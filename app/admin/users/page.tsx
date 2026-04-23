import AdminShell from '../components/AdminShell';
import { formatDateDMY } from '../../../lib/formatDate';
import prisma from '../../../lib/prisma';
import UsersTable from './components/UsersTable';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminUsersPage() {
  const locale = await getLocale();
  const text = locale === 'ru'
    ? { title: 'Пользователи', description: 'Список пользователей и ролей.' }
    : locale === 'en'
      ? { title: 'Users', description: 'List of users and roles.' }
      : { title: 'მომხმარებლები', description: 'მომხმარებლების სია და როლები.' };
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      role: true,
      employeeCountry: true,
      createdAt: true,
      roomNumber: true,
    },
  });

  // Format dates on server side to avoid hydration mismatch
  const formattedUsers = users.map((user) => ({
    ...user,
    createdAt: formatDateDMY(user.createdAt),
  }));

  return (
    <AdminShell
      title={text.title}
      description={text.description}
    >
      <UsersTable users={formattedUsers} />
    </AdminShell>
  );
}

