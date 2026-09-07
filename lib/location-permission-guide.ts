/**
 * Steps to re-enable site location after denial.
 * Native prompt will not reappear until the user resets permission in site settings.
 */
export function getLocationEnableSteps(): readonly string[] {
  return [
    "Look at the top address bar, where zapcash.in is shown.",
    "Click the settings icon on the left side of the website address.",
    "Select Location → Allow.",
    "Come back and click Try Again.",
  ] as const;
}
