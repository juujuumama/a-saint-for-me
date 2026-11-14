// Check-in vocabulary shown to users, mapped to internal themes.
export const EMOTIONS = [
  { id: "overwhelmed", label: "Overwhelmed", theme: "overwhelm" },
  { id: "anxious", label: "Anxious", theme: "anxiety" },
  { id: "lonely", label: "Lonely", theme: "loneliness" },
  { id: "sad", label: "Sad", theme: "sadness" },
  { id: "angry", label: "Angry", theme: "anger" },
  { id: "hopeful", label: "Hopeful", theme: "hope" },
  { id: "grateful", label: "Grateful", theme: "gratitude" },
  { id: "confused", label: "Confused", theme: "confusion" },
  { id: "peaceful", label: "Peaceful", theme: "peace" },
  { id: "discouraged", label: "Discouraged", theme: "discouragement" },
  { id: "inspired", label: "Inspired", theme: "inspiration" },
  { id: "afraid", label: "Afraid", theme: "fear" },
];

export const CIRCUMSTANCES = [
  { id: "motherhood", label: "Motherhood & parenting", themes: ["motherhood", "parenting"] },
  { id: "relationships", label: "Relationships & marriage", themes: ["relationships", "marriage"] },
  { id: "family", label: "Family difficulties", themes: ["family"] },
  { id: "finances", label: "Financial hardship", themes: ["finances"] },
  { id: "work", label: "Employment", themes: ["work"] },
  { id: "addiction", label: "Addiction & recovery", themes: ["addiction"] },
  { id: "health", label: "Health & illness", themes: ["health"] },
  { id: "grief", label: "Grief & loss", themes: ["grief"] },
  { id: "decisions", label: "Major life decisions", themes: ["decisions"] },
  { id: "growth", label: "Personal growth", themes: ["growth"] },
  { id: "faith", label: "Faith & spirituality", themes: ["faith"] },
  { id: "gratitude", label: "Gratitude & celebration", themes: ["gratitude"] },
];

export const THEMES = [
  "motherhood", "parenting", "marriage", "relationships", "family", "finances", "work",
  "addiction", "health", "grief", "decisions", "growth", "faith", "gratitude",
  "overwhelm", "anxiety", "loneliness", "sadness", "anger", "hope", "confusion",
  "peace", "discouragement", "inspiration", "fear",
];

// Lightweight keyword detection for the offline composer (no AI key configured).
const KEYWORDS = {
  motherhood: ["mom", "mother", "motherhood", "baby", "pregnan", "newborn", "postpartum", "daughter", "son"],
  parenting: ["kid", "child", "children", "parent", "toddler", "teen"],
  marriage: ["husband", "wife", "marriage", "married", "spouse", "divorce"],
  relationships: ["boyfriend", "girlfriend", "partner", "relationship", "breakup", "broke up", "dating", "friend"],
  family: ["family", "sister", "brother", "father", "dad", "in-law", "estranged"],
  finances: ["money", "rent", "bills", "debt", "afford", "financial", "broke", "evict"],
  work: ["job", "work", "boss", "career", "laid off", "fired", "interview", "unemploy"],
  addiction: ["addict", "sober", "sobriety", "relapse", "drink", "alcohol", "drug", "recovery", "gambl"],
  health: ["sick", "illness", "cancer", "diagnos", "surgery", "hospital", "pain", "health", "chemo"],
  grief: ["grandmother", "grandfather", "grandma", "grandpa", "died", "death", "passed away", "funeral", "grief", "grieving", "loss", "miscarriage", "lost my"],
  decisions: ["decide", "decision", "choice", "move", "should i", "discern"],
  gratitude: ["thank", "grateful", "blessed", "celebrat", "engaged", "promotion", "birth"],
  anxiety: ["anxious", "anxiety", "panic", "worry", "worried", "stress"],
  loneliness: ["lonely", "alone", "isolated"],
  sadness: ["sad", "depress", "crying", "cry"],
  anger: ["angry", "anger", "furious", "resent", "rage"],
  fear: ["afraid", "scared", "fear", "terrified"],
  overwhelm: ["overwhelm", "too much", "exhausted", "burned out", "burnout"],
  confusion: ["confused", "don't know", "unsure", "feel lost"],
  faith: ["faith", "god", "prayer", "church", "doubt", "mass"],
  hope: ["hope", "hopeful"],
  discouragement: ["discourag", "give up", "hopeless", "failing"],
};

export function detectThemes(text = "") {
  const t = text.toLowerCase();
  // match at word starts, so "grandmother" doesn't read as "mother"
  const hit = (w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(t);
  return Object.entries(KEYWORDS)
    .filter(([, words]) => words.some(hit))
    .map(([theme]) => theme);
}

export function themesFromCheckin({ emotions = [], circumstances = [], text = "" }) {
  const set = new Set();
  // circumstances lead (they shape saints & art most), then feelings, then free text
  for (const c of circumstances) { const m = CIRCUMSTANCES.find((x) => x.id === c); if (m) m.themes.forEach((t) => set.add(t)); }
  for (const e of emotions) { const m = EMOTIONS.find((x) => x.id === e); if (m) set.add(m.theme); }
  detectThemes(text).forEach((t) => set.add(t));
  return [...set];
}
