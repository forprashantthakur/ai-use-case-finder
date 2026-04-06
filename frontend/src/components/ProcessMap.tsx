import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ProcessArea } from "../types";

interface ProcessMapProps {
  processes: ProcessArea[];
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "Core Operations": {
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.4)",
    text: "#a5b4fc",
    dot: "#6366f1",
  },
  "Support Functions": {
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.4)",
    text: "#c4b5fd",
    dot: "#8b5cf6",
  },
  "Management & Strategy": {
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.4)",
    text: "#67e8f9",
    dot: "#06b6d4",
  },
  "Customer Facing": {
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.4)",
    text: "#6ee7b7",
    dot: "#10b981",
  },
  "Compliance & Risk": {
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.4)",
    text: "#fcd34d",
    dot: "#f59e0b",
  },
};

const DEFAULT_COLOR = {
  bg: "rgba(100,116,139,0.12)",
  border: "rgba(100,116,139,0.4)",
  text: "#94a3b8",
  dot: "#64748b",
};

function ProcessNode({ data }: { data: { process: ProcessArea } }) {
  const { process } = data;
  const colors = CATEGORY_COLORS[process.category] ?? DEFAULT_COLOR;

  return (
    <div
      className="rounded-xl p-4 min-w-[200px] max-w-[220px] shadow-lg"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl leading-none">{process.icon}</span>
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: colors.text }}
          >
            {process.category}
          </div>
          <div className="text-sm font-bold text-white leading-tight">{process.name}</div>
        </div>
      </div>
      <div className="text-xs text-slate-400 mb-2 line-clamp-2 leading-relaxed">
        {process.description}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.dot }} />
        <span>{process.department}</span>
      </div>
      {process.subProcesses.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/8">
          {process.subProcesses.slice(0, 3).map((sp) => (
            <div key={sp.id} className="text-xs text-slate-500 py-0.5 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
              <span className="truncate">{sp.name}</span>
            </div>
          ))}
          {process.subProcesses.length > 3 && (
            <div className="text-xs text-slate-600 mt-0.5">
              +{process.subProcesses.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { processNode: ProcessNode };

function layoutNodes(processes: ProcessArea[]): Node[] {
  const COLS = 3;
  const COL_WIDTH = 280;
  const ROW_HEIGHT = 260;

  return processes.map((proc, index) => ({
    id: proc.id,
    type: "processNode",
    position: {
      x: (index % COLS) * COL_WIDTH + 40,
      y: Math.floor(index / COLS) * ROW_HEIGHT + 40,
    },
    data: { process: proc },
  }));
}

export default function ProcessMap({ processes }: ProcessMapProps) {
  const nodes = useMemo(() => layoutNodes(processes), [processes]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    processes.forEach((proc) => {
      (proc.connections ?? []).forEach((targetId) => {
        if (processes.find((p) => p.id === targetId)) {
          result.push({
            id: `${proc.id}->${targetId}`,
            source: proc.id,
            target: targetId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "rgba(99,102,241,0.35)", strokeWidth: 1.5 },
          });
        }
      });
    });
    return result;
  }, [processes]);

  const onInit = useCallback(() => {}, []);

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden glass-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}
