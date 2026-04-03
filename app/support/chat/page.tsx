import { getLocale } from 'next-intl/server';
import SupportShell from '../components/SupportShell';
import ChatAdmin from '@/app/admin/chat/ChatAdmin';

export const dynamic = 'force-dynamic';

export default async function SupportChatPage() {
  const locale = await getLocale();
  const text =
    locale === 'ru'
      ? { title: 'Чат', description: 'Сообщения с внешнего экрана и ответы.' }
      : locale === 'en'
        ? { title: 'Chat', description: 'Messages from external screen and replies.' }
        : { title: 'ჩეთი', description: 'გარე ეკრანიდან მოსული შეტყობინებები და პასუხები.' };

  return (
    <SupportShell title={text.title} description={text.description}>
      <ChatAdmin allowDeleteThread={false} />
    </SupportShell>
  );
}

