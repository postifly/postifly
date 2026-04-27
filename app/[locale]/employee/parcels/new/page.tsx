import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import EmployeeSidebar from '@/app/[locale]/employee/components/EmployeeSidebar';
import AdminCreateParcelForm from '@/app/[locale]/admin/components/AdminCreateParcelForm';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

const TARIFF_TO_FORM_ORIGIN: Record<string, string> = {
  GB: 'uk',
  US: 'us',
  CN: 'cn',
  GR: 'gr',
  FR: 'fr',
  TR: 'tr',
};

export default async function EmployeeNewParcelPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations('employeeDashboard');

  if (!session?.user) redirect(`/${locale}/login`);
  if (session.user.role !== 'EMPLOYEE') redirect(`/${locale}`);

  const employee = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { employeeCountry: true },
  });

  const allowedOriginCountryCodes = employee?.employeeCountry
    ? [TARIFF_TO_FORM_ORIGIN[employee.employeeCountry]].filter(Boolean)
    : undefined;

  return (
    <div className="min-h-screen bg py-8 pt-20">
      <div className="mx-auto w-full px-4">
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <EmployeeSidebar />
          <main className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="text-xl font-semibold text-gray-900">{t('addParcelCta')}</h1>
              <p className="mt-1 text-sm text-gray-600">{t('homeDescription')}</p>
            </header>
            <div className="mt-6">
              <AdminCreateParcelForm
                postUrl="/api/admin/parcels"
                tariffsUrl="/api/admin/tariffs"
                successRedirect="/employee"
                allowedOriginCountryCodes={allowedOriginCountryCodes}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
