import AdminShell from '@/app/admin/components/AdminShell';
import AdminCreateUserForm from '@/app/admin/users/components/AdminCreateUserForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export default function AdminUsersNewPageLocale(_props: Props) {
  return (
    <AdminShell
      title="ახალი მომხმარებელი"
      description="შეავსეთ ფორმა ახალი მომხმარებლის ხელით რეგისტრაციისთვის."
    >
      <AdminCreateUserForm />
    </AdminShell>
  );
}

