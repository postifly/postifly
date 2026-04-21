import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminCacheTags, cachedAdmin } from '@/lib/cache/adminCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const threads = await cachedAdmin(
      'chat:threads:list:v2', // version bump (cache reset)
      {
        role: session.user.role,
        take: 50, // ↓ smaller payload
      },
      async () => {
        return await prisma.chatThread.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50,
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
        ttlSeconds: 60,       // ↑ longer cache
        staleSeconds: 300,    // serve stale while refreshing
        tags: [AdminCacheTags.chatThreads],
      },
    );

    return NextResponse.json(
      {
        threads, // ❗ no toLocaleString → faster
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