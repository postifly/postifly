import AdminShell from '@/app/[locale]/admin/components/AdminShell';
import AdminCreateUserForm from '@/app/[locale]/admin/users/components/AdminCreateUserForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export default async function AdminUsersNewPageLocale(props: Props) {
  void props;
  const t = await getTranslations('adminUsersNew');
  return (
    <AdminShell
      title={t('title')}
      description={t('description')}
    >
      <AdminCreateUserForm />
    </AdminShell>
  );
}

