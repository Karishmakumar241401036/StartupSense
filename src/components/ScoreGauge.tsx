import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  statusLabel: string;
}

export function ScoreGauge({ score, statusLabel }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 75
      ? {
          stroke: "#059669",
          track: "#D1FAE5",
          textClass: "text-emerald-700",
          surfaceClass: "bg-emerald-50 border-emerald-200",
          Icon: CheckCircle2,
        }
      : clamped >= 50
        ? {
            stroke: "#D97706",
            track: "#FEF3C7",
            textClass: "text-amber-700",
            surfaceClass: "bg-amber-50 border-amber-200",
            Icon: AlertTriangle,
          }
        : {
            stroke: "#DC2626",
            track: "#FEE2E2",
            textClass: "text-red-700",
            surfaceClass: "bg-red-50 border-red-200",
            Icon: ShieldAlert,
          };

  const StatusIcon = tone.Icon;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={tone.track}
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {clamped}
          </span>
          <span className="text-xs font-medium text-slate-500 tabular-nums">out of 100</span>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap">
        <StatusIcon className={`w-4 h-4 shrink-0 ${tone.textClass}`} aria-hidden="true" />
        <span className={tone.textClass}>{statusLabel}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Indicative Feasibility Score</p>
    </div>
  );
}
