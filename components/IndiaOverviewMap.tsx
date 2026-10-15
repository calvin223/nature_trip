import { useLocale, useTranslations } from 'next-intl';
import { overlayEntry } from '@/i18n/content';
import { Link } from '@/i18n/navigation';
import overviewGeo from '@/lib/geo/india-overview.json';
import { mapSignature, overviewMap, tripMaps, type OverviewRegion, type TripMapId } from '@/lib/mapData';
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
 * Accessibility: the SVG is hidden from assistive technology and described in text beside it; its
 * region links are a pointer convenience (an image role may not contain links). The page around it carries the real,
 * focusable links (About's region list, the trip cards on /trips/).
 *
 * Text: `maps` messages; each region's on-map label can be translated in
 * content/<locale>/places.json by trip id (`label`).
 */

const geo = overviewGeo as OverviewGeo;
const UID = 'wdm-india-overview';

const href = (id: TripMapId) => `/trips/${id}/`;

export default function IndiaOverviewMap() {
  const t = useTranslations('maps.overview');
  const locale = useLocale();
  if (geo.version !== GEO_VERSION || geo.signature !== mapSignature(overviewMap)) throw staleError('india-overview');
  for (const r of overviewMap.regions) {
    if (!geo.regions[r.tripId] || !tripMaps[r.tripId]) throw staleError('india-overview');
  }
  const label = (r: OverviewRegion) => overlayEntry<OverviewRegion>(locale, 'places', r.tripId)?.label ?? r.label;

  return (
    <figure className="m-0" style={cssVars({ '--wdm-ar': geo.width / geo.height })}>
      <MapStyles />
      <div className="wdm">
        <p className="sr-only">{t('ariaLabel')}</p>
        <svg className="wdm-svg" viewBox={`0 0 ${geo.width} ${geo.height}`} aria-hidden="true">
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
            return (
              <Link
                key={r.tripId}
                href={href(r.tripId)}
                tabIndex={-1}
                aria-hidden="true"
                className="wdm-ov-link"
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
                          {label(r)[0]}
                        </text>
                        <text className="wdm-ov-lbl" x={g.label.x} y={g.label.y + lineGap} dy="0.35em" textAnchor={g.label.anchor}>
                          {label(r)[1]}
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
        <Attribution>{t('note')}</Attribution>
      </figcaption>
    </figure>
  );
}
