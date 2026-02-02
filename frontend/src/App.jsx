import { useState } from "react";
import { FiActivity } from "react-icons/fi";
import Header from "./components/Header";
import Settings from "./components/Settings";
import UploadBox from "./components/UploadBox";
import ResultBox from "./components/ResultBox";
import { analyzeVoice } from "./api/analyze";

const LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Other",
];

export default function App() {
  const [language, setLanguage] = useState("English");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an audio file first.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await analyzeVoice(file, language);
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Header />
        <Settings
          language={language}
          onLanguageChange={setLanguage}
          options={LANGUAGES}
        />
        <UploadBox
          file={file}
          onFileChange={(f) => {
            setFile(f);
            setError(null);
            setResult(null);
          }}
          disabled={loading}
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            {loading ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FiActivity className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {result && <ResultBox result={result} />}
        <footer className="text-center text-slate-500 text-sm pt-4">
          AI Voice Detection API - Hackathon Project 2026
        </footer>
      </div>
    </div>
  );
}
