'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function ChatWidgetLazy() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const enable = () => setEnabled(true);

    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(enable, { timeout: 4000 });
      return () => {
        if (typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 2000);
    return () => window.clearTimeout(t);
  }, []);

  if (!enabled) return null;
  return <ChatWidget />;
}

