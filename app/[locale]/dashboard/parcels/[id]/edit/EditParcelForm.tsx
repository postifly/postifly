'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { parcelOriginLabelKey } from '@/lib/parcelOriginLabels';
import { z } from 'zod';
import { GB, US, CN, GR, FR, TR } from 'country-flag-icons/react/3x2';

const FLAGS: Record<string, React.ComponentType<{ title?: string; className?: string }>> = {
  GB,
  US,
  CN,
  GR,
  FR,
  TR,
};

const CODE_TO_FLAG: Record<string, string> = {
  uk: 'GB',
  us: 'US',
  cn: 'CN',
  gr: 'GR',
  fr: 'FR',
  tr: 'TR',
};

const ORIGIN_COUNTRIES: { code: string }[] = [
  { code: 'fr' },
  { code: 'uk' },
  { code: 'us' },
  { code: 'cn' },
  { code: 'gr' },
  { code: 'tr' },
];

type Initial = {
  price: number | null;
  onlineShop: string;
  quantity: number | null;
  originCountry: string;
  weight: number | null;
  description: string;
  comment: string;
};

type Props = {
  locale: string;
  parcelId: string;
  initial: Initial;
};

export default function EditParcelForm({ locale, parcelId, initial }: Props) {
  const t = useTranslations('parcelEdit');
  const tCommon = useTranslations('common');
  const tParcels = useTranslations('parcels');
  const router = useRouter();

  const [price, setPrice] = useState<string>(initial.price != null ? String(initial.price) : '');
  const [onlineShop, setOnlineShop] = useState<string>(initial.onlineShop ?? '');
  const [quantity, setQuantity] = useState<string>(initial.quantity != null ? String(initial.quantity) : '1');
  const [originCountry, setOriginCountry] = useState<string>(initial.originCountry ?? '');
  const [weight, setWeight] = useState<string>(initial.weight != null ? String(initial.weight) : '');
  const [description, setDescription] = useState<string>(initial.description ?? '');
  const [comment, setComment] = useState<string>(initial.comment ?? '');

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(() => {
    const numFromString = (v: unknown) => {
      if (typeof v === 'string') {
        const trimmed = v.trim();
        if (!trimmed) return undefined;
        return parseFloat(trimmed.replace(',', '.'));
      }
      return v;
    };
    const intFromString = (v: unknown) => {
      if (typeof v === 'string') {
        const trimmed = v.trim();
        if (!trimmed) return undefined;
        return parseInt(trimmed, 10);
      }
      return v;
    };
    return z.object({
      price: z.preprocess(numFromString, z.number().min(0)),
      onlineShop: z.string().trim().min(1),
      quantity: z.preprocess(intFromString, z.number().int().min(1).optional()),
      originCountry: z.string().trim().min(1),
      weight: z.preprocess(numFromString, z.number().min(0.001).optional()),
      description: z.string().trim().min(1),
      comment: z.string().trim().optional(),
    });
  }, []);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    if (countryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [countryOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = schema.safeParse({
      price,
      onlineShop,
      quantity,
      originCountry,
      weight,
      description,
      comment,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = (issue.path?.[0] as string | undefined) ?? 'form';
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/parcels/${encodeURIComponent(parcelId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parsed.data.price,
          onlineShop: parsed.data.onlineShop,
          quantity: parsed.data.quantity,
          originCountry: parsed.data.originCountry,
          weight: parsed.data.weight,
          description: parsed.data.description,
          comment: parsed.data.comment ?? '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data?.error as string) || t('saveError'));
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError(tCommon('networkError'));
      setLoading(false);
    }
  }

  return (
    <div className="bg py-8">
      <div className="mx-auto mt-24 w-full max-w-lg px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[16px] font-semibold text-black md:text-[18px]">{t('title')}</h1>
            <Link
              href="/dashboard"
              className="text-[16px] font-medium text-black hover:text-black md:text-[18px]"
            >
              ← {tCommon('back')}
            </Link>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="price">
                {t('fields.price')} *
              </label>
              <input
                id="price"
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  clearFieldError('price');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
              {fieldErrors.price && <p className="mt-1 text-[16px] text-red-600">{fieldErrors.price}</p>}
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="onlineShop">
                {t('fields.onlineShop')} *
              </label>
              <input
                id="onlineShop"
                type="text"
                value={onlineShop}
                onChange={(e) => {
                  setOnlineShop(e.target.value);
                  clearFieldError('onlineShop');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
              {fieldErrors.onlineShop && (
                <p className="mt-1 text-[16px] text-red-600">{fieldErrors.onlineShop}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="quantity">
                {t('fields.quantity')}
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  clearFieldError('quantity');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
              {fieldErrors.quantity && <p className="mt-1 text-[16px] text-red-600">{fieldErrors.quantity}</p>}
            </div>

            <div ref={countryRef} className="relative">
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="originCountry">
                {t('fields.country')} *
              </label>

              <input id="originCountry" type="text" readOnly value={originCountry} className="hidden" tabIndex={-1} aria-hidden />
              <button
                type="button"
                onClick={() => setCountryOpen((o) => !o)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-expanded={countryOpen}
                aria-haspopup="listbox"
              >
                {originCountry ? (
                  <>
                    {(() => {
                      const FlagComp = FLAGS[CODE_TO_FLAG[originCountry]];
                      return FlagComp ? (
                        <FlagComp className="h-5 w-8 shrink-0 rounded object-cover" title={originCountry} />
                      ) : null;
                    })()}
                    <span>{tParcels(parcelOriginLabelKey(originCountry))}</span>
                  </>
                ) : (
                  <span className="text-[16px] font-bold text-black md:text-[18px]">{tParcels('countryPlaceholder')}</span>
                )}
                <span className="ml-auto text-gray-400">{countryOpen ? '▲' : '▼'}</span>
              </button>

              {countryOpen && (
                <ul
                  className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                  role="listbox"
                >
                  {ORIGIN_COUNTRIES.map(({ code }) => {
                    const FlagComp = FLAGS[CODE_TO_FLAG[code]];
                    return (
                      <li
                        key={code}
                        role="option"
                        aria-selected={originCountry === code}
                        onClick={() => {
                          setOriginCountry(code);
                          setCountryOpen(false);
                          clearFieldError('originCountry');
                        }}
                        className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[15px] text-black hover:bg-gray-100 md:text-[18px]"
                      >
                        {FlagComp && <FlagComp className="h-5 w-8 shrink-0 rounded object-cover" title={code} />}
                        <span>{tParcels(parcelOriginLabelKey(code))}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {fieldErrors.originCountry && (
                <p className="mt-1 text-[16px] text-red-600">{fieldErrors.originCountry}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="weight">
                {t('fields.weight')}
              </label>
              <input
                id="weight"
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  clearFieldError('weight');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
              {fieldErrors.weight && <p className="mt-1 text-[16px] text-red-600">{fieldErrors.weight}</p>}
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="description">
                {t('fields.description')} *
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError('description');
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
              {fieldErrors.description && (
                <p className="mt-1 text-[16px] text-red-600">{fieldErrors.description}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-bold text-[#3a5bff] md:text-[18px]" htmlFor="comment">
                {t('fields.comment')}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                suppressHydrationWarning
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#3a5bff] px-5 py-2.5 text-[15px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70"
                suppressHydrationWarning
              >
                {loading ? t('saving') : tCommon('save')}
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-[15px] font-medium text-black"
              >
                {tCommon('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

