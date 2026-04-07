export type NbgCurrencyRate = {
  code: string;
  /** NBG sometimes quotes for multiple units (e.g. 10 CNY) */
  quantity: number;
  /** GEL amount for `quantity` units */
  rate: number;
};

type NbgResponseItem = {
  date: string;
  currencies: Array<{
    code: string;
    quantity: number;
    rate: number;
  }>;
};

const NBG_URL =
  'https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json';

function normalizeRate(r: { code: string; quantity: number; rate: number }): NbgCurrencyRate {
  return {
    code: r.code.toUpperCase(),
    quantity: Number(r.quantity) || 1,
    rate: Number(r.rate),
  };
}

export async function fetchNbgRates(): Promise<Map<string, NbgCurrencyRate>> {
  const res = await fetch(NBG_URL, {
    // Cache on the server; NBG publishes daily rates.
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) {
    throw new Error(`NBG fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as NbgResponseItem[];
  const first = data?.[0];
  const map = new Map<string, NbgCurrencyRate>();
  for (const c of first?.currencies ?? []) {
    const normalized = normalizeRate(c);
    if (Number.isFinite(normalized.rate) && normalized.rate > 0) {
      map.set(normalized.code, normalized);
    }
  }
  return map;
}

/** Returns GEL per 1 unit for the given currency code. */
export function gelPer1Unit(
  rates: Map<string, NbgCurrencyRate>,
  code: string,
): number | null {
  const r = rates.get(code.toUpperCase());
  if (!r) return null;
  if (!Number.isFinite(r.rate) || r.rate <= 0) return null;
  const q = Number.isFinite(r.quantity) && r.quantity > 0 ? r.quantity : 1;
  return r.rate / q;
}

export function convertToGel(
  rates: Map<string, NbgCurrencyRate>,
  amount: number,
  code: string,
): number | null {
  if (!Number.isFinite(amount)) return null;
  const upper = code.toUpperCase();
  if (upper === 'GEL') return amount;
  const gel = gelPer1Unit(rates, upper);
  if (gel == null) return null;
  return amount * gel;
}

