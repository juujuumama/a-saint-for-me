// Browser-only edition (GitHub Pages): the same API the server provides,
// running entirely on the visitor's device. Devotionals are saved in this
// browser only; artwork is re-drawn from its seed, so storage stays tiny.
import { composeOffline, hydrate } from "./lib/compose-offline.js";
import { proceduralArtwork, saintEmblem, wordsFrom, symbolIcon, SYMBOL_KEYS } from "./lib/art/procedural.js";
import { EMOTIONS, CIRCUMSTANCES } from "./lib/library/themes.js";
import { saintById } from "./lib/library/saints.js";
import { needsCare, CARE_RESOURCES } from "./lib/safety.js";
import { pickKit, kitFiles } from "./lib/art/kit.js";

const STYLE = await fetch(new URL("./lib/style.json", import.meta.url)).then((r) => r.json());
const KIT = await fetch(new URL("./kit/kit.json", import.meta.url)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
const kitData = new Map();
async function loadFile(file) {
  if (kitData.has(file)) return kitData.get(file);
  const p = fetch(new URL(`./kit/${file}`, import.meta.url)).then((r) => r.blob()).then((b) => new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }));
  kitData.set(file, p);
  return p;
}
const saintFor = (e, a) => (a.saintId ? saintById(a.saintId) : null);
const kitPick = (e, a) => (KIT ? pickKit(KIT, { themes: e.devotional.themes, seed: a.seed, saint: saintFor(e, a) }) : null);
// Load the artist's kit pieces an experience needs, before drawing it.
async function ensure(e) {
  await Promise.all(e.artHistory.flatMap((a) => kitFiles(kitPick(e, a)).map(loadFile)));
  for (const f of kitData.keys()) kitData.set(f, await kitData.get(f));
}
const KEY = "asfm:db";
const blank = () => ({ settings: { memoryConsent: false }, experiences: [] });
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || blank(); } catch { return blank(); } }
let db = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage full or blocked: keep working in memory */ } }
const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const svgUrl = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
const cache = new Map();

function artUrl(e, a) {
  const k = `${e.id}:${a.seed}`;
  if (!cache.has(k)) {
    const saint = saintFor(e, a), pick = kitPick(e, a);
    const kit = pick && Object.fromEntries(Object.entries(pick).map(([k2, v]) => [k2, v ? { ...v, href: kitData.get(v.file) } : null]));
    cache.set(k, svgUrl(proceduralArtwork({ brief: { ...e.devotional.art_brief, composition: a.composition }, themes: e.devotional.themes, seed: a.seed, aspect: a.aspect, words: a.words, saint, style: STYLE, kit })));
  }
  return cache.get(k);
}
const emblems = new Map();
const emblemUrl = (s) => emblems.get(s.id) || (emblems.set(s.id, svgUrl(saintEmblem(s, 1, STYLE))), emblems.get(s.id));

export function heroUrl() {
  if (KIT) return new URL(`./kit/${KIT.backgrounds[Math.floor(Date.now() / 864e5) % KIT.backgrounds.length].file}`, import.meta.url).href;
  const day = Math.floor(Date.now() / 864e5);
  return svgUrl(proceduralArtwork({ brief: { composition: ["rose_window", "orbital", "halo_icon", "constellation", "horizon_strata"][day % 5] }, themes: [["gratitude", "peace", "hope", "faith", "motherhood", "inspiration"][day % 6]], seed: day, aspect: "square", style: STYLE }));
}

function makeArt(e) {
  const seed = Math.floor(Math.random() * 2 ** 31);
  const d = e.devotional, prev = (e.artHistory || []).map((a) => a.composition);
  let composition = d.art_brief.composition;
  if (prev.includes(composition)) {
    const ids = STYLE.composition.archetypes.map((a) => a.id).filter((x) => !prev.includes(x));
    if (ids.length) composition = ids[seed % ids.length];
  }
  const angelDay = (d.themes || []).some((t) => ["fear", "anxiety", "loneliness", "overwhelm"].includes(t));
  const saint = (angelDay && d.saints.find((x) => x.kind === "angel")) || d.saints[0];
  const sources = [d.reflection, d.scripture?.[0]?.text, d.scripture?.[1]?.text].filter(Boolean);
  const words = seed % 4 === 0 ? [] : wordsFrom(sources[seed % sources.length]);
  e.artHistory = [...(e.artHistory || []), { seed, composition, aspect: "portrait", saintId: saint?.id, words, title: d.art_brief.title }];
  e.art = { status: "ready", current: e.artHistory.length - 1 };
}

function pub(e) {
  const cur = e.artHistory[e.art.current];
  return {
    id: e.id, createdAt: e.createdAt, intentionTitle: e.intentionTitle, mode: e.checkin.mode,
    personName: e.checkin.personName || null, shared: e.checkin.text || null,
    selections: { emotions: e.checkin.emotions, circumstances: e.checkin.circumstances },
    saved: e.saved, prayerSaved: e.prayerSaved, care: e.care ? CARE_RESOURCES : null,
    devotional: { ...e.devotional, saints: e.devotional.saints.map((s) => ({ ...s, emblem: emblemUrl(s) })) },
    art: {
      status: "ready", notice: null,
      current: cur ? { url: artUrl(e, cur), kind: "studio-sketch", provider: "procedural", title: cur.title, composition: cur.composition, aspect: cur.aspect } : null,
      history: e.artHistory.map((a, i) => ({ index: i, url: artUrl(e, a), kind: "studio-sketch", composition: a.composition })),
    },
  };
}

