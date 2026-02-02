import { FiZap } from "react-icons/fi";

export default function Header() {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
          <FiZap className="w-6 h-6" />
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          AI Voice Detection
        </h1>
      </div>
      <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">
        Detect whether a voice sample is AI-generated or spoken by a real human
      </p>
    </header>
  );
}
