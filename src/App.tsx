import { useRef, useState } from "react";
import { BarChart3, Compass, ShieldCheck } from "lucide-react";
import { BusinessIdeaForm } from "./components/BusinessIdeaForm";
import { EvaluationDashboard } from "./components/EvaluationDashboard";
import { SAMPLE_IDEAS } from "./data/sampleIdeas";
import type { BusinessEvaluationReport, BusinessIdeaInput } from "./types/evaluation";

const INITIAL_INPUT: BusinessIdeaInput = {
  businessName: "",
  industry: "SaaS",
  targetLocation: "",
  startingBudget: "",
  ideaDescription: "",
};

export default function App() {
  const [formInput, setFormInput] = useState<BusinessIdeaInput>(INITIAL_INPUT);
  const [report, setReport] = useState<BusinessEvaluationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);

  const handleValidate = async (input: BusinessIdeaInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload = (await response.json()) as BusinessEvaluationReport & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || `Validation failed with status ${response.status}.`);
      }

      setReport(payload);
      window.setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to validate the business idea right now. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLoadQuickSample = () => {
    setFormInput(SAMPLE_IDEAS[0]);
    setError(null);
    handleScrollToForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            StartupSense
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            <a
              href="#validator-form"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Validator
            </a>
            <a
              href="#framework"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            {report && (
              <a
                href="#evaluation-report"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Evaluation Report
              </a>
            )}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={report ? handleScrollToForm : handleLoadQuickSample}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {report ? "New Validation" : "Try Sample Brief"}
            </button>
          </div>
        </div>
      </header>

      {/* Deep Slate Executive Hero Section */}
      <section id="top" className="bg-slate-900 text-white pt-10 pb-20 sm:pt-12 sm:pb-24 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-[1.15] text-balance">
              StartupSense
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              Validate your business idea with AI-powered market, competitor, and feasibility insights.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-slate-400">
              <span>Feasibility Scoring</span>
              <span aria-hidden="true">·</span>
              <span>Customer Personas</span>
              <span aria-hidden="true">·</span>
              <span>Competitor Leads</span>
              <span aria-hidden="true">·</span>
              <span>SWOT &amp; Revenue Models</span>
              <span aria-hidden="true">·</span>
              <span>PDF Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 space-y-10">
        <div ref={formSectionRef} className="no-print">
          <BusinessIdeaForm
            value={formInput}
            onChange={setFormInput}
            onSubmit={handleValidate}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Loading Skeleton State */}
        {isLoading && (
          <section
            aria-live="polite"
            aria-label="Generating evaluation report"
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-2 w-full max-w-md">
                <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-72 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-9 w-36 bg-slate-200 rounded-lg animate-pulse shrink-0" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 h-44 bg-slate-100 rounded-xl animate-pulse" />
              <div className="lg:col-span-8 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-11/12 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </section>
        )}

        {/* Evaluation Dashboard Output */}
        {report && !isLoading && (
          <div id="evaluation-report" ref={reportRef} className="scroll-mt-6">
            <EvaluationDashboard report={report} onEditInputs={handleScrollToForm} />
          </div>
        )}

        {/* Empty / Methodology Reference Section when no report is active */}
        {!report && !isLoading && (
          <section
            id="framework"
            aria-labelledby="framework-heading"
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 no-print"
          >
            <div className="max-w-2xl">
              <h2 id="framework-heading" className="text-lg font-semibold text-slate-900 tracking-tight">
                What Your Validation Brief Covers
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Every submission is evaluated against your stated geography, sector dynamics, and starting budget constraints.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <BarChart3 className="w-5 h-5 text-slate-700" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Feasibility &amp; Budget Alignment
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  An indicative 0–100 score paired with transparent rationale and 3 concrete pre-launch improvements tailored to your capital runway.
                </p>
              </div>

              <div>
                <Compass className="w-5 h-5 text-slate-700" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Personas &amp; Competitor Leads
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  Primary and secondary buyer profiles alongside 3–4 realistic competitors or status-quo alternatives with clear differentiation angles.
                </p>
              </div>

              <div>
                <ShieldCheck className="w-5 h-5 text-slate-700" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  SWOT, Monetization &amp; Risks
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  A structured 2×2 SWOT matrix, practical revenue models, and prioritized market or operational risks ready to export as an executive PDF.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>StartupSense · AI-Powered Business Concept Validator</span>
          <span>Structured for founder due diligence &amp; early-stage strategy</span>
        </div>
      </footer>
    </div>
  );
}
