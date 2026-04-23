import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'ონლაინ მაღაზიები | Amazon, eBay და სხვა',
  description: 'ჩამონათვალი ონლაინ მაღაზიების — Amazon, eBay, AliExpress, Etsy და სხვა. ნაყიდი საქონლის მიწოდება ჩვენი მისამართით.',
};

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
