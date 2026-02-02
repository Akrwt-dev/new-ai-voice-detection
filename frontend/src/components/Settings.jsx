import { FiSettings } from "react-icons/fi";

export default function Settings({ language, onLanguageChange, options }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-slate-700 font-medium mb-3">
        <FiSettings className="w-5 h-5 text-slate-500" />
        <span>Settings</span>
      </div>
      <label className="block text-sm text-slate-600 mb-2">Language</label>
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
