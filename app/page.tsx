import type { Metadata } from 'next';
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALE_META, LOCALE_STORAGE_KEY } from '@/i18n/locales';
import { searchVerification } from '@/i18n/metadata';
import { SITE_URL } from '@/lib/site';
import { BASE_PATH } from '@/lib/photos';

/* The bare site address picks a language and moves on: the visitor's remembered choice, else the
   first browser language the site is published in, else the default. Search engines and visitors
   without JavaScript get the default language through the refresh, and links to every language. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Wildora Expeditions',
  alternates: { canonical: `${DEFAULT_LOCALE}/` },
  /* Search Console checks the address it was given, usually this bare one. */
  verification: searchVerification,
};

const pickScript = `(function(){var L=${JSON.stringify(ENABLED_LOCALES)},D=${JSON.stringify(DEFAULT_LOCALE)},pick=null;try{var s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(L.indexOf(s)>-1)pick=s}catch(e){}if(!pick){var n=navigator.languages||[navigator.language||""];for(var i=0;i<n.length&&!pick;i++){var c=String(n[i]).toLowerCase().split("-")[0];if(L.indexOf(c)>-1)pick=c}}location.replace(${JSON.stringify(BASE_PATH)}+"/"+(pick||D)+"/"+location.search+location.hash)})();`;

export default function LanguagePicker() {
  return (
    <html lang={LOCALE_META[DEFAULT_LOCALE].htmlLang}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickScript }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${BASE_PATH}/${DEFAULT_LOCALE}/`} />
        </noscript>
      </head>
      <body>
        <ul>
          {ENABLED_LOCALES.map((l) => (
            <li key={l}>
              <a href={`${BASE_PATH}/${l}/`} hrefLang={LOCALE_META[l].hreflang} lang={LOCALE_META[l].htmlLang}>
                {LOCALE_META[l].name}
              </a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
