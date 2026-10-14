import { useTranslations } from 'next-intl';

/* Key for the month charts: what a green and a grey month mean. */
export default function SeasonLegend({ className = '' }: { className?: string }) {
  const t = useTranslations('whenToVisit.legend');
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-wd-muted ${className}`} aria-label={t('label')}>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-3.5 w-6 rounded-[3px] bg-wd-emerald" />
        {t('on')}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-3.5 w-6 rounded-[3px] bg-wd-canopy" />
        {t('off')}
      </li>
    </ul>
  );
}
