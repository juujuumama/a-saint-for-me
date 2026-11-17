// Builds the art kit in public/kit/ from Sierra Renee's published work on juujuumama.art.
// Pieces are named by the first 10 characters of each image's id on the Sanity CDN,
// so adding or reordering works on the site never shifts them.
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
  neon: ["hope", "inspiration", "decisions", "overwhelm", "growth", "confusion", "work", "anxiety", "fear", "addiction", "finances"],
  soft: ["peace", "gratitude", "family", "motherhood", "loneliness", "grief", "faith", "hope", "health", "sadness", "parenting"],
};
const BACKGROUNDS = {
  floral: [
    "01ce23200b", "025b66f2c7", "0b7e6a9f48", "13616f74c9", "163534da11", "198dd4f804", "27dc7516b8",
    "29850a56d1", "47e98868ba", "562a98196d", "67dd28b80b", "6a5b29a922", "6b916f9f3f", "6fcb27168c",
    "7cb512cb35", "7dd36e556e", "80bab1ad7d", "85f6ef92f2", "875b23496a", "8885e176e9", "890d3beeec",
    "89fe372213", "94ad87aa52", "96e414f35a", "b149943c0d", "b500e46bb8", "bba95fb369", "c70ce2be37",
    "c870fd7c92", "d34f931400", "d73593fb44", "dd987aa15b", "e5e5338d05", "e795f3fae6", "f23a4aab38",
    "f599525907", "f65b9406e2", "fa262380f9", "fea01498de", "4bc8eda701", "4ecd7f7442", "3ac0c262d6",
    "2bb3dc4bc7", "bb3b421e92", "98a1f7beec",
  ],
  wave: [
    "045314b0fa", "13e761c090", "1503fa0848", "18fb429c99", "1fa47d18c2", "205e6010d4", "21e6b6d9d4",
    "27052a355a", "2d76b5824c", "2de9a01efb", "35f481ed9e", "4c94aa737c", "75f35a8db2", "7c55a1e883",
    "7eac91d6d7", "81a695ddfa", "8364af8d6e", "8a1011a32c", "92c323d973", "9ab7c85d53", "ac39f2cfaa",
    "ad37a69a70", "b2b8c46a5f", "b7b6d7332f", "d41a286752", "db3e4927fb", "e89e847d4c", "f154473f0a",
  ],
  land: [
    "0221b07484", "044421df9f", "16bc5a6b17", "18a56383a5", "2487a181f3", "3b0d0cb55e", "5c4b68c92a",
    "602ae96d89", "82045ca5ef", "9c109e5868", "a307c3a99d", "a40d191d81", "acda430bd8", "b93159317d",
    "bc9e04a3f2", "c80e216634", "ce9d044e36", "e0eaea8a1b", "fd27a583f3",
  ],
  tarot: [
    "0bd8d9ddb3", "4cc5a159f9", "8887e6f92c", "b8aaf79cda",
  ],
  crystal: [
    "291c43f941", "68cf201079", "e5c590a59c", "e7f5252f1b", "e174919a88",
  ],
  neon: [
    "d393e832a2", "ddf9f7cea0", "73a02beff6", "f4bf9a4d6d", "1aee917531", "60763de079", "52d7c90b1c",
    "46261ad242", "394d7c0b2f", "9be75339f3", "03dbe6ef1a", "a128cfafa8", "9faf110dc9", "c47b761a1c",
    "bb3e1d1145", "1da547e7a0", "fb4f17a947", "f8a63c807c", "2146102aed", "a94d499472", "3263824909",
    "b1e4388e62", "bbd0494cb7", "ad7868595a", "0ae5e3be72", "27f7d6a834", "1752dc7757", "5f6e13cfbf",
    "1be923b6ff", "ece62fb7c0",
    "c6bd3da910", "044203c081", "2768f73c4a", "0498b1454c", "687483b897", "db9c3eff87", "d55bfc771f", "b05fb1e50a", "742b92f24a", "2b0c246843", "989ad2fb50", "6dd94dface", "5ffe451a1e", "17c2bdbd08", "e9a476eff4", "81eb42d07d", "c2c994f6ab", "7dd5429ba6", "e8a269ca13", "c10d09dd8c", "2bdd3e7a02", "07dcf82629", "979b9724da", "1957969994", "d5a544de6c", "2ec384cf04", "26c4e1f4a7", "44ead4c905", "c24514bd40", "4db9eeb5b9", "fbeb0d4e6d", "8e0382c939", "d441e5506d", "338630b6b8", "87f3c30afb", "e488be5c48", "1b5e25bfe1",
  ],
  soft: [
    "8f4518a551", "f0520e3d14", "120884de54", "3009537dc1", "d436f3dd1b", "b4313c876c", "a4b1e65c38",
    "4666d9dee8", "9e3abfa39c",
    "bb1b0ae8e2", "09bc2628e3", "69e7f0a0b4", "97808aeae9", "0ea621571c", "49bf5d3f16", "2933b8d2dc", "bce2bef73a", "b70b4844a0", "ca9be5c02a", "78e8bc55d5", "4372a3e289", "6cef1a6805", "4ebf073d7f", "a74c64a8c6", "ebe0352e25",
  ],
};
const TEXTURES = [
  // [image, role, crop x,y,w,h, family]; outfits are chosen family first so one series never dominates
  ["34eab5ddc5", "robe", [0, 0.5, 1, 0.5]], ["3ff7cf1393", "accent", [0.1, 0.25, 0.8, 0.7]], ["8b070b44a1", "accent", [0.2, 0.35, 0.6, 0.5]],
  ["66657f2310", "robe", [0, 0.6, 1, 0.4]], ["85b23c3e12", "robe", [0, 0.62, 1, 0.38]], ["a5e622f05a", "robe", [0, 0.65, 1, 0.35]],
  ["aac2363f33", "robe", [0, 0.62, 1, 0.38]], ["d6f9754b90", "robe", [0, 0.6, 1, 0.4]], ["e83bb00629", "robe", [0, 0.35, 1, 0.65]],
  ["52f74260b6", "robe", [0, 0.62, 1, 0.38]], ["04da4f6817", "robe", [0, 0.62, 1, 0.38]], ["1aabe1bcb6", "robe", [0, 0.6, 1, 0.4]],
  ["29186aec4e", "robe", [0, 0.5, 1, 0.5]], ["42608a5678", "robe", [0, 0.6, 1, 0.4]], ["44f5370a50", "robe", [0, 0.55, 1, 0.45]],
  ["52ff78ef0a", "robe", [0, 0.62, 1, 0.38]], ["531c59fbdb", "robe", [0, 0.62, 1, 0.38]], ["672e1e8261", "robe", [0, 0.62, 1, 0.38]],
  ["684c039107", "robe", [0, 0.62, 1, 0.38]], ["79b5490aa5", "robe", [0, 0.62, 1, 0.38]], ["8cb068f5bc", "robe", [0, 0.62, 1, 0.38]],
  ["8f0dbaab5a", "robe", [0, 0.62, 1, 0.38]], ["90a4046421", "robe", [0, 0.55, 1, 0.45]], ["c5c7029342", "robe", [0, 0.6, 1, 0.4]],
  ["d63e7254ca", "robe", [0, 0.62, 1, 0.38]], ["e3d1746a42", "robe", [0, 0.6, 1, 0.4]],
  ["ec0f4dd51b", "robe", [0, 0.6, 1, 0.4]], ["fb1b97ac73", "robe", [0, 0.5, 1, 0.5]], ["ffa43bdb80", "robe", [0, 0.6, 1, 0.4]],
  ["9197acdc72", "paint", [0, 0, 1, 1]], ["9ab7c85d53", "paint", [0, 0.5, 1, 0.5]], ["7eac91d6d7", "paint", [0, 0, 1, 0.6]], ["81a695ddfa", "paint", [0, 0.55, 1, 0.45]],
  ["68cf201079", "crystal", [0, 0.5, 1, 0.5]], ["e174919a88", "crystal", [0.25, 0.1, 0.5, 0.6]], ["e5c590a59c", "crystal", [0.15, 0.3, 0.7, 0.6]],
  ["67dd28b80b", "crystal", [0, 0, 1, 1]], ["e7f5252f1b", "crystal", [0, 0.45, 1, 0.55]], ["291c43f941", "crystal", [0.1, 0.35, 0.8, 0.6]],
  // new works (Nov 2026): neon dreamscape and soft life
  ["4ecd7f7442", "accent", [0.1,  0.2,  0.8,  0.6]], ["98a1f7beec", "accent", [0.1,  0.2,  0.8,  0.7]], ["a04b4541f8", "paint", [0,  0,  1,  1]], ["b4313c876c", "paint", [0,  0.3,  1,  0.7]], ["2bb3dc4bc7", "accent", [0,  0.3,  1,  0.6]],
  ["fc47d3dd68", "robe", [0.3, 0.4, 0.5, 0.5], "neon"],
  ["635202f7fb", "robe", [0.1, 0.55, 0.8, 0.45], "neon"],
  ["e015667e50", "robe", [0, 0.55, 1, 0.45], "neon"],
  ["a3bd294436", "robe", [0, 0.5, 1, 0.5], "neon"],
  ["5f6f64e95d", "robe", [0.1, 0.4, 0.6, 0.5], "neon"],
  ["60c888e26a", "robe", [0.1, 0.6, 0.8, 0.4], "neon"],
  ["33299ee97a", "robe", [0.1, 0.45, 0.8, 0.55], "neon"],
  ["5f2b12b134", "robe", [0.3, 0.4, 0.4, 0.6], "neon"],
  ["8945bd8a76", "robe", [0.2, 0.4, 0.6, 0.6], "soft"],
  ["e448f7eea5", "robe", [0.1, 0.6, 0.8, 0.4], "soft"],
  ["93c1499026", "robe", [0.2, 0.5, 0.6, 0.5], "soft"],
  ["ad820f3eaf", "robe", [0.5, 0.45, 0.4, 0.5], "soft"],
  ["8a7f7932a6", "robe", [0, 0.75, 1, 0.25], "neon"],
  ["a9cb52cb84", "robe", [0.2, 0.5, 0.7, 0.5], "soft"],
  ["cdba0bc268", "paint", [0, 0, 1, 1]],
  ["cadfda87ee", "paint", [0, 0.3, 1, 0.7]],
  ["b0d059a419", "paint", [0, 0.6, 1, 0.4]],
  ["c6e0ef9992", "crystal", [0, 0.3, 1, 0.7]],
];
const FACES = JSON.parse(fs.readFileSync(path.resolve("scripts/kit-faces.json"), "utf8"));

