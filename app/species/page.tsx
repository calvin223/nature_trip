import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { wildlifeDisclaimer } from '@/lib/data';
import { photos } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import SpeciesExplorer from './SpeciesExplorer';

export const metadata: Metadata = {
  title: 'Species & Field Gallery',
  description:
    'The wildlife our naturalists look for, from Western Ghats endemics to monsoon frogs, reptiles, butterflies, plants and the big mammals of the tiger reserves, with a gallery of field photographs.',
};

const WE_DO = [
  'Keep a safe, respectful distance from wildlife',
  'Photograph ethically, without pressuring animals for a shot',
  'Teach identification by sight and by sound',
  'Respect animal behaviour and habitats',
  'Follow park rules on vehicles, routes and timings',
];

const WE_DONT = [
  'Use bird-call playback to lure birds',
  'Disturb nesting or breeding animals',
  'Handle, bait or crowd wildlife',
  'Collect specimens or eggs',
  'Trample vegetation for photographs',
];

export default function SpeciesPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <p className="eyebrow">Species</p>
          <h1 className="h-display mb-5">
            The wildlife <span className="accent-text">we look for</span>
          </h1>
          <p className="lede">
            Endemic birds and mammals of the Western Ghats, monsoon frogs and reptiles, butterflies and moths, forest
            plants, and the big mammals of the tiger reserves. Pick a group to filter {photos.length} field photographs.
          </p>
        </div>
      </section>

      <section className="wd-section !pt-0" id="gallery">
        <div className="wd-wrap">
          <SpeciesExplorer />
          <p className="mt-8 text-sm text-wd-faint" data-no-float>
            Field photographs supplied by the Wildora team.{' '}
            <Link href="/credits/" className="underline underline-offset-2 hover:text-white">
              Photo credits
            </Link>
          </p>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad reveal">
            <p className="eyebrow">Local specialities</p>
            <h2 className="h-section mb-5">Why local specialities matter</h2>
            <div className="space-y-4 text-wd-muted leading-relaxed">
              <p>
                Some species are widespread icons; others are tied to one region, habitat, altitude or season. In the
                Western Ghats, the lion-tailed macaque and the Nilgiri tahr live nowhere else on Earth.
              </p>
              <p>
                Endemic and threatened species matter especially because they depend on particular habitats. When those
                habitats are damaged, there may be no second chance elsewhere.
              </p>
              <p>
                On our trips we look for the endemic and locally special species that each route and season make
                likely, and we keep observation ethical and low-impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Fieldcraft</p>
            <h2 className="h-section">Ethical wildlife watching</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto float-grid">
            <article className="glass glass-pad card-3d reveal">
              <h3 className="h-card mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full grid place-items-center bg-wd-lime/15 border border-wd-lime/35 text-wd-lime text-base" aria-hidden="true">✓</span>
                We do
              </h3>
              <ul className="space-y-2.5 text-wd-muted">
                {WE_DO.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="glass glass-pad card-3d reveal" style={{ '--d': '110ms' } as CSSProperties}>
              <h3 className="h-card mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full grid place-items-center bg-wd-trogon/15 border border-wd-trogon/40 text-wd-trogon text-base" aria-hidden="true">✕</span>
                We don&apos;t
              </h3>
              <ul className="space-y-2.5 text-wd-muted">
                {WE_DONT.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-trogon flex-none" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad text-center reveal">
            <h2 className="h-section mb-4">Looking for something in particular?</h2>
            <p className="lede mb-6 max-w-2xl mx-auto">
              Tell us the species you most hope to see. We will tell you which trip and season give the best chance.
            </p>
            <p className="wd-note text-left max-w-2xl mx-auto mb-8">{wildlifeDisclaimer}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/trips/" className="btn btn-primary btn-lg">
                Browse trips
              </Link>
              <a
                href={waLink("Hello Wildora, I'm hoping to see a particular species. Which trip would suit?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
