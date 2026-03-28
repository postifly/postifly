import { Prisma } from '@/app/generated/prisma/client';
import prisma from './prisma';

/** Next PO{n} where n is 1 + max existing numeric suffix (ignores gaps from deleted users). */
export async function generateNextRoomNumber(): Promise<string> {
  const rows = await prisma.$queryRaw<{ max: number | bigint | null }[]>`
    SELECT MAX(
      (SUBSTRING("roomNumber" FROM '^PO([0-9]+)$'))::int
    ) AS max
    FROM users
    WHERE "roomNumber" ~ '^PO[0-9]+$'
  `;
  const raw = rows[0]?.max;
  const max = raw == null ? 0 : Number(raw);
  return `PO${max + 1}`;
}

const MAX_ROOM_RETRIES = 20;

/** True when Prisma reports unique violation on roomNumber (race or stale read). */
export function isRoomNumberUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== 'P2002') return false;
  const target = error.meta?.target;
  if (!Array.isArray(target)) return false;
  return target.some((f) => String(f).replace(/"/g, '') === 'roomNumber');
}

/**
 * Retries fn when user.create hits duplicate roomNumber (concurrent signups).
 */
export async function withRetryOnDuplicateRoomNumber<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < MAX_ROOM_RETRIES; i++) {
    try {
      return await fn();
    } catch (e) {
      if (isRoomNumberUniqueViolation(e)) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('ოთახის ნომრის მინიჭება ვერ მოხერხდა');
}
