import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import EmployeeSidebar from '@/app/[locale]/employee/components/EmployeeSidebar';
import EmployeeMyParcelsTable, {
  type EmployeeParcelRow,
} from '@/app/[locale]/employee/components/EmployeeMyParcelsTable';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EmployeeHomePage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations('employeeDashboard');

  if (!session?.user) redirect(`/${locale}/login`);
  if (session.user.role !== 'EMPLOYEE') {
    redirect(
      session.user.role === 'ADMIN'
        ? `/${locale}/admin`
        : session.user.role === 'SUPPORT'
          ? `/${locale}/support`
          : `/${locale}`,
    );
  }

  const employee = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { employeeCountry: true },
  });

  const parcels = await prisma.parcel.findMany({
    where: { createdById: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      status: true,
      trackingNumber: true,
      customerName: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  const intlLocale =
    locale === 'ka' ? 'ka-GE' : locale === 'ru' ? 'ru-RU' : 'en-US';
  const dt = new Intl.DateTimeFormat(intlLocale);

  const rows: EmployeeParcelRow[] = parcels.map((p) => ({
    id: p.id,
    status: p.status,
    trackingNumber: p.trackingNumber,
    customerEmail: p.user?.email ?? '',
    customerName: p.customerName ?? '',
    dateFormatted: dt.format(new Date(p.createdAt)),
  }));

  return (
    <div className="min-h-screen bg py-8 pt-20">
      <div className="mx-auto w-full px-4">
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <EmployeeSidebar />
          <main className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="text-xl font-semibold text-gray-900">{t('myParcelsTitle')}</h1>
              <p className="mt-1 text-sm text-gray-600">{t('homeDescription')}</p>
            </header>

            <div className="mt-6">
              {employee?.employeeCountry ? null : (
                <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[14px] text-amber-900">
                  {t('missingEmployeeCountry')}
                </p>
              )}

              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] text-gray-700">{t('homeHint')}</p>
                <Link
                  href="/employee/parcels/new"
                  className="inline-flex items-center justify-center rounded-lg bg-[#3a5bff] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#2d4ae0]"
                >
                  {t('addParcelCta')}
                </Link>
              </div>

              <EmployeeMyParcelsTable rows={rows} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
