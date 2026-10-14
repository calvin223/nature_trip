/* Procedural leaf geometry shared by the forest stage and the opening curtain.
   Everything is seeded, so server and client render identical markup. */

export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const f = (n: number) => n.toFixed(1);

/* A broad tropical leaf lying along the x-axis: stem at (0, h/2), tip at (len, h/2). */
export function broadLeaf(len: number, half: number, skew = 0) {
  const cy = half;
  const outline =
    `M0 ${f(cy)} C${f(len * 0.18)} ${f(cy - half * 1.05)} ${f(len * 0.7)} ${f(cy - half * (0.95 + skew))} ${f(len)} ${f(cy)} ` +
    `C${f(len * 0.7)} ${f(cy + half * (0.95 - skew))} ${f(len * 0.18)} ${f(cy + half * 1.05)} 0 ${f(cy)}Z`;
  const midrib = `M0 ${f(cy)} Q${f(len * 0.5)} ${f(cy - half * 0.08)} ${f(len * 0.97)} ${f(cy)}`;
  let veins = '';
  for (let t = 0.14; t < 0.88; t += 0.085) {
    const x = len * t;
    const w = half * Math.sin(Math.PI * Math.min(1, t * 1.08)) * 0.82;
    veins += `M${f(x)} ${f(cy)} Q${f(x + len * 0.05)} ${f(cy - w * 0.55)} ${f(x + len * 0.11)} ${f(cy - w)} `;
    veins += `M${f(x)} ${f(cy)} Q${f(x + len * 0.05)} ${f(cy + w * 0.55)} ${f(x + len * 0.11)} ${f(cy + w)} `;
  }
  return { outline, midrib, veins, w: len, h: half * 2 };
}

/* A fern frond: curved rachis with alternating leaflets that shrink towards the tip. */
export function frond(size: number, pairs: number, bend: number, rand: () => number) {
  const p0 = [size * 0.06, size * 0.94];
  const p1 = [size * (0.25 + bend), size * 0.25];
  const p2 = [size * 0.94, size * 0.08];
  const at = (t: number) => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
  ];
  const tan = (t: number) => {
    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  const rachis = `M${f(p0[0])} ${f(p0[1])} Q${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])}`;
  let leaflets = '';
  for (let i = 0; i < pairs; i++) {
    const t = 0.1 + (i / pairs) * 0.86;
    const [x, y] = at(t);
    const [tx, ty] = tan(t);
    const len = size * 0.2 * (1 - t * 0.78) * (0.85 + rand() * 0.3);
    const wid = len * 0.24;
    for (const side of [1, -1]) {
      // leaflet direction: perpendicular to rachis, swept forwards towards the tip
      const nx = -ty * side, ny = tx * side;
      const dx = nx * 0.8 + tx * 0.55, dy = ny * 0.8 + ty * 0.55;
      const l = Math.hypot(dx, dy);
      const ux = dx / l, uy = dy / l;
      const ex = x + ux * len, ey = y + uy * len;
      const px = -uy * wid, py = ux * wid;
      leaflets += `M${f(x)} ${f(y)} Q${f(x + ux * len * 0.5 + px)} ${f(y + uy * len * 0.5 + py)} ${f(ex)} ${f(ey)} Q${f(x + ux * len * 0.5 - px)} ${f(y + uy * len * 0.5 - py)} ${f(x)} ${f(y)}Z`;
    }
  }
  return { rachis, leaflets };
}
