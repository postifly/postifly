import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import EmployeeShell from './components/EmployeeShell';
import EmployeeMyParcelsTable from './components/EmployeeMyParcelsTable';

export const dynamic = 'force-dynamic';

export default async function EmployeeHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'EMPLOYEE') {
    redirect(session.user.role === 'SUPPORT' ? '/support' : '/');
  }

  const parcels = await prisma.parcel.findMany({
    where: { createdById: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { email: true } },
    },
  });

  const locale = await getLocale();
  const t = await getTranslations('employeeDashboard');

  const title =
    locale === 'ru'
      ? 'Панель сотрудника'
      : locale === 'en'
        ? 'Employee dashboard'
        : 'თანამშრომლის პანელი';

  const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-GB' : 'ka-GE';

  return (
    <EmployeeShell title={title} description={t('homeDescription')}>
      <div className="space-y-8">
    

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-[17px] font-semibold text-black">{t('myParcelsTitle')}</h2>
          <EmployeeMyParcelsTable
            rows={parcels.map((p) => ({
              id: p.id,
              status: p.status,
              trackingNumber: p.trackingNumber,
              customerEmail: p.user.email,
              customerName: p.customerName,
              dateFormatted: new Date(p.createdAt).toLocaleString(dateLocale, {
                dateStyle: 'short',
                timeStyle: 'short',
              }),
            }))}
          />
        </section>
      </div>
    </EmployeeShell>
  );
}
