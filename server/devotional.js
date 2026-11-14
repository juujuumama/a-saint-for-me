// Builds a personalized devotional experience from a check-in.
// Primary path: Claude, constrained by a structured-output schema whose saint,
// Scripture and devotion fields are ENUMS of the curated library — so the model
// can choose and explain, but never invent a saint or misquote a prayer.
// Fallback path: an offline composer, so prayer never depends on an API being up.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { SAINTS, SAINT_IDS, saintById } from "./library/saints.js";
import { SCRIPTURE, SCRIPTURE_IDS, scriptureById } from "./library/scripture.js";
import { DEVOTIONS, DEVOTION_IDS, devotionById } from "./library/devotions.js";
import { THEMES, themesFromCheckin, EMOTIONS, CIRCUMSTANCES } from "./library/themes.js";
import { loadStyle } from "./art/style.js";
import { composeOffline as composeOfflineWith, hydrate } from "./compose-offline.js";
const composeOffline = (checkin, context) => composeOfflineWith(checkin, context, loadStyle());

const MODEL = process.env.DEVOTIONAL_MODEL || "claude-opus-5-5";
const hasClaude = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
let client = null;
const claude = () => (client ||= new Anthropic());

const COMPOSITION_IDS = () => loadStyle().composition.archetypes.map((a) => a.id);

function schema() {
  return z.object({
    intention_title: z.string().describe("3–6 word neutral title for this intention, e.g. 'Strength in early motherhood'. No names, no private details."),
    opening: z.string().describe("1–2 warm sentences acknowledging what the person shared, without repeating private details back verbatim."),
    themes: z.array(z.enum(THEMES)),
    saints: z.array(z.object({
      id: z.enum(SAINT_IDS),
      why: z.string().describe("2–3 sentences on why this saint is a companion for THIS situation, grounded in the facts provided."),
    })).describe("2 to 5 saints"),
    prayer: z.object({
      title: z.string(),
      body: z.string().describe("An original Catholic prayer, 120–220 words, addressed to God (or asking a saint's intercession), naming the person's actual circumstances with compassion. Paragraphs separated by blank lines."),
      closing: z.string().describe("Short closing line, e.g. 'Through Christ our Lord. Amen.'"),
    }),
    scripture: z.array(z.object({
      id: z.enum(SCRIPTURE_IDS),
      connection: z.string().describe("1–2 sentences connecting the passage to their circumstances."),
    })).describe("2 or 3 passages"),
    devotions: z.array(z.object({
      id: z.enum(DEVOTION_IDS),
      suggestion: z.string().describe("One sentence on how or when to pray it today."),
    })).describe("2 or 3 traditional prayers or devotions"),
    reflection: z.string().describe("A short closing reflection (2–4 sentences) to carry into the day. Encouraging, not preachy."),
    art_brief: z.object({
      title: z.string().describe("A poetic 2–5 word title for the artwork."),
      concept: z.string().describe("The symbolic idea of the image in one sentence. Symbolic, not literal. Must contain NO names, places or private details from the check-in."),
      central_symbol: z.string(),
      motifs: z.array(z.string()).describe("3–5 supporting visual motifs"),
      composition: z.enum(COMPOSITION_IDS()),
      mood: z.string(),
      palette_emphasis: z.array(z.string()).describe("2–3 colors from the house palette to emphasize"),
      include_figure: z.boolean().describe("Whether a human figure (collage silhouette) belongs in the image"),
    }),
  });
}

