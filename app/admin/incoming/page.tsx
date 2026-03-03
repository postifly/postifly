import AdminShell from '../components/AdminShell';
import prisma from '../../../lib/prisma';
import ParcelsManager from '../components/ParcelsManager';

export const dynamic = 'force-dynamic';

export default async function AdminIncomingPage() {
  const parcels = await prisma.parcel.findMany({
    where: {
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          address: true,
        },
      },
    },
  });

  const formattedParcels = parcels.map((parcel) => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString('ka-GE'),
  }));

  return (
    <AdminShell
      title="შემოსული"
      description="შემოსული მომხმარებლის ამანათების მართვა."
    >
      <div className="space-y-6">
        <ParcelsManager initialParcels={formattedParcels} currentStatus="pending" />
      </div>
    </AdminShell>
  );
}

