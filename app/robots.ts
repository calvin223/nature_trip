import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/* Served at <base path>/robots.txt. Search engines only read robots.txt at a domain's root, so this
   takes effect once the site has its own domain; until then, submit the sitemap in Search Console. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}sitemap.xml` };
}
