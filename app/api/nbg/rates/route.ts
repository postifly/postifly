import { NextResponse } from 'next/server';
import { fetchNbgRates, gelPer1Unit } from '@/lib/nbgRates';

const DEFAULT_CODES = ['USD', 'EUR', 'GBP', 'CNY', 'TRY'] as const;

function parseCodes(url: URL): string[] {
  const raw = url.searchParams.get('codes');
  if (!raw) return [...DEFAULT_CODES];
  const codes = raw
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  return codes.length ? codes : [...DEFAULT_CODES];
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const codes = parseCodes(url);
    const nbgRates = await fetchNbgRates();
    const rates: Record<string, number | null> = {};
    for (const code of codes) {
      rates[code] = gelPer1Unit(nbgRates, code);
    }
    return NextResponse.json(
      { rates, fetchedAt: new Date().toISOString() },
      {
        headers: {
          // Client can cache briefly; upstream is already revalidated server-side.
          'Cache-Control': 'public, max-age=60',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: 'NBG rates unavailable' },
      { status: 502 },
    );
  }
}

