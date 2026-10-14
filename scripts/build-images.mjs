// Builds image assets that the static export cannot make at request time.
//   1. Hero crops from the client's full-resolution originals ("Website Photos/", gitignored):
//      a 16:9 desktop crop and a tall phone crop, each at two widths.
//      Skipped with a note when the originals are not on this machine.
//   2. lib/placeholders.json: a thumbhash blur for every photo under public/photos, shown behind
//      each image until it loads. The hash is decoded here and stored as a tiny WebP data URL
//      (thumbhash's own PNG encoder is ~4 KB a photo, too heavy to inline).
// Run: npm run build:images. Commit the outputs (public/photos/hero/*, lib/placeholders.json).
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToRGBA } from 'thumbhash';

const root = join(import.meta.dirname, '..');
const photosDir = join(root, 'public', 'photos');
const originals = join(root, 'Website Photos', 'z wildlife photos');

/* Crops are fractions of the auto-rotated original, so they survive a re-export at another size.
   Lion-tailed macaque (5184 x 3456, portrait after EXIF rotation): face centre ≈ (45%, 24%). */
const HEROES = [
  {
    src: 'Mammals/Lion tailed macque.JPG',
    name: 'macaque',
    crops: {
      wide: { left: 0, top: 0.097, width: 1, height: 0.375, widths: [1280, 2400] },   // 16:9
      tall: { left: 0.019, top: 0, width: 0.844, height: 1, widths: [720, 1080] },     // 9:16
    },
  },
];

async function buildHeroes() {
  if (!existsSync(originals)) {
    console.log('hero: originals folder not found, skipping (existing crops are kept)');
    return;
  }
  const out = join(photosDir, 'hero');
  mkdirSync(out, { recursive: true });
  for (const h of HEROES) {
    const base = sharp(join(originals, h.src)).rotate();
    const { width: W, height: H } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
    for (const [kind, c] of Object.entries(h.crops)) {
      const region = {
        left: Math.round(c.left * W),
        top: Math.round(c.top * H),
        width: Math.round(c.width * W),
        height: Math.round(c.height * H),
      };
      for (const w of c.widths) {
        const file = join(out, `${h.name}-${kind}-${w}.webp`);
        const info = await base.clone().extract(region).resize({ width: w }).webp({ quality: 80 }).toFile(file);
        console.log(`hero: ${relative(root, file)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
      }
    }
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

async function buildPlaceholders() {
  const files = walk(photosDir).filter((p) => p.endsWith('.webp') && !p.split(sep).includes('thumb'));
  const map = {};
  for (const file of files.sort()) {
    const { data, info } = await sharp(file).resize(100, 100, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const blur = thumbHashToRGBA(rgbaToThumbHash(info.width, info.height, data));
    const webp = await sharp(Buffer.from(blur.rgba), { raw: { width: blur.w, height: blur.h, channels: 4 } }).webp({ quality: 50 }).toBuffer();
    map['/' + relative(join(root, 'public'), file).split(sep).join('/')] = `data:image/webp;base64,${webp.toString('base64')}`;
  }
  const json = JSON.stringify(map, null, 0);
  writeFileSync(join(root, 'lib', 'placeholders.json'), json + '\n');
  console.log(`placeholders: ${files.length} photos, ${(json.length / 1024).toFixed(0)} KB`);
}

await buildHeroes();
await buildPlaceholders();
