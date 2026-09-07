import type { ReactNode } from "react";
import {
  CREDIT_SCORE_MAX,
  resolveScoreBand,
  resolveScoreFraction,
} from "@/components/credit-score/score-utils";

interface CreditScorePromoBannerProps {
  readonly onStart: () => void;
}

const SAMPLE_SCORE = 765;

const PROMO_FEATURES = [
  { bold: "Free", rest: "score check", Icon: BarChartIcon },
  { bold: "₹2", rest: "full report", Icon: RupeeIcon },
  { bold: "30 days", rest: "auto refresh", Icon: RefreshIcon },
] as const;

const GAUGE_RADIUS = 88;
const GAUGE_CENTER_X = 100;
const GAUGE_CENTER_Y = 100;
const GAUGE_STROKE_WIDTH = 16;
const GAUGE_FILL_FRACTION = 0.77;

function polarPoint(fraction: number): { x: number; y: number } {
  const angle = Math.PI * (1 - fraction);
  return {
    x: GAUGE_CENTER_X + GAUGE_RADIUS * Math.cos(angle),
    y: GAUGE_CENTER_Y - GAUGE_RADIUS * Math.sin(angle),
  };
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#CA8A04" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="13" width="4" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" />
      <rect x="16" y="5" width="4" height="15" rx="1" fill="currentColor" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <span className="text-lg font-semibold leading-none" aria-hidden="true">
      ₹
    </span>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 0 1-14.5 4.5M4 12a8 8 0 0 1 14.5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 7v5h5M20 17v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIconFrame({ children }: { readonly children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EA] text-primary">
      {children}
    </span>
  );
}

