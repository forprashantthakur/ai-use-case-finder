import { motion } from "framer-motion";
import { BarChart3, Zap, TrendingUp, Target } from "lucide-react";
import type { AnalysisResult } from "../types";

interface ExecutiveSummaryProps {
  result: AnalysisResult;
}

export default function ExecutiveSummary({ result }: ExecutiveSummaryProps) {
  const { industry, executiveSummary, aiUseCases, processMap } = result;

  const highPriority = aiUseCases.filter((u) => u.priority === "High").length;
  const medPriority = aiUseCases.filter((u) => u.priority === "Medium").length;
  const avgImpact = aiUseCases.length
    ? (aiUseCases.reduce((a, b) => a + b.impact, 0) / aiUseCases.length).toFixed(1)
    : "0.0";
  const avgFeasibility = aiUseCases.length
    ? (aiUseCases.reduce((a, b) => a + b.feasibility, 0) / aiUseCases.length).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Process Areas", value: processMap.length, icon: BarChart3, color: "from-indigo-500 to-purple-500" },
    { label: "AI Use Cases", value: aiUseCases.length, icon: Zap, color: "from-purple-500 to-pink-500" },
    { label: "High Priority", value: highPriority, icon: Target, color: "from-rose-500 to-orange-500" },
    { label: "Avg Impact Score", value: avgImpact, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Industry header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 text-2xl">
            🏭
          </div>
          <div>
            <div className="text-xs text-indigo-400 uppercase tracking-widest font-medium mb-1">
              {industry.size}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{industry.name} Industry</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">{industry.description}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/8">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
            Key Characteristics
          </div>
          <div className="flex flex-wrap gap-2">
            {industry.keyCharacteristics.map((c) => (
              <span
                key={c}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/8"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Priority breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="text-sm font-semibold text-slate-300 mb-3">Use Case Priority Distribution</div>
        <div className="space-y-2">
          {[
            { label: "High Priority", count: highPriority, color: "bg-rose-500", max: aiUseCases.length },
            { label: "Medium Priority", count: medPriority, color: "bg-amber-500", max: aiUseCases.length },
            { label: "Low Priority", count: aiUseCases.length - highPriority - medPriority, color: "bg-emerald-500", max: aiUseCases.length },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="text-xs text-slate-400 w-28">{item.label}</div>
              <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.max > 0 ? (item.count / item.max) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="text-sm font-bold text-white w-6 text-right">{item.count}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="text-center">
            <div className="text-sm font-bold text-white">{avgImpact}</div>
            <div className="text-xs text-slate-500">Avg Impact</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">{avgFeasibility}</div>
            <div className="text-xs text-slate-500">Avg Feasibility</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">{processMap.reduce((a, p) => a + p.subProcesses.length, 0)}</div>
            <div className="text-xs text-slate-500">Sub-processes</div>
          </div>
        </div>
      </motion.div>

      {/* Executive summary text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-white text-sm">Executive Summary</h3>
        </div>
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {executiveSummary}
        </div>
      </motion.div>
    </div>
  );
}