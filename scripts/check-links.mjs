// Checks every outside link the app shows (Scripture, devotions, help resources).
// Runs monthly on GitHub (.github/workflows/links.yml); GitHub emails you if one breaks.
//   node scripts/check-links.mjs
import { SCRIPTURE } from "../server/library/scripture.js";
import * as devotions from "../server/library/devotions.js";
import { CARE_RESOURCES } from "../server/safety.js";

const urls = new Set([
  ...SCRIPTURE.map((s) => s.url),
  ...Object.values(devotions).filter(Array.isArray).flat().map((d) => d?.url),
  ...CARE_RESOURCES.links.map((l) => l.href),
].filter((u) => typeof u === "string" && u.startsWith("http")));

const bad = [];
await Promise.all([...urls].map(async (u) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (link check)" }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return;
      if (i === 2) bad.push(`${r.status} ${u}`);
    } catch (e) { if (i === 2) bad.push(`ERR ${u} (${e.cause?.code || e.message})`); }
    await new Promise((res) => setTimeout(res, 2000));
  }
}));
console.log(bad.length ? `✗ ${bad.length} broken of ${urls.size}:\n${bad.join("\n")}` : `✓ all ${urls.size} links work`);
process.exit(bad.length ? 1 : 0);
