import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set.");
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/** DO NOT CHANGE MIME TYPES — Gemini expects real ones */
function normalizeMimeType(mimeType) {
  const allowed = ["audio/mpeg", "audio/wav", "audio/mp4"];
  return allowed.includes(mimeType) ? mimeType : "audio/mpeg";
}

export async function analyzeAudioWithGemini({ buffer, mimeType, language }) {
  if (!ai) {
    throw Object.assign(new Error("Gemini API not configured"), {
      statusCode: 503,
    });
  }

  const base64Audio = buffer.toString("base64").replace(/\s/g, "");
  const audioMime = normalizeMimeType(mimeType);

  const prompt = `You are an expert at distinguishing AI-generated voice from human voice.

Return JSON with:
classification: AI_GENERATED or HUMAN
confidence: number 0-1
detectedLanguage
reasoning

Expected language: ${language}`;

  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: audioMime,
        data: base64Audio,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING, enum: ["AI_GENERATED", "HUMAN"] },
          confidence: { type: Type.NUMBER },
          detectedLanguage: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ["classification", "confidence", "detectedLanguage", "reasoning"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned empty response");
  }

  let result = JSON.parse(response.text);

  if (!["AI_GENERATED", "HUMAN"].includes(result.classification)) {
    result.classification = "HUMAN";
  }

  result.confidence = Math.max(0, Math.min(1, Number(result.confidence) || 0.5));

  return result;
}
