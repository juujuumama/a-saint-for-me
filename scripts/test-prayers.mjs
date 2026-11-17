// Regression tests for the built-in prayer library: what someone writes → which
// intention (and variant) they get, and who the prayer is for.
// Run: node scripts/test-prayers.mjs   (also runs before every GitHub Pages deploy)
import fs from "node:fs";
import { composeOffline } from "../server/compose-offline.js";
import { detectIntent, detectWho, INTENTS } from "../server/library/prayers.js";

const style = JSON.parse(fs.readFileSync(new URL("../config/style.json", import.meta.url), "utf8"));

// [text, expected intent id, expected title must include (optional), expected "who" (optional; "" = praying for self)]
const CASES = [
  ["I start a new job next week and I'm nervous", "joy_work", "new job", ""],
  ["I got the job!! starting monday", "joy_work"],
  ["got a raise at work today, so grateful", "joy_work", "raise"],
  ["I have a job interview tomorrow", "job", "interview"],
  ["I lost my job", "job"],
  ["My mom is in the hospal and has surgery tomorrow", "illness", "surgery", "my mom"],
  ["my husband has knee surgery friday", "illness", "surgery", "my husband"],
  ["my dad has a biopsy next week", "illness", "results", "my dad"],
  ["my mom was diagnosed with breast cancer", "cancer", null, "my mom"],
  ["my scan came back clear!", "joy_health"],
  ["the doctor said it's not cancer", "joy_health"],
  ["my dad has dementia", "illness", null, "my dad"],
  ["we're pregnant! so excited", "joy_pregnancy"],
  ["I just found out I'm pregnant and I'm scared", "joy_pregnancy", "new pregnancy", ""],
  ["we didn't get pregnant again this month", "infertility"],
  ["I'm not pregnant, but I wish I was", "infertility"],
  ["we lost the baby at 10 weeks", "babyloss"],
  ["my grandpa passed last night", "grief", null, "my grandpa"],
  ["my friend's mom died, how do I pray for her", "grief", null, "my friend's mom"],
  ["my best friend moved away and I miss her", "lonely", null, ""],
  ["my brother took his own life last month", "suicideloss", null, "my brother"],
  ["my dad is dying of cancer, hospice says days", "dying", null, "my dad"],
  ["my cat is sick", "pet", "sick pet"],
  ["my dog died", "pet"],
  ["I can't find my keys anywhere", "lostthing"],
  ["I'm afraid of flying tomorrow", "protection"],
  ["my house got flooded in the storm", "protection", "disaster"],
  ["my husband hits me and I'm scared to leave", "abuse"],
  ["my mom is a narcissist and everything is always about her", "difficult", null, "my mom"],
  ["my sister and I aren't speaking anymore", "friendship", null, ""],
  ["my wife and I keep arguing about money", "marriage", null, ""],
  ["my husband left me", "heartbreak", null, ""],
  ["my kids won't stop fighting", "parenting"],
  ["my son is being bullied at school", "parenting", null, "my son"],
  ["my daughter is starting kindergarten, I'm emotional", "parenting", null, "my daughter"],
  ["my teenage daughter is depressed", "mental", null, "my teenage daughter"],
  ["please pray for my son, he's in jail", "prison", null, "my son"],
  ["my brother is in jail and my mom is heartbroken", "prison", null, "my brother"],
  ["I'm 6 months sober but my brother is still using and I'm scared for him", "addiction", "my own recovery", "my brother"],
  ["I relapsed last night after 90 days", "addiction", null, ""],
  ["my son is addicted to fentanyl and I'm terrified he'll overdose", "addiction", "safety", "my son"],
  ["one year sober today", "joy_sober"],
  ["we're behind on rent and might get evicted", "money", "a "],
  ["I can't afford christmas presents for my kids", "money", "providing parent", ""],
  ["my sister is drowning in debt", "money", null, "my sister"],
  ["please pray for my friend, she's going through a hard time", "lovedone", null, "my friend"],
  ["I passed my driving test!", "joy_school"],
  ["I'm angry at God", "doubt", "angry at God"],
  ["I got engaged but I'm nervous about the wedding costs", "joy_love", "engagement"],
  ["I'm turning 40 and feel behind in life", "selfworth"],
  ["I'm moving across the country next week, excited and nervous", "joy_newchapter"],
];

let fail = 0;
for (const [text, intent, titleHas, who] of CASES) {
  const it = detectIntent(text, []);
  const d = composeOffline({ mode: "new", emotions: [], circumstances: [], text, personName: "" }, {}, style);
  const errs = [];
  if (it?.id !== intent) errs.push(`intent ${it?.id} ≠ ${intent}`);
  if (titleHas && !d.prayer.title.toLowerCase().includes(titleHas.toLowerCase())) errs.push(`title "${d.prayer.title}" lacks "${titleHas}"`);
  if (who !== undefined) {
    const got = d.intention_title.startsWith("Praying for ") ? d.intention_title.slice(12) : /for (my [^ ]+(?: [^ ]+)?)/.test(d.prayer.title) && who ? who : detectWho(text, it?.id) && d.prayer.body.includes(detectWho(text, it?.id)) ? detectWho(text, it?.id) : "";
    if ((got || "") !== who) errs.push(`who "${got}" ≠ "${who}"`);
  }
  // grammar: no leftover placeholders or "she are"/"he are"
  if (/\{|\b(she|he) (are|were)\b/.test(d.prayer.body + d.opening + d.prayer.title)) errs.push("grammar/placeholder");
  if (errs.length) { fail++; console.log(`✗ ${text}\n    ${errs.join("; ")}`); }
}
// every saint / scripture / devotion an intention names must exist
const lib = await Promise.all(["saints", "scripture", "devotions"].map((n) => import(`../server/library/${n}.js`)));
const has = [(id) => lib[0].saintById(id), (id) => lib[1].scriptureById(id), (id) => lib[2].devotionById(id)];
for (const it of INTENTS) for (const v of [it, ...(it.variants || [])]) {
  ["saints", "scripture", "devotions"].forEach((k, i) => (v[k] || []).forEach((id) => { if (!has[i](id)) { fail++; console.log(`✗ ${it.id}: unknown ${k} "${id}"`); } }));
}
console.log(fail ? `\n${fail} problem(s) in ${CASES.length} cases` : `✓ all ${CASES.length} prayer cases pass`);
process.exit(fail ? 1 : 0);
