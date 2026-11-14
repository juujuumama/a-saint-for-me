// Configurable image-generation providers. config/providers.json is re-read on
// every call, so the active provider/model can change without a rebuild or
// restart. Keys come only from environment variables named in that file.
//
// Every provider implements: generate({ prompt, negative, aspect, references }) ->
//   { buffer, mime, ext }   (references = [{ path, mime }] founder artworks)
import fs from "node:fs";
import path from "node:path";
import { proceduralArtwork } from "./procedural.js";

const CONFIG_FILE = path.resolve(process.env.PROVIDERS_FILE || "config/providers.json");

export function loadProviderConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
}
export function saveProviderConfig(patch) {
  const cfg = loadProviderConfig();
  if (patch.active && !cfg.providers[patch.active]) throw new Error(`unknown provider "${patch.active}"`);
  if (patch.active) cfg.active = patch.active;
  if (Array.isArray(patch.fallbackChain)) cfg.fallbackChain = patch.fallbackChain.filter((p) => cfg.providers[p]);
  if (patch.providers) for (const [k, v] of Object.entries(patch.providers)) {
    if (!cfg.providers[k]) continue;
    // never allow writing secrets into the config file
    const { apiKey, key, token, ...safe } = v;
    Object.assign(cfg.providers[k], safe);
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
  return cfg;
}

export function providerStatus() {
  const cfg = loadProviderConfig();
  return Object.entries(cfg.providers).map(([id, p]) => ({
    id, label: p.label, type: p.type, model: p.model || null,
    active: cfg.active === id,
    credentialEnv: p.apiKeyEnv || null,
    configured: p.type === "procedural" || (p.type === "http" ? Boolean(p.endpoint) : Boolean(process.env[p.apiKeyEnv])),
  }));
}

const withTimeout = (ms) => AbortSignal.timeout(ms);
const sizeFor = (aspect) => (aspect === "square" ? "1024x1024" : "1024x1536");
const ratioFor = (aspect) => (aspect === "square" ? "1:1" : "2:3");

async function fail(res, name) {
  const body = await res.text().catch(() => "");
  throw new Error(`${name} ${res.status}: ${body.slice(0, 300)}`);
}

const ADAPTERS = {
  async procedural(p, job) {
    const svg = proceduralArtwork({ brief: job.brief, themes: job.themes, seed: job.seed, aspect: job.aspect, words: job.words || [] });
    return { buffer: Buffer.from(svg), mime: "image/svg+xml", ext: "svg" };
  },

  // OpenAI Images. With reference images, uses the edits endpoint so founder
  // artworks guide the style; otherwise plain generation.
  async openai(p, job, cfg) {
    const key = process.env[p.apiKeyEnv];
    const refs = p.useReferenceImages ? job.references.slice(0, p.maxReferenceImages || 4) : [];
    let res;
    if (refs.length) {
      const form = new FormData();
      form.append("model", p.model);
      form.append("prompt", `${job.prompt} Use the attached reference artworks ONLY as a guide to the artist's style, palette, textures and collage technique; create an entirely new composition.`);
      form.append("size", sizeFor(job.aspect));
      if (p.quality) form.append("quality", p.quality);
      for (const r of refs) form.append("image[]", new Blob([fs.readFileSync(r.path)], { type: r.mime }), path.basename(r.path));
      res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form, signal: withTimeout(cfg.timeoutMs) });
    } else {
      res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: p.model, prompt: job.prompt, size: sizeFor(job.aspect), quality: p.quality, n: 1 }),
        signal: withTimeout(cfg.timeoutMs),
      });
    }
    if (!res.ok) await fail(res, "openai");
    const json = await res.json();
    const item = json.data?.[0];
    if (item?.b64_json) return { buffer: Buffer.from(item.b64_json, "base64"), mime: "image/png", ext: "png" };
    if (item?.url) return download(item.url, cfg);
    throw new Error("openai: no image in response");
  },

  // Replicate: any model slug, e.g. black-forest-labs/flux-1.1-pro
  async replicate(p, job, cfg) {
    const key = process.env[p.apiKeyEnv];
    const res = await fetch(`https://api.replicate.com/v1/models/${p.model}/predictions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "wait=60" },
      body: JSON.stringify({ input: { prompt: job.prompt, aspect_ratio: ratioFor(job.aspect), ...(p.extraInput || {}) } }),
      signal: withTimeout(cfg.timeoutMs),
    });
    if (!res.ok) await fail(res, "replicate");
    let pred = await res.json();
    const deadline = Date.now() + cfg.timeoutMs;
    while (!["succeeded", "failed", "canceled"].includes(pred.status) && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2000));
      const poll = await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${key}` } });
      pred = await poll.json();
    }
    if (pred.status !== "succeeded") throw new Error(`replicate: ${pred.status} ${pred.error || ""}`);
    const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
    return download(url, cfg);
  },

  async stability(p, job, cfg) {
    const form = new FormData();
    form.append("prompt", job.prompt);
    form.append("negative_prompt", job.negative);
    form.append("aspect_ratio", ratioFor(job.aspect));
    form.append("output_format", "png");
    if (p.stylePreset) form.append("style_preset", p.stylePreset);
    const res = await fetch(p.endpoint, { method: "POST", headers: { Authorization: `Bearer ${process.env[p.apiKeyEnv]}`, Accept: "image/*" }, body: form, signal: withTimeout(cfg.timeoutMs) });
    if (!res.ok) await fail(res, "stability");
    return { buffer: Buffer.from(await res.arrayBuffer()), mime: "image/png", ext: "png" };
  },

  // Generic contract for your own model server:
  //   POST endpoint  { prompt, negative_prompt, aspect_ratio, reference_images: [base64...] }
  //   -> { image_base64, mime } or { image_url }
  async http(p, job, cfg) {
    const headers = { "Content-Type": "application/json" };
    if (p.apiKeyEnv && process.env[p.apiKeyEnv]) headers.Authorization = `Bearer ${process.env[p.apiKeyEnv]}`;
    const res = await fetch(p.endpoint, {
      method: "POST", headers, signal: withTimeout(cfg.timeoutMs),
      body: JSON.stringify({ prompt: job.prompt, negative_prompt: job.negative, aspect_ratio: ratioFor(job.aspect), reference_images: job.references.map((r) => fs.readFileSync(r.path).toString("base64")) }),
    });
    if (!res.ok) await fail(res, "http");
    const json = await res.json();
    if (json.image_base64) { const mime = json.mime || "image/png"; return { buffer: Buffer.from(json.image_base64, "base64"), mime, ext: mime.split("/")[1].replace("svg+xml", "svg") }; }
    if (json.image_url) return download(json.image_url, cfg);
    throw new Error("http: response had no image_base64 or image_url");
  },
};

