// Shared FAQ helpers for /faq/ and the FAQ teaser on /practical/.
// Plain module (no 'use client'), so server pages can call these functions.

import { faqCategories, faqs, type FaqCategory } from '@/lib/data';

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
  items: FaqEntry[];
}

/**
 * Every FAQ, grouped by `faqCategories` in display order. The internal `policy`
 * flag is stripped here so it can never reach the page or the client bundle.
 * Throws if a FAQ uses a category missing from `faqCategories`, rather than
 * silently dropping that question from the page.
 */
export function groupFaqs(): FaqGroup[] {
  const listed = new Set<FaqCategory>(faqCategories);
  const stray = faqs.filter((f) => !listed.has(f.category));
  if (stray.length > 0) {
    throw new Error(
      `FAQ categories missing from faqCategories in lib/data.ts: ${[...new Set(stray.map((f) => f.category))].join(', ')}`,
    );
  }
  return faqCategories
    .map((category) => ({
      category,
      slug: categorySlug(category),
      items: faqs
        .filter((f) => f.category === category)
        .map(({ question, answer }) => ({ question, answer })),
    }))
    .filter((group) => group.items.length > 0);
}
