import type { BusinessIdeaInput } from "../types/evaluation";

export const INDUSTRY_OPTIONS = [
  "HealthTech",
  "FinTech",
  "EdTech",
  "SaaS",
  "E-Commerce",
  "Sustainability",
  "AgriTech",
  "Logistics",
  "Other",
] as const;

export const BUDGET_PRESETS = [
  "Bootstrapped ($0–$1,000)",
  "$5,000",
  "₹2,00,000",
  "$25,000",
] as const;

export const SAMPLE_IDEAS: BusinessIdeaInput[] = [
  {
    businessName: "CareTriage Bharat",
    industry: "HealthTech",
    targetLocation: "Tier-2 Cities in India",
    startingBudget: "₹2,00,000",
    ideaDescription:
      "A WhatsApp-first clinic appointment, digital prescription summary, and chronic care follow-up platform built for independent doctors and 10–30 bed clinics in Tier-2 Indian cities. Instead of forcing patients and receptionists to adopt complex hospital ERPs or download dedicated apps, patients book slots, receive regional-language voice/text medication reminders, and share lab reports directly over WhatsApp while clinics automate queue management and repeat patient retention.",
  },
  {
    businessName: "LedgerLoop",
    industry: "FinTech",
    targetLocation: "Global (US & UK Freelancers)",
    startingBudget: "$5,000",
    ideaDescription:
      "An automated cash-flow smoothing and tax-reserve co-pilot for solo consultants and micro-agencies. It connects to Stripe and bank feeds, automatically sets aside jurisdiction-specific quarterly tax buffers into high-yield treasury sub-accounts, chases overdue invoices with polite multi-channel nudges, and forecasts 90-day runway based on recurring retainers versus one-off project milestones.",
  },
  {
    businessName: "RePack Grid",
    industry: "Sustainability",
    targetLocation: "Urban Metro Areas (India & Southeast Asia)",
    startingBudget: "Bootstrapped",
    ideaDescription:
      "A B2B returnable packaging-as-a-service network for D2C food, beauty, and pharmacy brands fulfilling local same-day deliveries. Brands lease durable QR-tracked insulated mailers at a per-trip fee comparable to single-use cardboard, and RePack Grid collects, sanitizes, and redistributes empty pouches via existing hyperlocal return riders.",
  },
];
