export type DatesFlightNamesByLocale = Partial<Record<'ka' | 'en' | 'ru', Record<string, string>>>;

/**
 * Optional display-name overrides for flight codes/names.
 * Keep this tiny to avoid pulling full locale JSON into pages (improves Fast Refresh).
 */
export const DATES_FLIGHT_NAMES: DatesFlightNamesByLocale = {
  // ka: { "FLIGHT_CODE": "Displayed name" },
  // en: { "FLIGHT_CODE": "Displayed name" },
  // ru: { "FLIGHT_CODE": "Displayed name" },
};

export function getFlightDisplayName(locale: string, rawName: string): string {
  const l = (locale === 'ka' || locale === 'en' || locale === 'ru') ? locale : 'ka';
  return DATES_FLIGHT_NAMES[l]?.[rawName] ?? rawName;
}

