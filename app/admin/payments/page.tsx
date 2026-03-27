import AdminShell from '../components/AdminShell';
import PaymentsTable from './paymentsTable';
import { getLocale } from 'next-intl/server';

export default async function AdminPaymentsPage() {
  const locale = await getLocale();
  const text = locale === 'ru'
    ? { title: 'Платежи', description: 'Здесь отображается история платежей пользователей.' }
    : locale === 'en'
      ? { title: 'Payments', description: 'User payment history is shown here.' }
      : { title: 'გადახდები', description: 'აქ ჩანს მომხმარებლების გადახდების ისტორია.' };
  return (
    <AdminShell
      title={text.title}
      description={text.description}
    >
      <PaymentsTable />
    </AdminShell>
  );
}

