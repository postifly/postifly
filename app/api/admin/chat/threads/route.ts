import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminCacheTags, cachedAdmin } from '@/lib/cache/adminCache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageRaw = parseInt(searchParams.get('page') ?? '1', 10);
    const limitRaw = parseInt(searchParams.get('limit') ?? '50', 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Math.min(50, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 50));
    const threads = await cachedAdmin(
      'chat:threads:list:v2', // version bump (cache reset)
      {
        role: session.user.role,
        page,
        limit,
      },
      async () => {
        return await prisma.chatThread.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            status: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      },
      {
        // Sidebar uses this for live indicators; keep it fresh.
        ttlSeconds: 3,
        staleSeconds: 9,
        tags: [AdminCacheTags.chatThreads],
      },
    );

    return NextResponse.json(
      {
        threads,
        page,
        limit,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (e) {
    console.error('Get chat threads error:', e);

    return NextResponse.json(
      { error: 'შეცდომა ჩათების წამოღებისას' },
      { status: 500 }
    );
  }
}