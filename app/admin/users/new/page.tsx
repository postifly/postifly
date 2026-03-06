import AdminShell from '../../components/AdminShell';
import AdminCreateUserForm from '../components/AdminCreateUserForm';

export const dynamic = 'force-dynamic';

export default function AdminUsersNewPage() {
  return (
    <AdminShell
      title="ახალი მომხმარებელი"
      description="შეავსეთ ფორმა ახალი მომხმარებლის ხელით რეგისტრაციისთვის."
    >
      <AdminCreateUserForm />
    </AdminShell>
  );
}
