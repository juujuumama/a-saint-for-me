// Builds the art kit in public/kit/ from Sierra Renee's published work on juujuumama.art.
// Each entry: n = index into the site's image list (every 3rd image, as sampled),
// crop = [x, y, w, h] as fractions of the original (used to avoid faces in textures).
// Re-run any time:  node scripts/fetch-kit.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/kit");
const BACKGROUNDS = [
  { n: 2, themes: ["gratitude", "peace", "hope", "inspiration"] },
  { n: 11, themes: ["marriage", "relationships", "gratitude", "anger"] },
  { n: 21, themes: ["decisions", "loneliness", "confusion", "hope"] },
  { n: 22, themes: ["family", "parenting", "overwhelm", "motherhood"] },
  { n: 23, themes: ["peace", "faith", "health"] },
  { n: 26, themes: ["grief", "sadness", "hope", "addiction"] },
  { n: 31, themes: ["family", "gratitude", "hope", "faith"] },
  { n: 40, themes: ["parenting", "motherhood", "work", "overwhelm"] },
  { n: 48, themes: ["hope", "growth", "inspiration", "decisions"] },
  { n: 53, themes: ["peace", "health", "faith", "gratitude"] },
  { n: 64, themes: ["gratitude", "motherhood", "peace"] },
  { n: 83, themes: ["gratitude", "inspiration", "hope", "growth"] },
  { n: 85, themes: ["fear", "anxiety", "hope", "grief"] },
  { n: 89, themes: ["family", "motherhood", "gratitude", "parenting"] },
  { n: 97, themes: ["marriage", "relationships", "grief", "gratitude"] },
  { n: 99, themes: ["relationships", "marriage", "anger", "sadness"] },
  { n: 108, themes: ["growth", "health", "addiction", "work"] },
  { n: 114, themes: ["relationships", "marriage", "loneliness", "gratitude"] },
  { n: 117, themes: ["work", "finances", "family"] },
  { n: 122, themes: ["gratitude", "work", "finances", "inspiration"] },
  { n: 143, themes: ["peace", "anxiety", "faith", "sadness", "fear"] },
  { n: 9, themes: ["faith", "decisions", "peace", "grief"] },
];
const TEXTURES = [
  { n: 28, role: "robe", crop: [0, 0.5, 1, 0.5] },
  { n: 32, role: "accent", crop: [0.1, 0.25, 0.8, 0.7] },
  { n: 75, role: "accent", crop: [0.2, 0.35, 0.6, 0.5] },
  { n: 52, role: "robe", crop: [0, 0.6, 1, 0.4] },
  { n: 70, role: "robe", crop: [0, 0.62, 1, 0.38] },
  { n: 91, role: "robe", crop: [0, 0.65, 1, 0.35] },
  { n: 94, role: "robe", crop: [0, 0.62, 1, 0.38] },
  { n: 120, role: "robe", crop: [0, 0.6, 1, 0.4] },
  { n: 132, role: "robe", crop: [0, 0.35, 1, 0.65] },
  { n: 43, role: "robe", crop: [0, 0.62, 1, 0.38] },
  { n: 79, role: "paint", crop: [0, 0, 1, 1] },
  { n: 85, role: "paint", crop: [0, 0.5, 1, 0.5] },
  { n: 54, role: "crystal", crop: [0, 0.5, 1, 0.5] },
  { n: 127, role: "crystal", crop: [0.25, 0.1, 0.5, 0.6] },
  { n: 130, role: "crystal", crop: [0.15, 0.3, 0.7, 0.6] },
  { n: 53, role: "crystal", crop: [0, 0, 1, 1] },
];

// Faces from the artist's portraits, used as saints' and angels' heads.
// tone: "dark" | "medium"; pres: "fem" | "masc" | "any" (used to match saints respectfully).
const FACES = [
  { n: 17, crop: [0.22, 0.32, 0.36, 0.45], tone: "medium", pres: "fem" },
  { n: 24, crop: [0.33, 0.42, 0.34, 0.43], tone: "medium", pres: "fem" },
  { n: 25, crop: [0.3, 0.2, 0.42, 0.38], tone: "dark", pres: "any" },
  { n: 39, crop: [0.3, 0.2, 0.6, 0.45], tone: "dark", pres: "fem" },
  { n: 55, crop: [0.12, 0.05, 0.72, 0.88], tone: "dark", pres: "fem" },
  { n: 65, crop: [0.2, 0.1, 0.55, 0.42], tone: "dark", pres: "masc" },
  { n: 100, crop: [0.1, 0.2, 0.62, 0.52], tone: "dark", pres: "fem" },
  { n: 107, crop: [0.3, 0.12, 0.32, 0.34], tone: "dark", pres: "fem" },
  { n: 109, crop: [0.12, 0.12, 0.62, 0.52], tone: "dark", pres: "fem" },
  { n: 129, crop: [0.3, 0.32, 0.4, 0.38], tone: "dark", pres: "masc" },
  { n: 134, crop: [0.45, 0.08, 0.45, 0.42], tone: "medium", pres: "fem" },
  { n: 1, crop: [0.35, 0.3, 0.3, 0.26], tone: "dark", pres: "any" },
];

const html = await (await fetch("https://www.juujuumama.art/", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
const all = [...new Set(html.match(/https:\/\/cdn\.sanity\.io\/images\/[A-Za-z0-9_/-]+\.(?:jpe?g|png|webp)/g))].sort();
const sampled = all.filter((_, i) => (i + 1) % 3 === 0); // matches the contact sheets used to choose
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

async function get(entry, kind, width, quality) {
  const url = sampled[entry.n - 1];
  const [, W, H] = url.match(/-(\d+)x(\d+)\./).map(Number);
  const [cx, cy, cw, ch] = entry.crop || [0, 0, 1, 1];
  const rect = [Math.round(cx * W), Math.round(cy * H), Math.round(cw * W), Math.round(ch * H)].join(",");
  const file = `${kind}-${String(entry.n).padStart(3, "0")}.jpg`;
  const res = await fetch(`${url}?rect=${rect}&w=${width}&fm=jpg&q=${quality}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
  return { file, w: width, h: Math.round((width * ch * H) / (cw * W)) };
}

const manifest = {
  source: "Artwork by Sierra Renee (juujuumama.art). All rights reserved by the artist.",
  backgrounds: [], textures: [], faces: [],
};
for (const b of BACKGROUNDS) manifest.backgrounds.push({ ...(await get(b, "bg", 760, 74)), themes: b.themes });
for (const t of TEXTURES) manifest.textures.push({ ...(await get(t, "tx", 480, 72)), role: t.role });
for (const fc of FACES) manifest.faces.push({ ...(await get(fc, "face", 360, 80)), tone: fc.tone, pres: fc.pres });
fs.writeFileSync(path.join(OUT, "kit.json"), JSON.stringify(manifest, null, 2));
const bytes = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`kit: ${manifest.backgrounds.length} backgrounds, ${manifest.textures.length} textures, ${manifest.faces.length} faces, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
