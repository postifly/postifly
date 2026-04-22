import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminCacheTags, cachedAdmin } from '@/lib/cache/adminCache';
import { invalidateCacheTags } from '@/lib/cache/redisCache';

export const dynamic = 'force-dynamic';

const ORIGIN_CODES = ['uk', 'us', 'cn', 'gr', 'fr', 'tr'] as const;

function parseOptionalDate(v: unknown): Date | null {
  if (v == null || v === '') return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

const createReisSchema = z.object({
  name: z.string().trim().min(1, 'სახელი აუცილებელია'),
  originCountry: z.enum(ORIGIN_CODES),
  destinationCountry: z.string().trim().min(1).default('GE'),
  departureAt: z.preprocess(parseOptionalDate, z.date().nullable().optional()),
  arrivalAt: z.preprocess(parseOptionalDate, z.date().nullable().optional()),
  status: z.enum(['open', 'closed']).default('open'),
  notes: z.string().optional(),
});

const updateReisSchema = createReisSchema.extend({
  id: z.string().min(1),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (session.user.role !== 'ADMIN') {
    return { ok: false as const, res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { ok: true as const };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    // Pagination (keeps payload bounded under growth)
    const { searchParams } = new URL(request.url);
    const pageRaw = parseInt(searchParams.get('page') ?? '1', 10);
    const limitRaw = parseInt(searchParams.get('limit') ?? '50', 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Math.min(50, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 50));
    const reises = await cachedAdmin(
      'reises:list:v2',
      { role: 'ADMIN', page, limit },
      async () => {
        return await prisma.reis.findMany({
          orderBy: [{ departureAt: 'desc' }, { createdAt: 'desc' }],
          take: limit,
          skip: (page - 1) * limit,
          select: {
            id: true,
            name: true,
            originCountry: true,
            destinationCountry: true,
            departureAt: true,
            arrivalAt: true,
            status: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { parcels: true } },
          },
        });
      },
      // Reises update occasionally; prioritize stable admin UX under load.
      { ttlSeconds: 120, staleSeconds: 600, tags: [AdminCacheTags.reises] },
    );
    return NextResponse.json(
      { reises, page, limit },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  } catch (e) {
    console.error('Get reises error:', e);
    return NextResponse.json({ error: 'შეცდომა რეისების წამოღებისას' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    const body = await request.json();
    const data = createReisSchema.parse(body);
    const reis = await prisma.reis.create({
      data: {
        name: data.name,
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
        departureAt: data.departureAt ?? null,
        arrivalAt: data.arrivalAt ?? null,
        status: data.status,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      },
    });
    void invalidateCacheTags([AdminCacheTags.reises]);
    return NextResponse.json({ message: 'რეისი დაემატა', reis }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'ვალიდაციის შეცდომა',
          details: e.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 },
      );
    }
    console.error('Create reis error:', e);
    return NextResponse.json({ error: 'რეისის დამატება ვერ მოხერხდა' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    const body = await request.json();
    const data = updateReisSchema.parse(body);

    const reis = await prisma.reis.update({
      where: { id: data.id },
      data: {
        name: data.name,
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
        departureAt: data.departureAt ?? null,
        arrivalAt: data.arrivalAt ?? null,
        status: data.status,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      },
    });

    void invalidateCacheTags([AdminCacheTags.reises]);
    return NextResponse.json({ message: 'შენახულია', reis }, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'ვალიდაციის შეცდომა',
          details: e.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 },
      );
    }
    console.error('Update reis error:', e);
    return NextResponse.json({ error: 'შენახვა ვერ მოხერხდა' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    const body = await request.json();
    const { id } = z.object({ id: z.string().min(1) }).parse(body);
    await prisma.reis.delete({ where: { id } });
    void invalidateCacheTags([AdminCacheTags.reises]);
    return NextResponse.json({ message: 'რეისი წაიშალა' }, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'ვალიდაციის შეცდომა', details: e.issues }, { status: 400 });
    }
    console.error('Delete reis error:', e);
    return NextResponse.json({ error: 'წაშლა ვერ მოხერხდა' }, { status: 500 });
  }
}
