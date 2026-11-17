// Gentle safety net. Prayer never replaces urgent help, so when someone's words
// suggest danger we show real resources at the top of the experience,
// in addition to (never instead of) their prayer.
// These lists lean toward showing help: a false alarm costs little, a miss costs a lot.
// Tested by scripts/test-prayers.mjs.

const SELF_HARM = [
  /\bkill(ing)? my ?self\b/, /\bkms\b/, /\bunalive\b/, /\bsuicid/, /\btak(e|ing) my (own )?life\b/,
  /\bend(ing)? (it all|my life|everything)\b/, /\bend(ing)? (it|things)\b(?! (with|between|there|here|on good))/, /\bwant (it|this|everything) (all )?to (end|be over|stop)\b/,
  /\b(want|wanted|wanna|wish) (to )?(die|be dead)\b/, /\bwish i (was|were|wasn'?t) (dead|alive|born|here)\b/, /\b(better off|rather be) dead\b/,
  /\b(don'?t|do not|dont) (want to|wanna) (live|be here|be alive|exist|go on|keep going)\b/, /\b(don'?t|do not|dont) (want to|wanna) wake up\b(?! (early|so early|this early|at|for|before|yet|on))/,
  /\bnever wake up\b/, /\bnot wake up\b/,
  /\bbetter off without me\b/, /\b(i'?m|i am|im) (just )?a burden\b/,
  /\b(no|any) (reason|point) (to|in) (live|living|keep going|go on|going on|being alive|be alive)\b/,
  /\bwhat'?s the point of (living|life|going on|being alive)\b/, /\blife (isn'?t|is not|isnt|not) worth living\b/, /\btired of (living|being alive)\b/,
  /\b(can'?t|cannot|don'?t think i can|dont think i can) (go on|keep going|do this any ?more|take (it|this) any ?more|live like this)\b(?!\s+(a|the|my|our|vacation|holiday|to)\b)/,
  /\bself[- ]?harm/, /\bcut(ting)? my ?self\b(?! (shaving|cooking|chopping|on|while|by accident|accidentally|with a))/, /\bcutting again\b/, /\b(hurt|hurting|harm|harming) my ?self\b/,
  /\b(i|i'll|ill|i might|i will|want to|wanna|going to|gonna|thinking (of|about)) (\w+ )?overdos/, /\btoo many pills\b/, /\btook (all )?(my|the) pills\b/,
  /\b(have|made|making) a plan to\b/, /\b(thinking|think) about jumping\b/, /\bjump off\b/, /\b(hang|shoot|drown) my ?self\b/,
  /\b(want to|wanna) disappear\b(?! (into|for|to|on|in)\b)/, /\bgive up on life\b/, /\bno way out\b/,
];

// Someone else may be in danger: "my friend says she wants to die"
const THIRD_PARTY = /\b(wants|said|says|saying|talks?|talking|threaten(s|ed|ing)?|told me|texted|posted|keeps saying)\b.{0,40}\b(to die|kill (him|her|them)sel(f|ves)|suicid|end (his|her|their) (own )?life|hurt (him|her|them)sel(f|ves)|better off without (him|her|them)|not (be|being) here)\b/;

const ABUSE = [
  /\babus/, /\bdomestic violence\b/, /\bnot safe (at home|with)\b/, /\bunsafe at home\b/,
  /\b(he|she|they|husband|wife|boyfriend|girlfriend|partner|ex|dad|father|stepdad|stepfather|mom|mother|stepmom|brother|uncle) (always |sometimes |just |often )?(hits|hit|beats|beat|hurts|hurt|chokes|choked|slaps|slapped|punches|punched|kicks|kicked|strangles|strangled|shoves|shoved|pushed|pushes) (me|my (kids|children|child|son|daughter|baby|mom|mother|sister|brother))\b(?! up)/,
  /\bthreaten(s|ed|ing)? (me|to kill|to hurt|my)\b/, /\b(will|going to|gonna|might|wants to|tried to) kill (me|us)\b/,
  /\b(afraid|scared|terrified) (of|that) my (husband|wife|boyfriend|girlfriend|partner|ex|dad|father|stepdad|stepfather|mom|mother|stepmom)\b/,
  /\brap(e|ed|ist)\b/, /\bsexual(ly)? (assault|abus)/, /\bmolest/, /\bassaulted\b/, /\bforced (himself|herself|me to)\b/,
  /\b(stepdad|stepfather|dad|father|uncle|brother|grandpa|grandfather|coach|teacher|boyfriend|neighbor|he) (touches|touched) me\b/,
  /\bstalk(s|ed|ing|er)\b/, /\bwon'?t let me leave\b/, /\btraffick/,
];

const norm = (text = "") => String(text).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, " ")
  // not about personal danger
  .replace(/\b(drug|substance|alcohol) abuse\b/g, " ").replace(/\babuse of (power|authority|trust)\b/g, " ");

// "my son took his own life" / "my brother killed himself" is a loss, handled by the grief prayers.
export function thirdPartyRisk(text = "") { return THIRD_PARTY.test(norm(text)); }
export function selfHarmRisk(text = "") { const t = norm(text); return SELF_HARM.some((p) => p.test(t)) || THIRD_PARTY.test(t); }
export function assaultMention(text = "") { return /\b(rap(e|ed|ist)|sexual(ly)? (assault|abus)|molest|assaulted|forced (himself|herself))/.test(norm(text)); }
export function abuseRisk(text = "") { const t = norm(text); return ABUSE.some((p) => p.test(t)); }
export function needsCare(text = "") { return selfHarmRisk(text) || abuseRisk(text); }

export const CARE_RESOURCES = {
  heading: "You don't have to carry this alone",
  body: "If you are in danger or thinking about ending your life, please reach out to someone right now. Talking to a person is not a lack of faith.",
  links: [
    { label: "Call or text 988 (Suicide & Crisis Lifeline, US)", href: "tel:988" },
    { label: "Text HOME to 741741 (Crisis Text Line, US)", href: "sms:741741&body=HOME" },
    { label: "National Domestic Violence Hotline: 1-800-799-7233", href: "tel:18007997233" },
    { label: "Sexual assault hotline (RAINN): 1-800-656-4673", href: "tel:18006564673" },
    { label: "Outside the US: find a helpline", href: "https://findahelpline.com" },
    { label: "In immediate danger? Call 911", href: "tel:911" },
  ],
};
