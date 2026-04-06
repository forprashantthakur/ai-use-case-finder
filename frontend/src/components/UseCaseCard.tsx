import { motion } from "framer-motion";
import {
  Zap,
  Database,
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { AIUseCase } from "../types";

interface UseCaseCardProps {
  useCase: AIUseCase;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const AI_TECH_COLORS: Record<string, string> = {
  "Generative AI": "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  "ML/Predictive": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Computer Vision": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  NLP: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "RPA+AI": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Optimisation AI": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-slate-400 w-6 text-right">{value}</span>
    </div>
  );
}

export default function UseCaseCard({
  useCase,
  index,
  isSelected,
  onClick,
}: UseCaseCardProps) {
  const techStyle =
    AI_TECH_COLORS[useCase.aiTechnology] ??
    "bg-slate-500/15 text-slate-400 border-slate-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={onClick}
      className={`glass-card-hover rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-indigo-500/50 bg-indigo-500/8 shadow-lg shadow-indigo-500/10"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`badge border ${useCase.priority === "High" ? "priority-high" : useCase.priority === "Medium" ? "priority-medium" : "priority-low"}`}>
              {useCase.priority} Priority
            </span>
            <span className={`badge border text-xs ${techStyle}`}>
              {useCase.aiTechnology}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm leading-tight">
            {useCase.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{useCase.processName}</p>
        </div>
        <ChevronRight
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            isSelected ? "text-indigo-400 rotate-90" : "text-slate-600"
          }`}
        />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {useCase.description}
      </p>

      {/* Scores */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-16 shrink-0">Impact</span>
          <ScoreBar value={useCase.impact} color="#f43f5e" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-16 shrink-0">Feasibility</span>
          <ScoreBar value={useCase.feasibility} color="#6366f1" />
        </div>
      </div>

      {/* Lenses */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {useCase.lensesApplied.slice(0, 3).map((lens) => (
          <span
            key={lens.lens}
            className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400/80 border border-indigo-500/15"
          >
            {lens.lens.split("—")[0].trim()}
          </span>
        ))}
        {useCase.lensesApplied.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-500">
            +{useCase.lensesApplied.length - 3}
          </span>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3 h-3 text-slate-600" />
          <span>{useCase.estimatedROI}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <AlertTriangle className="w-3 h-3 text-slate-600" />
          <span>{useCase.complexity} complexity</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Zap className="w-3 h-3 text-slate-600" />
          <span className="truncate">{useCase.potentialBenefits.efficiency.split(" ").slice(0, 4).join(" ")}...</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Database className="w-3 h-3 text-slate-600" />
          <span>{useCase.dataStrategy.dataVolume} data vol.</span>
        </div>
      </div>

      {/* Expand hint */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-indigo-500/20">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400">
            <TrendingUp className="w-3 h-3" />
            <span>View full analysis below</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
