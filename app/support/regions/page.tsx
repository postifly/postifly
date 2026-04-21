import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function SupportRegionsPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Регионы', description: 'Управление посылками в регионах/филиалах.' }
      : locale === 'en'
        ? { title: 'Regions', description: 'Manage parcels in regions/branches.' }
        : { title: 'რეგიონი', description: 'რეგიონებში/ფილიალებში მყოფი ამანათების მართვა.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={[]}
          currentStatus="region"
          allowDelete={false}
        />
      </div>
    </SupportShell>
  );
}

