import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function SupportInTransitPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'В пути', description: 'Управление посылками в пути.' }
      : locale === 'en'
        ? { title: 'In Transit', description: 'Manage parcels in transit.' }
        : { title: 'გზაში', description: 'გზაში მყოფი ამანათების მართვა.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={[]}
          currentStatus="in_transit"
          allowDelete={false}
          countryHub
        />
      </div>
    </SupportShell>
  );
}

