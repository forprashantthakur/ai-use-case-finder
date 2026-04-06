import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AIUseCase } from "../types";

interface PriorityMatrixProps {
  useCases: AIUseCase[];
  onSelectUseCase: (uc: AIUseCase) => void;
  selectedId: string | null;
}

const PRIORITY_COLORS = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#10b981",
};

const AI_TECH_COLORS: Record<string, string> = {
  "Generative AI": "#6366f1",
  "ML/Predictive": "#06b6d4",
  "Computer Vision": "#8b5cf6",
  NLP: "#ec4899",
  "RPA+AI": "#f59e0b",
  "Optimisation AI": "#10b981",
};

interface TooltipPayload {
  payload: AIUseCase;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const uc = payload[0].payload;
  return (
    <div className="glass-card rounded-xl p-4 shadow-xl max-w-xs border border-white/15">
      <div className="text-xs text-slate-400 mb-1">{uc.processName}</div>
      <div className="text-sm font-semibold text-white mb-2">{uc.title}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="text-slate-400">Impact</div>
        <div className="text-white font-medium">{uc.impact}/10</div>
        <div className="text-slate-400">Feasibility</div>
        <div className="text-white font-medium">{uc.feasibility}/10</div>
        <div className="text-slate-400">Priority</div>
        <div
          className="font-medium"
          style={{ color: PRIORITY_COLORS[uc.priority] }}
        >
          {uc.priority}
        </div>
        <div className="text-slate-400">ROI</div>
        <div className="text-white">{uc.estimatedROI}</div>
      </div>
    </div>
  );
}

export default function PriorityMatrix({
  useCases,
  onSelectUseCase,
  selectedId,
}: PriorityMatrixProps) {
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  const filtered = useCases.filter(
    (uc) => filter === "All" || uc.priority === filter
  );

  const data = filtered.map((uc) => ({
    ...uc,
    x: uc.feasibility,
    y: uc.impact,
  }));

  const priorityCounts = {
    High: useCases.filter((u) => u.priority === "High").length,
    Medium: useCases.filter((u) => u.priority === "Medium").length,
    Low: useCases.filter((u) => u.priority === "Low").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter + legend */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["All", "High", "Medium", "Low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === p
                  ? "bg-indigo-600 text-white"
                  : "glass-card text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
              {p !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({priorityCounts[p]})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {Object.entries(PRIORITY_COLORS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: v }} />
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Impact vs Feasibility Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click a bubble to see details · Size indicates complexity
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{useCases.length}</div>
            <div className="text-xs text-slate-500">use cases</div>
          </div>
        </div>

        {/* Quadrant labels */}
        <div className="relative">
          <div className="absolute top-0 left-[50%] right-0 text-center text-xs text-emerald-500/60 font-medium pointer-events-none z-10 mt-1">
            Quick Wins
          </div>
          <div className="absolute top-0 left-0 w-[50%] text-center text-xs text-rose-500/60 font-medium pointer-events-none z-10 mt-1">
            Strategic Bets
          </div>
          <div className="absolute bottom-0 left-[50%] right-0 text-center text-xs text-amber-500/60 font-medium pointer-events-none z-10 mb-1">
            Fill-ins
          </div>
          <div className="absolute bottom-0 left-0 w-[50%] text-center text-xs text-slate-600 font-medium pointer-events-none z-10 mb-1">
            Avoid / Defer
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 24, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="x"
                type="number"
                name="Feasibility"
                domain={[0, 10]}
                ticks={[0, 2, 4, 5, 6, 8, 10]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                label={{
                  value: "Feasibility →",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <YAxis
                dataKey="y"
                type="number"
                name="Impact"
                domain={[0, 10]}
                ticks={[0, 2, 4, 5, 6, 8, 10]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                label={{
                  value: "Impact →",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <ReferenceLine
                x={5}
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={5}
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 4"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Scatter
                data={data}
                onClick={(d) => onSelectUseCase(d as unknown as AIUseCase)}
                cursor="pointer"
              >
                {data.map((uc) => (
                  <Cell
                    key={uc.id}
                    fill={
                      AI_TECH_COLORS[uc.aiTechnology] ??
                      PRIORITY_COLORS[uc.priority]
                    }
                    fillOpacity={selectedId === uc.id ? 1 : 0.75}
                    stroke={selectedId === uc.id ? "white" : "transparent"}
                    strokeWidth={2}
                    r={selectedId === uc.id ? 10 : 7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Tech legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(AI_TECH_COLORS).map(([tech, color]) => (
          <div
            key={tech}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-card text-xs text-slate-400"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}
