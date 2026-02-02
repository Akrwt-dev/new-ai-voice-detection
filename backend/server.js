import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

import analyzeRoutes from "./routes/analyze.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// API routes
app.use("/api", analyzeRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Voice Detector API is running" });
});

// Global error handler (multer, Gemini, etc.)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, error: "File too large. Maximum size is 25MB." });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, error: err.message || "Server error." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
