// Writes one placeholder phone screenshot per iPhone app as SVG under public/shots/<slug>/01.svg.
// Run once with `node apps/site/scripts/placeholder-shots.mjs`; real screenshots replace the files
// under the same names. Colors are the light theme's tokens, fixed, since an <img> cannot read them.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const apps = [
  { slug: "dekk", name: "DEKK", rows: 5, mark: "circle" },
  { slug: "divot", name: "DIVOT", rows: 4, mark: "flag" },
  { slug: "regiment", name: "REGIMENT", rows: 6, mark: "bars" },
  { slug: "snaphour", name: "SNAPHOUR", rows: 4, mark: "grid" },
  { slug: "skillet", name: "SKILLET", rows: 5, mark: "circle" },
  { slug: "loot", name: "LOOT", rows: 5, mark: "tags" },
];

const bg = "#f1f1ec";
const ink = "#0b0b0c";
const grey = "#dcdcd6";
const blue = "#7fd1f2";
const W = 390;
const H = 844;

const marks = {
  circle: `<circle cx="195" cy="300" r="70" fill="none" stroke="${blue}" stroke-width="6"/><path d="M175 270v60l50-30z" fill="${ink}"/>`,
  flag: `<path d="M140 360V220" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M140 220q60-20 110 10-50-20-110 10z" fill="${blue}" stroke="${ink}" stroke-width="4"/><ellipse cx="195" cy="372" rx="60" ry="10" fill="none" stroke="${ink}" stroke-width="4"/>`,
  bars: `<rect x="120" y="300" width="30" height="70" fill="${ink}"/><rect x="165" y="260" width="30" height="110" fill="${blue}" stroke="${ink}" stroke-width="4"/><rect x="210" y="230" width="30" height="140" fill="${ink}"/><rect x="255" y="280" width="30" height="90" fill="${blue}" stroke="${ink}" stroke-width="4"/>`,
  grid: `<g fill="none" stroke="${ink}" stroke-width="4">${[0, 1, 2]
    .flatMap((r) =>
      [0, 1, 2].map(
        (c) => `<rect x="${110 + c * 60}" y="${230 + r * 60}" width="50" height="50"/>`,
      ),
    )
    .join("")}</g><rect x="170" y="290" width="50" height="50" fill="${blue}"/>`,
  tags: `<g fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"><path d="M120 250h70l60 60-60 60h-70z"/><path d="M150 300h60l40 40-40 40h-60z" fill="${blue}"/></g><circle cx="140" cy="310" r="6" fill="${ink}"/>`,
};

function svg({ name, rows, mark }) {
  const list = Array.from({ length: rows }, (_, i) => {
    const y = 440 + i * 64;
    return `<rect x="32" y="${y}" width="326" height="48" fill="none" stroke="${grey}"/><rect x="44" y="${y + 18}" width="${120 + ((i * 37) % 90)}" height="10" fill="${ink}"/><rect x="300" y="${y + 18}" width="46" height="10" fill="${i % 2 ? blue : grey}"/>`;
  }).join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name} placeholder">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${ink}"/>
  <rect x="32" y="44" width="326" height="1" fill="${ink}"/>
  <text x="32" y="34" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" letter-spacing="1.5" fill="${ink}">//${name}//</text>
  <rect x="330" y="24" width="8" height="8" fill="${blue}"/>
  <text x="32" y="130" font-family="Space Grotesk, system-ui, sans-serif" font-size="40" font-weight="600" letter-spacing="-1.5" fill="${ink}">${name}</text>
  <text x="32" y="160" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" letter-spacing="1.5" fill="#606060">PLACEHOLDER SCREENSHOT</text>
  <g>${marks[mark]}</g>
  <rect x="32" y="416" width="326" height="1" fill="${ink}"/>
    ${list}
  <rect x="0" y="${H - 72}" width="${W}" height="1" fill="${ink}"/>
  <rect x="${W / 2 - 60}" y="${H - 20}" width="120" height="5" fill="${ink}"/>
</svg>
`;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "shots");
for (const app of apps) {
  const dir = join(root, app.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "01.svg"), svg(app));
  console.log(`wrote ${join("public/shots", app.slug, "01.svg")}`);
}
