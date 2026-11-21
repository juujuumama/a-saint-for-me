// Offline devotional composer + library hydration. Pure module (no Node APIs),
// shared by the server and the free browser-only (GitHub Pages) edition.
import { SAINTS, saintById } from "./library/saints.js";
import { SCRIPTURE, scriptureById } from "./library/scripture.js";
import { DEVOTIONS, devotionById } from "./library/devotions.js";
import { themesFromCheckin } from "./library/themes.js";
import { INTENTS, SAINT_HOOKS, FEELING_LINES, JOY_NERVES, INVOCATIONS, CLOSINGS, detectIntent, detectWho, fill, matches, secondConcern, alsoFor } from "./library/prayers.js";

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

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const CONNECTIONS = [
  "A word to rest in today, slowly, more than once.",
  "Read it slowly. Let one phrase stay with you through the day.",
  "Try praying this line when your mind starts to race.",
  "Write it somewhere you'll see it today.",
];

export function composeOffline(checkin, context = {}, style) {
  let themes = themesFromCheckin(checkin);
  // Continuing an earlier intention: carry its themes forward when today's words add none.
  if (context.previous?.themes?.length) themes = [...new Set([...themes, ...context.previous.themes])];
  if (checkin.mode === "thanks" && !themes.includes("gratitude")) themes.unshift("gratitude");

  const text = checkin.text || "";
  // checkin.ai (optional) is what the AI understood: { intent, variant, who, also }.
  // Safety always comes first: despair, abuse and survivor prayers are never overridden.
  const found = detectIntent(text, themes);
  const ai = checkin.ai && !["despair", "survivor", "abuse"].includes(found?.id) ? checkin.ai : null;
  const aiIntent = ai && INTENTS.find((i) => i.id === ai.intent && !["despair", "survivor", "abuse"].includes(i.id));
  const intent = aiIntent || found || (checkin.mode === "thanks" ? INTENTS.find((i) => i.id === "gratitude") : null);
  if (intent) themes = [...new Set([...intent.themes, ...themes])];
  // A more specific version of the intention (e.g. a raise rather than a new job)
  const aiVariant = aiIntent && ai.variant > 0 ? intent.variants?.[ai.variant - 1] : null;
  const variant = aiVariant || intent?.variants?.find((v) => matches(v.when, text));
  const nervousBlock = variant ? variant.nervous : intent?.nervous;
  const nervousNews = Boolean(nervousBlock) && /\b(nervous|anxious|scared|afraid|worried|butterflies|jitters|overwhelmed)\b/i.test(text) && !/(!|\b(so excited|thrilled|so happy|can't wait|cant wait)\b)/i.test(text);
  let src = variant ? { ...intent, ...variant } : intent;
  if (nervousNews) src = { ...src, ...nervousBlock, joy: false, celebrate: false };
  if (!themes.length) themes = ["peace", "faith", "hope"];
  const isThanks = Boolean(src?.joy || src?.celebrate);

  // Who the prayer is for: with AI, only when the AI and the word matcher agree on the person
  // (the AI alone tends to name anyone mentioned: "I was hurtful to my sister").
  const localWho = detectWho(text, intent?.id);
  const sameWho = (a, b) => { const n = (x) => x.toLowerCase().replace(/^(my|the|our) /, "").split(" ").pop(); return a && b && (a.includes(n(b)) || b.includes(n(a))); };
  let who = checkin.personName || (aiIntent ? (sameWho(ai.who || "", localWho) ? localWho : "") : localWho);
  const otherMode = Boolean(who && (src?.other || intent?.id === "grief"));
  if (!otherMode) who = checkin.personName || "";

  // Saints, Scripture, devotions: the intention's own picks first, then the best theme matches.
  const pinned = (ids, lib) => (ids || []).map((id) => lib.find((x) => x.id === id)).filter(Boolean);
  const fillUp = (first, pool, n) => [...first, ...pool.filter((x) => !first.includes(x))].slice(0, n);
  const saints = fillUp(pinned(src?.saints, SAINTS), scoreBy(SAINTS, themes), 3);
  const scripture = fillUp(pinned(src?.scripture, SCRIPTURE), scoreBy(SCRIPTURE, themes), 2);
  const devotions = fillUp(pinned(src?.devotions, DEVOTIONS), [...scoreBy(DEVOTIONS.filter((d) => d.kind === "prayer"), themes).slice(0, 1), ...scoreBy(DEVOTIONS.filter((d) => d.kind !== "prayer"), themes)], 3);

  // The prayer
  let lead = saints[0];
  const feeling = themes.find((t) => FEELING_LINES[t] && !(intent?.themes || []).includes(t));
  const paras = [];
  if (intent) {
    const petition = otherMode ? fill(rand(src.other || src.self), who, text) : rand(src.self);
    paras.push(petition);
  } else {
    const named = themes.slice(0, 3).map((t) => PHRASES[t]).filter(Boolean);
    paras.push(`${rand(INVOCATIONS.self)} You know what is on my heart before I can find the words. I place before You ${named.join(", and ")}. Where I am weary, be my rest. Where I am afraid, be my courage. Where I cannot see the way, be my light.`);
  }
  const also = intent && !isThanks && !variant?.noAlso ? (aiIntent ? alsoFor(ai.also, intent) : secondConcern(text, intent)) : "";
  // don't add "my children" to a prayer that is already for a child
  const sameChild = also === "my children" && /\b(son|daughter|kids?|children|child|toddler|baby|babies|newborn|teen|teenager|stepson|stepdaughter)\b/i.test(who);
  if (also && !sameChild) paras[0] += ` And Lord, I also bring You ${also}.`;
  const nervous = /\b(nervous|scared|anxious|afraid|butterflies)\b/i.test(text);
  if (isThanks) { if (nervous && !otherMode) paras[0] += " " + rand(JOY_NERVES); }
  else if (feeling && !otherMode) paras[0] += " " + rand(FEELING_LINES[feeling]);
  // don't ask the same saint twice if the petition already names them
  const shortName = (x) => x.name.replace(/\s*\(.*\)/, "").split(",")[0];
  if (paras[0].includes(shortName(lead)) && saints[1]) lead = saints[1];
  const hook = intent?.hooks?.[lead.id] || SAINT_HOOKS[lead.id];
  paras.push(`${lead.name.replace(/\s*\(.*\)/, "")}${hook ? `, ${hook},` : ","} pray for ${otherMode ? `${who} and for me` : "me"}.`);
  const departed = otherMode && ["grief", "suicideloss"].includes(intent?.id);
  paras.push(departed ? fill(rand(CLOSINGS.departed), who, text)
    : isThanks ? (otherMode ? fill(rand(CLOSINGS.joyOther), who, text) : rand(CLOSINGS.joy))
    : otherMode ? fill(rand(CLOSINGS.other), who, text) : rand(CLOSINGS.self));
  const body = paras.join("\n\n");

  const title = otherMode && src?.titleOther ? fill(src.titleOther, who, text) : src ? rand(src.title) : "A prayer for today";
  const opening = otherMode && src?.openingOther ? fill(rand(src.openingOther), who, text) : src ? rand(src.opening) : "Thank you for trusting this moment with prayer. You are not alone in what you are carrying.";

  const motifPool = themes.flatMap((t) => style.motifs.byTheme[t] || []);
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const archetypes = style.composition.archetypes.map((a) => a.id).filter((id) => !(context.recentCompositions || []).includes(id));
  const central = motifPool[0] || "a geode holding a luminous seed";

  return {
    intention_title: context.previous?.title && !text ? context.previous.title
      : otherMode && !isThanks ? `Praying for ${who}` : title.replace(/^A prayer /, "Prayer "),
    opening,
    themes,
    saints: saints.map((s) => ({ id: s.id, why: `${SAINT_HOOKS[s.id] ? `${s.name.replace(/\s*\(.*\)/, "")}, ${SAINT_HOOKS[s.id]}, is a patron of ${s.patronages.slice(0, 2).join(" and ")}.` : `${s.name} is a patron of ${s.patronages.slice(0, 2).join(" and ")}.`} ${s.story.split(". ")[0]}.` })),
    prayer: { title, body, closing: "Through Christ our Lord. Amen." },
    scripture: scripture.map((s, i) => ({ id: s.id, connection: CONNECTIONS[(i + Math.floor(Math.random() * 4)) % CONNECTIONS.length] })),
    devotions: devotions.map((d) => ({ id: d.id, suggestion: d.kind === "rosary" ? "If a whole Rosary feels like too much today, one decade is a beautiful prayer." : d.kind === "devotion" ? "Consider it this week, when you have a quiet moment." : "Pray it slowly, perhaps once in the morning and once at night." })),
    reflection: src?.reflection ? rand(src.reflection) : pickReflection(themes, isThanks),
    art_brief: {
      title: isThanks ? "Overflowing Light" : "Held in the Night Garden",
      concept: `A symbolic meditation on ${PHRASES[themes[0]] || "being held by God"}.`,
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