// Head oval is 0.8 wide : 1 tall. Eyes sit at 47% of its height, chin at 87%,
// so every face lands in the same place under a veil, hood or halo.
// zoom < 1 crops closer (used where a neighboring robot would otherwise show at the edge).
function faceCrop({ fx, eye, chin, zoom = 1 }, W, H) {
  let ch = (((chin - eye) * H) / 0.4) * zoom, cw = ch * 0.8;
  const k = Math.min(1, W / cw, H / ch); ch *= k; cw *= k;
  let top = eye * H - 0.47 * ch, left = fx * W - cw / 2;
  top = Math.max(0, Math.min(H - ch, top)); left = Math.max(0, Math.min(W - cw, left));
  return [left / W, top / H, cw / W, ch / H];
}

const html = await (await fetch("https://www.juujuumama.art/", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
const api = "https://38dww007.api.sanity.io/v2021-10-21/data/query/production?query=" +
  encodeURIComponent('*[_type=="artwork"].images[].image.asset->url');
const fromApi = await fetch(api).then((r) => r.json()).then((j) => j.result || []).catch(() => []);
const all = [...new Set([...html.match(/https:\/\/cdn\.sanity\.io\/images\/[A-Za-z0-9_/-]+\.(?:jpe?g|png|webp)/g), ...fromApi.filter(Boolean)])].sort();
const idOf = (url) => url.split("/").pop().split("-")[0].slice(0, 10);
const byId = new Map(all.map((u) => [idOf(u), u]));
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

async function get(url, kind, crop, width, quality, tag = "") {
  if (!url) { console.warn(`missing ${kind} image (removed from the site?)`); return null; }
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
manifest.backgrounds = (await inBatches(bgItems, async ({ n, group }) => { const p = await get(byId.get(n), "bg", [0, 0, 1, 1], 760, 72); return p && { ...p, themes: T[group], group }; })).filter(Boolean);
manifest.textures = (await inBatches(TEXTURES, async ([n, role, crop, fam]) => { const p = await get(byId.get(n), "tx", crop, 480, 72); return p && { ...p, role, ...(fam ? { fam } : {}) }; })).filter(Boolean);
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
