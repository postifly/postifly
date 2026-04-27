import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import EmployeeSidebar from './EmployeeSidebar';

export default async function EmployeeShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'EMPLOYEE') {
    redirect(session.user.role === 'SUPPORT' ? '/support' : '/');
  }

  return (
    <div className=" pt-20 min-h-screen  bg py-8">
      <div className="mx-auto w-full  px-4">
        <div className="grid grid-cols-1 mt-10 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <EmployeeSidebar />
          <main className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {description ? (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              ) : null}
            </header>

            {children ? <div className="mt-6">{children}</div> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
