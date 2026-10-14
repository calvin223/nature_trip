// Post-build fix for Next.js 16 static export.
// The export writes segment-prefetch files in nested folders (out/contact/__next.contact/__PAGE__.txt),
// but the client router requests the flattened name (out/contact/__next.contact.__PAGE__.txt).
// On a static host the request 404s and every link prefetch fails. This copies each nested file to
// its flattened name. Idempotent; run after `next build` (wired into `npm run build`).
import { readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../out', import.meta.url));
if (!existsSync(out)) throw new Error(`fix-export-prefetch: ${out} not found; run next build first`);

let copied = 0;
function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith('__next.')) {
      for (const f of filesUnder(p)) {
        const flat = join(dir, `${name}.${relative(p, f).split(sep).join('.')}`);
        if (!existsSync(flat)) { copyFileSync(f, flat); copied++; }
      }
    } else {
      walk(p);
    }
  }
}
walk(out);
console.log(`fix-export-prefetch: ${copied} flattened prefetch file(s) written`);
