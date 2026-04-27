import SupportShell from '@/app/[locale]/support/components/SupportShell';
import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function SupportHomePage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Поддержка', description: 'Панель поддержки.' }
      : locale === 'en'
        ? { title: 'Support', description: 'Support dashboard.' }
        : { title: 'Support', description: 'Support პანელი.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-4">
        <p className="text-[14px] text-gray-700">
          {locale === 'ru'
            ? 'Выберите раздел слева или откройте популярные страницы ниже.'
            : locale === 'en'
              ? 'Use the sidebar or open common pages below.'
              : 'გამოიყენეთ მენიუ ან გახსენით ხშირად გამოყენებული გვერდები ქვემოთ.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/support/incoming"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] font-medium text-black hover:bg-gray-50"
          >
            {locale === 'ru' ? 'Поступившие' : locale === 'en' ? 'Incoming' : 'მოლოდინში'}
          </Link>
          <Link
            href="/support/chat"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] font-medium text-black hover:bg-gray-50"
          >
            {locale === 'ru' ? 'Чат' : locale === 'en' ? 'Chat' : 'ჩეთი'}
          </Link>
          <Link
            href="/support/users"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] font-medium text-black hover:bg-gray-50"
          >
            {locale === 'ru' ? 'Пользователи' : locale === 'en' ? 'Users' : 'მომხმარებლები'}
          </Link>
        </div>
      </div>
    </SupportShell>
  );
}