async function download(url, cfg) {
  const res = await fetch(url, { signal: withTimeout(cfg.timeoutMs) });
  if (!res.ok) await fail(res, "download");
  const mime = res.headers.get("content-type")?.split(";")[0] || "image/png";
  return { buffer: Buffer.from(await res.arrayBuffer()), mime, ext: mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png" };
}

// Try the active provider, then the fallback chain. The procedural artist is
// always last, so a devotional is never left without art.
export async function generateImage(job, { providerId } = {}) {
  const cfg = loadProviderConfig();
  const chain = [...new Set([providerId || cfg.active, ...(cfg.fallbackChain || []), "procedural"])];
  const errors = [];
  for (const id of chain) {
    const p = cfg.providers[id] || (id === "procedural" ? { type: "procedural" } : null);
    if (!p) continue;
    if (p.type !== "procedural" && p.type !== "http" && !process.env[p.apiKeyEnv]) { errors.push(`${id}: ${p.apiKeyEnv} not set`); continue; }
    try {
      const out = await ADAPTERS[p.type](p, job, cfg);
      return { ...out, provider: id, model: p.model || null, errors };
    } catch (err) {
      console.error(`[art] provider ${id} failed:`, err.message);
      errors.push(`${id}: ${err.message}`);
    }
  }
  throw new Error(`all providers failed: ${errors.join(" | ")}`);
}
