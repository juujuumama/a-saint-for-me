// Renders sample saint and angel collages for the About page strip into public/showcase/.
//   node scripts/render-showcase.mjs
import fs from "node:fs";
import path from "node:path";
// Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
const { chromium } = await import("playwright").catch(() => import("/opt/node-tools/node_modules/playwright/index.mjs"));
import { proceduralArtwork, wordsFrom } from "../server/art/procedural.js";
import { pickKit } from "../server/art/kit.js";
import { saintById } from "../server/library/saints.js";
import { saintEmblem } from "../server/art/procedural.js";
import { composeOffline, hydrate } from "../server/compose-offline.js";

const style = JSON.parse(fs.readFileSync("config/style.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("public/kit/kit.json", "utf8"));
const uri = (file) => `data:image/jpeg;base64,${fs.readFileSync("public/kit/" + file).toString("base64")}`;
const OUT = path.resolve("public/showcase");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const PICKS = [
  ["bakhita", ["hope"], 11], ["michael", ["fear"], 23], ["therese", ["gratitude"], 31], ["moses_black", ["addiction"], 47],
  ["monica", ["motherhood"], 52], ["guardian_angel", ["loneliness"], 64], ["joseph", ["work"], 78], ["mary_magdalene", ["grief"], 85],
];
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 512, height: 768 } });
const files = [];
for (const [i, [id, themes, seed]] of PICKS.entries()) {
  const saint = saintById(id);
  const pick = pickKit(manifest, { themes, seed, saint });
  const kit = Object.fromEntries(Object.entries(pick).map(([k, v]) => [k, v && { ...v, href: uri(v.file) }]));
  const svg = proceduralArtwork({ brief: {}, themes, seed, saint, style, kit, words: wordsFrom(["Be still, and know that I am God.", "You are not alone.", "Peace I leave with you.", "One step is enough.", "Do not be afraid.", "Love does not end.", "Hope is a seed, not a feeling. Plant it anyway.", "Every good gift comes from above."][i]) });
  await page.setContent(`<style>body{margin:0}</style><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" width="512" height="768">`);
  await page.waitForTimeout(600);
  const file = `saint-${i + 1}.jpg`;
  await page.screenshot({ path: path.join(OUT, file), type: "jpeg", quality: 78 });
  files.push(file);
}

// App icons for "Add to Home Screen"
const iconSvg = fs.readFileSync("public/icon.svg", "utf8");
for (const size of [180, 192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>body{margin:0}</style><img src="data:image/svg+xml;base64,${Buffer.from(iconSvg).toString("base64")}" width="${size}" height="${size}">`);
  await page.screenshot({ path: path.resolve(`public/icon-${size}.png`) });
}

// Example devotional for first-time visitors
const exampleText = "My mom starts chemo next week and I'm scared. Please pray for her and for me.";
const checkin = { mode: "new", emotions: [], circumstances: [], text: exampleText, personName: "" };
let dev = hydrate(composeOffline(checkin, {}, style));
const exSaint = dev.saints[0];
const exSeed = 4242;
const exPick = pickKit(manifest, { themes: dev.themes, seed: exSeed, saint: exSaint });
const exKit = Object.fromEntries(Object.entries(exPick).map(([k, v]) => [k, v && { ...v, href: uri(v.file) }]));
const exSvg = proceduralArtwork({ brief: {}, themes: dev.themes, seed: exSeed, saint: exSaint, style, kit: exKit, words: wordsFrom(dev.reflection).length ? wordsFrom(dev.reflection) : wordsFrom(dev.scripture[0].text) });
await page.setViewportSize({ width: 512, height: 768 });
await page.setContent(`<style>body{margin:0}</style><img src="data:image/svg+xml;base64,${Buffer.from(exSvg).toString("base64")}" width="512" height="768">`);
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(OUT, "example.jpg"), type: "jpeg", quality: 82 });
for (const s of dev.saints) fs.writeFileSync(path.join(OUT, `emblem-${s.id}.svg`), saintEmblem(s, 1, style));
const example = {
  id: "example", example: true, exampleText, createdAt: new Date().toISOString(), intentionTitle: dev.intention_title, mode: "new",
  personName: null, shared: null, saved: false, prayerSaved: false, care: null,
  devotional: { ...dev, source: "offline", saints: dev.saints.map((s) => ({ ...s, symbols: s.emblem?.symbols || [], emblem: `emblem-${s.id}.svg` })) },
  art: { status: "ready", notice: null, current: { file: "example.jpg", kind: "collage", title: dev.art_brief.title } },
};
fs.writeFileSync(path.join(OUT, "example.json"), JSON.stringify(example));

await b.close();
fs.writeFileSync(path.join(OUT, "showcase.json"), JSON.stringify(files));
console.log("rendered", files.length);
