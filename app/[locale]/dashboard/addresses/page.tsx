import { redirect } from 'next/navigation';

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardAddressesPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard#dashboard-addresses`);
}
