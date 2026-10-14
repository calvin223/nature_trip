import centralIndiaGeo from '@/lib/geo/central-india-big-cats.json';
import himalayaGeo from '@/lib/geo/himalaya-birds-mountain-wildlife.json';
import monsoonGeo from '@/lib/geo/monsoon-rainforest-nights.json';
import endemicsGeo from '@/lib/geo/western-ghats-endemics.json';
import {
  mapSignature,
  osmUrl,
  stopDays,
  stopDetail,
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
 * client bundle; only the small MapEnhancer is shipped as JavaScript.
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
  const uid = `wdm-${def.id}`;
  const stopById = new Map(def.stops.map((s) => [s.id, s]));
  const arrivals = def.gateways.filter((g) => g.role === 'arrival');
  const departures = def.gateways.filter((g) => g.role === 'departure');
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
    <figure className={['m-0', className].filter(Boolean).join(' ')}>
      <MapStyles />
      <MapEnhancer className="wdm">
        <svg
          className="wdm-svg"
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          role="img"
          aria-label={def.ariaLabel}
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
              const g = def.gateways.find((x) => x.id === leg.id);
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
                {def.gateways.map((g) => {
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
                  {def.stops.map((s) => (
                    <StopMarker key={s.id} stop={s} p={pos(s.id)} layout={layout} />
                  ))}
                </g>
                <ScaleBar scale={geo.scale} />
                <g aria-hidden="true">
                  {def.stops.map((s) => {
                    const t = pos(s.id)[layout].tip;
                    return (
                      <g key={s.id} className="wdm-tip" data-tip={s.id} transform={`translate(${t.x} ${t.y})`}>
                        <rect className="wdm-tip-box" width={t.w} height={t.h} rx={9} />
                        <text className="wdm-tip-t" x={t.pad} y={t.t1}>
                          {s.name}
                        </text>
                        <text className="wdm-tip-b" x={t.pad} y={t.t2}>
                          {stopDetail(s)}
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
            <li key={g.id}>{gatewayText(g, stopById)}</li>
          ))}
          {def.stops.map((s) => (
            <li key={s.id}>
              {s.days ? `${stopDays(s)}: ` : ''}
              {s.name}. {s.stay}.
            </li>
          ))}
          {departures.map((g) => (
            <li key={g.id}>{gatewayText(g, stopById)}</li>
          ))}
        </ol>

        {showStopList && (
          <StopList def={def} />
        )}
      </MapEnhancer>
      <figcaption>
        <MapKey />
        <Attribution>
          {`Straight lines show the order of travel, not roads.${def.shadeWesternGhats ? ' Shaded band: the Western Ghats.' : ''}`}
        </Attribution>
      </figcaption>
    </figure>
  );
}

function gatewayText(g: MapGateway, stops: Map<string, MapStop>) {
  const stop = stops.get(g.connectsTo);
  const role = g.role === 'arrival' ? 'Arrival' : 'Departure option';
  return `${role}: ${g.name}, ${g.role === 'arrival' ? 'to' : 'from'} ${stop?.name ?? g.connectsTo}.`;
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

function StopList({ def }: { def: RouteMapDef }) {
  const rows: { id: string; chip: string; name: string; detail: string; lat: number; lon: number; kind: 'stop' | 'base' | 'gateway' }[] = [
    ...def.gateways
      .filter((g) => g.role === 'arrival')
      .map((g) => ({ id: g.id, chip: '✈', name: g.name, detail: 'Arrival', lat: g.lat, lon: g.lon, kind: 'gateway' as const })),
    ...def.stops.map((s) => ({
      id: s.id,
      chip: s.days || '☾',
      name: s.name,
      detail: s.days ? stopDetail(s) : s.stay,
      lat: s.lat,
      lon: s.lon,
      kind: s.days ? ('stop' as const) : ('base' as const),
    })),
    ...def.gateways
      .filter((g) => g.role === 'departure')
      .map((g) => ({ id: g.id, chip: '✈', name: g.name, detail: 'Departure option', lat: g.lat, lon: g.lon, kind: 'gateway' as const })),
  ];
  return (
    <ul
      aria-label="Stops on OpenStreetMap"
      className="mt-4 grid list-none gap-x-6 gap-y-2.5 p-0 text-sm sm:grid-cols-2"
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
              aria-label={`Open ${row.name} in OpenStreetMap (opens in a new tab)`}
              className="text-xs font-medium text-[color:var(--wd-lime,#9ad14b)] underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--wd-lime,#9ad14b)]"
            >
              Open in OpenStreetMap ↗
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

function MapKey() {
  const item = 'inline-flex items-center gap-1.5';
  return (
    <ul
      aria-label="Map key"
      className="mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-xs text-[color:var(--wd-ink,#eaf3e3)]/80"
    >
      <li className={item}>
        <svg aria-hidden="true" width="22" height="14" viewBox="0 0 22 14">
          <rect x="1" y="1" width="20" height="12" rx="6" fill="var(--wd-sun, #f2b134)" />
        </svg>
        Day number
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="24" height="16" viewBox="0 0 24 16">
          <rect x="1.5" y="1.5" width="21" height="13" rx="6.5" fill="none" stroke="var(--wd-lime, #9ad14b)" strokeWidth="1.6" />
          <rect x="4" y="4" width="16" height="8" rx="4" fill="var(--wd-sun, #f2b134)" />
        </svg>
        Overnight
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-route" strokeWidth="3" strokeLinecap="round" />
        </svg>
        Route
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-route" strokeWidth="2.4" strokeDasharray=".5 5" strokeLinecap="round" />
        </svg>
        Day trip
      </li>
      <li className={item}>
        <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
          <line x1="2" y1="5" x2="26" y2="5" className="wdm-key-leg" strokeWidth="1.8" strokeDasharray="5 4" />
        </svg>
        Transfer
      </li>
    </ul>
  );
}

// ---------------------------------------------------------------------------------------------

function RegionMap({ def, geo, className }: { def: RegionMapDef; geo: RegionGeo; className?: string }) {
  const uid = `wdm-${def.id}`;
  const accent = REGION_ACCENT[def.id];
  const { regionLabel: rl } = geo;
  const diffuse = def.region.kind === 'ellipse';
  return (
    <figure className={['m-0', className].filter(Boolean).join(' ')}>
      <MapStyles />
      <div className="wdm">
        <svg className="wdm-svg" viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label={def.ariaLabel}>
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
                      {def.regionLabel[0]}
                    </text>
                    <text
                      className="wdm-rl2"
                      x={rl.x}
                      y={rl.y + 0.625 * (f.regionTitle + f.regionSub)}
                      dy="0.35em"
                      textAnchor={rl.anchor}
                    >
                      {def.regionLabel[1]}
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
        <Attribution>{def.regionNote}</Attribution>
      </figcaption>
    </figure>
  );
}
