import { motion } from "framer-motion";
import InputForm from "../components/InputForm";
import {
  Brain,
  Map,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface HomePageProps {
  onSubmit: (name: string, size: string, context?: string) => void;
}

const FEATURES = [
  {
    icon: Map,
    title: "Process Architecture",
    description: "AI maps your complete industry process landscape — departments, workflows, and sub-processes.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Brain,
    title: "10-Lens AI Analysis",
    description: "Applies proven frameworks: volume, data richness, decision frequency, pain points, and more.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Prioritised Use Cases",
    description: "Scores each opportunity by Impact and Feasibility on an interactive priority matrix.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Data Strategy",
    description: "Defines data sources, quality requirements, and governance for every use case.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Target,
    title: "ROI & Benefits",
    description: "Quantifies efficiency gains, cost reduction, quality improvements and revenue impact.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: TrendingUp,
    title: "AI Maturity Roadmap",
    description: "Plots your 3-year transformation journey from current state to AI-native organisation.",
    color: "from-rose-500 to-red-500",
  },
];

const LENSES = [
  { num: "1", label: "Volume & Repetition" },
  { num: "2", label: "Data Richness" },
  { num: "3", label: "Decision Frequency" },
  { num: "4", label: "Pain & Friction" },
  { num: "5", label: "Human Bottleneck" },
  { num: "6", label: "Compliance & Auditability" },
  { num: "7", label: "Customer Experience" },
  { num: "8", label: "Predictive Intelligence" },
  { num: "9", label: "Knowledge Management" },
  { num: "10", label: "Resource Optimisation" },
];

export default function HomePage({ onSubmit }: HomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-indigo-600 top-[-200px] left-[-200px]" />
      <div className="orb w-[500px] h-[500px] bg-purple-600 top-[200px] right-[-150px]" />
      <div className="orb w-[400px] h-[400px] bg-cyan-600 bottom-[-100px] left-[30%]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">AI Use Case Finder</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-xs">
            Local AI (Ollama)
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-indigo-500/20 mb-8 text-sm text-indigo-300">
            <Zap className="w-3.5 h-3.5" />
            <span>AI-powered · Process mapping · Use case identification</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
            <span className="text-white">Find where</span>
            <br />
            <span className="gradient-text">AI changes everything</span>
            <br />
            <span className="text-white">in your industry</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Enter your industry and size. Our AI agent maps your processes, applies
            10 analytical lenses, and delivers a prioritised roadmap of AI automation opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InputForm onSubmit={onSubmit} />
        </motion.div>
      </section>

      {/* 10 Lenses strip */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-8"
      >
        <p className="text-center text-slate-500 text-sm mb-5 uppercase tracking-widest font-medium">
          10 AI Opportunity Lenses
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {LENSES.map((lens, i) => (
            <motion.div
              key={lens.num}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-sm"
            >
              <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                {lens.num}
              </span>
              <span className="text-slate-300">{lens.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-12"
      >
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Everything you need to plan your AI strategy
        </h2>
        <p className="text-center text-slate-400 mb-10 max-w-xl mx-auto">
          From process architecture to prioritised use cases, data strategy, and implementation roadmaps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-card-hover rounded-2xl p-6"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm">
        Open-weight models via Ollama · Progressive Web App · Works offline after first visit
      </footer>
    </div>
  );
}
