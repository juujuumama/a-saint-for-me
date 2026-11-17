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
  ["I want to die", "despair", null, ""],
  ["I want to die, my mom doesn't even care", "despair", null, ""],
  ["my friend says she wants to die", "despair", null, "my friend"],
  ["I was raped last year and can't move on", "survivor", null, ""],
  ["my brother is in an abusive relationship", "abuse", null, "my brother"],
  ["this job is killing me", "job"],
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

// ---- Crisis detection: every one of these must show help; none of the everyday ones may ----
const { needsCare } = await import("../server/safety.js");
const MUST_SHOW_HELP = [
 "I want to kill myself",
 "i dont want to wake up tomorrow",
 "everyone would be better off without me",
 "I can't do this anymore, I'm done",
 "kms",
 "I want to end it",
 "thinking about ending things",
 "I don't want to be alive",
 "i wish i was dead",
 "I wish I were dead",
 "I've been cutting again",
 "no reason to keep going",
 "I'm a burden to everyone and want to disappear",
 "sometimes I think about suicide",
 "I took too many pills",
 "I have a plan to end my life",
 "life isn't worth living",
 "I want to die",
 "i dont wanna live anymore",
 "I'm going to hurt myself",
 "tired of living",
 "I can't go on",
 "better off dead",
 "unalive myself",
 "he hits me",
 "my boyfriend chokes me when he's mad",
 "I'm scared my husband will kill me",
 "my dad beats me",
 "he threatened to kill me",
 "she hurts my kids",
 "my stepdad touches me",
 "I was raped",
 "he forced himself on me",
 "I'm being abused",
 "I'm not safe at home",
 "suicidal thoughts won't stop",
 "I keep thinking about jumping",
 "I want to disappear forever",
 "what's the point of living",
 "I want to go to sleep and never wake up",
 "I dont think I can keep going",
 "honestly I just want it all to end",
 "I’m a burden",
 "thinking of ending it",
 "ive been hurting myself",
 "idk why im still here, wish i wasnt born",
 "my ex is stalking me",
 "he won't let me leave the house",
 "my uncle molested me when I was a kid",
 "I was sexually assaulted in college",
 "my husband shoved me into the wall",
 "he said he's going to kill me",
 "killing myself seems like the only way out",
 "I feel like there's no way out",
 "planning to take my own life",
 "I wanna die"
];
const MUST_NOT = [
 "my grandpa died last night",
 "this job is killing me",
 "I'm dying to see my sister",
 "my dog died",
 "I could kill for a vacation",
 "pray for my friend whose mom died",
 "I killed it at my interview!",
 "my plant is dying",
 "dead tired after work",
 "I'm done with my exams!",
 "my kids are killing me with their fighting lol",
 "we cut the cake at the wedding",
 "I hurt my knee",
 "he hit a home run",
 "my son took his own life last year",
 "I can't go on vacation this year",
 "can't go on the trip with my family",
 "my son killed it at his recital",
 "I'm so tired of my job",
 "I want to disappear into a good book",
 "this heat is killing me",
 "I beat my brother at chess",
 "my baby kicks me all night (pregnant!)",
 "he hit me up about a job",
 "the movie touched me deeply",
 "I don't want to wake up early tomorrow lol",
 "I cut myself shaving, pray for my clumsiness",
 "ending things with my boyfriend",
 "I want to end it with him",
 "my dad threatened to cut me off financially",
 "the sermon about abuse of power",
 "drug abuse runs in my family"
];
for (const m of MUST_SHOW_HELP) if (!needsCare(m)) { fail++; console.log(`✗ crisis MISSED: ${m}`); }
for (const m of MUST_NOT) if (needsCare(m)) { fail++; console.log(`✗ crisis false alarm: ${m}`); }
console.log(fail ? `\n${fail} problem(s) in ${CASES.length} cases` : `✓ all ${CASES.length} prayer cases and ${MUST_SHOW_HELP.length + MUST_NOT.length} crisis checks pass`);
process.exit(fail ? 1 : 0);
