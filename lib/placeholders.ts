import type { CSSProperties } from 'react';
import data from './placeholders.json';

const map = data as Record<string, string>;

/** Blurred stand-in painted behind a photo until it loads. `src` is the path without the
 *  basePath, e.g. "/photos/birds/malabar-trogon.webp". Built by `npm run build:images`. */
/** The blur as a data URL, for passing to client components. */
export const blurUrl = (src: string): string | undefined => map[src];

export function blurStyle(src: string): CSSProperties | undefined {
  const url = map[src];
  return url ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined;
}
