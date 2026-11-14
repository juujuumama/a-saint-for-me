// Offline devotional composer + library hydration. Pure module (no Node APIs),
// shared by the server and the free browser-only (GitHub Pages) edition.
import { SAINTS, saintById } from "./library/saints.js";
import { SCRIPTURE, scriptureById } from "./library/scripture.js";
import { DEVOTIONS, devotionById } from "./library/devotions.js";
import { themesFromCheckin } from "./library/themes.js";

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

export function composeOffline(checkin, context = {}, style) {
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
    reflection: pickReflection(themes, isThanks),
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

const REFLECTIONS = {
  thanks: ["Gratitude is a way of seeing. Carry one of today's gifts with you, and say thank you for it again tonight.", "Joy shared is joy multiplied. Tell someone today what you are thankful for.", "Every good gift comes from above. Let today's thanks become tomorrow's trust."],
  grief: ["Love does not end. The ones we have lost are held in the same hands that hold us.", "Grief is love with nowhere to go. Let it go to God today, a little at a time.", "You may carry this for a long while. You will not carry it alone."],
  fear: ["Do not be afraid. It is the most repeated command in Scripture, and it always comes with a promise: I am with you.", "Courage is not the absence of fear. It is one small yes, said while trembling.", "You are guarded more closely than you know. Rest in that tonight."],
  hope: ["Morning comes, even after the longest night. Watch for one small sign of it today.", "Hope is a seed, not a feeling. Plant it anyway.", "Nothing is wasted in God's hands. Not even this."],
  growth: ["Becoming whole is slow, holy work. Be as patient with yourself as God is.", "Every saint has a past. Every sinner has a future.", "One honest step today is enough."],
  default: ["You do not need to have everything figured out to be held by God today. Take the next small step, and let that be enough.", "Be still for one minute today. That minute is a prayer.", "You are seen, you are known, and you are loved exactly where you are."],
};
const REFLECT_MAP = { grief: "grief", sadness: "grief", fear: "fear", anxiety: "fear", overwhelm: "fear", hope: "hope", discouragement: "hope", finances: "hope", work: "hope", addiction: "growth", growth: "growth", decisions: "growth" };
function pickReflection(themes, isThanks) {
  const pool = REFLECTIONS[isThanks ? "thanks" : REFLECT_MAP[themes.find((t) => REFLECT_MAP[t])] || "default"];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Hydrate model choices with library facts ----------
export function hydrate(raw) {
  const uniq = (arr) => arr.filter((x, i) => arr.findIndex((y) => y.id === x.id) === i);
  const saints = uniq(raw.saints).slice(0, 5).map((s) => ({ ...saintById(s.id), why: s.why })).filter((s) => s.id);
  const scripture = uniq(raw.scripture).slice(0, 3).map((s) => ({ ...scriptureById(s.id), connection: s.connection })).filter((s) => s.id);
  const devotions = uniq(raw.devotions).slice(0, 3).map((d) => ({ ...devotionById(d.id), suggestion: d.suggestion })).filter((d) => d.id);
  return { ...raw, saints, scripture, devotions };
}

