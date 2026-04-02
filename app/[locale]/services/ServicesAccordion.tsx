"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Props = {
  isKa: boolean;
  activeServiceId?: string;
};

type ServiceItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function ServicesAccordion({ isKa, activeServiceId }: Props) {
  const t = useTranslations("home");

  const service2List = t.raw("service2List") as string[];
  const service4List = t.raw("service4List") as string[];

  const services: ServiceItem[] = [
    {
      id: "service1",
      title: t("service1"),
      content: t("service1Content"),
    },
    {
      id: "service2",
      title: t("service2"),
      content: (
        <>
          <p className="mb-3 md:mb-4">{t("service2ListIntro")}</p>
          <ul className="list-disc list-outside space-y-2 pl-5 md:pl-6 marker:text-black/70">
            {Array.isArray(service2List) &&
              service2List.map((item, i) => (
                <li key={i} className="pl-1">
                  {item}
                </li>
              ))}
          </ul>
        </>
      ),
    },
    {
      id: "service3",
      title: t("service3"),
      content: t("service3Content"),
    },
    {
      id: "service4",
      title: t("service4"),
      content: (
        <>
          <p className="mb-3 md:mb-4">{t("service4ListIntro")}</p>
          <ul className="list-disc list-outside space-y-2 pl-5 md:pl-6 marker:text-black/70">
            {Array.isArray(service4List) &&
              service4List.map((item, i) => (
                <li key={i} className="pl-1">
                  {item}
                </li>
              ))}
          </ul>
        </>
      ),
    },
  ];

  const pageTitle = isKa ? "სერვისები" : "Services";

  const visibleServices =
    activeServiceId && services.some((s) => s.id === activeServiceId)
      ? services.filter((s) => s.id === activeServiceId)
      : services;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      
      <div className="space-y-3 md:space-y-4">
        {visibleServices.map((service) => {
          const indexInAll = services.findIndex((s) => s.id === service.id);
          const number = indexInAll + 1;

          return (
            <motion.div
              key={service.id}
              id={service.id}
              className="relative overflow-hidden rounded-3xl border border-pink-200/60 bg-gradient-to-br from-white via-pink-50 to-indigo-50 shadow-xl p-5 md:p-8"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-full flex text-center   justify-between gap-3 px-4 md:px-6 py-3.5 md:py-4 text-left">
                <div className="flex text-center justify-center gap-3">
                  <span className="text-black text-left md:text-[18px] text-[15px] font-semibold">
                     {service.title}
                  </span>
                </div>
              </div>

              <div className="px-4 md:px-6 pb-4 md:pb-5 text-left pt-0 md:pt-2 text-black md:text-[16px] text-[14px] leading-relaxed md:text-justify border-t border-gray-100  from-white to-purple-50/40">
                {service.content}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

