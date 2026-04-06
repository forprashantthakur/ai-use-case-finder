import type { AnalysisResult } from "../types";

interface PrintViewProps {
  result: AnalysisResult;
}

const PRIORITY_COLOR: Record<string, string> = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#10b981",
};

const RISK_COLOR: Record<string, string> = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#10b981",
};

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "#e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(value / 10) * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", minWidth: 20 }}>
        {value}/10
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: "#1e293b",
        borderBottom: "2px solid #6366f1",
        paddingBottom: 6,
        marginBottom: 16,
        marginTop: 0,
        pageBreakAfter: "avoid",
      }}
    >
      {children}
    </h2>
  );
}

function Tag({ children, color = "#6366f1" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 600,
        background: color + "20",
        color,
        border: `1px solid ${color}40`,
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      {children}
    </span>
  );
}

export default function PrintView({ result }: PrintViewProps) {
  const { industry, executiveSummary, processMap, aiUseCases, strategicRecommendations, aiMaturityRoadmap } = result;
  const printDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const highCount = aiUseCases.filter(u => u.priority === "High").length;
  const medCount = aiUseCases.filter(u => u.priority === "Medium").length;
  const lowCount = aiUseCases.filter(u => u.priority === "Low").length;

  return (
    <div
      id="print-view"
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: "#1e293b",
        background: "#ffffff",
        maxWidth: 900,
        margin: "0 auto",
        padding: 0,
        fontSize: 12,
        lineHeight: 1.6,
      }}
    >
      {/* ── Cover Page ── */}
      <div
        style={{
          pageBreakAfter: "always",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 48px",
          background: "linear-gradient(135deg, #0f0f1a 0%, #1e1b4b 50%, #0f0f1a 100%)",
          color: "white",
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: 20,
              padding: "6px 16px",
              marginBottom: 32,
              fontSize: 11,
              fontWeight: 600,
              color: "#a5b4fc",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}
          >
            AI Use Case Finder · Local model (Ollama)
          </div>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 16,
              background: "linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Transformation
            <br />Analysis Report
          </h1>

          <div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
            {industry.name} Industry
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>{industry.size}</div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { label: "Process Areas", value: processMap.length },
            { label: "AI Use Cases", value: aiUseCases.length },
            { label: "High Priority", value: highCount },
            { label: "Avg Impact", value: (aiUseCases.reduce((a, b) => a + b.impact, 0) / aiUseCases.length).toFixed(1) },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "16px 20px",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: "white" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#64748b",
          }}
        >
          <span>Generated {printDate}</span>
          <span>Confidential · AI Use Case Finder</span>
        </div>
      </div>

      {/* ── Page body wrapper ── */}
      <div style={{ padding: "40px 48px" }}>

        {/* ── Executive Summary ── */}
        <div style={{ marginBottom: 40, pageBreakInside: "avoid" }}>
          <SectionTitle>Executive Summary</SectionTitle>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: "4px solid #6366f1",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, color: "#334155", fontSize: 12, lineHeight: 1.7 }}>
              {industry.description}
            </p>
          </div>
          <p style={{ margin: 0, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {executiveSummary}
          </p>
        </div>

        {/* ── Priority Summary ── */}
        <div style={{ marginBottom: 40, pageBreakInside: "avoid" }}>
          <SectionTitle>Use Case Priority Summary</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "High Priority", count: highCount, color: "#f43f5e", desc: "Immediate action recommended" },
              { label: "Medium Priority", count: medCount, color: "#f59e0b", desc: "Plan within 6–18 months" },
              { label: "Low Priority", count: lowCount, color: "#10b981", desc: "Consider for long-term roadmap" },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  border: `2px solid ${item.color}30`,
                  borderRadius: 10,
                  padding: "16px",
                  textAlign: "center" as const,
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: item.color }}>{item.count}</div>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Process Architecture ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Business Process Architecture</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {processMap.map(proc => (
              <div
                key={proc.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "14px 16px",
                  pageBreakInside: "avoid",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{proc.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>{proc.name}</div>
                    <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600 }}>{proc.category} · {proc.department}</div>
                  </div>
                </div>
                <p style={{ margin: "0 0 8px", color: "#475569", fontSize: 11 }}>{proc.description}</p>
                {proc.painPoints.length > 0 && (
                  <div>
                    {proc.painPoints.slice(0, 2).map(pp => (
                      <div key={pp} style={{ fontSize: 10, color: "#f43f5e", display: "flex", gap: 4, marginBottom: 2 }}>
                        <span>▸</span><span>{pp}</span>
                      </div>
                    ))}
                  </div>
                )}
                {proc.subProcesses.length > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Sub-processes</div>
                    {proc.subProcesses.slice(0, 3).map(sp => (
                      <div key={sp.id} style={{ fontSize: 10, color: "#64748b", display: "flex", gap: 4, marginBottom: 2 }}>
                        <span style={{ color: "#cbd5e1" }}>·</span>{sp.name}
                        <span style={{ color: "#94a3b8" }}>({sp.frequency})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Use Cases ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>AI Use Cases — Detailed Analysis</SectionTitle>

          {aiUseCases.map((uc, idx) => (
            <div
              key={uc.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "20px",
                marginBottom: 20,
                pageBreakInside: "avoid",
                borderLeft: `4px solid ${PRIORITY_COLOR[uc.priority]}`,
              }}
            >
              {/* UC Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#64748b",
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 10,
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <Tag color={PRIORITY_COLOR[uc.priority]}>{uc.priority} Priority</Tag>
                    <Tag color="#6366f1">{uc.aiTechnology}</Tag>
                    <Tag color="#64748b">{uc.complexity} Complexity</Tag>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{uc.title}</h3>
                  <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, marginTop: 2 }}>{uc.processName}</div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#6366f1" }}>{uc.impact}/{uc.feasibility}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>Impact / Feasibility</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#10b981", marginTop: 2 }}>ROI: {uc.estimatedROI}</div>
                </div>
              </div>

              <p style={{ margin: "0 0 14px", color: "#334155", lineHeight: 1.6, fontSize: 12 }}>{uc.description}</p>

              {/* Score bars */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Impact</div>
                  <ScoreBar value={uc.impact} color="#f43f5e" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Feasibility</div>
                  <ScoreBar value={uc.feasibility} color="#6366f1" />
                </div>
              </div>

              {/* Lenses */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>AI Opportunity Lenses</div>
                {uc.lensesApplied.map(lens => (
                  <div key={lens.lens} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#6366f1",
                        background: "#eef2ff",
                        padding: "1px 6px",
                        borderRadius: 4,
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      {lens.lens.split("—")[0].trim()}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569" }}>{lens.rationale}</span>
                  </div>
                ))}
              </div>

              {/* Two-column: Benefits + Data Strategy */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Potential Benefits</div>
                  {[
                    ["Efficiency", uc.potentialBenefits.efficiency],
                    ["Cost Reduction", uc.potentialBenefits.costReduction],
                    ["Quality", uc.potentialBenefits.qualityImprovement],
                    ["Revenue", uc.potentialBenefits.revenueImpact],
                    ["Time to Value", uc.potentialBenefits.timeToValue],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 11, marginBottom: 4, display: "flex", gap: 6 }}>
                      <span style={{ color: "#94a3b8", minWidth: 80, flexShrink: 0 }}>{k}</span>
                      <span style={{ color: "#334155", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Data Strategy</div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Sources</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const }}>
                      {uc.dataStrategy.dataSources.map(s => <Tag key={s} color="#06b6d4">{s}</Tag>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Integration Points</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const }}>
                      {uc.dataStrategy.integrationPoints.map(s => <Tag key={s} color="#8b5cf6">{s}</Tag>)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Data Volume</div>
                    <Tag color="#10b981">{uc.dataStrategy.dataVolume}</Tag>
                  </div>
                </div>
              </div>

              {/* CSFs */}
              {uc.criticalSuccessFactors.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Critical Success Factors</div>
                  {uc.criticalSuccessFactors.map(csf => (
                    <div key={csf.factor} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5, padding: "6px 10px", background: "#f8fafc", borderRadius: 6 }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 11, color: "#1e293b" }}>{csf.factor}: </span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{csf.description}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: RISK_COLOR[csf.risk], flexShrink: 0 }}>{csf.risk} Risk</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Roadmap */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Implementation Roadmap</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {Object.values(uc.implementationRoadmap).map((phase, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderTop: `3px solid ${"#6366f1"}`,
                        borderRadius: 6,
                        padding: "8px",
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", marginBottom: 3 }}>Phase {i + 1}</div>
                      <div style={{ fontSize: 10, color: "#334155" }}>{phase}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Priority Matrix Table ── */}
        <div style={{ marginBottom: 40, pageBreakInside: "avoid" }}>
          <SectionTitle>Priority Matrix — Impact vs Feasibility</SectionTitle>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
            }}
          >
            <thead>
              <tr style={{ background: "#1e293b", color: "white" }}>
                {["Use Case", "Process", "AI Technology", "Impact", "Feasibility", "Priority", "ROI"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left" as const,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...aiUseCases]
                .sort((a, b) => {
                  const order = { High: 0, Medium: 1, Low: 2 };
                  return order[a.priority] - order[b.priority];
                })
                .map((uc, i) => (
                  <tr
                    key={uc.id}
                    style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
                  >
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>{uc.title}</td>
                    <td style={{ padding: "8px 12px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{uc.processName}</td>
                    <td style={{ padding: "8px 12px", color: "#6366f1", fontWeight: 500, borderBottom: "1px solid #f1f5f9" }}>{uc.aiTechnology}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "#f43f5e", borderBottom: "1px solid #f1f5f9" }}>{uc.impact}/10</td>
                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "#6366f1", borderBottom: "1px solid #f1f5f9" }}>{uc.feasibility}/10</td>
                    <td style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ color: PRIORITY_COLOR[uc.priority], fontWeight: 700 }}>{uc.priority}</span>
                    </td>
                    <td style={{ padding: "8px 12px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{uc.estimatedROI}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ── Strategic Recommendations ── */}
        <div style={{ marginBottom: 40, pageBreakInside: "avoid" }}>
          <SectionTitle>Strategic Recommendations</SectionTitle>
          {strategicRecommendations.map((rec, i) => (
            <div
              key={rec.title}
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 14,
                padding: "14px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                pageBreakInside: "avoid",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#fef3c7",
                  color: "#d97706",
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{rec.title}</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#d97706",
                      background: "#fef3c7",
                      padding: "2px 8px",
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  >
                    {rec.timeframe.split(" ")[0]}
                  </span>
                </div>
                <p style={{ margin: "0 0 6px", color: "#334155", fontSize: 12 }}>{rec.recommendation}</p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11, fontStyle: "italic" }}>{rec.rationale}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Maturity Roadmap ── */}
        <div style={{ marginBottom: 40, pageBreakInside: "avoid" }}>
          <SectionTitle>3-Year AI Maturity Roadmap</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Current State", content: aiMaturityRoadmap.currentState, color: "#64748b" },
              { label: "Year 1 Goals", content: aiMaturityRoadmap.year1Goals, color: "#6366f1" },
              { label: "Year 2 Goals", content: aiMaturityRoadmap.year2Goals, color: "#8b5cf6" },
              { label: "Year 3 Vision", content: aiMaturityRoadmap.year3Vision, color: "#f59e0b" },
            ].map(step => (
              <div
                key={step.label}
                style={{
                  border: "1px solid #e2e8f0",
                  borderTop: `3px solid ${step.color}`,
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 8 }}>{step.label}</div>
                <p style={{ margin: 0, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>{step.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#94a3b8",
          }}
        >
          <span>AI Use Case Finder · {industry.name} Industry Analysis</span>
          <span>Generated {printDate} · Ollama / open-weight model</span>
        </div>
      </div>
    </div>
  );
}
