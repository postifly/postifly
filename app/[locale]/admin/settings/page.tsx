import AdminShell from '@/app/[locale]/admin/components/AdminShell';
import AdminSettingsForm from '@/app/[locale]/admin/components/AdminSettingsForm';
import { getLocale } from 'next-intl/server';

export default async function AdminSettingsPage() {
  const locale = await getLocale();
  const title = locale === 'ru' ? 'Настройки' : locale === 'en' ? 'Settings' : 'პარამეტრები';
  return (
    <AdminShell title={title} description="">
      <AdminSettingsForm />
    </AdminShell>
  );
}
