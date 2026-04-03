import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import SupportShell from '../../components/SupportShell';
import AdminCreateParcelForm from '@/app/admin/components/AdminCreateParcelForm';

export const dynamic = 'force-dynamic';

export default async function SupportNewParcelPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'SUPPORT') redirect(session.user.role === 'EMPLOYEE' ? '/employee' : '/');

  const locale = await getLocale();

  const title =
    locale === 'ru'
      ? 'Добавить посылку'
      : locale === 'en'
        ? 'Add parcel'
        : 'ამანათის დამატება';

  // SUPPORT users can add parcels for any origin country (no employeeCountry binding).
  return (
    <SupportShell title={title} description="">
      <AdminCreateParcelForm
        postUrl="/api/admin/parcels"
        tariffsUrl="/api/admin/tariffs"
        successRedirect="/support"
      />
    </SupportShell>
  );
}

