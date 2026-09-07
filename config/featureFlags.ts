type FullWebJourneyOverride = {
  enableFullWebJourneyOverride?: boolean;
};

export function resolveEnableFullWebJourney(
  override: FullWebJourneyOverride | null | undefined,
): boolean {
  return override?.enableFullWebJourneyOverride === true;
}
