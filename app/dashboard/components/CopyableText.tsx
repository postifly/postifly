'use client';

import * as React from 'react';

type Props = {
  text: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  copyOnTextClick?: boolean;
};

async function copyToClipboard(text: string) {
  if (!text) return;

  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall back below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

export default function CopyableText({
  text,
  className,
  ariaLabel,
  children,
  copyOnTextClick = false,
}: Props) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const triggerCopy = React.useCallback(async () => {
    const next = text?.trim?.() ? text.trim() : text;
    if (!next) return;

    await copyToClipboard(next);
    setCopied(true);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
  }, [text]);

  if (!text?.trim?.()) {
    return <span className={className}>{children}</span>;
  }

  const textSpanProps = copyOnTextClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': ariaLabel ?? 'Copy',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          triggerCopy();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            triggerCopy();
          }
        },
        className: [
          'cursor-copy select-text rounded px-1 py-0.5',
          'transition-colors hover:bg-black/5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a5bff]/40 focus-visible:ring-offset-2',
          className ?? '',
        ].join(' '),
      }
    : { className };

  return (
    <span className="inline-flex max-w-full items-center justify-end gap-2">
      <span {...textSpanProps}>
        {children}
      </span>

      <button
        type="button"
        aria-label={ariaLabel ?? 'Copy'}
        onClick={(e) => {
          e.stopPropagation();
          triggerCopy();
        }}
        className={[
          'inline-flex shrink-0 items-center gap-1.5 rounded-md border border-neutral-300 bg-[#3a5bff] px-1 py-1 text-xs font-medium text-white',
          'shadow-sm transition-colors  active:bg-neutral-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a5bff]/40 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        {copied ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        <span>{copied ? '' : ''}</span>
      </button>
    </span>
  );
}

