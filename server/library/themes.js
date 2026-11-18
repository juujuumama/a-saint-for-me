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
  motherhood: ["mama", "pregnant", "ivf", "infertil", "breastfeed", "nursing", "my baby", "baby", "motherhood", "newborn", "postpartum", "as a mom", "being a mom", "i'm a mom", "im a mom", "new mom", "miscarriage"],
  parenting: ["my son", "my daughter", "my kids", "my children", "my kids", "my child", "school", "custody", "kid", "child", "children", "parent", "toddler", "teen"],
  marriage: ["my husband", "my wife", "cheat", "affair", "husband", "wife", "marriage", "married", "spouse", "divorce"],
  relationships: ["boyfriend", "girlfriend", "partner", "relationship", "breakup", "broke up", "dating", "friend"],
  family: ["my mom", "my mother", "my dad", "my father", "my parents", "my grandma", "my grandmother", "my grandpa", "my sister", "my brother", "family", "sister", "brother", "father", "dad", "in-law", "estranged"],
  finances: ["paycheck", "afford", "savings", "loan", "credit card", "food stamps", "money", "rent", "bills", "debt", "afford", "financial", "broke", "evict"],
  work: ["coworker", "promotion", "my shift", "quit", "job", "work", "boss", "career", "laid off", "fired", "interview", "unemploy"],
  addiction: ["using again", "staying clean", "pills", "weed", "aa ", "na ", "addict", "sober", "sobriety", "relapse", "drink", "alcohol", "drug", "recovery", "gambl"],
  health: ["doctor", "therapy", "mri", "biopsy", "scan", "test results", "chronic", "sick", "illness", "cancer", "diagnos", "surgery", "hospital", "pain", "health", "chemo"],
  grief: ["miss her", "miss him", "anniversary of", "passed", "cemetery", "grandmother", "grandfather", "grandma", "grandpa", "died", "death", "passed away", "funeral", "grief", "grieving", "loss", "miscarriage", "lost my"],
  decisions: ["choose", "not sure if", "torn between", "offer", "decide", "decision", "choice", "move", "should i", "discern"],
  gratitude: ["happy", "joy", "excited", "answered prayer", "good news", "thank", "grateful", "blessed", "celebrat", "engaged", "promotion", "birth"],
  anxiety: ["nervous", "can't sleep", "racing thoughts", "on edge", "anxious", "anxiety", "panic", "worry", "worried", "stress"],
  loneliness: ["no friends", "nobody", "no one", "lonely", "alone", "isolated"],
  sadness: ["heartbroken", "empty", "numb", "feeling down", "sad", "depress", "crying", "cry"],
  anger: ["mad", "hate", "betray", "unfair", "angry", "anger", "furious", "resent", "rage"],
  fear: ["worried", "what if", "terrif", "afraid", "scared", "fear", "terrified"],
  overwhelm: ["tired", "drained", "can't keep up", "so much", "overwhelm", "too much", "exhausted", "burned out", "burnout"],
  confusion: ["confused", "don't know", "unsure", "feel lost"],
  faith: ["faith", "god", "prayer", "church", "doubt", "mass"],
  hope: ["looking forward", "new start", "fresh start", "hope", "hopeful"],
  discouragement: ["discourag", "give up", "hopeless", "failing"],
};

export function detectThemes(text = "") {
  // "alone with my toddler" is a parenting stretch, not loneliness
  const t = text.toLowerCase().replace(/\b(home )?(alone|by myself|on my own) with ((my|the|our|both|all) )?((\w+ )?(kids|children|toddler|baby|babies|son|daughter|little ones?|twins|newborn|boys|girls|kiddos|child))\b/g, "with $4");
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
