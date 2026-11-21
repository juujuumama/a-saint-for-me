// Deploys worker/worker.js to Sierra's Cloudflare account as "a-saint-for-me"
// (https://a-saint-for-me.juujuumama.workers.dev), with the prayer-topic list built
// from the app's own library. Needs a Cloudflare API token (Workers Scripts edit).
//   CLOUDFLARE_API_TOKEN=... node scripts/deploy-worker.mjs
import fs from "node:fs";
import { INTENTS } from "../server/library/prayers.js";

const ACCOUNT = "4701146901783da90c00f6a8662abb6f";
const NAME = "a-saint-for-me";
export const MODEL = process.env.ASFM_MODEL || "@cf/google/gemma-4-26b-a4b-it";
const SAFETY = new Set(["despair", "survivor", "abuse"]); // handled on the device, never by AI
const label = (t) => (Array.isArray(t) ? t[0] : t || "").replace(/^A prayer (for|in|of|when|before|after) /i, "").replace(/^A prayer /i, "");
// short clarifications where topics are easy to confuse
const HINTS = {
  heartbreak: "a breakup, being left or cheated on", marriage: "struggles between spouses who are still together",
  lonely: "feeling alone or isolated, missing family or friends far away, lonely in a new place", mental: "depression, anxiety, a heavy mind", overwhelm: "too much to do, stretched thin",
  suicideloss: "someone died by suicide", grief: "someone died", sickchild: "a child is sick", illness: "an adult is sick or having surgery",
  difficult: "a hard person: narcissistic, controlling, toxic", job: "work stress, job loss, job search", parenting: "raising kids, patience, solo parenting",
  lovedone: "praying for someone, nothing more specific fits",
};
const usable = INTENTS.filter((it) => !SAFETY.has(it.id));
export const CATALOG = usable.map((it) => {
  const vs = (it.variants || []).map((v, i) => `${i + 1}=${label(v.title)}`).join("; ");
  const note = it.joy || it.celebrate ? " (good news, even if they're also nervous)" : HINTS[it.id] ? ` (${HINTS[it.id]})` : "";
  return `${it.id}: ${label(it.title)}${note}${vs ? ` [variants: ${vs}]` : ""}`;
}).join("\n");

export const SYSTEM = `You sort prayer requests for a Catholic prayer app. Read what the person wrote (often a voice note) and choose the ONE prayer topic that fits best from this list (id: description [variants]):
${CATALOG}

Reply with JSON only, no other text:
{"intent":"<id from the list>","variant":<variant number, or 0 for the general prayer>,"who":"<who the prayer is FOR, copied from their words, like \\"my toddler\\" or \\"my mom\\"; empty string if the prayer is for the person writing>","also":"<a second topic id if they clearly mention another worry, else empty string>"}
Rules:
- "who" is empty when the person is praying about their own feelings, needs or behavior, even if others are mentioned ("my husband left me", "my wife and I keep fighting", "I keep yelling at my kids", "I'm alone with my toddler").
- "who" is a person only when the prayer is mainly for that person's situation ("my mom has cancer", "pray for my son").
- Choose the most specific topic. Use "lovedone" only when nothing more specific fits.`;

if ((process.argv[1] || "").endsWith("deploy-worker.mjs")) {
  const code = fs.readFileSync(new URL("../worker/worker.js", import.meta.url), "utf8")
    .replace('"__SYSTEM__"', JSON.stringify(SYSTEM))
    .replace("__IDS__", JSON.stringify(usable.map((it) => it.id)))
    .replace("__VARIANTS__", JSON.stringify(Object.fromEntries(usable.map((it) => [it.id, (it.variants || []).length]))))
    .replace("__MODEL__", MODEL);
  const api = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/${NAME}`;
  const auth = { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ main_module: "worker.js", compatibility_date: "2026-11-01", bindings: [{ type: "ai", name: "AI" }] })], { type: "application/json" }));
  form.append("worker.js", new Blob([code], { type: "application/javascript+module" }), "worker.js");
  const up = await fetch(api, { method: "PUT", headers: auth, body: form }).then((r) => r.json());
  if (!up.success) { console.error("deploy failed:", JSON.stringify(up.errors)); process.exit(1); }
  const sub = await fetch(`${api}/subdomain`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ enabled: true, previews_enabled: false }) }).then((r) => r.json());
  console.log(`deployed ${NAME} (${MODEL}); workers.dev: ${sub.success ? "on" : JSON.stringify(sub.errors)}`);
}
