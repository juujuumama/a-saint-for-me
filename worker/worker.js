// A Saint for Me: the small "understanding" service that runs on Sierra's Cloudflare account.
// It reads what someone wrote and picks the prayer topic from the app's own library. It never
// writes prayers itself, never stores or logs the message, and crisis detection stays in the app.
// Deployed by scripts/deploy-worker.mjs, which fills in CATALOG and MODEL.
const IDS = __IDS__;
const VARIANTS = __VARIANTS__; // number of variants per intent id
const MODEL = "__MODEL__";
const ORIGINS = [/^https:\/\/juujuumama\.github\.io$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];

const SYSTEM = "__SYSTEM__";

function cors(req) {
  const o = req.headers.get("Origin") || "";
  return ORIGINS.some((r) => r.test(o)) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", Vary: "Origin" } : null;
}
const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

export default {
  async fetch(req, env) {
    const h = cors(req);
    if (!h) return json({ error: "not allowed" }, 403, {});
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (req.method !== "POST" || new URL(req.url).pathname !== "/understand") return json({ error: "not found" }, 404, h);
    let text = "";
    try { text = String((await req.json()).text || "").slice(0, 1200).trim(); } catch {}
    if (text.length < 3) return json({ error: "empty" }, 400, h);
    try {
      const out = await env.AI.run(MODEL, { messages: [{ role: "system", content: SYSTEM }, { role: "user", content: text }], max_tokens: 120, temperature: 0, chat_template_kwargs: { enable_thinking: false } });
      let raw = out?.response ?? out?.choices?.[0]?.message?.content ?? "";
      if (typeof raw !== "string") raw = JSON.stringify(raw);
      const j = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");
      if (!IDS.includes(j.intent)) return json({ error: "unsure" }, 422, h);
      const variant = Number.isInteger(j.variant) && j.variant > 0 && j.variant <= (VARIANTS[j.intent] || 0) ? j.variant : 0;
      // "who" must be words they actually used
      let who = typeof j.who === "string" ? j.who.trim().toLowerCase().slice(0, 40) : "";
      if (who && !text.toLowerCase().replace(/[’']/g, "'").includes(who.replace(/[’']/g, "'"))) who = "";
      const also = IDS.includes(j.also) && j.also !== j.intent ? j.also : "";
      return json({ intent: j.intent, variant, who, also }, 200, h);
    } catch (e) {
      // over the free daily allowance, or the model is unavailable: the app falls back on its own
      return json({ error: "unavailable" }, 503, h);
    }
  },
};