function DesktopPromoGauge() {
  const start = polarPoint(0);
  const end = polarPoint(1);
  const arcPath = `M ${start.x} ${start.y} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${end.x} ${end.y}`;

  return (
    <div className="relative mx-auto aspect-[200/118] w-full max-w-[360px]">
      <div className="absolute inset-0 px-2">
        <svg
          viewBox="0 0 200 108"
          className="block w-full"
          role="img"
          aria-label="Credit score range from poor to excellent"
        >
          <defs>
            <linearGradient id="credit-promo-gauge-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F04438" />
              <stop offset="22%" stopColor="#F97316" />
              <stop offset="48%" stopColor="#FACC15" />
              <stop offset="72%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          <path
            d={arcPath}
            fill="none"
            stroke="#E7EDF2"
            strokeWidth={GAUGE_STROKE_WIDTH}
            strokeLinecap="round"
          />
          <path
            d={arcPath}
            fill="none"
            stroke="url(#credit-promo-gauge-desktop)"
            strokeWidth={GAUGE_STROKE_WIDTH}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${GAUGE_FILL_FRACTION * 100} 100`}
          />
        </svg>
      </div>
      <div className="absolute inset-x-[11%] top-[48%]">
        <p className="text-center text-[15px] font-medium text-gray-500">Powered by Equifax</p>
        <div className="mt-4 flex divide-x divide-gray-200">
          {PROMO_FEATURES.map(({ bold, rest, Icon }) => (
            <div key={bold} className="flex flex-1 flex-col items-center gap-2 px-2">
              <FeatureIconFrame>
                <Icon />
              </FeatureIconFrame>
              <div className="text-center">
                <p className="text-sm font-bold leading-none text-gray-900">{bold}</p>
                <p className="mt-1 text-xs leading-tight text-gray-500">{rest}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileScoreGauge() {
  const fraction = resolveScoreFraction(SAMPLE_SCORE);
  const band = resolveScoreBand(SAMPLE_SCORE);
  const radius = 82;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 13;
  const start = {
    x: centerX + radius * Math.cos(Math.PI),
    y: centerY - radius * Math.sin(Math.PI),
  };
  const end = {
    x: centerX + radius * Math.cos(0),
    y: centerY - radius * Math.sin(0),
  };
  const needleAngle = Math.PI * (1 - fraction);
  const needleInner = 18;
  const needleOuter = radius - 10;
  const needleTip = {
    x: centerX + needleOuter * Math.cos(needleAngle),
    y: centerY - needleOuter * Math.sin(needleAngle),
  };
  const needleBaseLeft = {
    x: centerX + needleInner * Math.cos(needleAngle + 0.16),
    y: centerY - needleInner * Math.sin(needleAngle + 0.16),
  };
  const needleBaseRight = {
    x: centerX + needleInner * Math.cos(needleAngle - 0.16),
    y: centerY - needleInner * Math.sin(needleAngle - 0.16),
  };
  const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;

  return (
    <div className="flex w-full flex-col items-center">
      <p className="py-2 text-center text-[10px] font-medium text-gray-200">Powered by Equifax</p>

      <svg
        viewBox="0 8 200 130"
        className="block w-full"
        role="img"
        aria-label={`Credit score ${SAMPLE_SCORE} out of ${CREDIT_SCORE_MAX}, rated ${band.label}`}
      >
        <defs>
          <linearGradient id="credit-promo-gauge-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F04438" />
            <stop offset="28%" stopColor="#F97316" />
            <stop offset="55%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <path
          d={arcPath}
          fill="none"
          stroke="#E8EEF2"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke="url(#credit-promo-gauge-mobile)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${fraction * 100} 100`}
        />
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleBaseLeft.x},${needleBaseLeft.y} ${needleBaseRight.x},${needleBaseRight.y}`}
          fill="#ffffff"
          stroke="#D1D5DB"
          strokeWidth="0.5"
        />
        <circle cx={centerX} cy={centerY} r="8" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1.25" />
        <text
          x={centerX}
          y={centerY - 26}
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill="white"
        >
          {SAMPLE_SCORE}
        </text>
        <text
          x={centerX}
          y={centerY + 25}
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#16A34A"
        >
          Good
        </text>
      </svg>
    </div>
  );
}

/**
 * Homepage banner that introduces the free credit score check and starts the flow.
 */
export default function CreditScorePromoBanner({ onStart }: CreditScorePromoBannerProps) {
  return (
    <>
      {/* Mobile layout */}
      <section className="overflow-hidden relative rounded-2xl bg-primary p-4 sm:hidden">
      <div className="pointer-events-none absolute -top-18 -right-18 h-48 w-48 rounded-full bg-white/10 z-1000 text-4xl"></div>

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 pt-1">
            <h2 className="text-2xl ml-1 font-bold leading-[1.2] tracking-tight text-[#f3f7f5]">
              Check Your Credit Score,{" "}
              <span className="text-white">Free</span>
            </h2>
            {/* <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Know your score, accounts, EMIs, enquiries &amp; payment history.
            </p> */}

            <button
              type="button"
              onClick={onStart}
              className="mt-3 inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-full bg-[#f3f7f5] px-4 py-[0.5px] text-[14px] font-semibold text-black transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Check Score
              <ArrowRightIcon />
            </button>
           
          </div>
          <div className="w-[48%] max-w-[150px] max-h-[150px] mx-auto shrink-0  ">
            <MobileScoreGauge />
            <span className="ml-2 justify-center flex items-center   gap-1 text-[10px] text-white">
              <LockIcon />
              256-bit encrypted
            </span>
          </div>
        </div>
      </section>

      {/* Desktop / tablet layout */}
      <section className="hidden overflow-hidden rounded-3xl bg-[#f3f7f5] px-8 py-8 sm:block lg:px-10 lg:py-9">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="w-full min-w-0 flex-1 text-left lg:max-w-[620px]">
            <h2 className="text-[25px] font-bold leading-tight tracking-tight text-gray-900 lg:text-[40px]">
              Check Your Credit Score,{" "}
              <span className="text-primary">Free</span>
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-600">
              Know your score, accounts, EMIs, enquiries &amp; payment history.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-[15px] font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Check Score
                <ArrowRightIcon />
              </button>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <LockIcon />
                256-bit encrypted &amp; secure
              </span>
            </div>
          </div>
          <div className="w-full shrink-0 lg:w-[370px] xl:w-[400px]">
            <DesktopPromoGauge />
          </div>
        </div>
      </section>
    </>
  );
}
