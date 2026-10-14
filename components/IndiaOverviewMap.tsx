import Link from 'next/link';
import overviewGeo from '@/lib/geo/india-overview.json';
import { mapSignature, overviewMap, tripMaps, type TripMapId } from '@/lib/mapData';
import {
  Attribution,
  BaseLayers,
  Cities,
  GEO_VERSION,
  Layouts,
  MapStyles,
  ScaleBar,
  SoftFilter,
  cssVars,
  staleError,
  type OverviewGeo,
} from './map/shared';

/*
 * IndiaOverviewMap: India (Natural Earth, India point-of-view boundaries) with the four trip
 * regions, each linking to its trip page. Static inline SVG (server component).
 *
 * Accessibility: the SVG is one image (role="img"); its region links are a pointer
 * convenience hidden from assistive technology. The visible list under the map carries the
 * real, focusable links.
 */

const geo = overviewGeo as OverviewGeo;
const UID = 'wdm-india-overview';

export interface IndiaOverviewMapProps {
  /** Classes for the outer wrapper (width, margins). The map fills the wrapper's width. */
  className?: string;
  /** Emphasise one trip and dim the others (e.g. on that trip's page). */
  highlight?: TripMapId;
  /** Show the list of trip links under the map. Default true. */
  showLegend?: boolean;
}

const href = (id: TripMapId) => `/trips/${id}/`;

export default function IndiaOverviewMap({ className, highlight, showLegend = true }: IndiaOverviewMapProps) {
  if (geo.version !== GEO_VERSION || geo.signature !== mapSignature(overviewMap)) throw staleError('india-overview');
  for (const r of overviewMap.regions) {
    if (!geo.regions[r.tripId] || !tripMaps[r.tripId]) throw staleError('india-overview');
  }

  return (
    <figure className={['m-0', className].filter(Boolean).join(' ')}>
      <MapStyles />
      <div className="wdm">
        <svg className="wdm-svg" viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label={overviewMap.ariaLabel}>
          <defs>
            <SoftFilter id={`${UID}-soft`} blur={5} width={geo.width} height={geo.height} />
            <SoftFilter id={`${UID}-diffuse`} blur={11} width={geo.width} height={geo.height} />
          </defs>
          <BaseLayers geo={geo} />
          <Layouts geo={geo}>{(layout) => <Cities geo={geo} layout={layout} />}</Layouts>
          {overviewMap.regions.map((r) => {
            const g = geo.regions[r.tripId];
            const def = tripMaps[r.tripId];
            const diffuse = def.kind === 'region' && def.region.kind === 'ellipse';
            const dim = highlight && highlight !== r.tripId;
            return (
              <Link
                key={r.tripId}
                href={href(r.tripId)}
                tabIndex={-1}
                aria-hidden="true"
                className={['wdm-ov-link', dim ? 'wdm-ov-dim' : ''].filter(Boolean).join(' ')}
                data-active={highlight === r.tripId ? '' : undefined}
                style={cssVars({ '--wdm-accent': r.colour })}
              >
                {g.shape && (
                  <>
                    <path className="wdm-halo" d={g.shape} filter={`url(#${UID}-${diffuse ? 'diffuse' : 'soft'})`} />
                    {!diffuse && <path className="wdm-halo-core" d={g.shape} />}
                  </>
                )}
                {g.route && (
                  <>
                    <path className="wdm-ov-routehalo" d={g.route} filter={`url(#${UID}-soft)`} />
                    <path className="wdm-ov-route" d={g.route} />
                  </>
                )}
                <Layouts geo={geo}>
                  {(layout) => {
                    const leader = g.leader?.[layout];
                    const lineGap = 1.25 * geo.fonts[layout].overview;
                    return (
                      <>
                        {leader && <line className="wdm-ov-leader" x1={leader[0]} y1={leader[1]} x2={leader[2]} y2={leader[3]} />}
                        <text className="wdm-ov-lbl" x={g.label.x} y={g.label.y} dy="0.35em" textAnchor={g.label.anchor}>
                          {r.label[0]}
                        </text>
                        <text className="wdm-ov-lbl" x={g.label.x} y={g.label.y + lineGap} dy="0.35em" textAnchor={g.label.anchor}>
                          {r.label[1]}
                        </text>
                      </>
                    );
                  }}
                </Layouts>
              </Link>
            );
          })}
          <Layouts geo={geo}>{() => <ScaleBar scale={geo.scale} />}</Layouts>
        </svg>
      </div>
      <figcaption>
        {showLegend && (
          <ul aria-label="Trip regions" className="mt-4 grid list-none gap-2 p-0 text-sm sm:grid-cols-2">
            {overviewMap.regions.map((r) => (
              <li key={r.tripId}>
                <Link
                  href={href(r.tripId)}
                  aria-current={highlight === r.tripId ? 'page' : undefined}
                  className="group inline-flex items-center gap-2.5 rounded-md py-1 pr-2 text-[color:var(--wd-ink,#eaf3e3)] hover:text-[color:var(--wd-lime,#9ad14b)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--wd-lime,#9ad14b)]"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ background: r.colour, boxShadow: `0 0 0 3px color-mix(in srgb, ${r.colour} 30%, transparent)` }}
                  />
                  <span className="font-medium underline-offset-4 group-hover:underline">{r.linkText}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Attribution>Shaded areas are approximate; exact parks and bases are set at booking.</Attribution>
      </figcaption>
    </figure>
  );
}
