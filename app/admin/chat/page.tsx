import AdminShell from '../components/AdminShell';
import ChatAdmin from './ChatAdmin';
import { getLocale } from 'next-intl/server';

export default async function AdminChatPage() {
  const locale = await getLocale();
  const text = locale === 'ru'
    ? { title: 'Чат', description: 'Сообщения с внешнего экрана и ответы.' }
    : locale === 'en'
      ? { title: 'Chat', description: 'Messages from external screen and replies.' }
      : { title: 'ჩეთი', description: 'გარე ეკრანიდან მოსული შეტყობინებები და პასუხები.' };
  return (
    <AdminShell
      title={text.title}
      description={text.description}
    >
      <ChatAdmin />
    </AdminShell>
  );
}

