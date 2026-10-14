import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { localize, overlayEntry } from '@/i18n/content';
import centralIndiaGeo from '@/lib/geo/central-india-big-cats.json';
import himalayaGeo from '@/lib/geo/himalaya-birds-mountain-wildlife.json';
import monsoonGeo from '@/lib/geo/monsoon-rainforest-nights.json';
import endemicsGeo from '@/lib/geo/western-ghats-endemics.json';
import {
  mapSignature,
  osmUrl,
  tripMaps,
  type MapGateway,
  type MapStop,
  type RegionMapDef,
  type RouteMapDef,
  type TripMapId,
} from '@/lib/mapData';
import MapEnhancer from './map/MapEnhancer';
import {
  Attribution,
  BaseLayers,
  Cities,
  Halo,
  Label,
  MapStyles,
  ScaleBar,
  SoftFilter,
  cssVars,
  GEO_VERSION,
  Layouts,
  staleError,
  type LayoutName,
  type RegionGeo,
  type RouteGeo,
} from './map/shared';

/*
 * TripMap: one trip's map as static inline SVG (server component).
 * Copyright-clean: Natural Earth geometry (public domain), India point-of-view boundaries,
 * coordinates from Wikipedia/OSM facts. No tiles, no third-party requests.
 * Render it from a server component (e.g. the trip page) so the geometry stays out of the
 * client bundle; only the small MapEnhancer is shipped as JavaScript. Its text comes from the
 * `maps` messages and, for place names, from the content overlay (see lib/mapData.ts); all of it
 * is rendered on the server, so no ClientMessages wrapper is needed.
 */

const GEO: Record<TripMapId, RouteGeo | RegionGeo> = {
  'western-ghats-endemics': endemicsGeo as RouteGeo,
  'monsoon-rainforest-nights': monsoonGeo as RegionGeo,
  'central-india-big-cats': centralIndiaGeo as RegionGeo,
  'himalaya-birds-mountain-wildlife': himalayaGeo as RegionGeo,
};

const REGION_ACCENT: Record<TripMapId, string> = {
  'western-ghats-endemics': 'var(--wd-lime, #9ad14b)',
  'monsoon-rainforest-nights': 'var(--wd-fern, #3fa34d)',
  'central-india-big-cats': 'var(--wd-sun, #f2b134)',
  'himalaya-birds-mountain-wildlife': 'var(--wd-sand, #efe6c8)',
};

/** Route draw-in duration, seconds. */
const DRAW_SECONDS = 2.8;

export interface TripMapProps {
  tripId: TripMapId;
  /** Classes for the outer wrapper (width, margins). The map fills the wrapper's width. */
  className?: string;
  /** Show the visible stop list with OpenStreetMap links under route maps. Default true. */
  showStopList?: boolean;
}

export default function TripMap({ tripId, className, showStopList = true }: TripMapProps) {
  const def = tripMaps[tripId];
  const geo = GEO[tripId];
  if (!def || !geo) throw new Error(`TripMap: no map is defined for trip "${tripId}"`);
  if (geo.version !== GEO_VERSION || geo.signature !== mapSignature(def) || geo.kind !== def.kind) throw staleError(tripId);
  return def.kind === 'route' ? (
    <RouteMap def={def} geo={geo as RouteGeo} className={className} showStopList={showStopList} />
  ) : (
    <RegionMap def={def} geo={geo as RegionGeo} className={className} />
  );
}

// ---------------------------------------------------------------------------------------------

