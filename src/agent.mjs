import { Agent, BedrockModel, tool } from "@strands-agents/sdk";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const model = new BedrockModel({
  modelId: "global.anthropic.claude-haiku-4-5-20251001-v1:0",
});

// ---------- Memory: load/save session history ----------
async function loadHistory(sessionId) {
  const resp = await ddb.send(new GetCommand({
    TableName: process.env.SESSIONS_TABLE,
    Key: { sessionId },
  }));
  return resp.Item ? JSON.parse(resp.Item.messages) : [];
}

async function saveHistory(sessionId, messages) {
  await ddb.send(new PutCommand({
    TableName: process.env.SESSIONS_TABLE,
    Item: {
      sessionId,
      messages: JSON.stringify(messages),
      expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    },
  }));
}

// ---------- Tools: Healthcare Knowledge Navigator ----------

// Consulta de perfiles de medicamentos
const lookUpDrugProfile = tool({
  name: "look_up_drug_profile",
  description: "Retrieve information about a medication (usage, dosage, side effects).",
  inputSchema: z.object({
    drug_name: z.string().describe("The medication to search for, e.g. 'Ibuprofen'"),
  }),
  callback: async ({ drug_name }) => {
    const resp = await ddb.send(new ScanCommand({ TableName: process.env.DRUGS_TABLE }));
    const matches = resp.Items.filter((item) =>
      item.name.toLowerCase().includes(drug_name.toLowerCase())
    );
    if (matches.length === 0) return `No drug profile found for '${drug_name}'.`;
    return JSON.stringify(matches);
  },
});

// Interpretación de resultados de laboratorio
const interpretLabResult = tool({
  name: "interpret_lab_result",
  description: "Provide reference ranges and explanations for lab test values.",
  inputSchema: z.object({
    test_name: z.string().describe("The lab test, e.g. 'Glucose'"),
    value: z.number().describe("The numeric result to interpret"),
  }),
  callback: async ({ test_name, value }) => {
    const resp = await ddb.send(new ScanCommand({ TableName: process.env.LABS_TABLE }));
    const match = resp.Items.find((item) =>
      item.test.toLowerCase() === test_name.toLowerCase()
    );
    if (!match) return `No reference data found for '${test_name}'.`;
    const normalRange = `${match.min} - ${match.max}`;
    const status = value < match.min ? "below normal" :
                   value > match.max ? "above normal" : "within normal range";
    return `Result for ${test_name}: ${value}. Normal range: ${normalRange}. Status: ${status}.`;
  },
});

// Consulta médica general (información de referencia)
const medicalConsultation = tool({
  name: "medical_consultation",
  description: "Provide general healthcare reference information for symptoms or conditions.",
  inputSchema: z.object({
    condition: z.string().describe("The condition or symptom to consult, e.g. 'hypertension'"),
  }),
  callback: async ({ condition }) => {
    // Aquí podrías integrar otra tabla DynamoDB o un modelo externo
    return `Reference information for ${condition}: Please note this is not a substitute for professional medical consultation.`;
  },
});

// ---------- System Prompt ----------
const SYSTEM_PROMPT =
  "You are a helpful Healthcare Knowledge Navigator. Provide reference medical information, explain drug profiles, and interpret lab results. " +
  "Always remind users this is reference information and does not replace professional medical consultation.";

// ---------- Agent ----------
export async function* answerWith(message, sessionId) {
  const history = await loadHistory(sessionId);
  const agent = new Agent({
    model,
    systemPrompt: SYSTEM_PROMPT,
    messages: history,
    tools: [lookUpDrugProfile, interpretLabResult, medicalConsultation],
    printer: false,
  });

  for await (const ev of agent.stream(message)) {
    if (ev.type === "modelStreamUpdateEvent" &&
        ev.event.type === "modelContentBlockDeltaEvent" &&
        ev.event.delta?.type === "textDelta") {
      yield { type: "token", text: ev.event.delta.text };
    } else if (ev.type === "beforeToolCallEvent") {
      yield { type: "tool", name: ev.toolUse?.name ?? "tool" };
    }
  }

  await saveHistory(sessionId, agent.messages);
}
