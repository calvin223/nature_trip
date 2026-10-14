import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { MetadataRoute } from 'next';
import { LOCALE_META } from '@/i18n/locales';
import { routing } from '@/i18n/routing';
import { trips } from '@/lib/data';
import { buildDate } from '@/lib/schedule';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/* Every page of every published language. Pages are found by walking app/[locale] for page.tsx, so a
   new page is listed without editing this file; the trip page's [id] expands to each trip. */
function pagePaths(dir = join(process.cwd(), 'app', '[locale]'), path = '/'): string[] {
  const here = existsSync(join(dir, 'page.tsx')) ? [path] : [];
  const below = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) =>
      e.name === '[id]'
        ? trips.map((t) => `${path}${t.id}/`)
        : pagePaths(join(dir, e.name), `${path}${e.name}/`),
    );
  return [...here, ...below];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = buildDate();
  return pagePaths().flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [LOCALE_META[l].hreflang, `${SITE_URL}${l}${path}`])),
      },
    })),
  );
}
