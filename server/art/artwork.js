// Orchestrates artwork for an experience: prompt -> provider -> stored file.
// PRIVACY: only the symbolic art brief reaches the image provider. The person's
// own words, names and circumstances never leave the devotional step.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildArtPrompt, loadStyle } from "./style.js";
import { generateImage } from "./providers.js";
import { wordsFrom } from "./procedural.js";
import { ART_DIR, REF_DIR, newId, saveUser, listReferences } from "../store.js";

function activeReferences() {
  return listReferences().filter((r) => r.useForGeneration).map((r) => ({ path: path.join(REF_DIR, r.file), mime: r.mime }));
}

export async function createArtwork(exp, { aspect = "portrait", providerId } = {}) {
  const seed = Math.floor(Math.random() * 2 ** 31);
  const brief = { ...exp.devotional.art_brief };
  // Rotate composition on regenerate so a new take really looks new.
  const prev = (exp.artHistory || []).map((a) => a.composition);
  if (prev.includes(brief.composition)) {
    const ids = loadStyle().composition.archetypes.map((a) => a.id).filter((id) => !prev.includes(id));
    if (ids.length) brief.composition = ids[seed % ids.length];
  }
  // The figure: an angel on days of fear or need for protection (if one was
  // recommended), otherwise the day's lead saint.
  const saints = exp.devotional.saints || [];
  const angelDay = (exp.devotional.themes || []).some((t) => ["fear", "anxiety", "loneliness", "overwhelm"].includes(t));
  const saint = (angelDay && saints.find((x) => x.kind === "angel")) || saints[0] || null;
  const built = buildArtPrompt(brief, { aspect, seed, saint });
  exp.art = { status: "generating", startedAt: new Date().toISOString() };
  saveUser();
  try {
    // Found-word strips: from the day's reflection or Scripture (never from what the person wrote).
    const d = exp.devotional, sources = [d.reflection, d.scripture?.[0]?.text, d.scripture?.[1]?.text].filter(Boolean);
    const rotated = sources.map((_, k) => sources[(seed + k) % sources.length]);
    const words = rotated.map(wordsFrom).find((w) => w.length) || wordsFrom("Be still, and know that I am God.");
    const out = await generateImage({ ...built, brief, themes: exp.devotional.themes, seed, aspect, words, saint, references: activeReferences() }, { providerId });
    const file = `${newId(9)}.${out.ext}`;
    fs.writeFileSync(path.join(ART_DIR, file), out.buffer);
    const record = {
      file, mime: out.mime, provider: out.provider, model: out.model, aspect, seed,
      composition: built.composition, styleVersion: built.styleVersion,
      title: brief.title, kind: out.provider === "procedural" ? "studio-sketch" : "ai-generated",
      createdAt: new Date().toISOString(), prompt: built.prompt,
    };
    exp.artHistory = [...(exp.artHistory || []), record];
    exp.art = { status: "ready", current: exp.artHistory.length - 1, notice: out.errors?.length && out.provider === "procedural" ? "Our image studio was unavailable, so this is a hand-built studio sketch. You can try again anytime." : null };
  } catch (err) {
    console.error("[art] failed:", err.message);
    exp.art = { status: "failed", current: exp.artHistory?.length ? exp.artHistory.length - 1 : null, notice: "We couldn't create artwork this time. Your prayer is ready, and you can try the art again." };
  }
  saveUser();
  return exp;
}

// Founder tool: read a reference artwork with Claude's vision and describe its
// style as reusable notes (palette, technique, composition, motifs).
const NotesSchema = z.object({
  palette: z.array(z.string()).describe("Dominant colors as 'name #HEX'"),
  techniques: z.array(z.string()),
  composition: z.array(z.string()),
  textures: z.array(z.string()),
  motifs: z.array(z.string()),
  atmosphere: z.string(),
  style_note: z.string().describe("One or two sentences, written as an instruction to an image model, capturing what makes this artist's style distinctive. Describe style only, not this specific image's subject, so it generalizes to new compositions."),
});

export async function analyzeReference(ref) {
  if (!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)) throw new Error("Set ANTHROPIC_API_KEY to analyze references.");
  if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(ref.mime)) throw new Error("Analysis supports PNG, JPEG, WEBP or GIF.");
  const client = new Anthropic();
  const data = fs.readFileSync(path.join(REF_DIR, ref.file)).toString("base64");
  const res = await client.beta.messages.parse({
    model: process.env.DEVOTIONAL_MODEL || "claude-opus-5-5",
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(NotesSchema) },
    messages: [{ role: "user", content: [
      { type: "image", source: { type: "base64", media_type: ref.mime, data } },
      { type: "text", text: "This is a reference artwork by the founder of a Catholic devotional art app. Describe its visual STYLE so other original artworks can share the same artistic identity without copying this piece. Be concrete and specific." },
    ] }],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) throw new Error("Could not analyze this image.");
  return res.parsed_output;
}
