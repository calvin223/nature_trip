import type { Locale } from '@/i18n/locales';
import { deepMerge, type DeepPartial } from '@/i18n/merge';
import en from './en';

export type Messages = typeof en;

/* Translations, merged over English so any string not yet translated still shows (in English).
   To add one: create messages/<locale>/ (same files as messages/en/), import it here, add it below,
   then enable the locale in i18n/locales.ts.

     import de from './de';
     const TRANSLATIONS = { de };                                                                  */
const TRANSLATIONS: Partial<Record<Locale, DeepPartial<Messages>>> = {};

export function loadMessages(locale: Locale): Messages {
  return deepMerge(en, TRANSLATIONS[locale]);
}
