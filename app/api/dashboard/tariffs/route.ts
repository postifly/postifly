import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Form country codes (uk, us, ...) to DB tariff originCountry (GB, US, ...) */
const FORM_TO_TARIFF_COUNTRY: Record<string, string> = {
  uk: 'GB',
  us: 'US',
  cn: 'CN',
  it: 'IT',
  gr: 'GR',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  tr: 'TR',
};

/**
 * GET - Returns pricePerKg per (form) country for logged-in dashboard user.
 * Used to show "ფასი = წონა × ტარიფი" when creating a parcel.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const tariffs = await prisma.tariff.findMany({
      where: {
        destinationCountry: 'GE',
        isActive: true,
      },
      orderBy: [{ originCountry: 'asc' }, { minWeight: 'asc' }],
    });

    const byFormCountry: Record<string, number> = {};
    for (const t of tariffs) {
      if (t.minWeight !== 0 || t.maxWeight != null) continue;
      const formCode = Object.entries(FORM_TO_TARIFF_COUNTRY).find(
        ([_, db]) => db === t.originCountry
      )?.[0];
      if (formCode != null) byFormCountry[formCode] = t.pricePerKg;
    }

    return NextResponse.json(
      { tariffs: byFormCountry },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (e) {
    console.error('Get dashboard tariffs error:', e);
    return NextResponse.json(
      { error: 'შეცდომა ტარიფების წამოღებისას' },
      { status: 500 }
    );
  }
}
