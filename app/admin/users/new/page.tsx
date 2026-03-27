import AdminShell from '../../components/AdminShell';
import AdminCreateUserForm from '../components/AdminCreateUserForm';
import { getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminUsersNewPage() {
  const locale = await getLocale();
  const text = locale === 'ru'
    ? { title: 'Новый пользователь', description: 'Заполните форму для ручной регистрации нового пользователя.' }
    : locale === 'en'
      ? { title: 'New User', description: 'Fill out the form to register a new user manually.' }
      : { title: 'ახალი მომხმარებელი', description: 'შეავსეთ ფორმა ახალი მომხმარებლის ხელით რეგისტრაციისთვის.' };
  return (
    <AdminShell
      title={text.title}
      description={text.description}
    >
      <AdminCreateUserForm />
    </AdminShell>
  );
}
