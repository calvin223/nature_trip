'use client';

import { useId, useMemo, useState } from 'react';
import { waLink } from '@/lib/site';
import type { FaqGroup } from './faq-utils';

/* FAQ list with a topic jump-list and a client-side search filter.

   Filtering toggles the `hidden` attribute and never unmounts a node or changes a
   className: ForestFX adds `.in` (reveal) and `.float` straight onto these DOM nodes,
   and a remounted `.reveal` card, or a className React rewrites, would lose them and
   stay invisible. Layout: the root and the list column are both `.float-grid`, so the
   category cards float individually while the sticky jump-list (`data-no-float`)
   holds still. */

const MIN_QUERY = 2;

function normalise(text: string): string {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

export default function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState('');
  const uid = useId();
  const inputId = `${uid}-search`;
  const statusId = `${uid}-status`;

  const haystacks = useMemo(
    () => groups.map((g) => g.items.map((it) => normalise(`${g.category} ${it.question} ${it.answer}`))),
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
    <div className="float-grid grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      <aside data-no-float aria-label="FAQ topics and search">
        {/* Sticky wrapper is not .glass: .glass sets position: relative outside Tailwind's layers. */}
        <div className="lg:sticky lg:top-28">
          <div className="glass glass-pad space-y-5">
            <div className="hidden [.js_&]:block">
              <label htmlFor={inputId} className="wd-label">Search the questions</label>
              <input
                id={inputId}
                type="search"
                className="wd-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. vegan, insurance, plugs"
                autoComplete="off"
                aria-controls={`${uid}-list`}
                aria-describedby={statusId}
              />
              <p id={statusId} aria-live="polite" className="mt-2 text-xs text-wd-faint">
                {searching
                  ? `${shown} of ${total} questions match`
                  : `${total} questions in ${groups.length} topics`}
              </p>
            </div>

            <nav aria-label="FAQ topics">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wd-lime mb-3">Topics</p>
              <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {groups.map((g, gi) => (
                  <li key={g.slug} hidden={searching && counts[gi] === 0}>
                    <a
                      href={`#${g.slug}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[var(--wd-line)] bg-[rgba(154,209,75,0.05)] px-3 py-2 text-sm text-wd-muted transition-colors hover:border-[var(--wd-line-strong)] hover:text-white"
                    >
                      <span>{g.category}</span>
                      <span className="text-xs text-wd-faint tabular-nums">{counts[gi]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      <div id={`${uid}-list`} className="float-grid space-y-12">
        {groups.map((g, gi) => (
          <section
            key={g.slug}
            id={g.slug}
            aria-labelledby={`${g.slug}-title`}
            hidden={counts[gi] === 0}
            className="glass glass-pad card-3d reveal scroll-mt-28"
          >
            <p className="eyebrow">Topic {gi + 1} of {groups.length}</p>
            <h2 id={`${g.slug}-title`} className="h-card !text-2xl">{g.category}</h2>
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
          <p className="text-wd-ink">No questions match “{query.trim()}”.</p>
          <p className="mt-2 text-sm text-wd-muted">
            Try a different word, or{' '}
            <a
              href={waLink(`Hello Wildora, I have a question that is not in your FAQ: ${query.trim()}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              ask us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
