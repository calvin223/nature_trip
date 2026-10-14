import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import LegalPage from '@/components/LegalPage';
import { getLegalDoc } from '@/content/legal';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { doc } = getLegalDoc(locale, 'packageTravel');
  return { title: doc.title, description: doc.description, alternates: alternates(locale, '/package-travel/') };
}

export default async function PackageTravelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { doc, fallback } = getLegalDoc(locale, 'packageTravel');
  return <LegalPage doc={doc} fallback={fallback} current="packageTravel" />;
}
