import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function SupportDeliveredPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Выданные', description: 'Управление выданными посылками.' }
      : locale === 'en'
        ? { title: 'Delivered', description: 'Manage delivered parcels.' }
        : { title: 'გაცემული', description: 'გაცემული ამანათების მართვა.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={[]}
          currentStatus="delivered"
          allowDelete={false}
          countryHub
        />
      </div>
    </SupportShell>
  );
}

