import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ResultBox({ result }) {
  const isHuman = result.classification === "HUMAN";
  const confidencePercent = Math.round((result.confidence ?? 0) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        {isHuman ? (
          <FiCheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <FiAlertCircle className="w-5 h-5 text-amber-500" />
        )}
        Result
      </h3>
      <div className="grid gap-3">
        <div>
          <span className="text-sm text-slate-500">Classification</span>
          <p className={`font-semibold ${isHuman ? "text-emerald-600" : "text-amber-600"}`}>
            {isHuman ? "Human" : "AI Generated"}
          </p>
        </div>
        <div>
          <span className="text-sm text-slate-500">Confidence</span>
          <p className="font-medium text-slate-800">{confidencePercent}%</p>
        </div>
        <div>
          <span className="text-sm text-slate-500">Reason</span>
          <p className="text-slate-700 text-sm leading-relaxed">{result.reasoning || "—"}</p>
        </div>
      </div>
    </div>
  );
}
