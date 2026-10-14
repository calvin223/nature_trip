import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/* Use these instead of next/link and next/navigation: they add the current locale to every href
   (href="/trips/" renders /en/trips/), and usePathname returns the path without it. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
