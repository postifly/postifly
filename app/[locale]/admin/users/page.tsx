import AdminShell from '@/app/[locale]/admin/components/AdminShell';
import { formatDateDMY } from '@/lib/formatDate';
import prisma from '@/lib/prisma';
import UsersTable from '@/app/[locale]/admin/users/components/UsersTable';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Props = { params: Promise<{ locale: string }> };

export default async function AdminUsersPageLocale(_props: Props) {
  const locale = (await _props.params).locale;
  const copy = {
    ka: {
      title: 'მომხმარებლები',
      description: 'მომხმარებლების სია და როლები.',
    },
    en: {
      title: 'Users',
      description: 'List of users and roles.',
    },
    ru: {
      title: 'Пользователи',
      description: 'Список пользователей и ролей.',
    },
  } as const;
  const text = copy[(locale as keyof typeof copy)] ?? copy.ka;

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

