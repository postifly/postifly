import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import UsersTable from '@/app/admin/users/components/UsersTable';

export default async function SupportUsersPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Пользователи', description: 'Список пользователей и ролей.' }
      : locale === 'en'
        ? { title: 'Users', description: 'List of users and roles.' }
        : { title: 'მომხმარებლები', description: 'მომხმარებლების სია და როლები.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      {/* UsersTable fetches /api/admin/users on mount; avoid heavy SSR DB reads */}
      <UsersTable users={[]} newUserHref="/support/users/new" allowDelete={false} />
    </SupportShell>
  );
}

