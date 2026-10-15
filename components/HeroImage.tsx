'use client';
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- static export with images.unoptimized (callers add the basePath with img()); alt is passed through by every caller. */

import type { ComponentProps } from 'react';

/* An eagerly loaded image (a page's hero) rendered as a client component. Rendered by a server
   component, React writes a preload hint for it into the page's prefetch data, so every page that
   merely links here (header, footer, trip cards) would download this photo too. As a client
   component it is still in the page's own HTML, loading early there, but nothing is preloaded for
   pages that only link to it. */
export default function HeroImage(props: ComponentProps<'img'>) {
  return <img {...props} />;
}
