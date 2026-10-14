// Shared FAQ helpers for /faq/ and the FAQ teaser on /practical/.
// Plain module (no 'use client'), so server pages can call these functions.

import { createTranslator } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { getContent } from '@/lib/content';
import type { FaqCategory } from '@/lib/data';
import { loadMessages, type Messages } from '@/messages';

/** URL fragment for a FAQ category: "Food & diet" -> "food-diet". */
export function categorySlug(category: FaqCategory): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroup {
  category: FaqCategory;
  slug: string;
  /** The category name in the page's language (faq.categories). */
  label: string;
  items: FaqEntry[];
}

/**
 * Every FAQ in `locale`, grouped by `faqCategories` in display order. The internal `policy`
 * flag is stripped here so it can never reach the page or the client bundle.
 * Throws if a FAQ uses a category missing from `faqCategories`, rather than
 * silently dropping that question from the page.
 */
export function groupFaqs(locale: Locale): FaqGroup[] {
  const { faqs, faqCategories } = getContent(locale);
  const t = createTranslator({ locale, messages: loadMessages(locale), namespace: 'faq' });
  const listed = new Set<FaqCategory>(faqCategories);
  const stray = faqs.filter((f) => !listed.has(f.category));
  if (stray.length > 0) {
    throw new Error(
      `FAQ categories missing from faqCategories in lib/data.ts: ${[...new Set(stray.map((f) => f.category))].join(', ')}`,
    );
  }
  return faqCategories
    .map((category) => {
      const slug = categorySlug(category);
      return {
        category,
        slug,
        label: t(`categories.${slug as keyof Messages['faq']['categories']}`),
        items: faqs
          .filter((f) => f.category === category)
          .map(({ question, answer }) => ({ question, answer })),
      };
    })
    .filter((group) => group.items.length > 0);
}
