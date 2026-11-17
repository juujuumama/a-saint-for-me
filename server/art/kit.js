// Chooses pieces from the artist's kit (public/kit/kit.json) for one artwork.
// Pure and deterministic: the same seed + themes + saint always picks the same pieces,
// so the browser edition can re-draw saved art without storing images.

// Saints are artistic interpretations: any of the artist's portraits can become any saint.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Any portrait can become any saint (artistic interpretation, not likeness).
// Robot faces are reserved for angels.
export function faceCandidates(faces = [], saint) {
  if (!saint || saint.kind === "angel") return faces;
  return faces.filter((fc) => fc.tone !== "robot");
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
  // Outfits: pick a series first (knit, neon, soft life…), then a fabric, so no one series dominates.
  const fams = [...new Set(role("robe").map((t) => t.fam || "knit"))];
  const outfit = (not = []) => pick(role("robe").filter((t) => (t.fam || "knit") === fams[Math.floor(r() * fams.length)]), not);
  const robe = outfit();
  const mantle = r() < 0.4 ? null : outfit([robe]); // null = solid jewel-tone mantle
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
