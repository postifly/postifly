import SupportShell from '@/app/[locale]/support/components/SupportShell';
import ParcelsManager from '@/app/[locale]/admin/components/ParcelsManager';
import { getLocale } from 'next-intl/server';
import { fetchAdminParcelsSsr } from '@/lib/adminParcelSsr';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SupportRegionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Регионы', description: 'Управление посылками в регионах/филиалах.' }
      : locale === 'en'
        ? { title: 'Regions', description: 'Manage parcels in regions/branches.' }
        : {
            title: 'რეგიონი',
            description: 'რეგიონებში/ფილიალებში მყოფი ამანათების მართვა.',
          };

  const { parcels } = await fetchAdminParcelsSsr('region', sp);

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager initialParcels={formattedParcels} currentStatus="region" />
      </div>
    </SupportShell>
  );
}