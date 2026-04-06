import { motion } from "framer-motion";
import { Compass, Flag, Rocket, TrendingUp, Clock } from "lucide-react";
import type { AnalysisResult } from "../types";

interface StrategicRoadmapProps {
  result: AnalysisResult;
}

const TIMEFRAME_STYLES: Record<string, string> = {
  "Short-term (0-6 months)": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Medium-term (6-18 months)": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Long-term (18+ months)": "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

const YEAR_ICONS = [Compass, Rocket, TrendingUp, Flag];
const YEAR_LABELS = ["Current State", "Year 1 Goals", "Year 2 Goals", "Year 3 Vision"];
const YEAR_COLORS = [
  "from-slate-500 to-slate-600",
  "from-indigo-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
];

export default function StrategicRoadmap({ result }: StrategicRoadmapProps) {
  const { strategicRecommendations, aiMaturityRoadmap } = result;

  const maturitySteps = [
    { label: YEAR_LABELS[0], content: aiMaturityRoadmap.currentState },
    { label: YEAR_LABELS[1], content: aiMaturityRoadmap.year1Goals },
    { label: YEAR_LABELS[2], content: aiMaturityRoadmap.year2Goals },
    { label: YEAR_LABELS[3], content: aiMaturityRoadmap.year3Vision },
  ];

  return (
    <div className="space-y-6">
      {/* AI Maturity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Maturity Roadmap</h3>
            <p className="text-xs text-slate-500">Your transformation journey from today to AI-native</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {maturitySteps.map((step, i) => {
            const Icon = YEAR_ICONS[i];
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-white/15 to-transparent z-0" />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${YEAR_COLORS[i]} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-300">{step.label}</div>
                  </div>
                  <div className="flex-1 bg-white/3 rounded-xl p-3 border border-white/6">
                    <p className="text-xs text-slate-400 leading-relaxed">{step.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Strategic Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Strategic Recommendations</h3>
            <p className="text-xs text-slate-500">{strategicRecommendations.length} prioritised actions for leadership</p>
          </div>
        </div>

        <div className="space-y-3">
          {strategicRecommendations.map((rec, i) => {
            const timeframeStyle =
              TIMEFRAME_STYLES[rec.timeframe] ??
              "bg-slate-500/15 text-slate-400 border-slate-500/25";

            return (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-card-hover rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-400">
                      {i + 1}
                    </div>
                    <div className="text-sm font-semibold text-white">{rec.title}</div>
                  </div>
                  <span className={`badge border text-xs flex-shrink-0 ${timeframeStyle}`}>
                    <Clock className="w-3 h-3" />
                    {rec.timeframe.split(" ")[0]}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-3 ml-10">
                  {rec.recommendation}
                </p>

                <div className="ml-10 pl-3 border-l-2 border-indigo-500/20">
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    {rec.rationale}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
