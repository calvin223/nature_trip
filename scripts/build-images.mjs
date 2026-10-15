// Builds image assets that the static export cannot make at request time.
//   1. Hero crops from the client's full-resolution originals ("Website Photos/", gitignored):
//      a 16:9 desktop crop and a tall phone crop, each at two widths.
//   2. Photos from the team's past field courses ("../Past photos/", the client's camera originals,
//      outside the repo), resized at high quality: they are among a visitor's first impressions.
//   Both are skipped with a note when the originals are not on this machine.
//   3. 240 px copies of the naturalists' portraits (public/photos/experts/thumb/) for the home page,
//      which shows them at 112 px.
//   4. lib/placeholders.json: a thumbhash blur for every photo under public/photos, shown behind
//      each image until it loads. The hash is decoded here and stored as a tiny WebP data URL
//      (thumbhash's own PNG encoder is ~4 KB a photo, too heavy to inline).
// Run: npm run build:images. Commit the outputs (public/photos/hero/*, public/photos/field/*,
// lib/placeholders.json).
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToRGBA } from 'thumbhash';

const root = join(import.meta.dirname, '..');
const photosDir = join(root, 'public', 'photos');
const originals = join(root, 'Website Photos', 'z wildlife photos');

/* Crops are fractions of the auto-rotated original, so they survive a re-export at another size.
   Young Bengal tiger (6000 x 4000): ears at ≈ 10% down, paws at ≈ 88%, face centre ≈ 51% across. */
const HEROES = [
  {
    src: 'Mammals/Tiger cub (2).JPG',
    name: 'tiger',
    crops: {
      wide: { left: 0, top: 0.05, width: 1, height: 0.84375, widths: [1280, 2400] },    // 16:9
      tall: { left: 0.3225, top: 0, width: 0.375, height: 1, widths: [720, 1080] },     // 9:16
    },
  },
];

/* Past field courses (Sony camera originals, January 2010 and 2012). Full frames, no crops; each at
   two or three widths. The file name is <name>-<width>.webp. */
const pastPhotos = join(root, '..', 'Past photos');
const FIELD = [
  { src: 'DSC01246.JPG', name: 'roadside-birding', widths: [800, 1400, 2400] },
  { src: 'DSC03163.JPG', name: 'forest-notes', widths: [700, 1200] },
  { src: 'DSC05987.JPG', name: 'mangrove-boat', widths: [700, 1200] },
  { src: 'DSC05733.JPG', name: 'lake-birding', widths: [700, 1200] },
  { src: 'DSC05801.JPG', name: 'shared-lunch', widths: [700, 1200] },
  { src: 'DSC06338.JPG', name: 'shola-walk', widths: [800, 1400, 2400] },
  { src: 'DSC01413.JPG', name: 'lecture', widths: [700, 1200] },
  { src: 'DSC01992.JPG', name: 'shore-notes', widths: [700, 1200] },
];

async function buildField() {
  if (!existsSync(pastPhotos)) {
    console.log('field: "Past photos" folder not found, skipping (existing files are kept)');
    return;
  }
  const out = join(photosDir, 'field');
  mkdirSync(out, { recursive: true });
  for (const f of FIELD) {
    for (const w of f.widths) {
      const file = join(out, `${f.name}-${w}.webp`);
      const info = await sharp(join(pastPhotos, f.src)).rotate().resize({ width: w }).webp({ quality: 86 }).toFile(file);
      console.log(`field: ${relative(root, file)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
    }
  }
}

async function buildExpertThumbs() {
  const dir = join(photosDir, 'experts');
  mkdirSync(join(dir, 'thumb'), { recursive: true });
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.webp'))) {
    const info = await sharp(join(dir, f)).resize({ width: 240 }).webp({ quality: 80 }).toFile(join(dir, 'thumb', f));
    console.log(`experts: thumb/${f} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}

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
        const info = await base.clone().extract(region).resize({ width: w }).webp({ quality: 100 }).toFile(file);
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
await buildField();
await buildExpertThumbs();
await buildPlaceholders();
