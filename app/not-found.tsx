import { setRequestLocale } from 'next-intl/server';
import NotFoundContent, { notFoundMetadata } from '@/components/NotFoundContent';
import SiteShell from '@/components/SiteShell';
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALES } from '@/i18n/locales';
import { BASE_PATH } from '@/lib/photos';

/* The static 404.html that GitHub Pages serves for any unknown path, outside every locale.
   Old links from before languages (/nature_trip/trips/) and links to a language that is not
   published yet (/nature_trip/de/trips/) are sent on to the same page in the default language. */
export const metadata = notFoundMetadata;

const redirectScript = `(function(){var B=${JSON.stringify(BASE_PATH)},A=${JSON.stringify(LOCALES)},E=${JSON.stringify(ENABLED_LOCALES)},D=${JSON.stringify(DEFAULT_LOCALE)};var p=location.pathname;if(p.indexOf(B)===0)p=p.slice(B.length);var seg=p.split("/")[1]||"";if(E.indexOf(seg)>-1)return;if(A.indexOf(seg)>-1)p=p.slice(seg.length+1);location.replace(B+"/"+D+p+location.search+location.hash)})();`;

export default function RootNotFound() {
  setRequestLocale(DEFAULT_LOCALE);
  return (
    <SiteShell locale={DEFAULT_LOCALE}>
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <NotFoundContent />
    </SiteShell>
  );
}
