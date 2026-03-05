import React from "react";
import ServicesAccordion from "./ServicesAccordion";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
};

export default async function ServicesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service } = await searchParams;
  const isKa = locale === "ka";

  return (
    <section
      id="services"
      className="w-full pt-14 mt-14 md:pt-20 pb-16 md:pb-24 bg-gray-50"
    >
      <ServicesAccordion isKa={isKa} activeServiceId={service} />
    </section>
  );
}

