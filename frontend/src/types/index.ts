export interface SubProcess {
  id: string;
  name: string;
  description: string;
  frequency: string;
  volume: string;
  currentTechnology: string;
}

export interface ProcessArea {
  id: string;
  name: string;
  category: string;
  description: string;
  department: string;
  icon: string;
  subProcesses: SubProcess[];
  inputs: string[];
  outputs: string[];
  painPoints: string[];
  connections: string[];
}

export interface LensApplication {
  lens: string;
  rationale: string;
}

export interface DataStrategy {
  dataSources: string[];
  dataTypes: string[];
  dataVolume: string;
  dataQualityRequirements: string[];
  dataGovernance: string[];
  integrationPoints: string[];
}

export interface PotentialBenefits {
  efficiency: string;
  costReduction: string;
  qualityImprovement: string;
  revenueImpact: string;
  timeToValue: string;
  employeeExperience: string;
}

export interface CriticalSuccessFactor {
  factor: string;
  description: string;
  risk: "High" | "Medium" | "Low";
}

export interface ImplementationRoadmap {
  phase1: string;
  phase2: string;
  phase3: string;
  phase4: string;
}

export interface AIUseCase {
  id: string;
  title: string;
  processId: string;
  processName: string;
  subProcessId: string;
  description: string;
  aiTechnology: string;
  lensesApplied: LensApplication[];
  dataStrategy: DataStrategy;
  potentialBenefits: PotentialBenefits;
  criticalSuccessFactors: CriticalSuccessFactor[];
  implementationRoadmap: ImplementationRoadmap;
  impact: number;
  feasibility: number;
  priority: "High" | "Medium" | "Low";
  priorityRationale: string;
  estimatedROI: string;
  complexity: "High" | "Medium" | "Low";
}

export interface StrategicRecommendation {
  title: string;
  recommendation: string;
  rationale: string;
  timeframe: string;
}

export interface AIMaturityRoadmap {
  currentState: string;
  year1Goals: string;
  year2Goals: string;
  year3Vision: string;
}

export interface IndustryInfo {
  name: string;
  size: string;
  description: string;
  keyCharacteristics: string[];
}

export interface AnalysisResult {
  industry: IndustryInfo;
  executiveSummary: string;
  processMap: ProcessArea[];
  aiUseCases: AIUseCase[];
  strategicRecommendations: StrategicRecommendation[];
  aiMaturityRoadmap: AIMaturityRoadmap;
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";
