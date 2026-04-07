import type {
  AIUseCase,
  AIMaturityRoadmap,
  AnalysisResult,
  CriticalSuccessFactor,
  DataStrategy,
  ImplementationRoadmap,
  IndustryInfo,
  LensApplication,
  PotentialBenefits,
  ProcessArea,
  StrategicRecommendation,
  SubProcess,
} from "../types";

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 5): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(10, Math.max(1, Math.round(n)));
}

function triState(v: unknown, fallback: "High" | "Medium" | "Low"): "High" | "Medium" | "Low" {
  const s = str(v);
  if (s === "High" || s === "Medium" || s === "Low") return s;
  return fallback;
}

function normalizeSubProcess(raw: unknown, i: number, parentIdx: number): SubProcess {
  const sp = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: str(sp.id, `sub_${parentIdx}_${i}`),
    name: str(sp.name, "Sub-process"),
    description: str(sp.description, ""),
    frequency: str(sp.frequency, "Daily"),
    volume: str(sp.volume, "Medium"),
    currentTechnology: str(sp.currentTechnology, ""),
  };
}

function normalizeProcess(raw: unknown, index: number): ProcessArea {
  const p = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const subRaw = arr<unknown>(p.subProcesses).map((s, i) => normalizeSubProcess(s, i, index));
  return {
    id: str(p.id, `proc_${index}`),
    name: str(p.name, "Process area"),
    category: str(p.category, "Core Operations"),
    description: str(p.description, ""),
    department: str(p.department, ""),
    icon: str(p.icon, "📋"),
    subProcesses: subRaw,
    inputs: arr<string>(p.inputs).map((x) => str(x)),
    outputs: arr<string>(p.outputs).map((x) => str(x)),
    painPoints: arr<string>(p.painPoints).map((x) => str(x)),
    connections: arr<string>(p.connections).map((x) => str(x)),
  };
}

function normalizeLens(raw: unknown, i: number): LensApplication {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    lens: str(o.lens, `Lens ${i + 1}`),
    rationale: str(o.rationale, ""),
  };
}

function normalizeDataStrategy(raw: unknown): DataStrategy {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const dg = arr<string>(d.dataGovernance);
  return {
    dataSources: arr<string>(d.dataSources).map((x) => str(x)),
    dataTypes: arr<string>(d.dataTypes).map((x) => str(x)),
    dataVolume: str(d.dataVolume, "Medium"),
    dataQualityRequirements: arr<string>(d.dataQualityRequirements).map((x) => str(x)),
    dataGovernance: dg.length ? dg : [""],
    integrationPoints: arr<string>(d.integrationPoints).map((x) => str(x)),
  };
}

function normalizeBenefits(raw: unknown): PotentialBenefits {
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    efficiency: str(b.efficiency, "—"),
    costReduction: str(b.costReduction, "—"),
    qualityImprovement: str(b.qualityImprovement, "—"),
    revenueImpact: str(b.revenueImpact, "—"),
    timeToValue: str(b.timeToValue, "—"),
    employeeExperience: str(b.employeeExperience, "—"),
  };
}

function normalizeCsf(raw: unknown, i: number): CriticalSuccessFactor {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    factor: str(c.factor, `Factor ${i + 1}`),
    description: str(c.description, ""),
    risk: triState(c.risk, "Medium"),
  };
}

function normalizeRoadmapPhases(raw: unknown): ImplementationRoadmap {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    phase1: str(r.phase1, ""),
    phase2: str(r.phase2, ""),
    phase3: str(r.phase3, ""),
    phase4: str(r.phase4, ""),
  };
}

function normalizeUseCase(raw: unknown, index: number): AIUseCase {
  const u = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const lenses = arr<unknown>(u.lensesApplied).map((l, i) => normalizeLens(l, i));
  const csf = arr<unknown>(u.criticalSuccessFactors).map((c, i) => normalizeCsf(c, i));
  return {
    id: str(u.id, `uc_${index}`),
    title: str(u.title, "AI use case"),
    processId: str(u.processId, ""),
    processName: str(u.processName, ""),
    subProcessId: str(u.subProcessId, ""),
    description: str(u.description, ""),
    aiTechnology: str(u.aiTechnology, "Generative AI"),
    lensesApplied: lenses.length ? lenses : [{ lens: "Lens 1", rationale: "" }],
    dataStrategy: normalizeDataStrategy(u.dataStrategy),
    potentialBenefits: normalizeBenefits(u.potentialBenefits),
    criticalSuccessFactors: csf.length
      ? csf
      : [{ factor: "Governance", description: "", risk: "Medium" as const }],
    implementationRoadmap: normalizeRoadmapPhases(u.implementationRoadmap),
    impact: num(u.impact, 5),
    feasibility: num(u.feasibility, 5),
    priority: triState(u.priority, "Medium"),
    priorityRationale: str(u.priorityRationale, ""),
    estimatedROI: str(u.estimatedROI, "—"),
    complexity: triState(u.complexity, "Medium"),
  };
}

function normalizeIndustry(raw: unknown): IndustryInfo {
  const ind = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const kc = arr<string>(ind.keyCharacteristics).map((x) => str(x));
  return {
    name: str(ind.name, "Industry"),
    size: str(ind.size, ""),
    description: str(ind.description, ""),
    keyCharacteristics: kc.length ? kc : ["—", "—", "—", "—", "—"],
  };
}

function normalizeMaturity(raw: unknown): AIMaturityRoadmap {
  const m = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    currentState: str(m.currentState, ""),
    year1Goals: str(m.year1Goals, ""),
    year2Goals: str(m.year2Goals, ""),
    year3Vision: str(m.year3Vision, ""),
  };
}

function normalizeRecommendation(raw: unknown, i: number): StrategicRecommendation {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    title: str(s.title, `Recommendation ${i + 1}`),
    recommendation: str(s.recommendation, ""),
    rationale: str(s.rationale, ""),
    timeframe: str(s.timeframe, "Short-term (0-6 months)"),
  };
}

/** Coerce LLM JSON into the shape the UI expects so missing arrays/objects do not crash React. */
export function normalizeAnalysisResult(raw: unknown): AnalysisResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid analysis payload (not an object).");
  }
  const r = raw as Record<string, unknown>;
  const processMap = arr<unknown>(r.processMap).map((p, i) => normalizeProcess(p, i));
  const aiUseCases = arr<unknown>(r.aiUseCases).map((u, i) => normalizeUseCase(u, i));
  const strategic = arr<unknown>(r.strategicRecommendations).map((s, i) =>
    normalizeRecommendation(s, i)
  );

  return {
    industry: normalizeIndustry(r.industry),
    executiveSummary: str(r.executiveSummary, ""),
    processMap,
    aiUseCases,
    strategicRecommendations: strategic.length
      ? strategic
      : [
          {
            title: "Review analysis",
            recommendation: "Re-run with more context or a larger model if output was thin.",
            rationale: "The model returned no strategic recommendations block.",
            timeframe: "Short-term (0-6 months)",
          },
        ],
    aiMaturityRoadmap: normalizeMaturity(r.aiMaturityRoadmap),
  };
}
