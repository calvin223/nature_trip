import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';

/* Client components can only read the namespaces handed to the browser. The site layout hands over
   'common'; wrap a page's client components in this to add that page's namespaces, so each page
   ships only the strings it needs rather than the whole site's. */
export default async function ClientMessages({ namespaces, children }: { namespaces: string[]; children: ReactNode }) {
  const messages = await getMessages();
  const picked = Object.fromEntries(['common', ...namespaces].filter((n) => n in messages).map((n) => [n, messages[n as keyof typeof messages]]));
  return <NextIntlClientProvider messages={picked}>{children}</NextIntlClientProvider>;
}
