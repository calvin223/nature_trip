import { broadLeaf, frond, seeded } from './forestShapes';

/* The fixed 3D forest behind every page: camouflage canopy, sun shafts, swaying leaves
   and fireflies. Three layers: perspective stage → scroll/pointer depth → idle hover.
   Pure markup; ForestFX drives --p / --px / --py and CSS does the rest. */

type LeafSpec = {
  kind: 'broad' | 'frond';
  left?: string; right?: string; top?: string; bottom?: string;
  size: number; rot: number; z: number; amp: number; dur: number; delay: number;
  tone: 0 | 1 | 2; near?: boolean; flip?: boolean;
};

const LEAVES: LeafSpec[] = [
  { kind: 'frond', left: '4%', top: '6%', size: 380, rot: 118, z: -120, amp: 3, dur: 11, delay: 0, tone: 1 },
  { kind: 'broad', left: '9%', top: '14%', size: 300, rot: 28, z: -40, amp: 5, dur: 8, delay: 1.2, tone: 2 },
  { kind: 'frond', right: '3%', top: '4%', size: 420, rot: 200, z: -80, amp: 3, dur: 12, delay: 0.6, tone: 0, flip: true },
  { kind: 'broad', right: '8%', top: '22%', size: 260, rot: 150, z: 20, amp: 6, dur: 9, delay: 2, tone: 1 },
  { kind: 'broad', left: '6%', bottom: '10%', size: 340, rot: -24, z: 40, amp: 4, dur: 10, delay: 0.4, tone: 0 },
  { kind: 'frond', left: '14%', bottom: '4%', size: 360, rot: -8, z: -160, amp: 3, dur: 13, delay: 1.8, tone: 2 },
  { kind: 'frond', right: '6%', bottom: '6%', size: 400, rot: -95, z: -20, amp: 4, dur: 11, delay: 2.6, tone: 1, flip: true },
  { kind: 'broad', right: '2%', bottom: '24%', size: 380, rot: 196, z: 140, amp: 3, dur: 12, delay: 0.9, tone: 0, near: true },
  { kind: 'broad', left: '1%', top: '44%', size: 420, rot: 8, z: 160, amp: 2.5, dur: 14, delay: 3, tone: 2, near: true },
];

const TONES = [
  ['#0b2a17', '#1f6b3a'],
  ['#0e3a1f', '#2f8f43'],
  ['#132f12', '#5f8f2a'],
] as const;

function Leaf({ spec, i }: { spec: LeafSpec; i: number }) {
  const [dark, light] = TONES[spec.tone];
  const id = `wdleaf${i}`;
  const style = {
    left: spec.left, right: spec.right, top: spec.top, bottom: spec.bottom,
    width: spec.size, height: spec.size,
    '--r': `${spec.rot}deg`, '--z': `${spec.z}px`, '--amp': `${spec.amp}deg`,
    '--dur': `${spec.dur}s`, '--delay': `-${spec.delay}s`,
    '--ox': spec.kind === 'broad' ? '0%' : '6%', '--oy': spec.kind === 'broad' ? '50%' : '94%',
  } as React.CSSProperties;

  if (spec.kind === 'broad') {
    const leaf = broadLeaf(spec.size, spec.size * 0.2, 0.08);
    return (
      <div className={`forest-leaf${spec.near ? ' forest-leaf--near' : ''}`} style={{ ...style, height: leaf.h }}>
        <svg width={leaf.w} height={leaf.h} viewBox={`0 0 ${leaf.w} ${leaf.h}`} style={{ overflow: 'visible', transform: spec.flip ? 'scaleY(-1)' : undefined }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={light} />
              <stop offset="1" stopColor={dark} />
            </linearGradient>
          </defs>
          <path d={leaf.outline} fill={`url(#${id})`} stroke="rgba(200,232,107,0.28)" strokeWidth="1.2" />
          <path d={leaf.midrib} fill="none" stroke="rgba(200,232,107,0.35)" strokeWidth="1.6" />
          <path d={leaf.veins} fill="none" stroke="rgba(200,232,107,0.16)" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  const fr = frond(spec.size, 13, spec.flip ? -0.08 : 0.06, seeded(1000 + i * 77));
  return (
    <div className={`forest-leaf${spec.near ? ' forest-leaf--near' : ''}`} style={style}>
      <svg width={spec.size} height={spec.size} viewBox={`0 0 ${spec.size} ${spec.size}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={dark} />
            <stop offset="1" stopColor={light} />
          </linearGradient>
        </defs>
        <path d={fr.leaflets} fill={`url(#${id})`} stroke="rgba(200,232,107,0.22)" strokeWidth="0.8" />
        <path d={fr.rachis} fill="none" stroke="rgba(200,232,107,0.4)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const rand = seeded(424242);
const FIREFLIES = Array.from({ length: 24 }, () => ({
  left: `${8 + rand() * 84}%`,
  top: `${10 + rand() * 80}%`,
  s: 3 + rand() * 4,
  z: Math.round(-120 + rand() * 260),
  dur: 12 + rand() * 14,
  blink: 2.6 + rand() * 3,
  delay: -(rand() * 20),
  d: Array.from({ length: 6 }, () => Math.round(-70 + rand() * 140)),
}));

export default function ForestStage() {
  return (
    <div className="forest-stage" aria-hidden="true">
      <div className="forest-depth">
        <div className="forest-float">
          <div className="forest-camo" />
          <div className="forest-shafts" />
          <div className="forest-leaves">
            {LEAVES.map((spec, i) => (
              <Leaf key={i} spec={spec} i={i} />
            ))}
          </div>
          {FIREFLIES.map((ff, i) => (
            <span
              key={i}
              className="firefly"
              style={{
                left: ff.left, top: ff.top,
                '--s': `${ff.s.toFixed(1)}px`, '--z': `${ff.z}px`,
                '--dur': `${ff.dur.toFixed(1)}s`, '--blink': `${ff.blink.toFixed(1)}s`, '--delay': `${ff.delay.toFixed(1)}s`,
                '--dx1': `${ff.d[0]}px`, '--dy1': `${ff.d[1]}px`, '--dx2': `${ff.d[2]}px`,
                '--dy2': `${ff.d[3]}px`, '--dx3': `${ff.d[4]}px`, '--dy3': `${ff.d[5]}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="forest-scrim" />
    </div>
  );
}
