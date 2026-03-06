'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
};

const items: AdminNavItem[] = [
  { label: 'მომხმარებლები', href: '/admin/users' },
  { label: 'შემოსული', href: '/admin/incoming' },
  { label: 'გზაში', href: '/admin/in-transit' },
  { label: 'საწყობში', href: '/admin/warehouse' },
  { label: 'რეგიონი', href: '/admin/regions' },
  { label: 'გაჩერებული', href: '/admin/stopped' },
  { label: 'გაცემული', href: '/admin/delivered' },
  { label: 'გადახდები', href: '/admin/payments' },
  { label: 'ტარიფების შეცვლა', href: '/admin/tariffs' },
  { label: 'ჩათი', href: '/admin/chat' },
  { label: 'პარამეტრები', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentItem =
    items.find((item) => pathname === item.href) ?? items[0];

  return (
    <div className="w-full lg:w-56 shrink-0 min-w-0">
      {/* Mobile: dropdown menu */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-[15px] font-medium text-black shadow-sm"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span>{currentItem.label}</span>
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
                    {item.label}
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}

