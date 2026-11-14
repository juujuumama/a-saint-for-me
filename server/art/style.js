// The house visual style: loading, saving, and turning an art brief into a
// provider-ready prompt. The style lives in config/style.json and is editable
// from the founder Style Studio without touching code.
import fs from "node:fs";
import path from "node:path";

const STYLE_FILE = path.resolve(process.env.STYLE_FILE || "config/style.json");

export function loadStyle() {
  return JSON.parse(fs.readFileSync(STYLE_FILE, "utf8"));
}

export function saveStyle(style) {
  if (!style?.palette || !style?.composition?.archetypes?.length) throw new Error("style must include palette and composition.archetypes");
  style.version = (Number(loadStyle().version) || 0) + 1;
  fs.writeFileSync(STYLE_FILE, JSON.stringify(style, null, 2));
  return style;
}

const pickN = (arr, n, rnd) => [...arr].sort(() => rnd() - 0.5).slice(0, n);

export function buildArtPrompt(brief, { aspect = "portrait", seed = Date.now(), referenceNotes } = {}) {
  const style = loadStyle();
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);

  const comp = style.composition.archetypes.find((a) => a.id === brief.composition) || style.composition.archetypes[0];
  const paletteNames = style.palette.primary.map((p) => `${p.name} ${p.hex}`);
  const emphasis = (brief.palette_emphasis || []).join(", ");
  const technique = pickN(style.techniques, 3, rnd).join(", ");
  const textures = pickN(style.textures, 2, rnd).join(", ");
  const afro = brief.include_figure
    ? `Any human figure is a dignified collage silhouette or cut-paper portrait of a Black woman or man, with ${pickN(style.motifs.afrocentric, 2, rnd).join(" and ")}.`
    : `Incorporate ${pickN(style.motifs.afrocentric.slice(2), 1, rnd)[0]} as pattern.`;
  const notes = (referenceNotes ?? style.referenceNotes ?? []).filter(Boolean);

  const fill = {
    technique: `Hand-made surrealist Afrofuturist collage: ${technique}`,
    concept: brief.concept,
    central_symbol: brief.central_symbol,
    motifs: [...(brief.motifs || []), pickN(style.motifs.universal, 1, rnd)[0]].join("; "),
    composition: `${comp.description}; ${pickN(style.composition.preferences, 2, rnd).join("; ")}; ${aspect === "square" ? "square 1:1 format" : "tall portrait 2:3 format for phone screens"}`,
    mood: brief.mood,
    palette: `${paletteNames.join(", ")}${emphasis ? `, emphasizing ${emphasis}` : ""}. ${style.palette.rules}`,
    textures,
    afrocentric: afro,
    lighting: `${style.lighting.atmosphere}; no ${style.lighting.avoid}`,
    rules: [style.typography.inImage, ...style.sacredIconographyRules.slice(0, 4)].join(" "),
    avoid: style.avoid.join(", "),
  };
  let prompt = style.promptTemplate.replace(/\{(\w+)\}/g, (_, k) => fill[k] ?? "");
  if (notes.length) prompt += ` Founder style notes: ${notes.join(" ")}`;
  prompt += " This is an original composition; do not reproduce any existing artwork.";

  return {
    prompt,
    negative: style.avoid.join(", "),
    composition: comp.id,
    styleVersion: style.version,
  };
}
