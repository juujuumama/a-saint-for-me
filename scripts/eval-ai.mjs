// Scores the word matcher, the AI and the combination on realistic messages (scripts/ai-eval-cases.json).
//   CLOUDFLARE_API_TOKEN=... node scripts/eval-ai.mjs   (uses a little of the free daily AI allowance)
import fs from "node:fs";
const R = new URL("../", import.meta.url).pathname;
const { SYSTEM, MODEL } = await import(R + "scripts/deploy-worker.mjs");
const P = await import(R + "server/library/prayers.js");
const A = "4701146901783da90c00f6a8662abb6f";
const set = JSON.parse(fs.readFileSync(process.argv[2] || new URL("./ai-eval-cases.json", import.meta.url), "utf8"));
const lowConf = (it) => { const c = P.matchConfidence(); return !it || it.id === "lovedone" || c.best < 1.5 || c.best - c.next < 0.75; };
let L = 0, AI = 0, H = 0, Lw = 0, AIw = 0, Hw = 0, asked = 0, neurons = 0; const rows = [];
for (const [text, intent, who] of set) {
  const li = P.detectIntent(text, []); const low = lowConf(li); const lwho = P.detectWho(text, li?.id);
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${A}/ai/run/${MODEL}`, { method: "POST", headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "system", content: SYSTEM }, { role: "user", content: text }], max_tokens: 120, temperature: 0, chat_template_kwargs: { enable_thinking: false } }) }).then((r) => r.json());
  neurons += r.result?.usage?.neurons || 0;
  const raw = r.result?.choices?.[0]?.message?.content ?? r.result?.response ?? ""; let j = {}; try { j = JSON.parse(String(raw).match(/\{[\s\S]*\}/)?.[0] || "{}"); } catch {}
  const awho = (j.who || "").toLowerCase();
  const hi = low ? j.intent : li?.id, hwho = low ? awho : lwho; if (low) asked++;
  L += li?.id === intent; AI += j.intent === intent; H += hi === intent;
  Lw += lwho === who; AIw += awho === who; Hw += hwho === who;
  rows.push(`${li?.id === intent ? "✓" : "✗"}${j.intent === intent ? "✓" : "✗"}${hi === intent ? "✓" : "✗"} ${low ? "AI " : "   "} want ${intent}/${who || "-"} | local ${li?.id}/${lwho || "-"} | ai ${j.intent}/${awho || "-"} | ${text.slice(0, 60)}`);
}
console.log(rows.join("\n"));
console.log(`\nintent: local ${L}/${set.length}, AI ${AI}/${set.length}, combined ${H}/${set.length} (AI asked on ${asked})\nwho:    local ${Lw}, AI ${AIw}, combined ${Hw}\navg neurons/request ${(neurons / set.length).toFixed(1)} → ~${Math.round(10000 / (neurons / set.length))} AI requests/day free`);
