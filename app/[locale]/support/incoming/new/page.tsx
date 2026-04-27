import SupportShell from '@/app/[locale]/support/components/SupportShell';
import AdminCreateParcelForm from '@/app/[locale]/admin/components/AdminCreateParcelForm';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function SupportIncomingNewPage() {
  const locale = await getLocale();
  const title =
    locale === 'ru' ? 'Добавить посылку' : locale === 'en' ? 'Add Parcel' : 'ამანათის დამატება';

  return (
    <SupportShell title={title} description="">
      <AdminCreateParcelForm
        postUrl="/api/admin/parcels"
        tariffsUrl="/api/admin/tariffs"
        successRedirect="/support/incoming"
      />
    </SupportShell>
  );
}