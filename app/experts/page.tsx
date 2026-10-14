/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { experts } from '@/lib/data';
import { img } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

export const metadata: Metadata = {
  title: 'Our Naturalists',
  description:
    'Meet the naturalists who lead Wildora trips: researchers and educators in birds, butterflies, mammals and tropical ecosystems, with field experience across the Western and Eastern Ghats.',
};

/* These cards are wide, so the standard card-3d tilt would swing their edges a long way.
   Halve it and lengthen the perspective. Reduced motion still wins: globals.css sets
   `.card-3d { transform: none !important }`. */
const SUBTLE_TILT: CSSProperties = {
  transform:
    'perspective(1800px) rotateX(calc(var(--rx, 0deg) * 0.45)) rotateY(calc(var(--ry, 0deg) * 0.45)) translateZ(0)',
};

const WHY = [
  {
    title: 'Field knowledge',
    body: 'Between them, our naturalists have spent years researching birds, butterflies, mammals and tropical ecosystems, much of it in the Western and Eastern Ghats.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'Finding and naming',
    body: 'Help spotting what is there, identifying it by sight and by call, and explaining how it lives, from hornbills overhead to frogs by a stream.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    title: 'Explained for everyone',
    body: 'Clear explanations in the field for first-time visitors and experienced naturalists alike, at a pace that leaves time to look and listen.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
];

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(-2)
    .join('');
}

export default function ExpertsPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <p className="eyebrow">Our naturalists</p>
          <h1 className="h-display mb-5">
            Guided by people who <span className="accent-text">study these forests</span>
          </h1>
          <p className="lede">
            Our guides are naturalists, researchers and educators who have spent years studying India&apos;s birds,
            butterflies, mammals and forests. They bring that field knowledge to the trips they lead, while keeping each
            day relaxed, practical and enjoyable.
          </p>
        </div>
      </section>

      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="grid gap-8 md:gap-10 float-grid">
            {experts.map((expert, index) => {
              const flip = index % 2 === 1;
              return (
                <article
                  key={expert.id}
                  className={`glass card-3d reveal overflow-hidden grid md:items-stretch ${
                    flip ? 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
                  }`}
                  style={SUBTLE_TILT}
                  aria-labelledby={`expert-${expert.id}`}
                >
                  <div className={`relative aspect-square md:aspect-auto md:min-h-[26rem] bg-wd-deep ${flip ? 'md:order-2' : ''}`}>
                    {expert.imageUrl ? (
                      <img
                        src={img(expert.imageUrl)}
                        alt={`Portrait of ${expert.name}`}
                        width={600}
                        height={600}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-wd-forest to-wd-deep font-display text-6xl text-wd-lime"
                        aria-hidden="true"
                      >
                        {initials(expert.name)}
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent ${
                        flip ? 'md:bg-gradient-to-r' : 'md:bg-gradient-to-l'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-5">
                    <div>
                      <h2 id={`expert-${expert.id}`} className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight">
                        {expert.name}
                      </h2>
                      <p className="mt-2 text-wd-lime font-semibold leading-snug">{expert.qualifications}</p>
                    </div>

                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--wd-line)] bg-black/20 p-4">
                        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-wd-faint mb-1.5">Specialism</dt>
                        <dd className="text-sm text-wd-ink leading-relaxed">{expert.specialization}</dd>
                      </div>
                      <div className="rounded-xl border border-[var(--wd-line)] bg-black/20 p-4">
                        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-wd-faint mb-1.5">Experience</dt>
                        <dd className="text-sm text-wd-ink leading-relaxed">{expert.experience}</dd>
                      </div>
                    </dl>

                    <hr className="divider" />

                    <p className="text-wd-muted leading-relaxed">{expert.bio}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">In the field</p>
            <h2 className="h-section">Why naturalist guides matter</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 float-grid">
            {WHY.map((w, i) => (
              <article
                key={w.title}
                className="glass glass-pad card-3d reveal"
                style={{ '--d': `${i * 110}ms` } as CSSProperties}
              >
                <div className="w-12 h-12 rounded-full grid place-items-center bg-wd-lime/15 border border-wd-lime/30 text-wd-lime mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={w.icon} />
                  </svg>
                </div>
                <h3 className="h-card mb-2">{w.title}</h3>
                <p className="text-wd-muted leading-relaxed">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad text-center reveal">
            <p className="eyebrow">Ask a naturalist</p>
            <h2 className="h-section mb-4">Questions about a species or a route?</h2>
            <p className="lede mb-8 max-w-2xl mx-auto">
              Message us with what you hope to see and when you can travel. We will tell you honestly what is likely and
              which trip fits.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink("Hello Wildora, I have a question for one of your naturalists.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <Link href="/trips/" className="btn btn-ghost btn-lg">
                See trips &amp; dates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
