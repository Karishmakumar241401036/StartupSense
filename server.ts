import "dotenv/config";
import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidateRequestBody {
  businessName?: string;
  industry?: string;
  targetLocation?: string;
  startingBudget?: string;
  ideaDescription?: string;
}

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.OBJECT,
      properties: {
        feasibilityScore: {
          type: Type.INTEGER,
          description:
            "Indicative feasibility score from 0 to 100 based on problem urgency, market realism, differentiation, and alignment with the stated starting budget.",
        },
        statusLabel: {
          type: Type.STRING,
          description:
            'Must be one of: "High Potential", "Promising with Refinement", "Needs Refinement", or "High Risk".',
        },
        verdictHeadline: {
          type: Type.STRING,
          description: "A concise 1-sentence executive verdict summarizing the business outlook.",
        },
        scoreReasoning: {
          type: Type.STRING,
          description:
            "2-3 clear sentences explaining the rationale behind the score, referencing the target market and starting budget.",
        },
        actionableRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 3 concrete, actionable next steps to improve viability before scaling.",
        },
      },
      required: [
        "feasibilityScore",
        "statusLabel",
        "verdictHeadline",
        "scoreReasoning",
        "actionableRecommendations",
      ],
    },
    targetCustomers: {
      type: Type.OBJECT,
      properties: {
        marketContext: {
          type: Type.STRING,
          description:
            "2-3 sentences on how the target location and industry dynamics shape customer adoption and willingness to pay.",
        },
        primaryPersona: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Archetype title for the primary buyer/user." },
            demographics: { type: Type.STRING, description: "Age, role, income/firmographics, and setting." },
            buyingBehavior: { type: Type.STRING, description: "How they currently solve this problem and make purchase decisions." },
            painPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 specific pain points addressed.",
            },
            valueDelivered: { type: Type.STRING, description: "Core outcome delivered to this persona." },
          },
          required: ["name", "demographics", "buyingBehavior", "painPoints", "valueDelivered"],
        },
        secondaryPersona: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Archetype title for the secondary buyer/user." },
            demographics: { type: Type.STRING, description: "Age, role, income/firmographics, and setting." },
            buyingBehavior: { type: Type.STRING, description: "How they discover and evaluate solutions." },
            painPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 specific pain points addressed.",
            },
            valueDelivered: { type: Type.STRING, description: "Core outcome delivered to this persona." },
          },
          required: ["name", "demographics", "buyingBehavior", "painPoints", "valueDelivered"],
        },
      },
      required: ["marketContext", "primaryPersona", "secondaryPersona"],
    },
    competitors: {
      type: Type.ARRAY,
      description: "3 to 4 realistic competitor leads or alternative solutions to research.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of a realistic competitor, category leader, or status-quo alternative." },
          category: { type: Type.STRING, description: "e.g., Direct Competitor, Regional Leader, or Manual Workflow Alternative." },
          strengths: { type: Type.STRING, description: "Key strengths and why customers choose them today." },
          weaknessOrGap: { type: Type.STRING, description: "Underserved segment, friction point, or pricing gap." },
          differentiationStrategy: { type: Type.STRING, description: "How the proposed startup can win against them." },
        },
        required: ["name", "category", "strengths", "weaknessOrGap", "differentiationStrategy"],
      },
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 internal strengths." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 internal weaknesses or resource constraints." },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 external market opportunities." },
        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 external market or competitive threats." },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    revenueModels: {
      type: Type.ARRAY,
      description: "2 to 3 tailored monetization strategies aligned with the industry and starting budget.",
      items: {
        type: Type.OBJECT,
        properties: {
          modelName: { type: Type.STRING, description: "Name of the revenue model." },
          pricingStructure: { type: Type.STRING, description: "Suggested pricing tiers, take-rate, or unit economics." },
          suitabilityRationale: { type: Type.STRING, description: "Why this fits the target market and budget constraints." },
          estimatedTimeToRevenue: { type: Type.STRING, description: "Realistic timeline to first paying customers." },
        },
        required: ["modelName", "pricingStructure", "suitabilityRationale", "estimatedTimeToRevenue"],
      },
    },
    risks: {
      type: Type.ARRAY,
      description: "3 to 4 key operational, financial, market, or regulatory risks with mitigations.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short risk title." },
          category: { type: Type.STRING, description: "Market, Financial, Operational, or Regulatory." },
          severity: { type: Type.STRING, description: "High, Medium, or Low." },
          description: { type: Type.STRING, description: "Clear explanation of why this risk matters for this venture." },
          mitigationStrategy: { type: Type.STRING, description: "Practical mitigation step suited to the starting budget." },
        },
        required: ["title", "category", "severity", "description", "mitigationStrategy"],
      },
    },
  },
  required: [
    "executiveSummary",
    "targetCustomers",
    "competitors",
    "swot",
    "revenueModels",
    "risks",
  ],
};