function RouteMap({
  def,
  geo,
  className,
  showStopList,
}: {
  def: RouteMapDef;
  geo: RouteGeo;
  className?: string;
  showStopList: boolean;
}) {
  const t = useTranslations('maps');
  const locale = useLocale();
  const uid = `wdm-${def.id}`;
  const stops = localize(locale, 'places', def.stops, (s) => s.id);
  const gateways = localize(locale, 'places', def.gateways, (g) => g.id);
  const stopById = new Map(stops.map((s) => [s.id, s]));
  const arrivals = gateways.filter((g) => g.role === 'arrival');
  const departures = gateways.filter((g) => g.role === 'departure');
  /* 'Days 1–2' / 'Day 3', and the second tooltip line, e.g. 'Days 1–2 · Overnight Thattekad (2 nights)'. */
  const dayLabel = (days: string) => t(/[–-]/.test(days) ? 'route.days' : 'route.day', { days });
  const detail = (s: MapStop) => (s.days ? t('route.stopDetail', { days: dayLabel(s.days), stay: s.stay }) : s.stay);
  const gatewayText = (g: MapGateway) =>
    t(g.role === 'arrival' ? 'route.srArrival' : 'route.srDeparture', { name: g.name, stop: stopById.get(g.connectsTo)?.name ?? g.connectsTo });
  const pos = (id: string) => {
    const p = geo.stops[id];
    if (!p) throw staleError(def.id);
    return p;
  };
  const gwPos = (id: string) => {
    const p = geo.gateways[id];
    if (!p) throw staleError(def.id);
    return p;
  };

  return (
    <figure className={['m-0', className].filter(Boolean).join(' ')} style={cssVars({ '--wdm-ar': geo.width / geo.height })}>
      <MapStyles />
      <MapEnhancer className="wdm wdm-routemap">
        <svg
          className="wdm-svg"
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          role="img"
          aria-label={t(`trips.${def.id}.ariaLabel`)}
          aria-describedby={`${uid}-stops`}
          style={cssVars({ '--wdm-dur': `${DRAW_SECONDS}s` })}
        >
          <defs>
            <SoftFilter id={`${uid}-ghats`} blur={9} width={geo.width} height={geo.height} />
          </defs>
          <BaseLayers geo={geo} ghats={geo.ghats} ghatsFilterId={`${uid}-ghats`} />
          <Layouts geo={geo}>{(layout) => <Cities geo={geo} layout={layout} />}</Layouts>

          {/* Transfers to and from gateways, day-trip spurs, then the main route. */}
          <g aria-hidden="true">
            {geo.legs.map((leg) => {
              const g = gateways.find((x) => x.id === leg.id);
              const delay = g?.role === 'arrival' ? 0 : 1;
              return <path key={leg.id} className="wdm-leg wdm-pop" d={leg.d} style={cssVars({ '--d': delay })} />;
            })}
            {geo.spurs.map((s) => (
              <path key={s.id} className="wdm-spur wdm-pop" d={s.d} style={cssVars({ '--d': pos(s.id).delay })} />
            ))}
            <path
              className="wdm-route wdm-route-glow"
              d={geo.route.d}
              style={cssVars({ '--wdm-len': geo.route.length })}
            />
            <path
              className="wdm-route wdm-route-line"
              d={geo.route.d}
              style={cssVars({ '--wdm-len': geo.route.length })}
            />
          </g>

          {/* Gateways: a diamond on the map, or an arrow at the edge when off-map. */}
          <Layouts geo={geo}>
            {(layout) => (
              <g aria-hidden="true">
                {gateways.map((g) => {
                  const p = gwPos(g.id);
                  const k = layout === 'sm' ? 1.22 : 1;
                  return (
                    <g key={g.id} className="wdm-pop" style={cssVars({ '--d': g.role === 'arrival' ? 0 : 1 })}>
                      {p.offMap ? (
                        <path
                          className="wdm-gw"
                          d="M8,0 L-6,-6.5 L-3,0 L-6,6.5 Z"
                          transform={`translate(${p.x} ${p.y}) rotate(${p.angle ?? 0}) scale(${k})`}
                        />
                      ) : (
                        <rect
                          className="wdm-gw"
                          x={-5.5}
                          y={-5.5}
                          width={11}
                          height={11}
                          transform={`translate(${p.x} ${p.y}) rotate(45) scale(${k})`}
                        />
                      )}
                      <Label label={p[layout]} text={g.label} className="wdm-lbl-gw" />
                    </g>
                  );
                })}
              </g>
            )}
          </Layouts>

          {/* Stops, scale bar, then tooltips last so they sit above everything (MapEnhancer shows them). */}
          <Layouts geo={geo}>
            {(layout) => (
              <>
                <g>
                  {stops.map((s) => (
                    <StopMarker key={s.id} stop={s} p={pos(s.id)} layout={layout} />
                  ))}
                </g>
                <ScaleBar scale={geo.scale} />
                <g aria-hidden="true">
                  {stops.map((s) => {
                    const tip = pos(s.id)[layout].tip;
                    return (
                      <g key={s.id} className="wdm-tip" data-tip={s.id} transform={`translate(${tip.x} ${tip.y})`}>
                        <rect className="wdm-tip-box" width={tip.w} height={tip.h} rx={9} />
                        <text className="wdm-tip-t" x={tip.pad} y={tip.t1}>
                          {s.name}
                        </text>
                        <text className="wdm-tip-b" x={tip.pad} y={tip.t2}>
                          {detail(s)}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </>
            )}
          </Layouts>
        </svg>

        {/* Text alternative: the stops in itinerary order. */}
        <ol id={`${uid}-stops`} className="sr-only">
          {arrivals.map((g) => (
            <li key={g.id}>{gatewayText(g)}</li>
          ))}
          {stops.map((s) => (
            <li key={s.id}>
              {s.days
                ? t('route.srStop', { days: dayLabel(s.days), name: s.name, stay: s.stay })
                : t('route.srBase', { name: s.name, stay: s.stay })}
            </li>
          ))}
          {departures.map((g) => (
            <li key={g.id}>{gatewayText(g)}</li>
          ))}
        </ol>

        {showStopList && (
          <StopList stops={stops} gateways={gateways} detail={detail} />
        )}
        <MapKey />
      </MapEnhancer>
      <figcaption>
        <Attribution>{t(`trips.${def.id}.note`)}</Attribution>
      </figcaption>
    </figure>
  );
}

function StopMarker({ stop, p, layout }: { stop: MapStop; p: RouteGeo['stops'][string]; layout: LayoutName }) {
  const { w, h, label } = p[layout];
  const r = h / 2;
  const ring = layout === 'sm' ? 4.3 : 3.5;
  return (
    <g className="wdm-stop wdm-pop" data-stop={stop.id} style={cssVars({ '--d': p.delay })} aria-hidden="true">
      {stop.days ? (
        <>
          {stop.overnight && (
            <rect className="wdm-ring" x={p.x - w / 2 - ring} y={p.y - r - ring} width={w + 2 * ring} height={h + 2 * ring} rx={r + ring} />
          )}
          <rect className="wdm-pill" x={p.x - w / 2} y={p.y - r} width={w} height={h} rx={r} />
          <text className="wdm-pill-txt" x={p.x} y={p.y} dy="0.36em" textAnchor="middle">
            {stop.days}
          </text>
        </>
      ) : (
        <>
          {stop.overnight && <circle className="wdm-ring" cx={p.x} cy={p.y} r={r + ring} />}
          <circle className="wdm-base" cx={p.x} cy={p.y} r={r} />
          {/* crescent: an overnight base */}
          <path
            className="wdm-moon"
            transform={`translate(${p.x} ${p.y}) scale(${r / 9})`}
            d="M1.6,-4.7 A5,5 0 1 0 1.6,4.7 A3.9,3.9 0 1 1 1.6,-4.7 Z"
          />
        </>
      )}
      <Label label={label} text={stop.label} className="wdm-lbl" />
    </g>
  );
}

function StopList({ stops, gateways, detail }: { stops: MapStop[]; gateways: MapGateway[]; detail: (s: MapStop) => string }) {
  const t = useTranslations('maps');
  const rows: { id: string; chip: ReactNode; name: string; detail: string; lat: number; lon: number; kind: 'stop' | 'base' | 'gateway' }[] = [
    ...gateways
      .filter((g) => g.role === 'arrival')
      .map((g) => ({ id: g.id, chip: <PlaneIcon />, name: g.name, detail: t('route.arrival'), lat: g.lat, lon: g.lon, kind: 'gateway' as const })),
    ...stops.map((s) => ({
      id: s.id,
      chip: s.days || <MoonIcon />,
      name: s.name,
      detail: detail(s),
      lat: s.lat,
      lon: s.lon,
      kind: s.days ? ('stop' as const) : ('base' as const),
    })),
    ...gateways
      .filter((g) => g.role === 'departure')
      .map((g) => ({ id: g.id, chip: <PlaneIcon />, name: g.name, detail: t('route.departureOption'), lat: g.lat, lon: g.lon, kind: 'gateway' as const })),
  ];
  return (
    <ul
      aria-label={t('stopList.label')}
      className="wdm-stops mt-4 grid list-none gap-x-6 gap-y-2.5 p-0 text-sm sm:grid-cols-2"
    >
      {rows.map((row) => (
        <li
          key={row.id}
          data-stop={row.kind === 'gateway' ? undefined : row.id}
          className="flex items-start gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-[color:var(--wd-forest,#134e2e)]/40 focus-within:bg-[color:var(--wd-forest,#134e2e)]/40"
        >
          <span
            aria-hidden="true"
            className={[
              'mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold',
              row.kind === 'stop'
                ? 'bg-[color:var(--wd-sun,#f2b134)] text-[color:var(--wd-night,#07140d)]'
                : row.kind === 'base'
                  ? 'border-2 border-[color:var(--wd-sun,#f2b134)] bg-[color:var(--wd-night,#07140d)] text-[color:var(--wd-sun,#f2b134)]'
                  : 'bg-[color:var(--wd-sand,#efe6c8)] text-[color:var(--wd-night,#07140d)]',
            ].join(' ')}
          >
            {row.chip}
          </span>
          <span className="min-w-0 flex-1">
            <span aria-hidden="true" className="block font-semibold text-[color:var(--wd-ink,#eaf3e3)]">
              {row.name}
            </span>
            <span aria-hidden="true" className="block text-xs text-[color:var(--wd-ink,#eaf3e3)]/70">
              {row.detail}
            </span>
            <a
              href={osmUrl(row.lat, row.lon)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('stopList.openLabel', { name: row.name })}
              className="text-xs font-medium text-[color:var(--wd-lime,#9ad14b)] underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--wd-lime,#9ad14b)]"
            >
              {t('stopList.open')}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Drawn to match the map: a plane for airports, the map's crescent for an overnight base. */
function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="-6 -6 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <path d="M1.6,-4.7 A5,5 0 1 0 1.6,4.7 A3.9,3.9 0 1 1 1.6,-4.7 Z" />
    </svg>
  );
}

function MapKey() {
  const t = useTranslations('maps.key');
  const item = 'inline-flex items-center gap-1.5';
  return (
    <ul
      aria-label={t('label')}
      className="wdm-key mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-xs text-[color:var(--wd-ink,#eaf3e3)]/80"
    >
      <li className={item}>
        <svg aria-hidden="true" width="22" height="14" viewBox="0 0 22 14">
          <rect x="1" y="1" width="20" height="12" rx="6" fill="var(--wd-sun, #f2b134)" />
        </svg>
        {t('dayNumber')}
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="24" height="16" viewBox="0 0 24 16">
          <rect x="1.5" y="1.5" width="21" height="13" rx="6.5" fill="none" stroke="var(--wd-lime, #9ad14b)" strokeWidth="1.6" />
          <rect x="4" y="4" width="16" height="8" rx="4" fill="var(--wd-sun, #f2b134)" />
        </svg>
        {t('overnight')}
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-route" strokeWidth="3" strokeLinecap="round" />
        </svg>
        {t('route')}
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-route" strokeWidth="2.4" strokeDasharray=".5 5" strokeLinecap="round" />
        </svg>
        {t('dayTrip')}
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-leg" strokeWidth="1.8" strokeDasharray="5 4" />
        </svg>
        {t('transfer')}
      </li>
    </ul>
  );
}

// ---------------------------------------------------------------------------------------------

function RegionMap({ def, geo, className }: { def: RegionMapDef; geo: RegionGeo; className?: string }) {
  const t = useTranslations('maps');
  const locale = useLocale();
  const uid = `wdm-${def.id}`;
  const accent = REGION_ACCENT[def.id];
  const regionLabel = overlayEntry<RegionMapDef>(locale, 'places', def.id)?.regionLabel ?? def.regionLabel;
  const { regionLabel: rl } = geo;
  const diffuse = def.region.kind === 'ellipse';
  return (
    <figure className={['m-0', className].filter(Boolean).join(' ')} style={cssVars({ '--wdm-ar': geo.width / geo.height })}>
      <MapStyles />
      <div className="wdm">
        <svg className="wdm-svg" viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label={t(`trips.${def.id}.ariaLabel`)}>
          <defs>
            <SoftFilter id={`${uid}-soft`} blur={diffuse ? 22 : 9} width={geo.width} height={geo.height} />
          </defs>
          <BaseLayers geo={geo} ghats={geo.ghats} ghatsFilterId={`${uid}-soft`} />
          <Halo d={geo.region} filterId={`${uid}-soft`} accent={accent} diffuse={diffuse} />
          <Layouts geo={geo}>
            {(layout) => {
              const f = geo.fonts[layout];
              return (
                <>
                  <Cities geo={geo} layout={layout} />
                  <g aria-hidden="true" style={cssVars({ '--wdm-accent': accent })}>
                    <text className="wdm-rl1" x={rl.x} y={rl.y} dy="0.35em" textAnchor={rl.anchor}>
                      {regionLabel[0]}
                    </text>
                    <text
                      className="wdm-rl2"
                      x={rl.x}
                      y={rl.y + 0.625 * (f.regionTitle + f.regionSub)}
                      dy="0.35em"
                      textAnchor={rl.anchor}
                    >
                      {regionLabel[1]}
                    </text>
                  </g>
                  <ScaleBar scale={geo.scale} />
                </>
              );
            }}
          </Layouts>
        </svg>
      </div>
      <figcaption>
        <Attribution>{t(`trips.${def.id}.note`)}</Attribution>
      </figcaption>
    </figure>
  );
}
