import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Sparkles } from "lucide-react";

interface InputFormProps {
  onSubmit: (name: string, size: string, context?: string) => void;
  compact?: boolean;
}

const INDUSTRY_EXAMPLES = [
  "Healthcare",
  "Banking & Financial Services",
  "Retail",
  "E-commerce",
  "Manufacturing",
  "Insurance",
  "Logistics & Supply Chain",
  "Telecommunications",
  "Education",
  "Oil & Gas",
  "Chemical",
  "Food & Beverages",
  "Electronics",
  "Real Estate",
  "Hospitality & Tourism",
  "Pharmaceuticals",
  "Agriculture",
  "Media & Entertainment",
  "Legal Services",
  "Automotive",
  "Aerospace & Defence",
  "Construction",
  "Mining & Metals",
  "Utilities & Energy",
  "Government & Public Sector",
];

const SIZE_OPTIONS = [
  { value: "Startup (1-50 employees)", label: "Startup", sub: "1–50 employees" },
  { value: "Small Business (51-200 employees)", label: "Small Business", sub: "51–200 employees" },
  { value: "Mid-Market (201-1000 employees)", label: "Mid-Market", sub: "201–1,000 employees" },
  { value: "Large Enterprise (1001-10000 employees)", label: "Large Enterprise", sub: "1,001–10,000 employees" },
  { value: "Global Enterprise (10000+ employees)", label: "Global Enterprise", sub: "10,000+ employees" },
];

export default function InputForm({ onSubmit, compact = false }: InputFormProps) {
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [context, setContext] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = INDUSTRY_EXAMPLES.filter(
    (e) => e.toLowerCase().includes(industry.toLowerCase()) && industry.length > 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (industry.trim() && size) {
      onSubmit(industry.trim(), size, context.trim());
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Industry name"
          className="input-field flex-1"
        />
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="input-field w-48"
        >
          <option value="">Select size</option>
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!industry.trim() || !size}
          className="btn-primary whitespace-nowrap"
        >
          Analyse
        </button>
      </form>
    );
  }

  return (
    <motion.div className="glass-card rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-left shadow-2xl shadow-black/40">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Industry input */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Industry / Sector
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="e.g. Healthcare, Banking, Manufacturing..."
              className="input-field pl-11 pr-4"
              autoComplete="off"
            />
          </div>

          {/* Autocomplete */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 z-20 mt-1 glass-card rounded-xl overflow-hidden shadow-xl border border-white/10"
            >
              {filteredSuggestions.slice(0, 6).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setIndustry(s); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Size selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Organisation Size
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSize(opt.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                  size === opt.value
                    ? "bg-indigo-500/20 border-indigo-500/60 text-white"
                    : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-200"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  size === opt.value ? "border-indigo-400" : "border-slate-600"
                }`}>
                  {size === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-inherit">{opt.label}</div>
                  <div className="text-xs text-slate-500">{opt.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
          Additional context (optional)
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Focus on customer-facing processes, exclude IT infrastructure, emphasise regulatory compliance..."
              className="input-field resize-none h-24 text-sm"
            />
          </motion.div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!industry.trim() || !size}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Use Case Analysis
        </button>

        <p className="text-center text-xs text-slate-600">
          Analysis may take 1–5 minutes on CPU · Local model via Ollama
        </p>
      </form>
    </motion.div>
  );
}
