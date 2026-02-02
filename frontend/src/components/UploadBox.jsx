import { useCallback, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const MAX_SIZE_MB = 25;
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4"
];


function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadBox({ file, onFileChange, disabled }) {
  const [drag, setDrag] = useState(false);
  const [localError, setLocalError] = useState(null);

  const validate = useCallback((f) => {
    if (!f) return null;
    if (!ALLOWED_TYPES.includes(f.type)) {
      return "Please use MP3, WAV, or M4A.";
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDrag(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      const err = validate(f);
      setLocalError(err);
      if (!err) onFileChange(f);
    },
    [disabled, validate, onFileChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDrag(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
  }, []);

  const handleFileInput = useCallback(
    (e) => {
      if (disabled) return;
      const f = e.target.files?.[0];
      if (!f) return;
      const err = validate(f);
      setLocalError(err);
      if (!err) onFileChange(f);
      e.target.value = "";
    },
    [disabled, validate, onFileChange]
  );

  const clearFile = useCallback(() => {
    onFileChange(null);
    setLocalError(null);
  }, [onFileChange]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl m-4 p-8 text-center transition
          ${drag ? "border-primary-400 bg-primary-50" : "border-slate-300 bg-slate-50"}
          ${disabled ? "pointer-events-none opacity-70" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/m4a"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {file ? (
          <div className="space-y-2">
            <p className="font-medium text-slate-700 truncate">{file.name}</p>
            <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Remove file
              </button>
            )}
          </div>
        ) : (
          <>
            <FiUploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="font-medium text-slate-700 mb-1">Upload Audio File</p>
            <p className="text-sm text-slate-500">
              Drag and drop an MP3, WAV, or M4A file here, or click to select.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Maximum file size: {MAX_SIZE_MB}MB
            </p>
          </>
        )}
      </div>
      {localError && (
        <p className="text-red-600 text-sm px-4 pb-3">{localError}</p>
      )}
    </div>
  );
}
