import React from "react";
import ConditionsAccordion from "./ConditionsAccordion";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ section?: string }>;
};

export default async function ConditionsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { section } = await searchParams;

  return (
    <div className="w-full pt-14 mt-14  pb-16  bg-gray-50">
      <section
        id="conditions"
        className="w-full "
      >
        <ConditionsAccordion locale={locale} sectionId={section} />
      </section>
    </div>
  );
}
