import { analyzeAudioWithGemini } from "../services/geminiService.js";

/**
 * Validate that required fields (file + language) are present
 */
export function validateAnalyzeRequest(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No audio file uploaded. Please upload an MP3, WAV, or M4A file.",
    });
  }
  const language = req.body.language?.trim?.();
  if (!language) {
    return res.status(400).json({
      success: false,
      error: "Language is required. Please select a language.",
    });
  }
  next();
}

/**
 * POST /api/analyze
 * Sends audio file to Gemini and returns classification
 */
export async function analyzeVoice(req, res) {
  try {
    const { language } = req.body;
    const file = req.file;

    const result = await analyzeAudioWithGemini({
      buffer: file.buffer,
      mimeType: file.mimetype,
      language: String(language),
    });

    return res.status(200).json({
      success: true,
      classification: result.classification,
      confidence: result.confidence,
      reasoning: result.reasoning,
      language: result.detectedLanguage,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || "Analysis failed. Please try again.",
    });
  }
}

/**
 * POST /api/analyze-base64
 * Accepts BOTH:
 * 1) { audioBase64, mimeType, language }
 * 2) { "Audio Base64 Format", "Audio Format", "Language" } (tester format)
 */
export async function analyzeVoiceBase64(req, res) {
  try {
    // Support multiple possible field names
    const audioBase64 =
      req.body.audioBase64 ||
      req.body["Audio Base64 Format"] ||
      req.body.audio_base64;

    const language =
      req.body.language ||
      req.body.Language;

    const audioFormat =
      req.body.mimeType ||
      req.body["Audio Format"] ||
      req.body.audioFormat;

    if (!audioBase64 || !audioFormat || !language) {
      return res.status(400).json({
        success: false,
        error: "audioBase64, mimeType, and language are required",
        received: req.body
      });
    }

    // Map format → valid mime type
    let mimeType = audioFormat;
    if (audioFormat === "mp3") mimeType = "audio/mpeg";
    if (audioFormat === "wav") mimeType = "audio/wav";
    if (audioFormat === "m4a") mimeType = "audio/mp4";

    // Convert base64 → Buffer
    const buffer = Buffer.from(audioBase64, "base64");

    const result = await analyzeAudioWithGemini({
      buffer,
      mimeType,
      language: String(language),
    });

    return res.status(200).json({
      success: true,
      classification: result.classification,
      confidence: result.confidence,
      reasoning: result.reasoning,
      language: result.detectedLanguage,
    });
  } catch (err) {
    console.error("Base64 analyze error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || "Base64 analysis failed. Please try again.",
    });
  }
}
