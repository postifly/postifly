import AdminShell from '@/app/[locale]/admin/components/AdminShell';
import TariffsManager from '@/app/[locale]/admin/tariffs/tariffsManager';
import { getLocale } from 'next-intl/server';

export default async function AdminTariffsPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Тарифы', description: 'Список стран и установка цены за 1 кг.' }
      : locale === 'en'
        ? { title: 'Tariffs', description: 'Country list and per-kg pricing.' }
        : {
            title: 'ტარიფები',
            description: 'ქვეყნების ჩამონათვალი და 1 კგ ფასის დაყენება.',
          };
  return (
    <AdminShell title={text.title} description={text.description}>
      <TariffsManager />
    </AdminShell>
  );
}
