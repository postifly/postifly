import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import EditParcelForm from './EditParcelForm';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditParcelPage({ params }: Props) {
  const { locale, id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/login`);
  if (session.user.role === 'ADMIN') redirect(`/${locale}/admin`);
  if (session.user.role === 'EMPLOYEE') redirect(`/${locale}/employee`);
  if (session.user.role === 'SUPPORT') redirect(`/${locale}/support`);

  const parcel = await prisma.parcel.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      status: true,
      price: true,
      onlineShop: true,
      quantity: true,
      originCountry: true,
      weight: true,
      description: true,
      comment: true,
    },
  });

  if (!parcel) notFound();
  if (parcel.status !== 'pending') redirect(`/${locale}/dashboard`);

  return (
    <EditParcelForm
      locale={locale}
      parcelId={parcel.id}
      initial={{
        price: parcel.price ?? null,
        onlineShop: parcel.onlineShop ?? '',
        quantity: parcel.quantity ?? null,
        originCountry: parcel.originCountry ?? '',
        weight: parcel.weight ?? null,
        description: parcel.description ?? '',
        comment: parcel.comment ?? '',
      }}
    />
  );
}
