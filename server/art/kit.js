// Chooses pieces from the artist's kit (public/kit/kit.json) for one artwork.
// Pure and deterministic: the same seed + themes + saint always picks the same pieces,
// so the browser edition can re-draw saved art without storing images.

// Who each figure is, for matching faces respectfully:
// tone group of the saint's likely origin, and presentation. Angels take any face.
const SAINT_META = {
  monica: ["dark", "fem"], gianna: ["light", "fem"], anne: ["medium", "fem"], joseph: ["medium", "masc"],
  zelie_louis: ["light", "any"], rita: ["light", "fem"], thomas_more: ["light", "masc"], bakhita: ["dark", "fem"],
  moses_black: ["dark", "masc"], matt_talbot: ["light", "masc"], augustine: ["dark", "masc"], martin_porres: ["dark", "masc"],
  benedict_moor: ["dark", "masc"], perpetua_felicity: ["dark", "fem"], charles_lwanga: ["dark", "masc"], katharine_drexel: ["light", "fem"],
  cajetan: ["light", "masc"], jude: ["medium", "masc"], dymphna: ["light", "fem"], padre_pio: ["light", "masc"],
  therese: ["light", "fem"], teresa_avila: ["light", "fem"], john_cross: ["light", "masc"], teresa_calcutta: ["light", "fem"],
  peregrine: ["light", "masc"], bernadette: ["light", "fem"], elizabeth_seton: ["light", "fem"], ignatius: ["light", "masc"],
  francis: ["light", "masc"], mary_magdalene: ["medium", "fem"], thomas_apostle: ["medium", "masc"], anthony: ["light", "masc"],
  faustina: ["light", "fem"], kateri: ["indigenous", "fem"],
};
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Every saint gets a face from the artist's portraits: the closest match first
// (tone and presentation), then presentation, then any portrait (artistic interpretation).
export function faceCandidates(faces = [], saint) {
  if (!faces.length) return [];
  // Angels: about half the time one of the artist's robot faces, otherwise any portrait.
  if (!saint || saint.kind === "angel") return faces;
  faces = faces.filter((fc) => fc.tone !== "robot");
  const [tone, pres] = SAINT_META[saint.id] || ["none", "any"];
  const presOk = (fc) => fc.pres === "any" || pres === "any" || fc.pres === pres;
  const exact = faces.filter((fc) => fc.tone === tone && presOk(fc));
  if (exact.length) return exact;
  const byPres = faces.filter(presOk);
  return byPres.length ? byPres : faces;
}

export function pickKit(manifest, { themes = [], seed = 1, saint = null } = {}) {
  if (!manifest?.backgrounds?.length) return null;
  const r = rng(seed ^ 0x5eed);
  const scored = manifest.backgrounds
    .map((b) => ({ b, s: b.themes.filter((t) => themes.includes(t)).length * 2 + r() * 1.5 }))
    .sort((x, y) => y.s - x.s);
  const bg = scored[Math.floor(r() * Math.min(3, scored.length))].b;
  const role = (x) => manifest.textures.filter((t) => t.role === x);
  const pick = (arr, not = []) => { const pool = arr.filter((t) => !not.includes(t)); return pool[Math.floor(r() * pool.length)] || arr[0]; };
  const robe = pick(role("robe"));
  const mantle = pick(role("robe"), [robe]);
  const crystal = pick(role("crystal"));
  const wing = pick([...role("crystal"), ...role("robe")], [crystal, robe, mantle]);
  const paint = pick(role("paint"));
  const faces = faceCandidates(manifest.faces, saint);
  const robots = faces.filter((fc) => fc.tone === "robot");
  const pool = saint?.kind === "angel" && robots.length && r() < 0.5 ? robots : faces.filter((fc) => fc.tone !== "robot");
  const face = pool.length ? pool[Math.floor(r() * pool.length)] : null;
  return { bg, robe, mantle, crystal, wing, paint, face };
}

// Files needed for a pick (for preloading).
export const kitFiles = (pick) => (pick ? Object.values(pick).filter(Boolean).map((x) => x.file) : []);
