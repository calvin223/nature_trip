# Map data: sources and licence

*Updated 2026-10-03.*

Every map on this site (the trip maps and the India overview) is a static SVG drawn at build
time. No map tiles, map APIs or third-party map requests are used: no Google Maps, no Mapbox,
no OpenStreetMap tile embedding.

## Geometry: Natural Earth (public domain)

| Item | Value |
|---|---|
| Publisher | Natural Earth, <https://www.naturalearthdata.com/> |
| Version | 5.1.2 (git tag `v5.1.2`, released 2022-05-13) |
| Licence | Public domain. No permission or attribution is required (<https://www.naturalearthdata.com/about/terms-of-use/>). We credit it on each map anyway: "Map data: Natural Earth (public domain)". |
| Download used | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/<file>` (the same layers as the shapefile zips on `https://naciscdn.org/naturalearth/10m/`) |

Layers used, all at 1:10 million scale. The build checks each file's SHA-256:

| File | Used for | SHA-256 |
|---|---|---|
| `ne_10m_admin_0_countries_ind.geojson` | Country outlines, coastline, international borders (**India point of view**) | `3e67a5a6ddeff3247ca8400cd2514fd4a5ac6e5432823b25d610a7028597d45f` |
| `ne_10m_admin_1_states_provinces.geojson` | Internal Indian state lines only | `22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5` |
| `ne_10m_geography_regions_polys.geojson` | Western Ghats ("WESTERN GHATS" + "Southern Ghats") and Himalaya ("HIMALAYAS" + "Siwalik Hills") shading | `b7b26e50ea917d3696aec87f932def2bf5f890f5770e441d59c162c6f4c92a77` |
| `ne_10m_populated_places_simple.geojson` | Reference-city dots (e.g. Coimbatore, Nagpur, New Delhi) | `fd3fa867a320cbd5c5b6bb5bc550afeec2939fb2cef688e508007282a55ac42f` |

## India boundary: point-of-view data

Every national outline comes from Natural Earth's **India point-of-view** (IND POV) admin-0
file, not the default de-facto file. In it, the whole of Jammu and Kashmir and Ladakh
(including Gilgit-Baltistan and Aksai Chin) and the whole of Arunachal Pradesh are drawn as
India. The build script refuses to run unless India's polygon contains Gilgit, Muzaffarabad,
Aksai Chin and Tawang, so the default boundary cannot slip in by accident.

Internal state lines are drawn only where two Indian states share an edge in the admin-1 file.
The Jammu and Kashmir / Ladakh line is left out, because Natural Earth's de-facto version of
it ends at the Line of Control.

**What this is not.** These maps are small-scale illustrations of trip regions. They are not
authenticated by the Survey of India and must not be described as such. Do not add the Survey of
India certification wording to them.

## Place coordinates (facts, not map data)

Itinerary stops and gateways are single latitude/longitude points: public facts taken from
Wikipedia article coordinates, which mirror the linked Wikidata item's P625 value. Where
Wikipedia had none (Top Slip), the point comes from OpenStreetMap via Overpass (node 7252324542).
All were retrieved on 2026-10-03. Each point names its source in `lib/mapData.ts`. No
OpenStreetMap geometry or tiles are stored or shown. The "Open in OpenStreetMap" links only link
out to openstreetmap.org.

Regions for trips whose itineraries do not name places (central India, the Himalaya, monsoon
rainforests) are drawn as deliberately soft, approximate areas, labelled "set at booking".
They do not name or imply specific parks.

## Rebuilding

```
node scripts/build-map-data.mjs
```

The script needs Node 22.18 or later. It downloads the four files above (cached in
`node_modules/.cache/natural-earth-5.1.2/`), checks their hashes, and writes `lib/geo/*.json`.
Commit those files: `next build` never touches the network. Re-run it after any edit to
`lib/mapData.ts`. The map components refuse to render stale data.
