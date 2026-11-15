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
  // fx = face center x, eye = eye line y, chin = chin y (fractions of the original image)
  { n: 1, fx: 0.5, eye: 0.46, chin: 0.58, tone: "dark", pres: "any" },
  { n: 10, fx: 0.33, eye: 0.31, chin: 0.47, tone: "dark", pres: "fem" },
  { n: 14, fx: 0.36, eye: 0.215, chin: 0.3, tone: "light", pres: "fem" },
  { n: 17, fx: 0.34, eye: 0.53, chin: 0.7, tone: "medium", pres: "fem" },
  { n: 24, fx: 0.48, eye: 0.6, chin: 0.8, tone: "medium", pres: "fem" },
  { n: 25, fx: 0.52, eye: 0.4, chin: 0.57, tone: "dark", pres: "any" },
  { n: 34, fx: 0.4, eye: 0.24, chin: 0.33, tone: "dark", pres: "masc" },
  { n: 36, fx: 0.44, eye: 0.2, chin: 0.31, tone: "light", pres: "fem" },
  { n: 39, fx: 0.62, eye: 0.36, chin: 0.55, tone: "dark", pres: "fem" },
  { n: 44, fx: 0.33, eye: 0.37, chin: 0.5, tone: "medium", pres: "fem" },
  { n: 55, fx: 0.48, eye: 0.35, chin: 0.75, tone: "dark", pres: "fem" },
  { n: 65, fx: 0.6, eye: 0.29, chin: 0.45, tone: "dark", pres: "masc" },
  { n: 86, fx: 0.62, eye: 0.27, chin: 0.38, tone: "light", pres: "fem" },
  { n: 100, fx: 0.28, eye: 0.44, chin: 0.62, tone: "dark", pres: "fem" },
  { n: 107, fx: 0.5, eye: 0.34, chin: 0.45, tone: "dark", pres: "fem" },
  { n: 109, fx: 0.42, eye: 0.31, chin: 0.52, tone: "dark", pres: "fem" },
  { n: 129, fx: 0.5, eye: 0.45, chin: 0.67, tone: "dark", pres: "masc" },
  { n: 134, fx: 0.73, eye: 0.24, chin: 0.42, tone: "medium", pres: "fem" },
  { n: 135, fx: 0.5, eye: 0.25, chin: 0.4, tone: "light", pres: "fem" },
  // robot faces: used for angels only
  { n: 14, fx: 0.62, eye: 0.19, chin: 0.27, tone: "robot", pres: "any" },
  { n: 36, fx: 0.65, eye: 0.2, chin: 0.3, tone: "robot", pres: "any" },
  { n: 44, fx: 0.57, eye: 0.22, chin: 0.35, tone: "robot", pres: "any" },
  { n: 86, fx: 0.43, eye: 0.21, chin: 0.33, tone: "robot", pres: "any" },
];
// Head oval is 0.8 wide : 1 tall. Eyes sit at 47% of its height, chin at 87%,
// so every face lands in the same place under a veil, hood or halo.
function faceCrop({ fx, eye, chin }, W, H) {
  let ch = ((chin - eye) * H) / 0.4, cw = ch * 0.8;
  const k = Math.min(1, W / cw, H / ch); ch *= k; cw *= k;
  let top = eye * H - 0.47 * ch, left = fx * W - cw / 2;
  top = Math.max(0, Math.min(H - ch, top)); left = Math.max(0, Math.min(W - cw, left));
  return [left / W, top / H, cw / W, ch / H];
}

const html = await (await fetch("https://www.juujuumama.art/", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
const all = [...new Set(html.match(/https:\/\/cdn\.sanity\.io\/images\/[A-Za-z0-9_/-]+\.(?:jpe?g|png|webp)/g))].sort();
const sampled = all.filter((_, i) => (i + 1) % 3 === 0); // matches the contact sheets used to choose
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

async function get(entry, kind, width, quality) {
  const url = sampled[entry.n - 1];
  const [, W, H] = url.match(/-(\d+)x(\d+)\./).map(Number);
  const [cx, cy, cw, ch] = entry.eye ? faceCrop(entry, W, H) : entry.crop || [0, 0, 1, 1];
  const rect = [Math.round(cx * W), Math.round(cy * H), Math.round(cw * W), Math.round(ch * H)].join(",");
  const file = `${kind}${entry.tone === "robot" ? "-robot" : ""}-${String(entry.n).padStart(3, "0")}.jpg`;
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
