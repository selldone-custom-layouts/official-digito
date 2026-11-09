// Tests for theme-color.ts (paletteFromColor): every role reads, for extreme and random picks.
// Run: node components/theme-switcher/theme-color.test.mjs   (Node 22.6+ strips the TypeScript types;
// on Node 22 add --experimental-strip-types). Prints a table of the colours used and exits 1 on a failure.
import { contrast, luminance, normalizeHex, paletteFromColor } from "./theme-color.ts";

const WHITE = "#ffffff";
const SURFACES = ["#0d1220", "#161d2e", "#1e2639"];
const LIGHT_SURFACES = ["#ffffff", "#f0f2f5"];
let failures = 0;
const check = (ok, msg) => {
  if (!ok) {
    failures++;
    console.log("FAIL " + msg);
  }
};

function verify(pick, opts) {
  const p = paletteFromColor(pick, opts);
  const need = Math.max(4.5, opts.headerContrast || 4.5);
  const L = p.light;
  const D = p.dark;
  check(contrast(WHITE, L.primary) >= need, `${pick} light primary ${L.primary}: white ${contrast(WHITE, L.primary).toFixed(2)} < ${need}`);
  check(contrast(WHITE, L.deep) >= 4.5, `${pick} light deep ${L.deep}: white ${contrast(WHITE, L.deep).toFixed(2)}`);
  for (const s of LIGHT_SURFACES) check(contrast(L.text, s) >= 4.5, `${pick} light text ${L.text} on ${s}: ${contrast(L.text, s).toFixed(2)}`);
  check(contrast(L.primary, L.soft) >= 4.5, `${pick} light primary on its soft tint ${L.soft}: ${contrast(L.primary, L.soft).toFixed(2)}`);
  check(contrast(WHITE, D.primary) >= 4.5, `${pick} dark primary ${D.primary}: white ${contrast(WHITE, D.primary).toFixed(2)}`);
  check(contrast(D.primary, SURFACES[1]) >= 3 - 1e-9, `${pick} dark primary ${D.primary} vs card: ${contrast(D.primary, SURFACES[1]).toFixed(2)} (vanishes)`);
  check(contrast(WHITE, D.deep) >= 4.5, `${pick} dark deep ${D.deep}: white ${contrast(WHITE, D.deep).toFixed(2)}`);
  for (const s of SURFACES) check(contrast(D.text, s) >= 4.5, `${pick} dark text ${D.text} on ${s}: ${contrast(D.text, s).toFixed(2)}`);
  check(contrast(D.text, D.soft) >= 4.5, `${pick} dark text on its dark tint ${D.soft}: ${contrast(D.text, D.soft).toFixed(2)}`);
  if (opts.extras?.pop) check(contrast(opts.extras.pop, L.primary) >= 4.5, `${pick} pop on the header ${L.primary}: ${contrast(opts.extras.pop, L.primary).toFixed(2)}`);
  // Deterministic.
  check(JSON.stringify(paletteFromColor(pick, opts)) === JSON.stringify(p), `${pick} not deterministic`);
  return p;
}

// normalizeHex
check(normalizeHex("FFF") === "#ffffff", "normalizeHex short");
check(normalizeHex("#0A4BD8") === "#0a4bd8", "normalizeHex case");
check(normalizeHex("nope") === null, "normalizeHex rejects");

// A dark pick that already reads is kept exactly.
const navy = paletteFromColor("#0a4bd8", { headerContrast: 6.5 });
check(navy.light.primary === "#0a4bd8" && !navy.adjusted.light, "Digito blue kept in light");

const DIGITO = { headerContrast: 6.5, extras: { pop: "#ffd91a" } };
const PICKS = ["#ffff00", "#00ffff", "#ffffff", "#000000", "#808080", "#ff00ff", "#7fff00", "#ff0000", "#0000ff", "#ffa500"];
const rows = [];
for (const pick of PICKS) {
  for (const opts of [DIGITO, {}]) verify(pick, opts);
  const p = paletteFromColor(pick, DIGITO);
  rows.push([pick, p.light.primary, contrast(WHITE, p.light.primary).toFixed(2), p.dark.primary, contrast(WHITE, p.dark.primary).toFixed(2), contrast(p.dark.primary, SURFACES[1]).toFixed(2), p.dark.text, contrast(p.dark.text, SURFACES[2]).toFixed(2)]);
}

// 2000 more picks from a fixed seed (deterministic), plus every grey.
let seed = 20261109;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
for (let i = 0; i < 2000; i++) {
  const hex = "#" + [0, 0, 0].map(() => Math.floor(rnd() * 256).toString(16).padStart(2, "0")).join("");
  verify(hex, i % 2 ? DIGITO : {});
}
for (let v = 0; v < 256; v += 5) {
  const g = v.toString(16).padStart(2, "0");
  verify(`#${g}${g}${g}`, DIGITO);
}

console.log("pick     light     white  dark      white  vs-card  dark-link  vs-raise");
for (const r of rows) console.log(r.map((x, i) => String(x).padEnd([9, 10, 7, 10, 7, 9, 11, 8][i])).join(""));
console.log(failures ? `FAILURES ${failures}` : "ALL PASS (10 test picks, 2000 seeded picks, 52 greys; light, dark, header 6.5:1)");
process.exit(failures ? 1 : 0);
