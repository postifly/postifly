import SupportShell from '@/app/support/components/SupportShell';
import AdminCreateUserForm from '@/app/admin/users/components/AdminCreateUserForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export default function SupportUsersNewPageLocale(props: Props) {
  void props;
  return (
    <SupportShell
      title="ახალი მომხმარებელი"
      description="შეავსეთ ფორმა ახალი მომხმარებლის ხელით რეგისტრაციისთვის."
    >
      <AdminCreateUserForm postUrl="/api/admin/users" successRedirect="/support/users" />
    </SupportShell>
  );
}