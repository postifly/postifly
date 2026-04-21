import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function SupportInWarehousePage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'На складе', description: 'Управление посылками на складе.' }
      : locale === 'en'
        ? { title: 'In warehouse', description: 'Manage parcels in warehouse.' }
        : { title: 'საწყობში', description: ' მყოფი ამანათების მართვა.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={[]}
          currentStatus="in_warehouse"
          allowDelete={false}
          countryHub
        />
      </div>
    </SupportShell>
  );
}

