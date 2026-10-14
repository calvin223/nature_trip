'use client';

import { useTranslations } from 'next-intl';
import { useId, useMemo, useState } from 'react';
import { waLink } from '@/lib/site';
import type { FaqGroup } from './faq-utils';

/* FAQ list with a topic jump-list and a client-side search filter.
   Filtering toggles the `hidden` attribute rather than unmounting nodes. */

const MIN_QUERY = 2;

function normalise(text: string): string {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

export default function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const t = useTranslations('faq.browser');
  const [query, setQuery] = useState('');
  const uid = useId();
  const inputId = `${uid}-search`;
  const statusId = `${uid}-status`;

  const haystacks = useMemo(
    () => groups.map((g) => g.items.map((it) => normalise(`${g.label} ${it.question} ${it.answer}`))),
    [groups],
  );

  const trimmed = normalise(query.trim());
  const searching = trimmed.length >= MIN_QUERY;
  const terms = searching ? trimmed.split(/\s+/) : [];
  const visible = haystacks.map((items) => items.map((text) => terms.every((t) => text.includes(t))));
  const counts = visible.map((v) => v.filter(Boolean).length);
  const shown = counts.reduce((a, b) => a + b, 0);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      <aside aria-label={t('asideLabel')}>
        {/* Sticky wrapper is not .glass: .glass sets position: relative outside Tailwind's layers. */}
        <div className="lg:sticky lg:top-28">
          <div className="glass glass-pad space-y-5">
            <div className="hidden [.js_&]:block">
              <label htmlFor={inputId} className="wd-label">{t('searchLabel')}</label>
              <input
                id={inputId}
                type="search"
                className="wd-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                autoComplete="off"
                aria-controls={`${uid}-list`}
                aria-describedby={statusId}
              />
              <p id={statusId} aria-live="polite" className="mt-2 text-xs text-wd-faint">
                {searching ? t('matches', { shown, total }) : t('summary', { total, topics: groups.length })}
              </p>
            </div>

            <nav aria-label={t('topicsLabel')}>
              <p className="font-display text-lg font-semibold text-wd-ink mb-2">{t('topics')}</p>
              <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-1">
                {groups.map((g, gi) => (
                  <li key={g.slug} hidden={searching && counts[gi] === 0}>
                    <a
                      href={`#${g.slug}`}
                      className="flex items-center justify-between gap-2 border-b border-[var(--wd-line)] py-2 text-sm text-wd-muted transition-colors hover:text-wd-ink"
                    >
                      <span>{g.label}</span>
                      <span className="text-xs text-wd-faint tabular-nums">{counts[gi]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      <div id={`${uid}-list`} className="space-y-12">
        {groups.map((g, gi) => (
          <section
            key={g.slug}
            id={g.slug}
            aria-labelledby={`${g.slug}-title`}
            hidden={counts[gi] === 0}
            className="glass glass-pad card-3d scroll-mt-28"
          >
            <h2 id={`${g.slug}-title`} className="h-card !text-2xl">{g.label}</h2>
            <div className="mt-3">
              {g.items.map((it, qi) => (
                <details key={it.question} className="wd-acc" hidden={!visible[gi][qi]} open={searching}>
                  <summary>{it.question}</summary>
                  <div>{it.answer}</div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div hidden={!searching || shown > 0} className="glass glass-pad text-center">
          <p className="text-wd-ink">{t('noMatch', { query: query.trim() })}</p>
          <p className="mt-2 text-sm text-wd-muted">
            {t.rich('tryAgain', {
              link: (chunks) => (
                <a
                  href={waLink(t('whatsappMessage', { query: query.trim() }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
