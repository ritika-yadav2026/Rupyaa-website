export const CREDIT_SCORE_MIN = 300;
export const CREDIT_SCORE_MAX = 900;

export interface ScoreBand {
  readonly label: string;
  readonly color: string;
  readonly textClassName: string;
}

const BAND_POOR: ScoreBand = {
  label: "Poor",
  color: "#EF4444",
  textClassName: "text-red-500",
};
const BAND_FAIR: ScoreBand = {
  label: "Fair",
  color: "#F59E0B",
  textClassName: "text-amber-500",
};
const BAND_GOOD: ScoreBand = {
  label: "Good",
  color: "#22C55E",
  textClassName: "text-green-500",
};
const BAND_EXCELLENT: ScoreBand = {
  label: "Excellent",
  color: "#16A34A",
  textClassName: "text-green-600",
};

/**
 * Maps a numeric credit score to its qualitative band (label + colors).
 */
export function resolveScoreBand(score: number): ScoreBand {
  if (score < 580) {
    return BAND_POOR;
  }
  if (score < 670) {
    return BAND_FAIR;
  }
  if (score < 750) {
    return BAND_GOOD;
  }
  return BAND_EXCELLENT;
}

/**
 * Returns the 0–1 position of a score along the {@link CREDIT_SCORE_MIN}–{@link CREDIT_SCORE_MAX} range.
 */
export function resolveScoreFraction(score: number): number {
  const raw = (score - CREDIT_SCORE_MIN) / (CREDIT_SCORE_MAX - CREDIT_SCORE_MIN);
  return Math.max(0, Math.min(1, raw));
}
