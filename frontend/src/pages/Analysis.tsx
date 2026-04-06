import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  Map,
  Zap,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import type { UseAnalysisReturn } from "../hooks/useAnalysis";
import type { AIUseCase } from "../types";
import LoadingState from "../components/LoadingState";
import ExecutiveSummary from "../components/ExecutiveSummary";
import ProcessMap from "../components/ProcessMap";
import UseCaseCard from "../components/UseCaseCard";
import UseCaseDetail from "../components/UseCaseDetail";
import PriorityMatrix from "../components/PriorityMatrix";
import StrategicRoadmap from "../components/StrategicRoadmap";
import ExportButton from "../components/ExportButton";

interface AnalysisPageProps {
  industryName: string;
  industrySize: string;
  analysis: UseAnalysisReturn;
  onReset: () => void;
}

const TABS = [
  { id: "summary", label: "Summary", icon: LayoutDashboard },
  { id: "processes", label: "Process Map", icon: Map },
  { id: "usecases", label: "Use Cases", icon: Zap },
  { id: "matrix", label: "Priority Matrix", icon: TrendingUp },
  { id: "roadmap", label: "Roadmap", icon: TrendingUp },
];

const SORT_OPTIONS = [
  { value: "priority", label: "Priority" },
  { value: "impact", label: "Impact" },
  { value: "feasibility", label: "Feasibility" },
  { value: "complexity", label: "Complexity" },
];

export default function AnalysisPage({
  industryName,
  industrySize,
  analysis,
  onReset,
}: AnalysisPageProps) {
  const { status, result, streamText, statusMessage, error } = analysis;
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedUseCase, setSelectedUseCase] = useState<AIUseCase | null>(null);
  const [ucFilter, setUcFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [ucSort, setUcSort] = useState("priority");
  const [ucSearch, setUcSearch] = useState("");

  if (status === "loading" || (status === "idle" && !result)) {
    return (
      <LoadingState
        industryName={industryName}
        statusMessage={statusMessage}
        streamText={streamText}
      />
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed whitespace-pre-line text-left max-w-lg mx-auto">{error}</p>
          <button onClick={onReset} className="btn-primary flex items-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Results</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            The analysis completed but no data was returned. This can happen if the AI response was malformed.
          </p>
          <button onClick={onReset} className="btn-primary flex items-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sortedUseCases = [...result.aiUseCases]
    .filter((uc) => ucFilter === "All" || uc.priority === ucFilter)
    .filter(
      (uc) =>
        ucSearch === "" ||
        uc.title.toLowerCase().includes(ucSearch.toLowerCase()) ||
        uc.processName.toLowerCase().includes(ucSearch.toLowerCase()) ||
        uc.aiTechnology.toLowerCase().includes(ucSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (ucSort === "impact") return b.impact - a.impact;
      if (ucSort === "feasibility") return b.feasibility - a.feasibility;
      if (ucSort === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (ucSort === "complexity") {
        const order = { Low: 0, Medium: 1, High: 2 };
        return order[a.complexity] - order[b.complexity];
      }
      return 0;
    });


  const handleSelectInMatrix = (uc: AIUseCase) => {
    setSelectedUseCase(uc);
    setActiveTab("usecases");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background orbs */}
      <div className="fixed orb w-[500px] h-[500px] bg-indigo-600 top-[-200px] left-[-200px] pointer-events-none" />
      <div className="fixed orb w-[400px] h-[400px] bg-purple-600 bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="p-2 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-none">{industryName}</div>
                <div className="text-xs text-slate-500">{industrySize.split("(")[0].trim()}</div>
              </div>
            </div>
          </div>

          {/* Tabs — desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-white/4 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id ? "tab-active" : "tab-inactive"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ExportButton result={result} />
            <button
              onClick={onReset}
              className="p-2 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-colors"
              title="New analysis"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden border-t border-white/8 px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto tabs-scroll pt-2 pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "tab-active" : "tab-inactive"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ExecutiveSummary result={result} />
            </motion.div>
          )}

          {activeTab === "processes" && (
            <motion.div
              key="processes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2 className="section-title">Process Architecture Map</h2>
                <p className="section-subtitle">
                  {result.processMap.length} process areas · {result.processMap.reduce((a, p) => a + p.subProcesses.length, 0)} sub-processes · Zoom, pan and click to explore
                </p>
              </div>
              <ProcessMap processes={result.processMap} />

              {/* Process list */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.processMap.map((proc) => (
                  <div key={proc.id} className="glass-card-hover rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-xl">{proc.icon}</span>
                      <div>
                        <div className="text-xs text-indigo-400 font-medium">{proc.category}</div>
                        <div className="text-sm font-semibold text-white">{proc.name}</div>
                        <div className="text-xs text-slate-500">{proc.department}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proc.description}</p>
                    {proc.painPoints.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Pain Points</div>
                        {proc.painPoints.slice(0, 2).map((pp) => (
                          <div key={pp} className="text-xs text-rose-400/80 flex items-center gap-1.5 mb-0.5">
                            <div className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                            {pp}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "usecases" && (
            <motion.div
              key="usecases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2 className="section-title">AI Use Cases</h2>
                <p className="section-subtitle">
                  {result.aiUseCases.length} opportunities identified · Click a card to see full analysis
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <input
                  type="text"
                  value={ucSearch}
                  onChange={(e) => setUcSearch(e.target.value)}
                  placeholder="Search use cases..."
                  className="input-field w-56 text-sm py-2"
                />
                <div className="flex gap-1">
                  {(["All", "High", "Medium", "Low"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setUcFilter(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        ucFilter === p ? "bg-indigo-600 text-white" : "glass-card text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <select
                  value={ucSort}
                  onChange={(e) => setUcSort(e.target.value)}
                  className="input-field w-36 text-sm py-2"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{`Sort: ${o.label}`}</option>
                  ))}
                </select>
                <span className="text-xs text-slate-500">{sortedUseCases.length} results</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Use case cards */}
                <div className="space-y-3 lg:overflow-y-auto lg:max-h-[800px] lg:pr-2 scrollbar-none">
                  {sortedUseCases.map((uc, i) => (
                    <UseCaseCard
                      key={uc.id}
                      useCase={uc}
                      index={i}
                      isSelected={selectedUseCase?.id === uc.id}
                      onClick={() =>
                        setSelectedUseCase(
                          selectedUseCase?.id === uc.id ? null : uc
                        )
                      }
                    />
                  ))}
                  {sortedUseCases.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No use cases match your filter
                    </div>
                  )}
                </div>

                {/* Detail panel */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                  {selectedUseCase ? (
                    <div className="max-h-[800px] overflow-y-auto scrollbar-none">
                      <UseCaseDetail useCase={selectedUseCase} />
                    </div>
                  ) : (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <Zap className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">
                        Select a use case to view full analysis, data strategy, and implementation roadmap
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "matrix" && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2 className="section-title">Priority Matrix</h2>
                <p className="section-subtitle">
                  Impact vs Feasibility · Click a point to navigate to that use case
                </p>
              </div>
              <PriorityMatrix
                useCases={result.aiUseCases}
                onSelectUseCase={handleSelectInMatrix}
                selectedId={selectedUseCase?.id ?? null}
              />
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2 className="section-title">AI Strategy Roadmap</h2>
                <p className="section-subtitle">
                  Maturity progression and strategic recommendations for {industryName}
                </p>
              </div>
              <StrategicRoadmap result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
