import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Send audio file and language to backend for Gemini analysis
 */
export async function analyzeVoice(file, language) {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("language", language);

  const { data } = await axios.post(`${API_BASE}/api/analyze`, formData, {
  timeout: 60000,
});


  if (!data.success) {
    throw new Error(data.error || "Analysis failed.");
  }

  return {
    classification: data.classification,
    confidence: data.confidence,
    reasoning: data.reasoning,
    language: data.language,
  };
}
