import {
  CREDIT_SCORE_MAX,
  CREDIT_SCORE_MIN,
  resolveScoreBand,
  resolveScoreFraction,
} from "@/components/credit-score/score-utils";

interface CreditScoreGaugeProps {
  readonly score: number;
  readonly variant?: "light" | "dark";
  readonly showRange?: boolean;
  readonly className?: string;
}

const RADIUS = 80;
const CENTER_X = 100;
const CENTER_Y = 100;
const STROKE_WIDTH = 14;

function polarPoint(fraction: number): { x: number; y: number } {
  const angle = Math.PI * (1 - fraction);
  return {
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y - RADIUS * Math.sin(angle),
  };
}

/**
 * Semicircular Equifax-style credit score gauge (300–900) with a gradient arc
 * and a marker at the current score.
 */
export default function CreditScoreGauge({
  score,
  variant = "light",
  showRange = true,
  className = "",
}: CreditScoreGaugeProps) {
  const fraction = resolveScoreFraction(score);
  const band = resolveScoreBand(score);
  const start = polarPoint(0);
  const end = polarPoint(1);
  const marker = polarPoint(fraction);
  const trackColor = variant === "dark" ? "#1f3a2a" : "#EEF2F0";
  const scoreTextColor = variant === "dark" ? "#ffffff" : "#111827";
  const rangeTextColor = variant === "dark" ? "#9CA3AF" : "#9CA3AF";
  const gradientId = `credit-gauge-${variant}`;
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 200 118"
        className="w-full max-w-[240px]"
        role="img"
        aria-label={`Credit score ${score} out of ${CREDIT_SCORE_MAX}, rated ${band.label}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="65%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <path
          d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        <path
          d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${fraction * 100} 100`}
        />
        <circle
          cx={marker.x}
          cy={marker.y}
          r={7}
          fill="#ffffff"
          stroke={band.color}
          strokeWidth={4}
        />
        <text
          x={CENTER_X}
          y={CENTER_Y - 14}
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill={scoreTextColor}
        >
          {score}
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y + 6}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={band.color}
        >
          {band.label}
        </text>
      </svg>
      {showRange ? (
        <div className="flex w-full max-w-[240px] justify-between px-2 text-xs font-medium" style={{ color: rangeTextColor }}>
          <span>{CREDIT_SCORE_MIN}</span>
          <span>{CREDIT_SCORE_MAX}</span>
        </div>
      ) : null}
    </div>
  );
}
