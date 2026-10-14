'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LOCALE_META, LOCALE_STORAGE_KEY } from '@/i18n/locales';
import { routing } from '@/i18n/routing';

/* The same page in each published language. Renders nothing until a second locale is enabled.
   The choice is remembered, so the bare site address (app/page.tsx) opens it next time. */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common.language');
  if (routing.locales.length < 2) return null;

  return (
    <nav aria-label={t('label')} className={`lang-switch ${className}`}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={LOCALE_META[l].hreflang}
          lang={LOCALE_META[l].htmlLang}
          aria-current={l === locale ? 'true' : undefined}
          aria-label={l === locale ? undefined : t('switchTo', { language: LOCALE_META[l].name })}
          onClick={() => {
            try {
              localStorage.setItem(LOCALE_STORAGE_KEY, l);
            } catch {}
          }}
        >
          {LOCALE_META[l].name}
        </Link>
      ))}
    </nav>
  );
}
