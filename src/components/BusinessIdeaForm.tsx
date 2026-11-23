import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, RotateCcw, FileText, AlertCircle } from "lucide-react";
import type { BusinessIdeaInput } from "../types/evaluation";
import { BUDGET_PRESETS, INDUSTRY_OPTIONS, SAMPLE_IDEAS } from "../data/sampleIdeas";

interface BusinessIdeaFormProps {
  value: BusinessIdeaInput;
  onChange: (next: BusinessIdeaInput) => void;
  onSubmit: (input: BusinessIdeaInput) => void;
  isLoading: boolean;
  error: string | null;
}

export function BusinessIdeaForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}: BusinessIdeaFormProps) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const isCustomIndustry =
    value.industry !== "" &&
    !INDUSTRY_OPTIONS.includes(value.industry as (typeof INDUSTRY_OPTIONS)[number]);

  const selectValue = isCustomIndustry ? "Other" : value.industry;

  const handleLoadSample = () => {
    const sample = SAMPLE_IDEAS[sampleIndex % SAMPLE_IDEAS.length];
    onChange(sample);
    setSampleIndex((prev) => (prev + 1) % SAMPLE_IDEAS.length);
    setLocalError(null);
  };

  const handleReset = () => {
    onChange({
      businessName: "",
      industry: "SaaS",
      targetLocation: "",
      startingBudget: "",
      ideaDescription: "",
    });
    setLocalError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (
      !value.businessName.trim() ||
      !value.industry.trim() ||
      !value.targetLocation.trim() ||
      !value.startingBudget.trim() ||
      !value.ideaDescription.trim()
    ) {
      setLocalError("Please fill in all fields before running the validation.");
      return;
    }

    if (value.ideaDescription.trim().length < 25) {
      setLocalError(
        "Please expand your business idea description to at least 25 characters so the evaluation has enough context."
      );
      return;
    }

    onSubmit({
      businessName: value.businessName.trim(),
      industry: value.industry.trim(),
      targetLocation: value.targetLocation.trim(),
      startingBudget: value.startingBudget.trim(),
      ideaDescription: value.ideaDescription.trim(),
    });
  };

  const activeError = localError || error;
  const charCount = value.ideaDescription.length;

  return (
    <section
      id="validator-form"
      aria-labelledby="form-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 id="form-heading" className="text-xl font-semibold text-slate-900 tracking-tight">
            Business Concept Brief
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Provide your venture fundamentals for an instant structured market and feasibility analysis.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {(value.businessName || value.ideaDescription) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
            <span>Load Sample Idea</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Business Name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              value={value.businessName}
              onChange={(e) => onChange({ ...value, businessName: e.target.value })}
              placeholder="e.g., CareTriage Bharat"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Industry / Sector
            </label>
            <div className="space-y-2">
              <select
                id="industry"
                name="industry"
                value={selectValue}
                onChange={(e) => {
                  const chosen = e.target.value;
                  onChange({
                    ...value,
                    industry: chosen === "Other" ? "Other" : chosen,
                  });
                }}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {(selectValue === "Other" || isCustomIndustry) && (
                <input
                  type="text"
                  aria-label="Custom industry or sector"
                  value={value.industry === "Other" ? "" : value.industry}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      industry: e.target.value || "Other",
                    })
                  }
                  placeholder="Specify your sector (e.g., LegalTech, GovTech)"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="targetLocation"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Target Location / Market
            </label>
            <input
              id="targetLocation"
              name="targetLocation"
              type="text"
              value={value.targetLocation}
              onChange={(e) => onChange({ ...value, targetLocation: e.target.value })}
              placeholder="e.g., India, Global, Tier-2 Cities in India"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="startingBudget"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Estimated Starting Budget
            </label>
            <input
              id="startingBudget"
              name="startingBudget"
              type="text"
              value={value.startingBudget}
              onChange={(e) => onChange({ ...value, startingBudget: e.target.value })}
              placeholder="e.g., $5,000, ₹2,00,000, Bootstrapped"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              required
            />
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>Quick fill:</span>
              {BUDGET_PRESETS.map((preset, idx) => (
                <span key={preset} className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onChange({ ...value, startingBudget: preset })}
                    className="text-slate-600 hover:text-slate-900 underline underline-offset-2 decoration-slate-300 hover:decoration-slate-900 transition-colors"
                  >
                    {preset}
                  </button>
                  {idx < BUDGET_PRESETS.length - 1 && (
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="ideaDescription" className="block text-sm font-medium text-slate-800">
              Business Idea Description
            </label>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {charCount} chars
            </span>
          </div>
          <textarea
            id="ideaDescription"
            name="ideaDescription"
            rows={5}
            value={value.ideaDescription}
            onChange={(e) => onChange({ ...value, ideaDescription: e.target.value })}
            placeholder="Describe the core customer problem, your proposed product or service, how it works, and why customers will choose it over current alternatives..."
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50 resize-y"
            required
          />
        </div>

        {activeError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 shrink-0" aria-hidden="true" />
            <span>{activeError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Structured evaluation includes feasibility score, personas, competitor leads, SWOT, revenue models, and risks.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Analyzing Business Idea...</span>
              </>
            ) : (
              <>
                <span>Validate Business Idea</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
