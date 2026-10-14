/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { findPhoto, img } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist or has moved. Find your way back to Wildora trips, naturalists and the species gallery.',
};

const ONWARD = [
  { href: '/experts/', title: 'Our naturalists', body: 'Meet the people who lead our trips.' },
  { href: '/species/', title: 'Species gallery', body: 'Browse field photographs by group.' },
  { href: '/when-to-visit/', title: 'When to visit', body: 'See which trips run in your month.' },
  { href: '/contact/', title: 'Send an enquiry', body: 'Tell us your dates and interests.' },
];

export default function NotFound() {
  const owl = findPhoto('mottled-wood-owl');

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[1.25fr_1fr] items-center">
          <div>
            <p className="eyebrow">Error 404</p>
            <h1 className="h-display mb-5">
              Lost the <span className="accent-text">trail?</span>
            </h1>
            <p className="lede mb-8 max-w-xl">
              This page does not exist, or it has moved. Even good trackers lose a trail now and then. Here is the way
              back.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn btn-primary btn-lg">
                Back to home
              </Link>
              <Link href="/trips/" className="btn btn-ghost btn-lg">
                See trips &amp; dates
              </Link>
            </div>
          </div>
          {owl && (
            <figure className="photo-tile photo-tile--captioned card-3d aspect-[4/5] max-h-[32rem] w-full max-w-sm mx-auto lg:mr-0" data-float>
              <img src={img(owl.src)} alt={owl.name} width={owl.w} height={owl.h} decoding="async" />
              <figcaption className="photo-tile__caption">{owl.name}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 float-grid">
            {ONWARD.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="glass glass-pad card-3d reveal flex flex-col gap-1.5"
                style={{ '--d': `${i * 80}ms` } as CSSProperties}
              >
                <span className="h-card">{l.title}</span>
                <span className="text-sm text-wd-muted">{l.body}</span>
                <span className="link-arrow text-sm mt-2">Go</span>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center text-wd-muted">
            Looking for something specific?{' '}
            <a
              href={waLink("Hello Wildora, I couldn't find a page on your website. Can you help?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-wd-lime font-semibold hover:text-wd-leaf"
            >
              <WhatsAppIcon className="w-4 h-4" /> Ask us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
