'use client';

import { useState } from 'react';

export default function ReturnParcelForm() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setError(null);
    setSuccess(false);

    const tn = trackingNumber.trim();
    if (tn.length < 3) {
      setError('შეიყვანეთ თრექინგ კოდი.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: tn,
          reason: reason.trim() ? reason.trim() : undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { error?: string };
      if (!res.ok) {
        setError(data && 'error' in data && data.error ? data.error : 'შეცდომა');
        return;
      }
      setSuccess(true);
      setTrackingNumber('');
      setReason('');
    } catch {
      setError('ქსელის შეცდომა. სცადეთ თავიდან.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[14px] font-semibold text-black">თრექინგ კოდი</label>
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          placeholder="მაგ. 1Z999AA10123456784"
        />
      </div>

      <div>
        <label className="block text-[14px] font-semibold text-black">
          მიზეზი (არასავალდებულო)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="mt-1 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          placeholder="მოკლედ აღწერეთ რატომ გსურთ დაბრუნება…"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-900">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[14px] text-emerald-900">
          მოთხოვნა მიღებულია.
        </div>
      )}

      <button
        type="button"
        disabled={submitting}
        onClick={submit}
        className="w-full rounded-lg bg-[#3a5bff] px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#2d4ae0] disabled:opacity-60"
      >
        {submitting ? 'იგზავნება…' : 'დაბრუნების მოთხოვნა'}
      </button>
    </div>
  );
}

