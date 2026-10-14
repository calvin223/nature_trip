import type { Locale } from '@/i18n/locales';
import type { Messages } from '@/messages';

/* Types every translation key: t('nav.trips') is checked against messages/en/, so a typo or a
   removed key fails the type check instead of showing a raw key on the page. */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
