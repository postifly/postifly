'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

const MiddleText = () => {
  const t = useTranslations('home');
  const texts = useMemo(
    () => [
      {
        line1: t('hero1Line1'),
        line2: t('hero1Line2'),
        line3: t('hero1Line3'),
        line4: t('hero1Line4'),
      },
      {
        line1: t('hero2Line1'),
        line2: t('hero2Line2'),
        line3: null as string | null,
        line4: null as string | null,
      },
    ],
    [t]
  );
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const n = texts.length;
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % n);
    }, 10000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <section className="bg-[#010002]">
      <div className="relative mx-auto max-w-4xl">
        {texts.map((text, i) => (
          <h2
            key={i}
            className={`md:text-[25px] text-[18px] text-white font-medium md:text-left text-center transition-opacity duration-500 ${
              textIndex === i
                ? 'opacity-100 relative'
                : 'opacity-0 absolute left-0 right-0 top-0 pointer-events-none'
            }`}
          >
            {text.line1}
            {text.line2 && (
              <>
                <br />
                <span className="inline-block md:text-[30px] text-[20px] space-x-2 mt-5 text-white">
                  {text.line2}
                </span>
              </>
            )}
            {text.line3 && (
              <>
                <br />
                <span className="inline-block md:text-[30px] text-[20px] space-x-2 mt-5 text-white">
                  {text.line3}
                </span>
              </>
            )}
            {text.line4 && (
              <>
                <br />
                <span className="inline-block md:text-[30px] text-[20px] space-x-2 mt-5 text-white">
                  {text.line4}
                </span>
              </>
            )}
          </h2>
        ))}
      </div>
    </section>
  );
};

export default MiddleText;
