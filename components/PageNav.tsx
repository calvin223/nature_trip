import { useTranslations } from 'next-intl';

/* In-page navigation: a slim solid bar that sticks under the main nav, with the page
   name on the left and its sections as plain links (adapted from Apple's product sub-nav).
   On phones the links scroll sideways and fade at the edge. */
export default function PageNav({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const t = useTranslations('trips.pageNav');
  return (
    <nav className="subnav no-print" aria-label={t('label')}>
      <div className="wd-wrap subnav__inner">
        <p className="subnav__title">{title}</p>
        <ul className="subnav__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
