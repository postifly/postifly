import AdminShell from '../components/AdminShell';
import prisma from '../../../lib/prisma';
import ParcelsManager from '../components/ParcelsManager';

export default async function AdminDeliveredPage() {
  const parcels = await prisma.parcel.findMany({
    where: {
      status: 'delivered',
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
      title="გაცემული"
      description="გაცემული ამანათების მართვა."
    >
      <div className="space-y-6">
        <ParcelsManager initialParcels={formattedParcels} currentStatus="delivered" />
      </div>
    </AdminShell>
  );
}

