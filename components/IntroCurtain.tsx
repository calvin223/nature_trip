import LeafMark from './LeafMark';
import { broadLeaf, seeded } from './forestShapes';

/* Opening titles: two camouflage canopy doors carrying the WILDORA wordmark swing apart
   in 3D along a glowing seam to reveal the site.

   The curtain is painted by CSS from the first frame so the page never flashes before it.
   INTRO_SCRIPT (inlined in <head> by layout.tsx) decides before paint whether to play it:
   it is skipped for return visits in the same session, reduced motion and ?nointro.
   Each door holds its own copy of the mark, clipped at the seam, so the two read as one
   until they part. */

const rand = seeded(9071);
/* Leafy fringe on the left door's inner edge: irregular, dark, overlapping leaves of mixed size,
   kept clear of the wordmark band so the seam glow reads through the name. */
const FRINGE = Array.from({ length: 22 }, () => {
  let y = rand() * 1000;
  if (y > 330 && y < 670) y = y < 500 ? 330 - rand() * 90 : 670 + rand() * 90;
  const len = 55 + rand() * 105;
  const leaf = broadLeaf(len, len * (0.16 + rand() * 0.1), 0.05);
  const tones = ['#0b2f19', '#11432a', '#175a31', '#1f6b3a'];
  return { y, x: 28 + rand() * 34, rot: -62 + rand() * 124, leaf, tone: tones[Math.floor(rand() * tones.length)] };
}).sort((a, b) => a.leaf.w - b.leaf.w);

function Mark() {
  return (
    <div className="wd-intro-mark">
      <LeafMark className="wd-intro-glyph" id="wdintro" />
      <span className="wd-intro-word">WILDORA</span>
      <span className="wd-intro-rule" />
      <span className="wd-intro-tag">Expeditions · Western Ghats</span>
    </div>
  );
}

export default function IntroCurtain() {
  return (
    <div className="wd-intro" aria-hidden="true" role="presentation" data-intro>
      <div className="wd-intro-half wd-intro-left" style={{ zIndex: 2 }}>
        <div className="wd-intro-panel">
          <Mark />
        </div>
        <div className="wd-intro-fringe">
          <svg viewBox="0 0 140 1000" preserveAspectRatio="xMinYMid slice" style={{ overflow: 'visible' }}>
            {FRINGE.map((l, i) => (
              <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)})`}>
                <path d={l.leaf.outline} transform={`translate(0 ${(-l.leaf.h / 2).toFixed(1)})`} fill={l.tone} stroke="rgba(200,232,107,0.22)" strokeWidth="0.8" />
                <path d={l.leaf.midrib} transform={`translate(0 ${(-l.leaf.h / 2).toFixed(1)})`} fill="none" stroke="rgba(200,232,107,0.18)" strokeWidth="0.8" />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="wd-intro-half wd-intro-right" style={{ zIndex: 1 }}>
        <div className="wd-intro-panel">
          <Mark />
        </div>
      </div>
      <span className="wd-intro-seam" />
      <span className="wd-intro-skipbtn">Skip</span>
    </div>
  );
}

/* Runs in <head> before first paint. Plain ES5 so it never waits on the JS bundle. */
export const INTRO_SCRIPT = `(function(){
var d=document.documentElement;
d.classList.add('js');
var skip=false;
try{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||/[?&]nointro/.test(location.search))skip=true;
  else if(sessionStorage.getItem('wd-intro')==='1')skip=true;
  else sessionStorage.setItem('wd-intro','1');
}catch(e){}
if(skip){d.classList.add('wd-intro-skip');return;}
d.classList.add('wd-intro-lock');
var opened=false;
function open(){
  if(opened)return;opened=true;
  d.classList.add('wd-intro-open','wd-intro-revealing');
  setTimeout(function(){d.classList.add('wd-intro-done');d.classList.remove('wd-intro-lock');},1050);
  setTimeout(function(){d.classList.remove('wd-intro-revealing');},2100);
}
requestAnimationFrame(function(){setTimeout(function(){d.classList.add('wd-intro-in');},80);});
var t=setTimeout(open,2300);
function early(){clearTimeout(t);open();}
addEventListener('pointerdown',early,{once:true});
addEventListener('keydown',early,{once:true});
addEventListener('wheel',early,{once:true,passive:true});
addEventListener('touchmove',early,{once:true,passive:true});
})();`;
