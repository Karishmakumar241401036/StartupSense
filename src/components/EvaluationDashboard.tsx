import { useState } from "react";
import {
  Download,
  Pencil,
  Users,
  Swords,
  LayoutGrid,
  CircleDollarSign,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
} from "lucide-react";
import type { BusinessEvaluationReport } from "../types/evaluation";
import { ScoreGauge } from "./ScoreGauge";
import { exportEvaluationPdf } from "../utils/pdfExport";

interface EvaluationDashboardProps {
  report: BusinessEvaluationReport;
  onEditInputs: () => void;
}

export function EvaluationDashboard({ report, onEditInputs }: EvaluationDashboardProps) {
  const [pdfExported, setPdfExported] = useState(false);

  const formattedDate = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDownloadPdf = () => {
    exportEvaluationPdf(report);
    setPdfExported(true);
    window.setTimeout(() => setPdfExported(false), 2500);
  };

  const getSeverityVisuals = (severity: string) => {
    const normalized = severity.toLowerCase();
    if (normalized === "high") {
      return {
        textClass: "text-red-700",
        Icon: ShieldAlert,
        label: "High Severity",
      };
    }
    if (normalized === "medium") {
      return {
        textClass: "text-amber-700",
        Icon: AlertTriangle,
        label: "Medium Severity",
      };
    }
    return {
      textClass: "text-emerald-700",
      Icon: CheckCircle2,
      label: "Low Severity",
    };
  };

  return (
    <div className="space-y-8" aria-label="Business Evaluation Dashboard">
      {/* Top Report Action & Context Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500">
              <span>{report.input.industry}</span>
              <span aria-hidden="true">·</span>
              <span>{report.input.targetLocation}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{report.input.startingBudget}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formattedDate}</span>
            </div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              {report.input.businessName} — Evaluation Report
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
            <button
              type="button"
              onClick={onEditInputs}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit Inputs</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>{pdfExported ? "PDF Downloaded" : "Download PDF Report"}</span>
            </button>
          </div>
        </div>

        {/* Section Jump Links */}
        <nav
          aria-label="Report sections"
          className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 no-print"
        >
          <a href="#section-summary" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            Executive Summary
          </a>
          <a href="#section-customers" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            Target Customers
          </a>
          <a href="#section-competitors" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            Competitors
          </a>
          <a href="#section-swot" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            SWOT Analysis
          </a>
          <a href="#section-revenue" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            Revenue Models
          </a>
          <a href="#section-risks" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap">
            Risk Analysis
          </a>
        </nav>
      </div>

      {/* 1. Executive Summary & Indicative Feasibility Score */}
      <section
        id="section-summary"
        aria-labelledby="summary-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid"
      >
        <h3 id="summary-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
          Executive Summary & Feasibility Assessment
        </h3>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 py-4 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
            <ScoreGauge
              score={report.executiveSummary.feasibilityScore}
              statusLabel={report.executiveSummary.statusLabel}
            />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div>
              <p className="text-base font-semibold text-slate-900 leading-snug">
                {report.executiveSummary.verdictHeadline}
              </p>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                {report.executiveSummary.scoreReasoning}
              </p>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900">
                Top 3 Actionable Recommendations
              </h4>
              <ol className="mt-3 space-y-3">
                {report.executiveSummary.actionableRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="font-mono text-xs font-semibold text-slate-500 mt-0.5 tabular-nums shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Target Customer Analysis */}
      <section
        id="section-customers"
        aria-labelledby="customers-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid"
      >
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
          <h3 id="customers-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
            Target Customer Analysis
          </h3>
        </div>
        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed max-w-4xl">
          {report.targetCustomers.marketContext}
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x lg:divide-slate-100">
          {[
            { role: "Primary Persona", persona: report.targetCustomers.primaryPersona },
            { role: "Secondary Persona", persona: report.targetCustomers.secondaryPersona },
          ].map(({ role, persona }, idx) => (
            <div key={role} className={idx === 1 ? "lg:pl-8" : ""}>
              <div className="text-xs font-medium text-slate-500">{role}</div>
              <h4 className="mt-1 text-base font-semibold text-slate-900">{persona.name}</h4>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Demographics & Profile</dt>
                  <dd className="mt-0.5 text-slate-700 leading-relaxed">{persona.demographics}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Buying Behavior</dt>
                  <dd className="mt-0.5 text-slate-700 leading-relaxed">{persona.buyingBehavior}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Core Pain Points Solved</dt>
                  <dd className="mt-1">
                    <ul className="space-y-1.5 text-slate-700">
                      {persona.painPoints.map((pain, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-slate-400 select-none" aria-hidden="true">
                            —
                          </span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <dt className="text-xs font-semibold text-emerald-700">Value Delivered</dt>
                  <dd className="mt-0.5 text-slate-800 font-medium leading-relaxed">
                    {persona.valueDelivered}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Competitor Suggestions */}
      <section
        id="section-competitors"
        aria-labelledby="competitors-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Swords className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
            <h3 id="competitors-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
              Competitor Suggestions & Differentiation
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {report.competitors.length} research leads identified
          </span>
        </div>

        <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          {report.competitors.map((comp, idx) => (
            <div key={idx} className="py-5 first:pt-5 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              <div className="lg:col-span-3">
                <div className="text-xs font-medium text-slate-500">{comp.category}</div>
                <h4 className="mt-0.5 text-base font-semibold text-slate-900">{comp.name}</h4>
              </div>
              <div className="lg:col-span-3">
                <div className="text-xs font-semibold text-slate-500">Key Strengths</div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">{comp.strengths}</p>
              </div>
              <div className="lg:col-span-3">
                <div className="text-xs font-semibold text-slate-500">Gap / Limitation</div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">{comp.weaknessOrGap}</p>
              </div>
              <div className="lg:col-span-3">
                <div className="text-xs font-semibold text-emerald-700">How You Differentiate</div>
                <p className="mt-1 text-sm text-slate-800 font-medium leading-relaxed">
                  {comp.differentiationStrategy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SWOT Analysis (Clean 2x2 Architectural Grid) */}
      <section
        id="section-swot"
        aria-labelledby="swot-heading"
        className="bg-white border border-slate-200 rounded-xl overflow-hidden print-break-inside-avoid"
      >
        <div className="p-6 sm:px-8 sm:py-6 border-b border-slate-200 flex items-center gap-2.5">
          <LayoutGrid className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
          <h3 id="swot-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
            SWOT Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
          {[
            {
              title: "Strengths",
              subtitle: "Internal advantages",
              items: report.swot.strengths,
              accentClass: "text-emerald-700",
              Icon: CheckCircle2,
            },
            {
              title: "Weaknesses",
              subtitle: "Internal constraints",
              items: report.swot.weaknesses,
              accentClass: "text-amber-700",
              Icon: AlertTriangle,
            },
            {
              title: "Opportunities",
              subtitle: "External tailwinds",
              items: report.swot.opportunities,
              accentClass: "text-emerald-700",
              Icon: TrendingUp,
            },
            {
              title: "Threats",
              subtitle: "External headwinds",
              items: report.swot.threats,
              accentClass: "text-red-700",
              Icon: ShieldAlert,
            },
          ].map(({ title, subtitle, items, accentClass, Icon }) => (
            <div key={title} className="bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${accentClass}`} aria-hidden="true" />
                  <h4 className="text-base font-semibold text-slate-900">{title}</h4>
                </div>
                <span className="text-xs text-slate-500">{subtitle}</span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                {items.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-slate-400 select-none" aria-hidden="true">
                      —
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Revenue Model Suggestions */}
      <section
        id="section-revenue"
        aria-labelledby="revenue-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid"
      >
        <div className="flex items-center gap-2.5">
          <CircleDollarSign className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
          <h3 id="revenue-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
            Revenue Model Suggestions
          </h3>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:divide-x lg:divide-slate-100">
          {report.revenueModels.map((model, idx) => (
            <div key={idx} className={idx > 0 ? "lg:pl-8" : ""}>
              <div className="text-xs font-mono text-slate-500 tabular-nums">
                Option 0{idx + 1} · {model.estimatedTimeToRevenue}
              </div>
              <h4 className="mt-1 text-base font-semibold text-slate-900">{model.modelName}</h4>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Pricing Structure</div>
                  <p className="mt-0.5 text-slate-800 font-medium leading-relaxed">
                    {model.pricingStructure}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Budget & Market Fit</div>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">
                    {model.suitabilityRationale}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Risk Analysis */}
      <section
        id="section-risks"
        aria-labelledby="risks-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 print-break-inside-avoid"
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
          <h3 id="risks-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
            Risk Analysis & Mitigation Plan
          </h3>
        </div>

        <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          {report.risks.map((risk, idx) => {
            const visuals = getSeverityVisuals(risk.severity);
            const SeverityIcon = visuals.Icon;

            return (
              <div key={idx} className="py-5 first:pt-5 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="text-slate-500">{risk.category}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${visuals.textClass}`}>
                      <SeverityIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{visuals.label}</span>
                    </span>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-slate-900">{risk.title}</h4>
                </div>
                <div className="lg:col-span-4">
                  <div className="text-xs font-semibold text-slate-500">Risk Exposure</div>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">{risk.description}</p>
                </div>
                <div className="lg:col-span-4">
                  <div className="text-xs font-semibold text-slate-700">Mitigation Strategy</div>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    {risk.mitigationStrategy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Required Disclaimer Note */}
      <footer className="bg-slate-100 border border-slate-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs text-slate-600 leading-relaxed italic">
          Note: Competitor suggestions are AI-generated research leads, not verified live market
          research. The feasibility score is an indicative AI assessment, not a guarantee of
          business success.
        </p>
      </footer>
    </div>
  );
}
