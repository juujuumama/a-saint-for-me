// Gentle safety net. Prayer never replaces urgent help, so when someone's words
// suggest danger we show real resources at the top of the experience,
// in addition to (never instead of) their prayer.
const PATTERNS = [
  /\bkill(ing)? myself\b/i, /\bsuicid/i, /\bend (it all|my life)\b/i, /\bwant to die\b/i,
  /\bdon'?t want to (live|be here)\b/i, /\bself[- ]?harm/i, /\bcut(ting)? myself\b/i,
  /\boverdos/i, /\bhurt(ing)? myself\b/i, /\bno reason to live\b/i,
  /\b(he|she|they) (hits|hit|beats|beat|hurts) me\b/i, /\bnot safe at home\b/i, /\babus(e|ing|ive)\b/i,
  /\bafraid of my (husband|wife|boyfriend|girlfriend|partner|dad|father|mom|mother)\b/i, /\bdomestic violence\b/i, /\bthreaten(s|ed) (me|to)\b/i, /\b(hits|hit|beats|chokes|choked) me\b/i,
];

export function needsCare(text = "") {
  return PATTERNS.some((p) => p.test(text));
}

export const CARE_RESOURCES = {
  heading: "You don't have to carry this alone",
  body: "If you are in danger or thinking about ending your life, please reach out to someone right now. Talking to a person is not a lack of faith.",
  links: [
    { label: "Call or text 988 (Suicide & Crisis Lifeline, US)", href: "tel:988" },
    { label: "Text HOME to 741741 (Crisis Text Line, US)", href: "sms:741741&body=HOME" },
    { label: "National Domestic Violence Hotline: 1-800-799-7233", href: "tel:18007997233" },
    { label: "Outside the US: find a helpline", href: "https://findahelpline.com" },
  ],
};
