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

// ---------- Offline composer ----------
function scoreBy(items, themes) {
  return items
    .map((it) => ({ it, s: it.themes.filter((t) => themes.includes(t)).length + Math.random() * 0.3 }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.it);
}

const PHRASES = {
  motherhood: "the holy and exhausting work of mothering", parenting: "the children you have entrusted to me",
  marriage: "my marriage", relationships: "the relationships that shape my heart", family: "my family, with all its wounds and love",
  finances: "the worry of providing and making ends meet", work: "my work and the search for meaningful work",
  addiction: "my recovery, one day at a time", health: "my body and its healing", grief: "the one I have lost and still love",
  decisions: "the decision before me", growth: "who You are making me to become", faith: "my faith, in its light and its questions",
  gratitude: "the gifts You have poured into my life", overwhelm: "everything that feels like too much", anxiety: "the anxious thoughts that crowd my mind",
  loneliness: "the loneliness I carry", sadness: "this sadness", anger: "the anger burning in me", hope: "the hope stirring in me",
  confusion: "what I cannot yet understand", peace: "this gift of peace", discouragement: "my tired and discouraged heart",
  inspiration: "the fire You have lit in me", fear: "what I am afraid of",
};

function composeOffline(checkin, context) {
  const style = loadStyle();
  let themes = themesFromCheckin(checkin);
  if (checkin.mode === "thanks" && !themes.includes("gratitude")) themes.unshift("gratitude");
  if (!themes.length) themes = ["peace", "faith", "hope"];

  const saints = scoreBy(SAINTS, themes).slice(0, 3);
  const scripture = scoreBy(SCRIPTURE, themes).slice(0, 2);
  const prayers = scoreBy(DEVOTIONS.filter((d) => d.kind === "prayer"), themes);
  const other = scoreBy(DEVOTIONS.filter((d) => d.kind !== "prayer"), themes);
  const devotions = [prayers[0], other[0], other[1]].filter(Boolean);

  const named = themes.slice(0, 3).map((t) => PHRASES[t]).filter(Boolean);
  const isThanks = themes[0] === "gratitude" || checkin.mode === "thanks";
  const who = checkin.personName;
  const body = [
    who
      ? `Loving God, I bring ${who} before You today. You know ${who} more deeply than I ever could, and You hold every part of their story.`
      : `Loving God, You know what is on my heart before I can find the words. I come to You just as I am today.`,
    isThanks
      ? `Thank You for ${named.join(", ")}. Teach me to notice Your goodness, to receive it with open hands, and to share it freely.`
      : `I place before You ${named.join(", and ")}. Where I am weary, be my rest. Where I am afraid, be my courage. Where I cannot see the way, be my light.`,
    `${saints[0].name}${saints[1] ? ` and ${saints[1].name}` : ""}, you knew struggle and grace in your own lives — pray for ${who ? who : "me"}, that ${who ? "they" : "I"} may trust that nothing is wasted in God's hands.`,
    `Stay close today, Lord. Let me feel that I am held, and let me hold others with the same tenderness.`,
  ].join("\n\n");

  const motifPool = themes.flatMap((t) => style.motifs.byTheme[t] || []);
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const archetypes = style.composition.archetypes.map((a) => a.id).filter((id) => !(context.recentCompositions || []).includes(id));
  const central = motifPool[0] || "a geode holding a luminous seed";

  return {
    intention_title: isThanks ? "A day of thanksgiving" : `Prayer for ${themes[0].replace(/^\w/, (c) => c.toUpperCase())}`.replace("Prayer for Overwhelm", "When it is all too much"),
    opening: isThanks
      ? "What a gift to pause and give thanks. Here is a prayer and some companions for your gratitude today."
      : "Thank you for trusting this moment with prayer. You are not alone in what you are carrying.",
    themes,
    saints: saints.map((s) => ({ id: s.id, why: `${s.name} is a patron of ${s.patronages.slice(0, 2).join(" and ")}. ${s.story.split(". ")[0]}.` })),
    prayer: { title: who ? `A prayer for ${who}` : isThanks ? "A prayer of thanksgiving" : "A prayer for today", body, closing: "Through Christ our Lord. Amen." },
    scripture: scripture.map((s) => ({ id: s.id, connection: "A word to rest in today, slowly, more than once." })),
    devotions: devotions.map((d) => ({ id: d.id, suggestion: d.kind === "rosary" ? "If a whole Rosary feels like too much today, one decade is a beautiful prayer." : "Pray it slowly, perhaps once in the morning and once at night." })),
    reflection: isThanks
      ? "Gratitude is a way of seeing. Carry one of today's gifts with you, and say thank you for it again tonight."
      : "You do not need to have everything figured out to be held by God today. Take the next small step, and let that be enough.",
    art_brief: {
      title: isThanks ? "Overflowing Light" : "Held in the Night Garden",
      concept: `A symbolic meditation on ${named[0] || "being held by God"}.`,
      central_symbol: central,
      motifs: pick(motifPool.slice(1).concat(style.motifs.universal), 4),
      composition: archetypes[Math.floor(Math.random() * archetypes.length)] || "halo_icon",
      mood: isThanks ? "celebratory, abundant, joyful" : "tender, steady, quietly hopeful",
      palette_emphasis: isThanks ? ["Marigold orange", "Hibiscus pink"] : ["Lagoon turquoise", "Soft peach"],
      include_figure: !isThanks,
    },
  };
}

// ---------- Hydrate model choices with library facts ----------
function hydrate(raw) {
  const uniq = (arr) => arr.filter((x, i) => arr.findIndex((y) => y.id === x.id) === i);
  const saints = uniq(raw.saints).slice(0, 5).map((s) => ({ ...saintById(s.id), why: s.why })).filter((s) => s.id);
  const scripture = uniq(raw.scripture).slice(0, 3).map((s) => ({ ...scriptureById(s.id), connection: s.connection })).filter((s) => s.id);
  const devotions = uniq(raw.devotions).slice(0, 3).map((d) => ({ ...devotionById(d.id), suggestion: d.suggestion })).filter((d) => d.id);
  return { ...raw, saints, scripture, devotions };
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
