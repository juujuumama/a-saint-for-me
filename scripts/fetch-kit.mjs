// Builds the art kit in public/kit/ from Sierra Renee's published work on juujuumama.art.
// Numbers are 1-based positions in the site's sorted image list (see the contact sheets);
// each piece is stored under its stable image id, so reordering on the site is harmless.
// Faces come from scripts/kit-faces.json (face center, eye line and chin found by a face
// detector, then reviewed and labeled by hand).
//   node scripts/fetch-kit.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/kit");
const T = {
  floral: ["gratitude", "peace", "hope", "inspiration", "marriage", "relationships", "motherhood"],
  wave: ["grief", "fear", "family", "hope", "work", "overwhelm", "anxiety", "sadness", "parenting", "finances"],
  land: ["peace", "decisions", "loneliness", "faith", "confusion", "hope", "growth"],
  tarot: ["faith", "decisions", "grief", "peace", "confusion"],
  crystal: ["health", "peace", "anxiety", "faith", "addiction", "growth"],
};
const BACKGROUNDS = {
  floral: [4, 6, 25, 33, 40, 49, 68, 74, 110, 137, 159, 164, 166, 176, 190, 192, 199, 212, 218, 220, 222, 223, 244, 249, 291, 297, 311, 325, 328, 350, 361, 368, 391, 394, 418, 422, 424, 429, 437],
  wave: [10, 34, 37, 44, 55, 56, 59, 66, 77, 78, 86, 120, 181, 189, 193, 205, 208, 224, 242, 255, 286, 289, 293, 299, 351, 364, 397, 416],
  land: [5, 9, 41, 43, 63, 93, 144, 150, 206, 257, 267, 268, 288, 303, 314, 326, 342, 380, 435],
  tarot: [27, 121, 221, 302],
  crystal: [71, 162, 390, 395, 381],
};
const TEXTURES = [
  // [image, role, crop x,y,w,h]
  [84, "robe", [0, 0.5, 1, 0.5]], [96, "accent", [0.1, 0.25, 0.8, 0.7]], [225, "accent", [0.2, 0.35, 0.6, 0.5]],
  [156, "robe", [0, 0.6, 1, 0.4]], [210, "robe", [0, 0.62, 1, 0.38]], [273, "robe", [0, 0.65, 1, 0.35]],
  [282, "robe", [0, 0.62, 1, 0.38]], [360, "robe", [0, 0.6, 1, 0.4]], [396, "robe", [0, 0.35, 1, 0.65]],
  [129, "robe", [0, 0.62, 1, 0.38]], [13, "robe", [0, 0.62, 1, 0.38]], [50, "robe", [0, 0.6, 1, 0.4]],
  [70, "robe", [0, 0.5, 1, 0.5]], [101, "robe", [0, 0.6, 1, 0.4]], [104, "robe", [0, 0.55, 1, 0.45]],
  [130, "robe", [0, 0.62, 1, 0.38]], [131, "robe", [0, 0.62, 1, 0.38]], [158, "robe", [0, 0.62, 1, 0.38]],
  [161, "robe", [0, 0.62, 1, 0.38]], [182, "robe", [0, 0.62, 1, 0.38]], [226, "robe", [0, 0.62, 1, 0.38]],
  [230, "robe", [0, 0.62, 1, 0.38]], [235, "robe", [0, 0.55, 1, 0.45]], [322, "robe", [0, 0.6, 1, 0.4]],
  [338, "robe", [0, 0.5, 1, 0.5]], [356, "robe", [0, 0.62, 1, 0.38]], [386, "robe", [0, 0.6, 1, 0.4]],
  [404, "robe", [0, 0.6, 1, 0.4]], [431, "robe", [0, 0.5, 1, 0.5]], [438, "robe", [0, 0.6, 1, 0.4]],
  [237, "paint", [0, 0, 1, 1]], [255, "paint", [0, 0.5, 1, 0.5]], [193, "paint", [0, 0, 1, 0.6]], [205, "paint", [0, 0.55, 1, 0.45]],
  [162, "crystal", [0, 0.5, 1, 0.5]], [381, "crystal", [0.25, 0.1, 0.5, 0.6]], [390, "crystal", [0.15, 0.3, 0.7, 0.6]],
  [159, "crystal", [0, 0, 1, 1]], [395, "crystal", [0, 0.45, 1, 0.55]], [71, "crystal", [0.1, 0.35, 0.8, 0.6]],
];
const FACES = JSON.parse(fs.readFileSync(path.resolve("scripts/kit-faces.json"), "utf8"));

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
const idOf = (url) => url.split("/").pop().split("-")[0].slice(0, 10);
const byId = new Map(all.map((u) => [idOf(u), u]));
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

async function get(url, kind, crop, width, quality, tag = "") {
  const [, W, H] = url.match(/-(\d+)x(\d+)\./).map(Number);
  const [cx, cy, cw, ch] = crop;
  const rect = [Math.round(cx * W), Math.round(cy * H), Math.round(cw * W), Math.round(ch * H)].join(",");
  const file = `${kind}-${idOf(url)}${tag}.jpg`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${url}?rect=${rect}&w=${width}&fm=jpg&q=${quality}`);
    if (res.ok) { fs.writeFileSync(path.join(OUT, file), Buffer.from(await res.arrayBuffer())); break; }
    if (attempt === 2) { console.warn(`skipped ${file}: ${res.status}`); return null; }
  }
  return { file, w: width, h: Math.round((width * ch * H) / (cw * W)) };
}
async function piece(...args) {
  const p = await get(...args);
  return p;
}
async function inBatches(items, fn, size = 8) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

const manifest = { source: "Artwork by Sierra Renee (juujuumama.art). All rights reserved by the artist.", backgrounds: [], textures: [], faces: [] };
const bgItems = Object.entries(BACKGROUNDS).flatMap(([group, ns]) => ns.map((n) => ({ n, group })));
manifest.backgrounds = (await inBatches(bgItems, async ({ n, group }) => { const p = await get(all[n - 1], "bg", [0, 0, 1, 1], 760, 72); return p && { ...p, themes: T[group], group }; })).filter(Boolean);
manifest.textures = (await inBatches(TEXTURES, async ([n, role, crop]) => { const p = await get(all[n - 1], "tx", crop, 480, 72); return p && { ...p, role }; })).filter(Boolean);
manifest.faces = (await inBatches(FACES, async (fc, i) => {
  const url = byId.get(fc.id);
  if (!url) { console.warn("missing face image", fc.id); return null; }
  const [, W, H] = url.match(/-(\d+)x(\d+)\./).map(Number);
  const p = await get(url, "face", faceCrop(fc, W, H), 300, 80, `-${i}`);
  return p && { ...p, tone: fc.tone, pres: fc.pres };
})).filter(Boolean);
fs.writeFileSync(path.join(OUT, "kit.json"), JSON.stringify(manifest));
const bytes = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`kit: ${manifest.backgrounds.length} backgrounds, ${manifest.textures.length} textures, ${manifest.faces.length} faces, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
