import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { img } from '@/lib/photos';
import { blurStyle } from '@/lib/placeholders';

/* Full-bleed hero: one photograph, the headline anchored bottom-left.
   Art-directed crops from the client's 5184 px original (scripts/build-images.mjs):
   16:9 on landscape screens, 9:16 on phones. */
const WIDE = '/photos/hero/macaque-wide-2400.webp';

export default function HomeHero() {
  const t = useTranslations('home');
  return (
    <section className="home-hero" style={blurStyle(WIDE)} aria-labelledby="home-hero-title">
      <picture>
        <source
          media="(min-aspect-ratio: 4/5)"
          srcSet={`${img('/photos/hero/macaque-wide-1280.webp')} 1280w, ${img(WIDE)} 2400w`}
          sizes="100vw"
        />
        <img
          className="home-hero__img"
          src={img('/photos/hero/macaque-tall-1080.webp')}
          srcSet={`${img('/photos/hero/macaque-tall-720.webp')} 720w, ${img('/photos/hero/macaque-tall-1080.webp')} 1080w`}
          sizes="100vw"
          alt={t('hero.imageAlt')}
          fetchPriority="high"
        />
      </picture>

      <div className="home-hero__body wd-wrap">
        {/* UNESCO: "Older than the Himalaya mountains, the mountain chain of the Western Ghats…"
            https://whc.unesco.org/en/list/1342/ */}
        <h1 id="home-hero-title">{t('hero.title')}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">{t('hero.lede')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/trips/" className="btn btn-light btn-lg">{t('hero.tripsCta')}</Link>
          <Link href="/journey/" className="btn btn-glass btn-lg">{t('journeyCta')}</Link>
        </div>
      </div>

      <p className="home-hero__caption">
        {t.rich('hero.captionName', { latin: 'Macaca silenus', i: (chunks) => <i className="font-display">{chunks}</i> })}
        <br />
        {t('hero.captionNote')}
      </p>
    </section>
  );
}
