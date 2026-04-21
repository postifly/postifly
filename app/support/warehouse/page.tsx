import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function SupportWarehousePage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Прибывшие', description: 'Управление прибывшими посылками.' }
      : locale === 'en'
        ? { title: 'Arrived', description: 'Manage arrived parcels.' }
        : { title: 'ჩამოსული', description: 'ჩამოსული ამანათების მართვა.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={[]}
          currentStatus="arrived"
          allowDelete={false}
          countryHub
        />
      </div>
    </SupportShell>
  );
}