function systemPrompt() {
  const style = loadStyle();
  const saints = SAINTS.map((s) => `- ${s.id}: ${s.name} (${s.years}); patron of ${s.patronages.join(", ")}; themes: ${s.themes.join(", ")}`).join("\n");
  const scripture = SCRIPTURE.map((s) => `- ${s.id}: ${s.ref} — "${s.text}"`).join("\n");
  const devotions = DEVOTIONS.map((d) => `- ${d.id}: ${d.title} [${d.kind}]; themes: ${d.themes.join(", ")}`).join("\n");
  const motifs = Object.entries(style.motifs.byTheme).map(([k, v]) => `- ${k}: ${v.join("; ")}`).join("\n");
  const compositions = style.composition.archetypes.map((a) => `- ${a.id}: ${a.description}`).join("\n");

  return `You are the devotional writer and art director for "A Saint for Me", a Catholic app that gives each person a personalized daily devotional: saints, an original prayer, Scripture, traditional devotions, a reflection, and an original artwork.

VOICE
- Warm, reverent, emotionally intelligent, faithful to Catholic teaching. Never preachy, never saccharine, never clinical.
- Meet the person where they are. Do not assume more than they said. Do not moralize or diagnose.
- If they are celebrating, celebrate with them. If they are hurting, stay with them in it before offering hope.
- The prayer is ORIGINAL and personal: it names their real circumstances (in general terms), feelings and hopes. If they are praying for someone else, pray for that person by the first name given.
- Never claim the prayer is a traditional or official prayer of the Church.
- If anything suggests danger to themselves or others, gently encourage reaching out to a trusted person or professional within the opening, and keep the prayer tender.

SAINTS — choose only from this list, and explain using these facts; do not add biographical claims beyond them:
${saints}

SCRIPTURE — choose only from these passages:
${scripture}

TRADITIONAL PRAYERS & DEVOTIONS — choose only from this list:
${devotions}

ART DIRECTION
House style: ${style.summary}
The art brief will be turned into an image prompt. It must be SYMBOLIC and contain no names, places or private details from the check-in (the image service never sees the person's words). Avoid literal depictions: ${style.avoid.join("; ")}.
Theme motif vocabulary (draw from it, recombine, or invent in its spirit):
${motifs}
Composition archetypes:
${compositions}
Vary compositions; if previous compositions are listed in the request, choose a different one.`;
}

function userPrompt(checkin, context) {
  const emo = checkin.emotions.map((id) => EMOTIONS.find((e) => e.id === id)?.label).filter(Boolean);
  const circ = checkin.circumstances.map((id) => CIRCUMSTANCES.find((c) => c.id === id)?.label).filter(Boolean);
  const lines = [];
  const modeText = {
    new: "Sharing what is on their heart today.",
    continue: "Continuing to pray about an earlier intention.",
    someone: "Praying for someone else.",
    thanks: "Giving thanks.",
  }[checkin.mode] || "Sharing what is on their heart today.";
  lines.push(`Mode: ${modeText}`);
  if (emo.length) lines.push(`Feelings selected: ${emo.join(", ")}`);
  if (circ.length) lines.push(`Circumstances selected: ${circ.join(", ")}`);
  if (checkin.personName) lines.push(`Praying for: ${checkin.personName}`);
  if (context.previous) {
    lines.push(`Earlier intention they chose to continue: "${context.previous.title}" (from ${context.previous.date}). Do not assume it is unchanged; let today's words lead.`);
    if (context.previous.summary) lines.push(`What they shared then (kept with their permission): ${context.previous.summary}`);
  }
  if (context.recentCompositions?.length) lines.push(`Previous compositions to avoid repeating: ${context.recentCompositions.join(", ")}`);
  lines.push(`Today's date: ${new Date().toDateString()}`);
  lines.push(`In their own words:\n"""${checkin.text || "(they did not write anything; work from the selections)"}"""`);
  return lines.join("\n");
}

async function composeWithClaude(checkin, context) {
  const response = await claude().beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(schema()) },
    system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userPrompt(checkin, context) }],
  });
  if (response.stop_reason === "refusal") throw new Error("model declined");
  if (!response.parsed_output) throw new Error("no structured output");
  return response.parsed_output;
}

export async function composeDevotional(checkin, context = {}) {
  let raw, source;
  if (hasClaude()) {
    try {
      raw = await composeWithClaude(checkin, context);
      source = "claude";
    } catch (err) {
      console.error("[devotional] Claude failed, using offline composer:", err?.status || "", err?.message);
    }
  }
  if (!raw) { raw = composeOffline(checkin, context); source = "offline"; }
  const out = hydrate(raw);
  if (out.saints.length < 2) {
    const extra = composeOffline(checkin, context);
    out.saints = hydrate({ ...extra, scripture: [], devotions: [] }).saints;
  }
  return { ...out, source, model: source === "claude" ? MODEL : null };
}
