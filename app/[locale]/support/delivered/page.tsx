import SupportShell from '@/app/support/components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';
import { getLocale } from 'next-intl/server';
import { fetchAdminParcelsSsr } from '@/lib/adminParcelSsr';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SupportDeliveredPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Выданные', description: 'Управление выданными посылками.' }
      : locale === 'en'
        ? { title: 'Delivered', description: 'Manage delivered parcels.' }
        : { title: 'გაცემული', description: 'გაცემული ამანათების მართვა.' };

  const { parcels } = await fetchAdminParcelsSsr('delivered', sp);

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={formattedParcels}
          currentStatus="delivered"
          countryHub
        />
      </div>
    </SupportShell>
  );
}