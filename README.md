# AI Voice Detector

Full-stack web app that detects whether an audio sample is **AI-generated** or **human** using the Google Gemini API.

## Features

- **Language selection**: Hindi, English, Telugu, Tamil, and more
- **Audio upload**: Drag & drop or click to upload MP3, WAV, or M4A (max 25MB)
- **Gemini analysis**: Audio is sent to Gemini for classification
- **Result**: Classification (AI Generated / Human), confidence %, and reasoning

## Project structure

```
/backend
  /routes       - Express routes (analyze)
  /controllers  - Request handlers
  /services      - Gemini API integration
  server.js
/frontend
  /src
    /components  - Header, Settings, UploadBox, ResultBox
    /api         - analyze API client
    App.jsx, main.jsx, index.css
  index.html, vite.config.js, tailwind.config.js
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

Start the server:

```bash
npm run dev
```

Server runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** and proxies `/api` to the backend.

### 3. Use the app

1. Open http://localhost:3000
2. Select a language
3. Upload an audio file (MP3, WAV, or M4A)
4. Click **Analyze**
5. View classification, confidence, and reasoning

## API

### POST /api/analyze

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `audio`: file (MP3, WAV, M4A, max 25MB)
  - `language`: string (e.g. "English", "Hindi")
- **Response** (JSON):

```json
{
  "success": true,
  "classification": "HUMAN",
  "confidence": 0.85,
  "reasoning": "Natural prosody and breath sounds suggest human speech.",
  "language": "English"
}
```

`classification` is either `"HUMAN"` or `"AI_GENERATED"`. `confidence` is between 0 and 1.

## Sample Gemini prompt

The backend sends audio (base64) plus this prompt to Gemini:

```
You are an expert at distinguishing AI-generated voice from real human speech.

Analyze the provided audio and determine whether it is:
1. AI_GENERATED - synthetic/TTS/voice clone
2. HUMAN - spoken by a real person

Consider: natural prosody, breathing, imperfections, artifacts, synthetic timbre, and consistency.

Respond with a JSON object only, no other text. Use this exact structure:
{
  "classification": "AI_GENERATED" or "HUMAN",
  "confidence": number between 0 and 1,
  "reasoning": "Brief explanation of why you chose this classification."
}
```

The user’s selected language is appended as context so Gemini can use it when analyzing.

## Tech stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Icons
- **Backend**: Node.js, Express, Multer, dotenv, cors, @google/genai (Gemini)
- **API**: REST, JSON, env vars for API keys

## Notes

- Do not commit `.env` or your real API key.
- For production, run `npm run build` in `frontend` and serve the build; keep the backend on a separate host/port and set `VITE_API_URL` if the API is on another origin.
