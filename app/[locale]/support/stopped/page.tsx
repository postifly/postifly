import SupportShell from '@/app/[locale]/support/components/SupportShell';
import ParcelsManager from '@/app/[locale]/admin/components/ParcelsManager';
import { getLocale } from 'next-intl/server';
import { fetchAdminParcelsSsr } from '@/lib/adminParcelSsr';

export const dynamic = 'force-dynamic';

export default async function SupportStoppedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? {
          title: 'Остановленные',
          description: 'Посылки со статусом «остановлено».',
        }
      : locale === 'en'
        ? {
            title: 'Stopped',
            description: 'Parcels with status stopped.',
          }
        : {
            title: 'გაჩერებული',
            description: 'გაჩერებული სტატუსის ამანათები.',
          };

  const { parcels } = await fetchAdminParcelsSsr('stopped', sp);

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <SupportShell title={text.title} description={text.description}>
      <ParcelsManager
        initialParcels={formattedParcels}
        currentStatus="stopped"
        countryHub
      />
    </SupportShell>
  );
}
