import { setRequestLocale } from 'next-intl/server';
import NotFoundContent, { notFoundMetadata } from '@/components/NotFoundContent';
import SiteShell from '@/components/SiteShell';
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALES } from '@/i18n/locales';
import { BASE_PATH } from '@/lib/photos';

/* The static 404.html that GitHub Pages serves for any unknown path, outside every locale.
   Old links from before languages (/nature_trip/trips/) and links to a language that is not
   published yet (/nature_trip/de/trips/) are sent on to the same page in the default language.
   Pages that no longer exist go to where their content lives now (MOVED, keyed by locale-free path). */
export const metadata = notFoundMetadata;

const MOVED: Record<string, string> = {
  /* The 10-day route page became the Western Ghats trip's itinerary. */
  '/journey/': '/trips/western-ghats-endemics/#itinerary',
};

const redirectScript = `(function(){var B=${JSON.stringify(BASE_PATH)},A=${JSON.stringify(LOCALES)},E=${JSON.stringify(ENABLED_LOCALES)},D=${JSON.stringify(DEFAULT_LOCALE)},M=${JSON.stringify(MOVED)};var p=location.pathname;if(p.indexOf(B)===0)p=p.slice(B.length);var seg=p.split("/")[1]||"",l=E.indexOf(seg)>-1?seg:D;if(A.indexOf(seg)>-1)p=p.slice(seg.length+1);var m=M[p.slice(-1)==="/"?p:p+"/"];if(m)return location.replace(B+"/"+l+m);if(E.indexOf(seg)>-1)return;location.replace(B+"/"+D+p+location.search+location.hash)})();`;

export default function RootNotFound() {
  setRequestLocale(DEFAULT_LOCALE);
  return (
    <SiteShell locale={DEFAULT_LOCALE}>
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <NotFoundContent />
    </SiteShell>
  );
}
