"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("home");
  const line1 = t("hero1Line1");
  const line2 = t("hero1Line2");
  const line3 = t("hero1Line3");
  const line4 = t("hero1Line4");

  return (
    <section className=" w-full overflow-hidden mt-14">
      <Image
        src="/hero/prices1.png"
        alt="pricing background"
        fill
        priority
        className="object-cover object-center opacity-90"
        sizes="100vw"
      />
      <div className="relative mx-auto grid min-h-[520px] max-w-screen-2xl grid-cols-1 items-start px-4 py-6 sm:px-6 md:min-h-[560px] md:py-8 lg:px-10">
        <div className="relative z-10 max-w-2xl rounded-2xl p-6 sm:p-8 lg:-ml-44">
          <h1 className="text-balance text-[25px] md:text-[30px] text-center md:text-left font-semibold leading-tight text-white ">
            POSTIFLY
          </h1>
          <p className="mt-4 text-pretty text-[25px] md:text-[30px] leading-relaxed text-white ">
           როცა სისწრაფე 
          </p>
          <p className=" text-pretty text-[25px] md:text-[30px] leading-relaxed text-white ">
           მნიშვნელოვანია
          </p>
        </div>
        <div className="relative z-10 max-w-2xl rounded-2xl p-6 text-[25px] text-white sm:p-8 md:mt-44 md:text-[30px] lg:-ml-44">
        საჰაერო ამანათები უმოკლეს დროში
        </div>
      </div>
    </section>
  );
}