function getHttpStatusFromError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const lower = rawMessage.toLowerCase();

  if (lower.includes("api_key_invalid") || lower.includes("permission_denied") || lower.includes("403")) {
    return {
      status: 403,
      message:
        "Gemini API access was denied. Please verify your GEMINI_API_KEY in the Settings > Secrets panel.",
    };
  }
  if (lower.includes("resource_exhausted") || lower.includes("429") || lower.includes("quota")) {
    return {
      status: 429,
      message:
        "Gemini API rate limit or quota exceeded. Please wait a moment and try again, or check your API quota in Settings > Secrets.",
    };
  }
  if (lower.includes("not_found") || lower.includes("404")) {
    return {
      status: 502,
      message: "The configured Gemini model could not be reached. Please try again shortly.",
    };
  }
  return {
    status: 500,
    message: rawMessage || "Failed to generate business validation report.",
  };
}

async function generateWithRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const msg = error instanceof Error ? error.message.toLowerCase() : "";
      const isTransient = msg.includes("503") || msg.includes("timeout") || msg.includes("econnreset");
      if (!isTransient || attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    }
  }
  throw lastError;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/validate", async (req: Request, res: Response) => {
    try {
      const body = (req.body ?? {}) as ValidateRequestBody;
      const businessName = (body.businessName ?? "").trim();
      const industry = (body.industry ?? "").trim();
      const targetLocation = (body.targetLocation ?? "").trim();
      const startingBudget = (body.startingBudget ?? "").trim();
      const ideaDescription = (body.ideaDescription ?? "").trim();

      if (!businessName || !industry || !targetLocation || !startingBudget || !ideaDescription) {
        res.status(400).json({
          error: "All business validation fields are required.",
        });
        return;
      }

      if (ideaDescription.length < 25) {
        res.status(400).json({
          error: "Please provide a more detailed business idea description (at least 25 characters).",
        });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            "GEMINI_API_KEY is not configured on the server. Please add it in the Settings > Secrets panel.",
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = [
        "Evaluate the following startup / business concept and produce a structured investment-grade validation brief:",
        "",
        `Business Name: ${businessName}`,
        `Industry / Sector: ${industry}`,
        `Target Location / Market: ${targetLocation}`,
        `Estimated Starting Budget: ${startingBudget}`,
        `Business Idea Description: ${ideaDescription}`,
        "",
        "Guidelines:",
        "- Ground every assessment specifically in the stated location, industry dynamics, and starting budget.",
        "- If the budget is tight or bootstrapped, reflect realistic customer acquisition constraints and recommend lean validation steps.",
        "- Competitor suggestions must be realistic research leads (existing regional/global players or status-quo alternatives) with concrete differentiation angles.",
        "- Avoid generic fluff; keep each bullet crisp, specific, and practical for a founder.",
      ].join("\n");

      const response = await generateWithRetry(() =>
        ai.models.generateContent({
          model:"gemini-2.5-flash-lite",
          contents: prompt,
          config: {
            systemInstruction:
              "You are a senior venture analyst and startup strategist. You evaluate business ideas objectively, balancing commercial opportunity with operational and financial realism. Always return strictly valid JSON matching the requested schema.",
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
          },
        })
      );

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        res.status(502).json({
          error: "Received an empty evaluation response from Gemini. Please try again.",
        });
        return;
      }

      const parsed = JSON.parse(rawText);
      const clampedScore = Math.max(
        0,
        Math.min(100, Math.round(Number(parsed?.executiveSummary?.feasibilityScore ?? 50)))
      );

      if (parsed?.executiveSummary) {
        parsed.executiveSummary.feasibilityScore = clampedScore;
      }

      res.json({
        generatedAt: new Date().toISOString(),
        input: {
          businessName,
          industry,
          targetLocation,
          startingBudget,
          ideaDescription,
        },
        ...parsed,
      });
    } catch (err) {
      console.error("[StartupSense] /api/validate error:", err);
      const mapped = getHttpStatusFromError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV === "production") {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`StartupSense server running on http://0.0.0.0:${port}`);
  });
}

createServer().catch((err) => {
  console.error("Failed to start StartupSense server:", err);
  process.exit(1);
});
