'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';

const CONSENT_STORAGE_KEY = 'postifly_home_consent_v1';

export default function HomeConsentModal() {
  const t = useTranslations('homeConsent');
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const existingConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      setIsVisible(!existingConsent);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'rejected');
    setIsVisible(false);
    router.push('/conditions');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
        <h3 className="text-[20px] font-semibold text-black">{t('title')}</h3>
        <p className="mt-3 text-[15px] leading-6 text-gray-800">{t('description')}</p>
        <Link href="/conditions" className="mt-2 inline-block text-[14px] text-black underline hover:no-underline">
          {t('conditionsLink')}
        </Link>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-[15px] font-medium text-black hover:bg-gray-100"
          >
            {t('reject')}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="w-full rounded-md bg-black px-4 py-2 text-[15px] font-medium text-white hover:bg-gray-800"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
