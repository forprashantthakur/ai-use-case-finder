import { motion } from "framer-motion";
import {
  Database,
  TrendingUp,
  Target,
  Map,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Star,
} from "lucide-react";
import type { AIUseCase } from "../types";

interface UseCaseDetailProps {
  useCase: AIUseCase;
}

const LENS_COLORS = [
  "bg-indigo-500/15 border-indigo-500/25 text-indigo-300",
  "bg-purple-500/15 border-purple-500/25 text-purple-300",
  "bg-cyan-500/15 border-cyan-500/25 text-cyan-300",
  "bg-emerald-500/15 border-emerald-500/25 text-emerald-300",
];

const RISK_STYLES = {
  High: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Low: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
};

function Section({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function BenefitItem({ icon: Icon, label, value }: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm text-slate-200 leading-relaxed">{value}</div>
      </div>
    </div>
  );
}

export default function UseCaseDetail({ useCase }: UseCaseDetailProps) {
  return (
    <motion.div
      key={useCase.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header card */}
      <div className="glass-card rounded-2xl p-6 gradient-border">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`badge border text-xs ${useCase.priority === "High" ? "priority-high" : useCase.priority === "Medium" ? "priority-medium" : "priority-low"}`}>
                {useCase.priority} Priority
              </span>
              <span className="badge bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-xs">
                {useCase.aiTechnology}
              </span>
              <span className="badge bg-white/5 text-slate-400 border border-white/10 text-xs">
                {useCase.complexity} complexity
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{useCase.processName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-black gradient-text">{useCase.impact}/{useCase.feasibility}</div>
            <div className="text-xs text-slate-500">Impact / Feasibility</div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {useCase.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Est. ROI", value: useCase.estimatedROI, icon: Clock },
            { label: "Data Volume", value: useCase.dataStrategy.dataVolume, icon: Database },
            { label: "Impact Score", value: `${useCase.impact}/10`, icon: TrendingUp },
            { label: "Feasibility", value: `${useCase.feasibility}/10`, icon: Target },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/3 rounded-xl px-3 py-3 text-center">
              <Icon className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority rationale */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
        <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-medium text-amber-400 mb-1">Priority Rationale</div>
          <p className="text-sm text-slate-300 leading-relaxed">{useCase.priorityRationale}</p>
        </div>
      </div>

      {/* Lenses applied */}
      <Section title="AI Opportunity Lenses Applied" icon={Target}>
        <div className="space-y-3">
          {useCase.lensesApplied.map((lens, i) => (
            <div
              key={lens.lens}
              className={`rounded-xl p-3 border ${LENS_COLORS[i % LENS_COLORS.length]}`}
            >
              <div className="text-xs font-semibold mb-1">{lens.lens}</div>
              <p className="text-xs opacity-80 leading-relaxed">{lens.rationale}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Potential benefits */}
      <Section title="Potential Benefits" icon={TrendingUp}>
        <BenefitItem icon={Zap} label="Efficiency Gain" value={useCase.potentialBenefits.efficiency} />
        <BenefitItem icon={DollarSign} label="Cost Reduction" value={useCase.potentialBenefits.costReduction} />
        <BenefitItem icon={BarChart3} label="Quality Improvement" value={useCase.potentialBenefits.qualityImprovement} />
        <BenefitItem icon={TrendingUp} label="Revenue Impact" value={useCase.potentialBenefits.revenueImpact} />
        <BenefitItem icon={Clock} label="Time to Value" value={useCase.potentialBenefits.timeToValue} />
        <BenefitItem icon={Users} label="Employee Experience" value={useCase.potentialBenefits.employeeExperience} />
      </Section>

      {/* Data strategy */}
      <Section title="Data Strategy & Requirements" icon={Database}>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Data Sources</div>
            <div className="flex flex-wrap gap-2">
              {useCase.dataStrategy.dataSources.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Data Types</div>
            <div className="flex flex-wrap gap-2">
              {useCase.dataStrategy.dataTypes.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Integration Points</div>
            <div className="flex flex-wrap gap-2">
              {useCase.dataStrategy.integrationPoints.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Data Quality Requirements</div>
            <ul className="space-y-1.5">
              {useCase.dataStrategy.dataQualityRequirements.map((r) => (
                <li key={r} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Data Governance</div>
            <ul className="space-y-1.5">
              {useCase.dataStrategy.dataGovernance.map((g) => (
                <li key={g} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Critical success factors */}
      <Section title="Critical Success Factors" icon={AlertCircle}>
        <div className="space-y-3">
          {useCase.criticalSuccessFactors.map((csf) => (
            <div key={csf.factor} className="rounded-xl p-4 bg-white/3 border border-white/6">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="text-sm font-semibold text-white">{csf.factor}</div>
                <span className={`badge text-xs ${RISK_STYLES[csf.risk]}`}>
                  {csf.risk} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{csf.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Implementation roadmap */}
      <Section title="Implementation Roadmap" icon={Map}>
        <div className="space-y-3">
          {Object.entries(useCase.implementationRoadmap).map(([phase, desc], i) => (
            <div key={phase} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                </div>
                {i < 3 && <div className="w-px h-full bg-indigo-500/15 mt-1" />}
              </div>
              <div className="pb-4 flex-1">
                <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
