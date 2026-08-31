/**
 * Regenerates src/lib/usStatePaths.ts.
 *
 *   node scripts/generate-state-paths.mjs
 *
 * The map on /locum-tenens-jobs needs real state outlines, and the options are
 * to ship a mapping library or to ship the geometry. A library means an extra
 * runtime dependency and, for most of them, tiles fetched from someone else's
 * server on every page view. Fifty path strings cost nothing at runtime and
 * work offline, so the geometry is baked here at build time instead.
 *
 * Source is us-atlas (ISC), projected with geoAlbersUsa so Alaska and Hawaii
 * sit in the usual insets rather than dragging the frame across the Pacific.
 * Simplified to roughly a fifth of its points and rounded to whole units:
 * the map renders about 700px wide, so anything finer is detail nobody sees
 * at a cost everybody pays.
 *
 * Dev-only dependencies — nothing here reaches the browser bundle.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import { geoAlbersUsa, geoPath } from "d3-geo";

const WIDTH = 960;
const HEIGHT = 600;
/** Share of points kept. 0.2 is where the outlines stop visibly changing. */
const DETAIL = 0.2;

// us-atlas names, mapped to the postal codes taxonomy.ts uses. Only the DC
// entry actually differs, but going through an explicit table means a rename
// upstream fails loudly here rather than silently dropping a state.
const NAME_TO_CODE = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

const topo = JSON.parse(readFileSync("node_modules/us-atlas/states-10m.json", "utf8"));
const pre = presimplify(topo);
const simplified = simplify(pre, quantile(pre, DETAIL));
const collection = feature(simplified, simplified.objects.states);

const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
const toPath = geoPath(projection).digits(0);

const paths = {};
const centroids = {};
for (const f of collection.features) {
  const code = NAME_TO_CODE[f.properties.name];
  // Territories are in the source but outside geoAlbersUsa, so they project to
  // null. Skipping unnamed ones is expected; a missing *state* is not.
  if (!code) continue;
  const d = toPath(f);
  if (!d) continue;
  paths[code] = d;
  const c = toPath.centroid(f);
  if (Number.isFinite(c[0]) && Number.isFinite(c[1])) {
    centroids[code] = [Math.round(c[0]), Math.round(c[1])];
  }
}

const missing = Object.values(NAME_TO_CODE).filter((c) => !paths[c]);
if (missing.length) {
  console.error("Missing geometry for:", missing.join(", "));
  process.exit(1);
}

const body = `// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/generate-state-paths.mjs
// Source: us-atlas (ISC), geoAlbersUsa, simplified to ${DETAIL * 100}% of points.

export const MAP_VIEWBOX = "0 0 ${WIDTH} ${HEIGHT}";

/** Postal code to SVG path, in the ${WIDTH}x${HEIGHT} viewBox above. */
export const US_STATE_PATHS: Record<string, string> = ${JSON.stringify(paths, null, 0)};

/** Projected centre of each state, for labelling the ones big enough to hold one. */
export const US_STATE_CENTROIDS: Record<string, [number, number]> = ${JSON.stringify(centroids, null, 0)};
`;

writeFileSync("src/lib/usStatePaths.ts", body);
console.log(
  `wrote src/lib/usStatePaths.ts — ${Object.keys(paths).length} states, ` +
    `${(body.length / 1024).toFixed(1)}KB raw, ` +
    `${(gzipSync(Buffer.from(body)).length / 1024).toFixed(1)}KB gzipped`,
);
