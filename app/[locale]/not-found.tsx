import NotFoundContent, { notFoundMetadata } from '@/components/NotFoundContent';

/* Used by a host that renders on request; the static export serves app/not-found.tsx instead. */
export const metadata = notFoundMetadata;

export default function LocaleNotFound() {
  return <NotFoundContent />;
}
