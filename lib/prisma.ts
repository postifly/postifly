import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  prismaSlowLogInstalled?: boolean;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

// Slow query logging (helps surface missing indexes / bad query shapes).
// Enabled by default in production; set `PRISMA_SLOW_QUERY_MS` to override threshold.
if (!globalForPrisma.prismaSlowLogInstalled) {
  globalForPrisma.prismaSlowLogInstalled = true;
  const thresholdMsRaw = Number(process.env.PRISMA_SLOW_QUERY_MS ?? '500');
  const thresholdMs = Number.isFinite(thresholdMsRaw) && thresholdMsRaw > 0 ? thresholdMsRaw : 500;
  const maybeUse = (prisma as unknown as { $use?: unknown }).$use;
  if (typeof maybeUse === 'function') {
    (maybeUse as (fn: (params: unknown, next: (p: unknown) => Promise<unknown>) => Promise<unknown>) => void)(
      async (params: unknown, next: (p: unknown) => Promise<unknown>) => {
        const t0 = Date.now();
        const result = await next(params);
        const ms = Date.now() - t0;
        if (ms >= thresholdMs) {
          console.warn('[prisma:slow]', {
            ms,
            // best-effort metadata; depends on Prisma client build
            model: (params as { model?: unknown }).model,
            action: (params as { action?: unknown }).action,
          });
        }
        return result;
      },
    );
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;