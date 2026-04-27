import SupportShell from '@/app/support/components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';
import { getLocale } from 'next-intl/server';
import { fetchAdminParcelsSsr } from '@/lib/adminParcelSsr';

export const dynamic = 'force-dynamic';

export default async function SupportInWarehousePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? {
          title: 'На складе',
          description: 'Управление посылками на складе.',
        }
      : locale === 'en'
        ? {
            title: 'In warehouse',
            description: 'Manage parcels in warehouse.',
          }
        : {
            title: 'საწყობში',
            description: 'საწყობში მყოფი ამანათების მართვა.',
          };

  const { parcels } = await fetchAdminParcelsSsr('in_warehouse', sp);

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <SupportShell title={text.title} description={text.description}>
      <ParcelsManager
        initialParcels={formattedParcels}
        currentStatus="in_warehouse"
        countryHub
      />
    </SupportShell>
  );
}