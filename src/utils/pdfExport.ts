import { jsPDF } from "jspdf";
import type { BusinessEvaluationReport } from "../types/evaluation";

const DISCLAIMER_TEXT =
  "Note: Competitor suggestions are AI-generated research leads, not verified live market research. The feasibility score is an indicative AI assessment, not a guarantee of business success.";

export function exportEvaluationPdf(report: BusinessEvaluationReport): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 54) {
      doc.addPage();
      y = 48;
    }
  };

  const addSectionHeading = (title: string) => {
    ensureSpace(44);
    y += 14;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
    y += 16;
  };

  const addWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    options?: {
      fontSize?: number;
      fontStyle?: "normal" | "bold";
      color?: [number, number, number];
      lineHeight?: number;
      bottomGap?: number;
    }
  ) => {
    const fontSize = options?.fontSize ?? 9.5;
    const fontStyle = options?.fontStyle ?? "normal";
    const color = options?.color ?? [51, 65, 85];
    const lineHeight = options?.lineHeight ?? fontSize * 1.42;
    const bottomGap = options?.bottomGap ?? 6;

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight + 4);
      doc.text(line, x, y);
      y += lineHeight;
    }
    y += bottomGap;
  };

  // Top Navy Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 108, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("STARTUPSENSE  ·  BUSINESS VALIDATION REPORT", margin, 32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(report.input.businessName, contentWidth) as string[];
  doc.text(titleLines[0] ?? report.input.businessName, margin, 58);

  const formattedDate = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  const metaLine = `${report.input.industry}  ·  ${report.input.targetLocation}  ·  Budget: ${report.input.startingBudget}  ·  ${formattedDate}`;
  doc.text(metaLine, margin, 82);

  y = 130;

  // 1. Executive Summary & Feasibility Score
  const score = report.executiveSummary.feasibilityScore;
  const statusColor: [number, number, number] =
    score >= 75 ? [5, 150, 105] : score >= 50 ? [217, 119, 6] : [220, 38, 38];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 64, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`${score}/100`, margin + 16, y + 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(report.executiveSummary.statusLabel.toUpperCase(), margin + 16, y + 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const verdictLines = doc.splitTextToSize(
    report.executiveSummary.verdictHeadline,
    contentWidth - 135
  ) as string[];
  doc.text(verdictLines.slice(0, 3), margin + 120, y + 26);

  y += 82;

  addWrappedText("Score Rationale", margin, contentWidth, {
    fontSize: 10,
    fontStyle: "bold",
    color: [15, 23, 42],
    bottomGap: 3,
  });
  addWrappedText(report.executiveSummary.scoreReasoning, margin, contentWidth, {
    bottomGap: 10,
  });

  addWrappedText("Top Actionable Recommendations", margin, contentWidth, {
    fontSize: 10,
    fontStyle: "bold",
    color: [15, 23, 42],
    bottomGap: 4,
  });
  report.executiveSummary.actionableRecommendations.forEach((rec, index) => {
    addWrappedText(`0${index + 1}. ${rec}`, margin + 6, contentWidth - 6, {
      bottomGap: 4,
    });
  });

  // 2. Target Customer Analysis
  addSectionHeading("Target Customer Analysis");
  addWrappedText(report.targetCustomers.marketContext, margin, contentWidth, {
    bottomGap: 10,
  });

  const personas = [
    { label: "Primary Persona", data: report.targetCustomers.primaryPersona },
    { label: "Secondary Persona", data: report.targetCustomers.secondaryPersona },
  ];

  for (const item of personas) {
    ensureSpace(80);
    addWrappedText(`${item.label}: ${item.data.name}`, margin, contentWidth, {
      fontSize: 10,
      fontStyle: "bold",
      color: [15, 23, 42],
      bottomGap: 2,
    });
    addWrappedText(`Demographics: ${item.data.demographics}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(`Buying Behavior: ${item.data.buyingBehavior}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(`Value Delivered: ${item.data.valueDelivered}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(
      `Pain Points: ${item.data.painPoints.join("  ·  ")}`,
      margin + 8,
      contentWidth - 8,
      { bottomGap: 8 }
    );
  }

  // 3. Competitor Suggestions
  addSectionHeading("Competitor Research Leads");
  for (const comp of report.competitors) {
    ensureSpace(70);
    addWrappedText(`${comp.name}  (${comp.category})`, margin, contentWidth, {
      fontSize: 10,
      fontStyle: "bold",
      color: [15, 23, 42],
      bottomGap: 2,
    });
    addWrappedText(`Strengths: ${comp.strengths}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(`Gap / Limitation: ${comp.weaknessOrGap}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(
      `Differentiation Strategy: ${comp.differentiationStrategy}`,
      margin + 8,
      contentWidth - 8,
      { bottomGap: 8 }
    );
  }

  // 4. SWOT Analysis
  addSectionHeading("SWOT Analysis");
  const swotQuadrants: Array<{ title: string; items: string[] }> = [
    { title: "Strengths", items: report.swot.strengths },
    { title: "Weaknesses", items: report.swot.weaknesses },
    { title: "Opportunities", items: report.swot.opportunities },
    { title: "Threats", items: report.swot.threats },
  ];

  for (const quadrant of swotQuadrants) {
    ensureSpace(55);
    addWrappedText(quadrant.title, margin, contentWidth, {
      fontSize: 10,
      fontStyle: "bold",
      color: [15, 23, 42],
      bottomGap: 3,
    });
    for (const point of quadrant.items) {
      addWrappedText(`• ${point}`, margin + 8, contentWidth - 8, { bottomGap: 2 });
    }
    y += 4;
  }

  // 5. Revenue Model Suggestions
  addSectionHeading("Revenue Model Suggestions");
  for (const model of report.revenueModels) {
    ensureSpace(64);
    addWrappedText(
      `${model.modelName}  ·  Est. Time to Revenue: ${model.estimatedTimeToRevenue}`,
      margin,
      contentWidth,
      {
        fontSize: 10,
        fontStyle: "bold",
        color: [15, 23, 42],
        bottomGap: 2,
      }
    );
    addWrappedText(`Pricing Structure: ${model.pricingStructure}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(`Suitability: ${model.suitabilityRationale}`, margin + 8, contentWidth - 8, {
      bottomGap: 8,
    });
  }

  // 6. Risk Analysis
  addSectionHeading("Risk Analysis & Mitigations");
  for (const risk of report.risks) {
    ensureSpace(64);
    addWrappedText(
      `${risk.title}  ·  ${risk.category}  ·  Severity: ${risk.severity}`,
      margin,
      contentWidth,
      {
        fontSize: 10,
        fontStyle: "bold",
        color: [15, 23, 42],
        bottomGap: 2,
      }
    );
    addWrappedText(`Risk: ${risk.description}`, margin + 8, contentWidth - 8, {
      bottomGap: 2,
    });
    addWrappedText(`Mitigation: ${risk.mitigationStrategy}`, margin + 8, contentWidth - 8, {
      bottomGap: 8,
    });
  }

  // Disclaimer Box at end of report
  ensureSpace(64);
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER_TEXT, contentWidth - 24) as string[];
  const boxHeight = disclaimerLines.length * 13 + 20;
  doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(disclaimerLines, margin + 12, y + 16);

  // Page numbering footer across all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("StartupSense AI Business Evaluation", margin, pageHeight - 24);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 24, {
      align: "right",
    });
  }

  const safeSlug = report.input.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`startupsense-${safeSlug || "report"}.pdf`);
}
