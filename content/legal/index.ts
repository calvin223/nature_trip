import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import notice from './en/notice';
import terms from './en/terms';
import packageTravel from './en/packageTravel';
import privacy from './en/privacy';
import cookies from './en/cookies';
import accessibility from './en/accessibility';

export type LegalDocId = 'notice' | 'terms' | 'packageTravel' | 'privacy' | 'cookies' | 'accessibility';

export interface LegalDoc {
  title: string;
  description: string;
  lede: string;
  /** ISO date (YYYY-MM-DD) of the last change to this document. */
  updated: string;
  sections: { id: string; title: string; content: ReactNode }[];
}

const en: Record<LegalDocId, LegalDoc> = { notice, terms, packageTravel, privacy, cookies, accessibility };

/* Legal documents are whole documents per language, so a lawyer can review each one as it stands
   (never assembled string by string). To add a translation, e.g. German:
     1. copy content/legal/en/<id>.tsx to content/legal/de/<id>.tsx and translate it, keeping the
        section ids (other pages link to them, e.g. /terms/#complaints);
     2. have it reviewed;
     3. import it here and register it: de: { terms: termsDe, ... }.
   Until a language has its own copy, the English document is shown with a notice. */
const DOCS: Partial<Record<Locale, Partial<Record<LegalDocId, LegalDoc>>>> = { en };

export function getLegalDoc(locale: Locale, id: LegalDocId): { doc: LegalDoc; fallback: boolean } {
  const doc = DOCS[locale]?.[id];
  return doc ? { doc, fallback: false } : { doc: en[id], fallback: true };
}
