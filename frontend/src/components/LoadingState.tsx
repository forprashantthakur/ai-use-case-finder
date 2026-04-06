import { motion } from "framer-motion";
import { Brain, Map, Zap, BarChart3, CheckCircle2 } from "lucide-react";

interface LoadingStateProps {
  industryName: string;
  statusMessage: string;
  streamText: string;
}

const STEPS = [
  { icon: Map, label: "Mapping process architecture", delay: 0 },
  { icon: Brain, label: "Applying AI opportunity lenses", delay: 8 },
  { icon: Zap, label: "Identifying automation use cases", delay: 20 },
  { icon: BarChart3, label: "Scoring impact & feasibility", delay: 35 },
];

export default function LoadingState({ industryName, statusMessage, streamText }: LoadingStateProps) {
  const charCount = streamText.length;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        {/* Animated brain */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse-slow" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-10 h-10 text-indigo-400" />
          </div>
          {/* Orbit dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-indigo-500"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-6px",
                marginLeft: "-6px",
              }}
              animate={{
                x: Math.cos((i * Math.PI) / 2) * 44,
                y: Math.sin((i * Math.PI) / 2) * 44,
              }}
              transition={{ duration: 0 }}
            />
          ))}
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Analysing {industryName}
        </h2>
        <p className="text-slate-400 mb-8">
          {statusMessage || "Local model is generating your use case report…"}
        </p>

        {/* Steps */}
        <div className="space-y-3 text-left mb-8">
          {STEPS.map((step, i) => {
            const threshold = step.delay * 20;
            const isDone = charCount > threshold + 500;
            const isActive = charCount > threshold && !isDone;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: charCount > threshold ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? "bg-emerald-500/20" : isActive ? "bg-indigo-500/20" : "bg-white/5"
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <step.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-600"}`} />
                  )}
                </div>
                <span className={`text-sm ${isDone ? "text-emerald-400" : isActive ? "text-slate-200" : "text-slate-600"}`}>
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Token counter */}
        {charCount > 0 && (
          <p className="text-xs text-slate-600 font-mono">
            {charCount.toLocaleString()} characters generated
          </p>
        )}
      </div>
    </div>
  );
}
