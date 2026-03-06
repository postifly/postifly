import AdminShell from '../components/AdminShell';
import AdminSettingsForm from '../components/AdminSettingsForm';

export default async function AdminSettingsPage() {
  return (
    <AdminShell
      title="პარამეტრები"
      description=""
    >
      <AdminSettingsForm />
    </AdminShell>
  );
}

