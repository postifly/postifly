'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

const PHRASE_KEYS = [
  'guideLine1',
  'guideLine2',
 
  'hero1Line2',
  'hero1Line3',
] as const;

type RowConfig = {
  durationSec: number;
  reverse?: boolean;
  opacity: number;
};

const ROWS: RowConfig[] = [
  { durationSec: 32, opacity: 1 },
  { durationSec: 40, reverse: true, opacity: 0.88 },
  { durationSec: 48, opacity: 0.62 },
];

function MarqueeRow({
  phrases,
  durationSec,
  reverse,
  opacity,
}: {
  phrases: string[];
  durationSec: number;
  reverse?: boolean;
  opacity: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden py-1.5 md:py-2"
      style={{ opacity }}
    >
      <div
        className={`home-marquee-track flex  w-max ${reverse ? 'home-marquee-track--reverse' : ''}`}
        style={{
          animationDuration: `${durationSec}s`,
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-x-10 md:gap-x-14 pr-10 md:pr-14"
            aria-hidden={copy === 1}
          >
            {phrases.map((text, i) => (
              <span
                key={`${copy}-${i}`}
                className="inline-flex items-center justify-center gap-2.5 md:gap-2 shrink-0"
              >
                <Image
                  src="/logo2.jpg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-10 w-10 md:h-9 mb-3 md:w-9 shrink-0 rounded-full object-cover "
                  unoptimized
                />
                <span className="whitespace-nowrap text-center items-center justify-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 md:text-[17px] md:tracking-[0.14em]">
                  {text}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeMarqueeBand() {
  const t = useTranslations('home');
  const phrases = PHRASE_KEYS.map((key) => t(key));

  return (
    <section
      className="relative w-full overflow-hidden bg-white select-none"
      aria-label={t('tariffsSectionTitle')}
    >
      <div
        className="mx-auto max-w-[100vw] px-0 py-5 md:py-8 home-marquee-fade-mask"
      >
        {ROWS.map((row, index) => (
          <MarqueeRow
            key={index}
            phrases={phrases}
            durationSec={row.durationSec}
            reverse={row.reverse}
            opacity={row.opacity}
          />
        ))}
      </div>
    </section>
  );
}
