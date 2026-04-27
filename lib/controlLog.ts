import { appendFile } from 'node:fs/promises';
import path from 'node:path';

type ControlLogEvent = {
  at: string;
  event: string;
  actorRole?: string | null;
  actorId?: string | null;
  method?: string | null;
  url?: string | null;
  parcelId?: string | null;
  trackingNumber?: string | null;
  fromStatus?: string | null;
  toStatus?: string | null;
  meta?: Record<string, unknown> | null;
};

export async function writeControlLog(event: Omit<ControlLogEvent, 'at'>) {
  try {
    const line = JSON.stringify({
      at: new Date().toISOString(),
      ...event,
    }) + '\n';

    const filePath = path.join(process.cwd(), 'control.log');
    await appendFile(filePath, line, { encoding: 'utf8' });
  } catch {
    // best-effort; never fail requests because of logging
  }
}

