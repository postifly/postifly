import AdminShell from '../../components/AdminShell';
import AdminCreateParcelForm from '../../components/AdminCreateParcelForm';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminIncomingNewPage() {
  const locale = await getLocale();
  const title = locale === 'ru' ? 'Добавить посылку' : locale === 'en' ? 'Add Parcel' : 'ამანათის დამატება';
  return (
    <AdminShell
      title={title}
      description=""
    >
      <AdminCreateParcelForm />
    </AdminShell>
  );
}

