import express from "express";
import multer from "multer";

import {
  analyzeVoice,
  analyzeVoiceBase64,
  validateAnalyzeRequest
} from "../controllers/analyzeController.js";

const router = express.Router();

// Multer: store in memory for processing (max 25MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4"
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Use MP3, WAV, or M4A."), false);
    }
  },
});

// POST /api/analyze - audio file + language (multipart/form-data)
router.post(
  "/analyze",
  upload.single("audio"),
  validateAnalyzeRequest,
  analyzeVoice
);

// POST /api/analyze-base64 - audio in base64 (application/json)
router.post(
  "/analyze-base64",
  express.json({ limit: "30mb" }),
  analyzeVoiceBase64
);

export default router;
