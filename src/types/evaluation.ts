export interface BusinessIdeaInput {
  businessName: string;
  industry: string;
  targetLocation: string;
  startingBudget: string;
  ideaDescription: string;
}

export interface CustomerPersona {
  name: string;
  demographics: string;
  buyingBehavior: string;
  painPoints: string[];
  valueDelivered: string;
}

export interface CompetitorSuggestion {
  name: string;
  category: string;
  strengths: string;
  weaknessOrGap: string;
  differentiationStrategy: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RevenueModelSuggestion {
  modelName: string;
  pricingStructure: string;
  suitabilityRationale: string;
  estimatedTimeToRevenue: string;
}

export interface RiskItem {
  title: string;
  category: 'Market' | 'Financial' | 'Operational' | 'Regulatory' | string;
  severity: 'High' | 'Medium' | 'Low' | string;
  description: string;
  mitigationStrategy: string;
}

export interface BusinessEvaluationReport {
  generatedAt: string;
  input: BusinessIdeaInput;
  executiveSummary: {
    feasibilityScore: number;
    statusLabel: 'High Potential' | 'Promising with Refinement' | 'Needs Refinement' | 'High Risk' | string;
    verdictHeadline: string;
    scoreReasoning: string;
    actionableRecommendations: string[];
  };
  targetCustomers: {
    primaryPersona: CustomerPersona;
    secondaryPersona: CustomerPersona;
    marketContext: string;
  };
  competitors: CompetitorSuggestion[];
  swot: SwotAnalysis;
  revenueModels: RevenueModelSuggestion[];
  risks: RiskItem[];
}
