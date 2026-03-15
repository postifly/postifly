'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
};

type ChatThreadSummary = {
  id: string;
  status: string;
};

type ChatMessage = {
  id: string;
  sender: 'USER' | 'ADMIN';
};

export default function AdminSidebar() {
  const t = useTranslations('adminsidebar');
  const items: AdminNavItem[] = [
    { label: t('users'), href: '/admin/users' },
    { label: t('incoming'), href: '/admin/incoming' },
    { label: t('inTransit'), href: '/admin/in-transit' },
    { label: t('warehouse'), href: '/admin/warehouse' },
    { label: t('regions'), href: '/admin/regions' },
    { label: t('stopped'), href: '/admin/stopped' },
    { label: t('delivered'), href: '/admin/delivered' },
    { label: t('payments'), href: '/admin/payments' },
    { label: t('editTariffs'), href: '/admin/tariffs' },
    { label: t('chat'), href: '/admin/chat' },
    { label: t('settings'), href: '/admin/settings' },
  ];
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [chatCounts, setChatCounts] = useState<{
    open: number;
    awaitingReply: number;
  } | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadChatCounts = async () => {
      try {
        setChatLoading(true);
        const res = await fetch('/api/admin/chat/threads');
        const data = await res.json();
        const threads: ChatThreadSummary[] = Array.isArray(data.threads)
          ? data.threads
          : [];

        const openThreads = threads.filter((t) => t.status === 'open');

        const awaitingReplyIds = new Set<string>();

        await Promise.all(
          openThreads.map(async (thread) => {
            try {
              const resMessages = await fetch(
                `/api/admin/chat/threads/${thread.id}`,
              );
              const dataMessages = await resMessages.json();
              const messages: ChatMessage[] = Array.isArray(
                dataMessages.messages,
              )
                ? dataMessages.messages
                : [];

              const last = messages[messages.length - 1];
              if (last && last.sender === 'USER') {
                awaitingReplyIds.add(thread.id);
              }
            } catch {
              // ignore single-thread errors
            }
          }),
        );

        if (!cancelled) {
          setChatCounts({
            open: openThreads.length,
            awaitingReply: awaitingReplyIds.size,
          });
        }
      } catch {
        if (!cancelled) {
          setChatCounts(null);
        }
      } finally {
        if (!cancelled) {
          setChatLoading(false);
        }
      }
    };

    void loadChatCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentItem =
    items.find((item) => pathname === item.href) ?? items[0];

  return (
    <div className="w-full lg:w-48 shrink-0 min-w-0">
      {/* Mobile: dropdown menu */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-[15px] font-medium text-black shadow-sm"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="flex items-center gap-2">
            <span>{currentItem.label}</span>
            {currentItem.href === '/admin/chat' && (chatCounts || chatLoading) ? (
              <span className="flex items-center gap-1 text-xs">
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black">
                  გაუხსნელი: {chatCounts?.open ?? '...'}
                </span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black">
                  უპასუხებელი: {chatCounts?.awaitingReply ?? '...'}
                </span>
              </span>
            ) : null}
          </span>
          <span
            className={`text-black transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </button>
        {open && (
          <div className="mt-1 rounded-xl border border-gray-200 bg-white shadow-lg">
            <nav className="flex flex-col gap-0.5 py-1">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.push(item.href);
                    }}
                    className={`block w-full text-left py-2.5 px-3 text-[15px] font-medium transition-colors ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{item.label}</span>
                      {item.href === '/admin/chat' && (chatCounts || chatLoading) ? (
                        <span className="ml-auto flex items-center gap-1 text-xs">
                          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black">
                            გაუხსნელი: {chatCounts?.open ?? '...'}
                          </span>
                          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black">
                            უპასუხებელი: {chatCounts?.awaitingReply ?? '...'}
                          </span>
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-4 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
          <nav className="flex flex-col gap-0.5 py-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2.5 px-2 text-[15px] font-medium transition-colors rounded-lg border-l-2 ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-transparent text-black hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>{item.label}</span>
                    {item.href === '/admin/chat' && (chatCounts || chatLoading) ? (
                      <span className="ml-auto flex items-center gap-1 text-xs">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
                          {chatCounts?.open ?? '...'}
                        </span>
                       
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}
