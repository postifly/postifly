import SupportShell from '@/app/support/components/SupportShell';
import AdminCreateUserForm from '@/app/admin/users/components/AdminCreateUserForm';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export default async function SupportUsersNewPageLocale(props: Props) {
  void props;
  const t = await getTranslations('supportUsersNew');
  return (
    <SupportShell
      title={t('title')}
      description={t('description')}
    >
      <AdminCreateUserForm postUrl="/api/admin/users" successRedirect="/support/users" />
    </SupportShell>
  );
}