const find = (x) => { const e = db.experiences.find((y) => y.id === x); if (!e) throw new Error("We couldn't find that devotional."); return e; };

export async function handle(path, method = "GET", body = {}) {
  const [p, q] = path.split("?");
  const m = p.match(/^\/api\/experiences\/([^/]+)(?:\/(.+))?$/);
  if (p === "/api/symbols") return SYMBOL_KEYS().map((key) => ({ key, svg: symbolIcon(key, STYLE) }));
  if (p === "/api/kit-sample") return { images: KIT ? KIT.backgrounds.filter((_, i) => i % 9 === 0).slice(0, 8).map((b) => new URL(`./kit/${b.file}`, import.meta.url).href) : [] };
  if (p === "/api/options") return { emotions: EMOTIONS, circumstances: CIRCUMSTANCES };
  if (p === "/api/me" && method === "GET") {
    const recent = db.settings.memoryConsent
      ? db.experiences.slice(-12).reverse().filter((e, i, a) => a.findIndex((x) => x.intentionTitle === e.intentionTitle) === i).slice(0, 5)
          .map((e) => ({ id: e.id, title: e.intentionTitle, date: e.createdAt, personName: e.checkin.personName || null }))
      : [];
    return { settings: db.settings, returning: db.experiences.length > 0, lastVisit: db.experiences.at(-1)?.createdAt || null, collectionCount: db.experiences.filter((e) => e.saved).length, recentIntentions: recent };
  }
  if (p === "/api/me/settings") {
    db.settings.memoryConsent = !!body.memoryConsent;
    if (!db.settings.memoryConsent) db.experiences.forEach((e) => delete e.checkin.text);
    save(); return { settings: db.settings };
  }
  if (p === "/api/me" && method === "DELETE") { db = blank(); try { localStorage.removeItem(KEY); } catch {} return { ok: true }; }
  if (p === "/api/devotional") {
    const clip = (s, n) => (typeof s === "string" ? s.trim().slice(0, n) : "");
    const checkin = {
      mode: ["new", "continue", "someone", "thanks"].includes(body.mode) ? body.mode : "new",
      emotions: (body.emotions || []).filter((x) => EMOTIONS.some((e) => e.id === x)),
      circumstances: (body.circumstances || []).filter((x) => CIRCUMSTANCES.some((c) => c.id === x)),
      text: clip(body.text, 2000), personName: clip(body.personName, 40),
    };
    const context = { recentCompositions: db.experiences.slice(-3).flatMap((e) => e.artHistory.map((a) => a.composition)) };
    const prev = body.continueFrom && db.settings.memoryConsent && db.experiences.find((e) => e.id === body.continueFrom);
    if (prev) { context.previous = { title: prev.intentionTitle, themes: prev.devotional.themes }; if (!checkin.personName) checkin.personName = prev.checkin.personName; }
    const devotional = { ...hydrate(composeOffline(checkin, context, STYLE)), source: "offline" };
    const e = {
      id: id(), createdAt: new Date().toISOString(), intentionTitle: devotional.intention_title, devotional,
      checkin: { ...checkin, text: db.settings.memoryConsent ? checkin.text : undefined },
      care: needsCare(checkin.text), saved: false, prayerSaved: false, artHistory: [], continuedFrom: prev?.id || null,
    };
    makeArt(e);
    db.experiences.push(e); save();
    await ensure(e);
    await new Promise((r) => setTimeout(r, 1400)); // a breath, so the moment doesn't feel instant
    return pub(e);
  }
  if (m && !m[2] && method === "GET") { const e = find(m[1]); await ensure(e); return pub(e); }
  if (m && !m[2] && method === "DELETE") { db.experiences = db.experiences.filter((e) => e.id !== m[1]); save(); return { ok: true }; }
  if (m && m[2] === "art/regenerate") {
    const e = find(m[1]);
    if (e.artHistory.length >= 8) throw new Error("This devotional already has several artworks. Choose a favorite from its history.");
    makeArt(e); save(); await ensure(e); return pub(e);
  }
  if (m && m[2] === "art/select") { const e = find(m[1]); if (e.artHistory[body.index]) e.art.current = Number(body.index); save(); await ensure(e); return pub(e); }
  if (m && m[2] === "save") {
    const e = find(m[1]);
    if (typeof body.saved === "boolean") e.saved = body.saved;
    if (typeof body.prayerSaved === "boolean") e.prayerSaved = body.prayerSaved;
    save(); await ensure(e); return pub(e);
  }
  if (p === "/api/journey") {
    const f = new URLSearchParams(q).get("filter");
    const list = db.experiences.filter((e) => (f === "saved" ? e.saved : f === "prayers" ? e.prayerSaved : true)).slice().reverse();
    await Promise.all(list.map(ensure));
    return { experiences: list.map(pub) };
  }
  throw new Error("Not available in this edition.");
}
