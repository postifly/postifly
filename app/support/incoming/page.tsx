import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SupportIncomingPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? {
          title: 'Поступившие',
          description: 'Управление поступившими посылками.',
          newParcel: 'Создать новую посылку',
        }
      : locale === 'en'
        ? { title: 'Incoming', description: 'Manage incoming parcels.', newParcel: 'Create new parcel' }
        : {
            title: 'მოლოდინში',
            description: 'მოლოდინში ამანათების მართვა.',
            newParcel: 'ამანათის დამატება',
          };

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link
            href="/support/incoming/new"
            className="inline-flex items-center rounded-lg bg-[#3a5bff] px-4 py-2 text-[16px] font-semibold text-white "
          >
            {text.newParcel}
          </Link>
        </div>
        <ParcelsManager
          // Let the client manager fetch paginated data from /api/admin/parcels
          // to avoid server-side heavy DB reads for large statuses.
          initialParcels={[]}
          currentStatus="pending"
          allowDelete={false}
          countryHub
        />
      </div>
    </SupportShell>
  );
}

