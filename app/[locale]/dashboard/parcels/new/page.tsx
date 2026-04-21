import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import NewParcelForm from './NewParcelForm';

export default async function NewParcelPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'EMPLOYEE') redirect('/employee');
  if (session.user.role === 'SUPPORT') redirect('/support');

  // Avoid calling /api/auth/session on page load (client hook).
  // Keep this lightweight; only what the form needs.
  const u = session.user as unknown as {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
  const full = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
  const resolvedCustomerName = full || u.email || '';

  return <NewParcelForm resolvedCustomerName={resolvedCustomerName} />;
}
