import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import express from "express";
import multer from "multer";
import { composeDevotional } from "./devotional.js";
import { createArtwork, analyzeReference } from "./art/artwork.js";
import { loadStyle, saveStyle, buildArtPrompt } from "./art/style.js";
import { providerStatus, saveProviderConfig, loadProviderConfig } from "./art/providers.js";
import { saintEmblem, proceduralArtwork } from "./art/procedural.js";
import { generateImage } from "./art/providers.js";
import { saintById } from "./library/saints.js";
import { EMOTIONS, CIRCUMSTANCES } from "./library/themes.js";
import { needsCare, CARE_RESOURCES } from "./safety.js";
import * as store from "./store.js";

// Load .env if present (no dependency needed)
if (fs.existsSync(".env")) for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "200kb" }));

// ---------- anonymous, private identity (httpOnly cookie) ----------
app.use((req, res, next) => {
  const m = (req.headers.cookie || "").match(/(?:^|;\s*)asfm_uid=([\w-]{16,})/);
  let uid = m?.[1];
  if (!uid) {
    uid = store.newId(18);
    res.setHeader("Set-Cookie", `asfm_uid=${uid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 400}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  }
  req.uid = uid;
  next();
});

const artUrl = (file) => (file ? `/api/art/${file}` : null);

function publicExperience(e) {
  const cur = e.art?.current != null ? e.artHistory[e.art.current] : null;
  return {
    id: e.id, createdAt: e.createdAt, intentionTitle: e.intentionTitle, mode: e.checkin.mode,
    personName: e.checkin.personName || null, shared: e.checkin.text || null,
    selections: { emotions: e.checkin.emotions, circumstances: e.checkin.circumstances },
    saved: e.saved, prayerSaved: e.prayerSaved, care: e.care ? CARE_RESOURCES : null,
    devotional: { ...e.devotional, saints: e.devotional.saints.map((s) => ({ ...s, emblem: `/api/saints/${s.id}/emblem.svg` })) },
    art: {
      status: e.art?.status, notice: e.art?.notice || null,
      current: cur ? { url: artUrl(cur.file), kind: cur.kind, provider: cur.provider, title: cur.title, composition: cur.composition, aspect: cur.aspect } : null,
      history: (e.artHistory || []).map((a, i) => ({ index: i, url: artUrl(a.file), kind: a.kind, composition: a.composition })),
    },
  };
}

// ---------- check-in vocabulary ----------
app.get("/api/options", (req, res) => res.json({ emotions: EMOTIONS, circumstances: CIRCUMSTANCES }));

// ---------- me / privacy ----------
app.get("/api/me", (req, res) => {
  const u = store.getUser(req.uid);
  const last = u.experiences.at(-1);
  const recent = u.settings.memoryConsent
    ? u.experiences.slice(-12).reverse().filter((e, i, arr) => arr.findIndex((x) => x.intentionTitle === e.intentionTitle) === i).slice(0, 5)
        .map((e) => ({ id: e.id, title: e.intentionTitle, date: e.createdAt, personName: e.checkin.personName || null }))
    : [];
  res.json({
    settings: u.settings,
    returning: u.experiences.length > 0,
    lastVisit: last?.createdAt || null,
    collectionCount: u.experiences.filter((e) => e.saved).length,
    recentIntentions: recent,
  });
});

app.post("/api/me/settings", (req, res) => {
  const u = store.getUser(req.uid);
  if (typeof req.body.memoryConsent === "boolean") {
    u.settings.memoryConsent = req.body.memoryConsent;
    // Turning memory off forgets the person's own words immediately.
    if (!req.body.memoryConsent) for (const e of u.experiences) delete e.checkin.text;
  }
  store.saveUser();
  res.json({ settings: u.settings });
});

app.delete("/api/me", (req, res) => { store.deleteUser(req.uid); res.json({ ok: true }); });

// ---------- devotional ----------
const clean = (s, n) => (typeof s === "string" ? s.trim().slice(0, n) : "");

app.post("/api/devotional", async (req, res) => {
  const u = store.getUser(req.uid);
  const today = u.experiences.filter((e) => Date.now() - Date.parse(e.createdAt) < 864e5).length;
  if (today >= 25) return res.status(429).json({ error: "You've received many devotionals today. Rest in these for a while, and come back tomorrow." });

  const b = req.body || {};
  const checkin = {
    mode: ["new", "continue", "someone", "thanks"].includes(b.mode) ? b.mode : "new",
    emotions: (Array.isArray(b.emotions) ? b.emotions : []).filter((id) => EMOTIONS.some((e) => e.id === id)).slice(0, 6),
    circumstances: (Array.isArray(b.circumstances) ? b.circumstances : []).filter((id) => CIRCUMSTANCES.some((c) => c.id === id)).slice(0, 6),
    text: clean(b.text, 2000),
    personName: clean(b.personName, 40).replace(/[^\p{L}\p{M}' .-]/gu, ""),
  };
  if (!checkin.text && !checkin.emotions.length && !checkin.circumstances.length && checkin.mode !== "continue" && checkin.mode !== "thanks")
    return res.status(400).json({ error: "Share a few words or choose a feeling to begin." });

  // Continuity only with consent, and only from the person's own history.
  const context = { recentCompositions: u.experiences.slice(-3).flatMap((e) => (e.artHistory || []).map((a) => a.composition)) };
  let continuedFrom = null;
  if (b.continueFrom) {
    const prev = store.findExperience(req.uid, String(b.continueFrom));
    if (prev && u.settings.memoryConsent) {
      continuedFrom = prev.id;
      context.previous = { title: prev.intentionTitle, date: new Date(prev.createdAt).toDateString(), summary: prev.checkin.text || null };
      if (!checkin.personName && prev.checkin.personName) checkin.personName = prev.checkin.personName;
    }
  }

  try {
    const devotional = await composeDevotional(checkin, context);
    const exp = {
      id: store.newId(10), createdAt: new Date().toISOString(),
      checkin: { ...checkin, text: u.settings.memoryConsent ? checkin.text : undefined },
      intentionTitle: devotional.intention_title, devotional, continuedFrom,
      care: needsCare(checkin.text), saved: false, prayerSaved: false,
      art: { status: "queued" }, artHistory: [],
    };
    u.experiences.push(exp);
    store.saveUser();
    res.json(publicExperience(exp));
    // Art is generated after the prayer is delivered: never a barrier to prayer.
    createArtwork(exp, { aspect: b.aspect === "square" ? "square" : "portrait" }).catch((e) => console.error(e));
  } catch (err) {
    console.error("[devotional] fatal:", err);
    res.status(500).json({ error: "Something went wrong preparing your devotional. Please try again." });
  }
});

app.get("/api/experiences/:id", (req, res) => {
  const e = store.findExperience(req.uid, req.params.id);
  if (!e) return res.status(404).json({ error: "Not found" });
  res.json(publicExperience(e));
});

app.post("/api/experiences/:id/art/regenerate", (req, res) => {
  const e = store.findExperience(req.uid, req.params.id);
  if (!e) return res.status(404).json({ error: "Not found" });
  if (e.art?.status === "generating") return res.json(publicExperience(e));
  if ((e.artHistory || []).length >= 8) return res.status(429).json({ error: "This devotional already has several artworks. Choose a favorite from its history." });
  createArtwork(e, { aspect: req.body?.aspect === "square" ? "square" : "portrait" }).catch((err) => console.error(err));
  e.art.status = "generating";
  res.json(publicExperience(e));
});

app.post("/api/experiences/:id/art/select", (req, res) => {
  const e = store.findExperience(req.uid, req.params.id);
  const i = Number(req.body?.index);
  if (!e || !e.artHistory?.[i]) return res.status(404).json({ error: "Not found" });
  e.art = { ...e.art, status: "ready", current: i, notice: null };
  store.saveUser();
  res.json(publicExperience(e));
});

app.post("/api/experiences/:id/save", (req, res) => {
  const e = store.findExperience(req.uid, req.params.id);
  if (!e) return res.status(404).json({ error: "Not found" });
  if (typeof req.body.saved === "boolean") e.saved = req.body.saved;
  if (typeof req.body.prayerSaved === "boolean") e.prayerSaved = req.body.prayerSaved;
  store.saveUser();
  res.json(publicExperience(e));
});

app.delete("/api/experiences/:id", (req, res) => {
  res.json({ ok: store.deleteExperience(req.uid, req.params.id) });
});

app.get("/api/journey", (req, res) => {
  const u = store.getUser(req.uid);
  const filter = req.query.filter;
  const list = u.experiences
    .filter((e) => (filter === "saved" ? e.saved : filter === "prayers" ? e.prayerSaved : true))
    .slice().reverse().map(publicExperience);
  res.json({ experiences: list });
});

// Private artwork: served only to its owner.
app.get("/api/art/:file", (req, res) => {
  const file = path.basename(req.params.file);
  if (store.artOwner(file) !== req.uid) return res.status(404).end();
  res.setHeader("Cache-Control", "private, max-age=31536000, immutable");
  res.sendFile(path.join(store.ART_DIR, file));
});

app.get("/api/saints/:id/emblem.svg", (req, res) => {
  const s = saintById(req.params.id);
  if (!s) return res.status(404).end();
  res.type("image/svg+xml").setHeader("Cache-Control", "public, max-age=86400");
  res.send(saintEmblem(s));
});

// ---------- founder Style Studio (token-protected) ----------
function studioAuth(req, res, next) {
  const token = process.env.STUDIO_TOKEN;
  if (!token) return res.status(503).json({ error: "Style Studio is disabled. Set STUDIO_TOKEN in .env to enable it." });
  const given = req.headers["x-studio-token"] || "";
  const ok = given.length === token.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(token));
  if (!ok) return res.status(401).json({ error: "Invalid studio token" });
  next();
}
const studio = express.Router();
studio.use(studioAuth);

studio.get("/style", (req, res) => res.json(loadStyle()));
studio.put("/style", (req, res) => { try { res.json(saveStyle(req.body)); } catch (e) { res.status(400).json({ error: e.message }); } });

studio.get("/providers", (req, res) => res.json({ config: loadProviderConfig(), status: providerStatus(), devotionalAI: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) }));
studio.put("/providers", (req, res) => { try { saveProviderConfig(req.body); res.json({ config: loadProviderConfig(), status: providerStatus() }); } catch (e) { res.status(400).json({ error: e.message }); } });

const upload = multer({
  storage: multer.diskStorage({ destination: store.REF_DIR, filename: (req, f, cb) => cb(null, `${store.newId(9)}${path.extname(f.originalname).toLowerCase()}`) }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, f, cb) => cb(null, /^image\/(png|jpeg|webp)$/.test(f.mimetype)),
});
studio.get("/references", (req, res) => res.json(store.listReferences().map((r) => ({ ...r, url: `/api/studio/references/${r.id}/file` }))));
studio.post("/references", upload.array("files", 12), (req, res) => {
  const added = (req.files || []).map((f) => store.addReference({ id: store.newId(8), file: f.filename, mime: f.mimetype, name: req.body.title || f.originalname, uploadedAt: new Date().toISOString(), useForGeneration: true, notes: null }));
  res.json(added);
});
studio.get("/references/:id/file", (req, res) => {
  const r = store.listReferences().find((x) => x.id === req.params.id);
  if (!r) return res.status(404).end();
  res.sendFile(path.join(store.REF_DIR, r.file));
});
studio.patch("/references/:id", (req, res) => {
  const patch = {};
  if (typeof req.body.useForGeneration === "boolean") patch.useForGeneration = req.body.useForGeneration;
  if (typeof req.body.name === "string") patch.name = req.body.name.slice(0, 120);
  const r = store.updateReference(req.params.id, patch);
  r ? res.json(r) : res.status(404).end();
});
studio.delete("/references/:id", (req, res) => res.json({ ok: store.removeReference(req.params.id) }));
studio.post("/references/:id/analyze", async (req, res) => {
  const r = store.listReferences().find((x) => x.id === req.params.id);
  if (!r) return res.status(404).end();
  try { const notes = await analyzeReference(r); store.updateReference(r.id, { notes }); res.json({ ...r, notes }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
// Fold a reference's style note into the house style.
studio.post("/references/:id/adopt", (req, res) => {
  const r = store.listReferences().find((x) => x.id === req.params.id);
  if (!r?.notes?.style_note) return res.status(400).json({ error: "Analyze the reference first." });
  const style = loadStyle();
  style.referenceNotes = [...new Set([...(style.referenceNotes || []), r.notes.style_note])];
  res.json(saveStyle(style));
});

studio.post("/preview", async (req, res) => {
  const brief = {
    title: "Preview", concept: req.body.concept || "a symbolic meditation on being held by God",
    central_symbol: req.body.central_symbol || "a geode cradling a luminous seed",
    motifs: req.body.motifs || ["crescent moon", "stained-glass halo", "torn paper strata"],
    composition: req.body.composition || "halo_icon", mood: req.body.mood || "tender, hopeful",
    palette_emphasis: ["Hibiscus pink", "Lagoon turquoise"], include_figure: Boolean(req.body.include_figure),
  };
  const aspect = req.body.aspect === "square" ? "square" : "portrait";
  const built = buildArtPrompt(brief, { aspect, seed: Date.now() });
  if (req.body.promptOnly) return res.json(built);
  try {
    const refs = store.listReferences().filter((r) => r.useForGeneration).map((r) => ({ path: path.join(store.REF_DIR, r.file), mime: r.mime }));
    const out = await generateImage({ ...built, brief, themes: req.body.themes || [], seed: Date.now() % 2 ** 31, aspect, references: refs }, { providerId: req.body.provider });
    res.json({ ...built, provider: out.provider, errors: out.errors, image: `data:${out.mime};base64,${out.buffer.toString("base64")}` });
  } catch (e) { res.status(502).json({ error: e.message, prompt: built.prompt }); }
});
app.use("/api/studio", studio);

// A fresh house-style collage for the homepage each day.
app.get("/hero.svg", (req, res) => {
  const day = Math.floor(Date.now() / 864e5);
  const comps = ["rose_window", "orbital", "halo_icon", "constellation", "horizon_strata"];
  const themes = ["gratitude", "peace", "hope", "faith", "motherhood", "inspiration"];
  res.type("image/svg+xml").setHeader("Cache-Control", "public, max-age=3600");
  res.send(proceduralArtwork({ brief: { composition: comps[day % comps.length] }, themes: [themes[day % themes.length]], seed: day, aspect: "square" }));
});

// ---------- static ----------
app.use(express.static(path.resolve("public"), { extensions: ["html"] }));
app.get(/^\/(today|journey|e\/.*)?$/, (req, res) => res.sendFile(path.resolve("public/index.html")));

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  const p = loadProviderConfig();
  console.log(`A Saint for Me → http://localhost:${PORT}`);
  console.log(`  devotional AI: ${process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN ? "Claude" : "offline composer (set ANTHROPIC_API_KEY)"}`);
  console.log(`  image provider: ${p.active}  |  studio: ${process.env.STUDIO_TOKEN ? "/studio" : "disabled (set STUDIO_TOKEN)"}`);
});
