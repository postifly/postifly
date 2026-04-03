import { getLocale } from 'next-intl/server';
import prisma from '@/lib/prisma';
import SupportShell from '../components/SupportShell';
import ParcelsManager from '@/app/admin/components/ParcelsManager';
import { adminParcelInclude } from '@/lib/adminParcelInclude';

export const dynamic = 'force-dynamic';

export default async function SupportRegionsPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Регионы', description: 'Управление посылками в регионах/филиалах.' }
      : locale === 'en'
        ? { title: 'Regions', description: 'Manage parcels in regions/branches.' }
        : { title: 'რეგიონი', description: 'რეგიონებში/ფილიალებში მყოფი ამანათების მართვა.' };

  const parcels = await prisma.parcel.findMany({
    where: { status: 'region' },
    orderBy: { createdAt: 'desc' },
    include: adminParcelInclude,
  });

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <SupportShell title={text.title} description={text.description}>
      <div className="space-y-6">
        <ParcelsManager
          initialParcels={formattedParcels}
          currentStatus="region"
          allowDelete={false}
        />
      </div>
    </SupportShell>
  );
}

