/** `messages` → `parcels.originCountryLabels.<code>` — next-intl გასაღები */
export type ParcelOriginLabelKey =
  | 'originCountryLabels.uk'
  | 'originCountryLabels.us'
  | 'originCountryLabels.cn'
  | 'originCountryLabels.gr'
  | 'originCountryLabels.fr'
  | 'originCountryLabels.tr';

export function parcelOriginLabelKey(code: string): ParcelOriginLabelKey {
  return `originCountryLabels.${code}` as ParcelOriginLabelKey;
}
