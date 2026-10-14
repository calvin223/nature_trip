// Generates public/textures/camo.svg: a seamless, vibrant woodland-camouflage tile.
// Deterministic (seeded), so re-running produces the same file. Run: node scripts/gen-camo.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const T = 960; // tile size, px
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let seed = 20261003;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const between = (a, b) => a + (b - a) * rnd();

/* Closed Catmull-Rom spline through jittered polar points -> smooth organic blob. */
function blob(cx, cy, r, stretch, rot) {
  const n = 7 + Math.floor(rnd() * 4);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + between(-0.25, 0.25);
    const rr = r * between(0.55, 1.2);
    const x = Math.cos(a) * rr * stretch;
    const y = Math.sin(a) * rr;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  const p = (i) => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/* Each blob is drawn at the 9 tile offsets so the pattern wraps seamlessly. */
function layer(fill, count, rMin, rMax) {
  const paths = [];
  for (let i = 0; i < count; i++) {
    const cx = rnd() * T, cy = rnd() * T, r = between(rMin, rMax);
    const stretch = between(1.3, 2.1), rot = between(-0.5, 0.5);
    const saved = seed;
    for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) {
      if (cx + dx + r * 2.6 < 0 || cx + dx - r * 2.6 > T || cy + dy + r * 2.6 < 0 || cy + dy - r * 2.6 > T) continue;
      seed = saved; // identical shape at every offset
      paths.push(blob(cx + dx, cy + dy, r, stretch, rot));
    }
  }
  return `<path fill="${fill}" d="${paths.join('')}"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">
<rect width="${T}" height="${T}" fill="#123a21"/>
${layer('#1d6234', 14, 70, 120)}
${layer('#2f8f43', 12, 55, 95)}
${layer('#7fbf3c', 9, 35, 65)}
${layer('#5c3e22', 10, 40, 75)}
${layer('#0a2214', 12, 28, 55)}
</svg>
`;

mkdirSync(join(root, 'public/textures'), { recursive: true });
writeFileSync(join(root, 'public/textures/camo.svg'), svg);
console.log(`camo.svg written: ${(svg.length / 1024).toFixed(1)} KB`);
