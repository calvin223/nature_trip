import type { LegalDoc } from '@/content/legal';
import { Link } from '@/i18n/navigation';
import { LOCALE_STORAGE_KEY } from '@/i18n/locales';
import { routing } from '@/i18n/routing';

/* Checked against the code on 2026-10-14: no cookies, analytics or third-party requests; fonts
   self-hosted by next/font (components/SiteShell.tsx); maps are inline SVG from bundled data
   (components/TripMap.tsx, IndiaOverviewMap.tsx, map/*); the only browser storage is the language
   choice (components/LanguageSwitcher.tsx, read by app/page.tsx). Re-check if any of that changes. */
const cookies: LegalDoc = {
  title: 'Cookies and local storage',
  description: 'This website sets no cookies and uses no analytics, advertising or tracking. The only thing it can store in your browser is your language choice.',
  lede: 'This website sets no cookies and uses no analytics, advertising or tracking. Here is exactly what it does store, and what it loads.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'no-cookies',
      title: 'No cookies, no tracking',
      content: (
        <p>
          This website sets no cookies. It uses no analytics, advertising, social-media plugins or other tracking tools,
          so no record of your visits is built up by us or for us.
        </p>
      ),
    },
    {
      id: 'what-loads',
      title: 'Everything comes from this website',
      content: (
        <>
          <p>Everything a page needs is served from this website itself:</p>
          <ul>
            <li>fonts: we host the font files ourselves, so your browser makes no requests to Google Fonts or any other font service;</li>
            <li>photographs;</li>
            <li>maps, which are drawn from map data bundled with the site, with no map tiles from outside services.</li>
          </ul>
          <p>
            The company that hosts the website keeps technical access logs, as described in our{' '}
            <Link href="/privacy/">privacy notice</Link>.
          </p>
        </>
      ),
    },
    {
      id: 'local-storage',
      title: 'Local storage: your language choice',
      content: (
        <>
          <p>
            When the website is published in more than one language, a language switcher appears in the footer and the
            menu. Only if you choose a language there does your browser save that choice in its local storage, under
            the name <code>{LOCALE_STORAGE_KEY}</code>, so the site opens in your language next time.
          </p>
          <ul>
            <li>It stays on your device and is never sent to us.</li>
            <li>It has no expiry date.</li>
            <li>You can delete it at any time by clearing this website&apos;s data in your browser settings.</li>
          </ul>
          {routing.locales.length < 2 && (
            <p>The website is currently published in English only, so the switcher is not shown and nothing is stored.</p>
          )}
        </>
      ),
    },
    {
      id: 'other-services',
      title: 'Links to other services',
      content: (
        <p>
          Some links lead to other services, such as WhatsApp, OpenStreetMap and the sources of our photographs and map
          data. Once you follow them, those services&apos; own cookie and privacy policies apply.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'If this changes',
      content: (
        <p>
          If we ever add cookies or similar technologies that are not strictly necessary, such as analytics, we will ask
          for your consent first and update this page.
        </p>
      ),
    },
  ],
};

export default cookies;
