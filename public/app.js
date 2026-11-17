// A Saint for Me — client
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const main = $("#main");
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

// "See an example" devotional for first-time visitors (off until approved).
const SHOW_EXAMPLE = Boolean(window.ASFM_SHOW_EXAMPLE);
// Shown on shared cards so they lead back to the site.
const SITE = (location.host + (window.ASFM_STATIC ? location.pathname.replace(/index\.html$/, "") : "")).replace(/\/$/, "").replace(/^www\./, "").toUpperCase();

// Browser-only edition (GitHub Pages): same API, served from this device.
const STATIC = Boolean(window.ASFM_STATIC);
let local = null;
const L = (path) => (STATIC ? `#${path}` : path);
const currentPath = () => (STATIC ? location.hash.slice(1) || "/" : location.pathname);
async function api(path, opts = {}) {
  if (STATIC) { local ||= await import("./local-api.js"); return local.handle(path, opts.method || "GET", opts.body || {}); }
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, credentials: "same-origin", ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Something went wrong.");
  return json;
}
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }
const fmtDate = (iso, opts = { weekday: "long", month: "long", day: "numeric" }) => new Date(iso).toLocaleDateString(undefined, opts);
const ICON = {
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor"/></svg>',
  heartO: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h9a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3Z M5 17a3 3 0 0 1 3-3h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};
const CHIP_COLORS = ["var(--pink)", "var(--turq)", "var(--orange)", "var(--peach)", "var(--coral)"];

// ---------------- router ----------------
function navigate(path, replace = false) {
  if (STATIC) { const h = path === "/" ? "" : path; if (location.hash.slice(1) === h) route(); else location.hash = h; return; }
  (replace ? history.replaceState : history.pushState).call(history, {}, "", path); route();
}
if (STATIC) addEventListener("hashchange", route);
document.addEventListener("click", (e) => {
  if (STATIC) return; // hash links route themselves
  const a = e.target.closest("a[data-link]");
  if (a && !e.metaKey && !e.ctrlKey && a.origin === location.origin) { e.preventDefault(); navigate(a.pathname); }
});
addEventListener("popstate", route);
let pollTimer = null;
function route() {
  clearTimeout(pollTimer);
  const p = currentPath();
  $$("[data-nav]").forEach((n) => n.removeAttribute("aria-current"));
  if (p.startsWith("/e/")) return renderExperience(p.slice(3));
  if (p === "/example" && SHOW_EXAMPLE) return renderExample();
  if (p === "/about") { $('[data-nav="about"]').setAttribute("aria-current", "page"); return renderAbout(); }
  if (p === "/journey") { $('[data-nav="journey"]').setAttribute("aria-current", "page"); return renderJourney(); }
  renderHome();
}

// ---------------- HOME ----------------
let OPTIONS = null;
async function renderHome() {
  document.title = "A Saint for Me";
  const [opts, me] = await Promise.all([OPTIONS || api("/api/options"), api("/api/me")]);
  OPTIONS = opts;
  const state = { mode: "new", continueFrom: null };
  const returning = me.returning;
  const canContinue = me.settings.memoryConsent && me.recentIntentions.length;

  main.innerHTML = `
  <section class="hero">
    <div class="hero-art" style="background-image:url('${STATIC ? local.heroUrl() : me.heroImage || "/hero.svg"}')"></div>
    <div class="hero-grid">
    <div class="hero-inner">
      <h1>What's on your <span>heart</span> today?</h1>
      <p class="lead">Share what you're feeling and receive a personal prayer, the saints and Scripture for it, and a one-of-a-kind collage made from the original works of Catholic artist Sierra Renee (juujuumama).</p>
    </div>
  <form class="checkin" id="checkin" novalidate>
    <label class="sr-only" for="text">What's on your heart today?</label>
    <div class="speak-wrap">
      <textarea id="text" maxlength="2000" placeholder="Type or tap the mic to share what's going on."></textarea>
      <button type="button" class="mic" id="mic" aria-label="Speak instead of typing" aria-pressed="false" hidden>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    ${canContinue ? `<div class="continue-inline"><span>Or keep praying about:</span><div class="continue-list">${me.recentIntentions.map((r) => `<button type="button" data-id="${r.id}" aria-pressed="false">${esc(r.title)}</button>`).join("")}</div></div>` : ""}
    <p class="hint" id="micHint" aria-live="polite"></p>
    <div class="submit-row">
      <span class="privacy-note">${ICON.lock} Private to you.</span>
      <button class="btn primary" id="go">Receive today's devotional</button>
    </div>
    <p class="hint" id="formError" role="alert" style="color:#C0392B"></p>
    ${SHOW_EXAMPLE && !returning ? `<p class="example-link">Not sure what you'll get? <a href="${L("/example")}" data-link>See an example</a></p>` : ""}
  </form>
    </div>
  </section>
  <section class="sotd" id="sotd" hidden></section>
  <div id="installTip"></div>
  <section class="recent" id="recent" hidden></section>`;

  $$(".continue-list button").forEach((cb) => cb.addEventListener("click", () => {
    state.continueFrom = cb.getAttribute("aria-pressed") === "true" ? null : cb.dataset.id;
    $$(".continue-list button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.id === state.continueFrom)));
  }));
  setupVoice($("#text"), $("#mic"), $("#micHint"));
  api("/api/saint-of-day").then((s) => {
    const box = $("#sotd"); if (!box) return;
    box.hidden = false;
    box.innerHTML = `<span class="sotd-icon">${s.icon}</span>
      <div><p class="sotd-label">${esc(s.label)}</p><h2>${esc(s.name)}</h2>
      <p class="sotd-meta">${esc(s.years)} · Feast ${esc(s.feast)} · Patron of ${esc(s.patronages.slice(0, 2).join(", "))}</p>
      <details><summary>Their story</summary><p>${esc(s.story)}</p>${SYMBOLS[s.symbol] ? `<p class="symbol-note">✦ In the artwork: ${esc(SYMBOLS[s.symbol])}.</p>` : ""}</details></div>`;
  }).catch(() => {});
  showInstallTip(returning);

  $("#checkin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      mode: state.continueFrom ? "continue" : "new", text: $("#text").value, personName: "",
      emotions: [], circumstances: [], continueFrom: state.continueFrom,
    };
    if (!state.continueFrom && !body.text.trim()) return ($("#formError").textContent = "Share a few words (typed or spoken) to begin.");
    stopVoice();
    renderPreparing();
    try {
      const exp = await api("/api/devotional", { method: "POST", body });
      if (STATIC) navigate(`/e/${exp.id}`);
      else { history.pushState({}, "", `/e/${exp.id}`); renderExperience(exp.id, exp); }
    } catch (err) { await renderHome(); $("#formError").textContent = err.message; }
  });

  // gentle look back
  if (returning) api("/api/journey").then(({ experiences }) => {
    const items = experiences.filter((x) => x.art.current).slice(0, 8);
    if (!items.length) return;
    const r = $("#recent"); r.hidden = false;
    r.innerHTML = `<div class="section-title"><h2>From your recent days</h2><a href="${L("/journey")}" data-link>See your collection →</a></div>
      <div class="strip">${items.map(tile).join("")}</div>`;
  }).catch(() => {});
}

// What the symbol in each saint's artwork means.
const SYMBOLS = {
  palm: "a palm branch, the sign of a martyr", lily: "a lily, a sign of purity", roses: "roses, a sign of love",
  chains_broken: "broken chains, for freedom from slavery and addiction", flame: "a flame, the fire of the Holy Spirit",
  heart: "a heart, for love of God", tears: "tears, for years of faithful prayer", book: "a book, for wisdom and teaching",
  sword: "a sword, for protection against evil", scales: "scales, for justice", fish: "a fish, from the healing story in Tobit",
  hand: "an open hand", rays: "the pale and red rays of Divine Mercy", broom: "a broom, for humble service",
  bread: "bread, for charity to the poor", wheat: "wheat, for God's provision", sun: "a sun, for God's light",
  rings: "wedding rings, for marriage", lamp: "a lamp, light in darkness", ladder: "a ladder, the soul's climb to God",
  thorn: "a crown of thorns, sharing in Christ's suffering", castle: "a castle, from her book The Interior Castle",
  water: "water, from the spring at Lourdes", jar: "an alabaster jar of ointment", cross: "a cross", rosary: "a rosary",
  medallion: "a medallion bearing Christ's image", tools: "carpenter's tools", star: "a star", moon: "a crescent moon", dove: "a dove, the Holy Spirit",
};
const symbolNote = (s) => { const k = (s.symbols || s.emblem?.symbols || [])[0]; return SYMBOLS[k] ? `In the artwork: ${SYMBOLS[k]}.` : ""; };

// Read the prayer aloud with the device's own voice (private, free).
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter((v) => v.lang?.startsWith((navigator.language || "en").slice(0, 2)));
  return vs.find((v) => /natural|enhanced|premium|samantha|ava|allison|google us english/i.test(v.name)) || vs[0] || null;
}
function toggleListen(btn, d) {
  if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
  const text = `${d.prayer.title}. ${d.prayer.body.replace(/\n+/g, " ")} ${d.prayer.closing}`;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.pitch = 1; const v = pickVoice(); if (v) u.voice = v;
  const set = (on) => { btn.setAttribute("aria-pressed", String(on)); btn.innerHTML = on ? `${ICON.stop} Stop` : `${ICON.play} Listen`; };
  u.onstart = () => set(true); u.onend = u.onerror = () => set(false);
  speechSynthesis.speak(u);
}
addEventListener("popstate", () => { try { speechSynthesis.cancel(); } catch {} });
addEventListener("hashchange", () => { try { speechSynthesis.cancel(); } catch {} });

// "Add to Home Screen" tip, once, for returning visitors on phones.
let deferredInstall = null;
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });
function showInstallTip(returning) {
  const box = $("#installTip"); if (!box) return;
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const phone = matchMedia("(max-width: 820px)").matches;
  if (!returning || standalone || !phone || store.get("asfm:installTip", false)) return;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  box.innerHTML = `<div class="install-tip"><p><strong>Keep A Saint for Me on your Home Screen.</strong> ${deferredInstall ? "It opens like an app, with your collection." : ios ? "Tap the Share button, then <em>Add to Home Screen</em>." : "Open your browser menu and choose <em>Add to Home Screen</em>."}</p>
    <div class="row">${deferredInstall ? `<button class="btn small" id="installGo">Add it</button>` : ""}<button class="btn small ghost" id="installNo">Not now</button></div></div>`;
  $("#installNo").onclick = () => { store.set("asfm:installTip", true); box.innerHTML = ""; };
  $("#installGo")?.addEventListener("click", async () => { deferredInstall.prompt(); await deferredInstall.userChoice.catch(() => {}); deferredInstall = null; store.set("asfm:installTip", true); box.innerHTML = ""; });
}

// Voice-to-text using the browser's built-in speech recognition, where available.
let recognizer = null;
function stopVoice() { try { recognizer?.stop(); } catch {} recognizer = null; }
function setupVoice(textarea, btn, hint) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { hint.textContent = "Tip: to speak instead of type, tap the microphone on your keyboard."; return; }
  btn.hidden = false;
  btn.addEventListener("click", () => {
    if (recognizer) { stopVoice(); return; }
    const rec = new SR(); recognizer = rec;
    rec.lang = navigator.language || "en-US"; rec.continuous = true; rec.interimResults = true;
    const base = textarea.value ? textarea.value.replace(/\s*$/, " ") : "";
    let finalText = "";
    rec.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t + " "; else interim += t;
      }
      textarea.value = base + finalText + interim;
    };
    rec.onstart = () => { btn.setAttribute("aria-pressed", "true"); hint.textContent = "Listening… tap the mic again when you're done."; };
    rec.onend = () => { btn.setAttribute("aria-pressed", "false"); hint.textContent = "Edit anything you like, then receive your devotional."; if (recognizer === rec) recognizer = null; };
    rec.onerror = (ev) => { hint.textContent = ev.error === "not-allowed" ? "Microphone access was blocked. You can type instead, or allow the mic in your browser settings." : "Couldn't hear that. Try again, or type instead."; };
    rec.start();
  });
}

function renderPreparing() {
  const lines = ["Listening to what's on your heart…", "Finding saints who have walked this road…", "Writing a prayer for this moment…", "Choosing words of Scripture…"];
  main.innerHTML = `<section class="preparing" aria-live="polite"><div><div class="orb" aria-hidden="true"></div><h2>Preparing your devotional</h2><p id="prepLine">${lines[0]}</p></div></section>`;
  let i = 0; const t = setInterval(() => { const el = $("#prepLine"); if (!el) return clearInterval(t); el.textContent = lines[++i % lines.length]; }, 2600);
  scrollTo({ top: 0 });
}

// ---------------- EXPERIENCE ----------------
let VIEW = store.get("asfm:view", "prayer");
async function renderExperience(id, preloaded) {
  let exp;
  try { exp = preloaded || (await api(`/api/experiences/${id}`)); } catch { main.innerHTML = `<div class="empty"><h2>We couldn't find that devotional.</h2><p><a href="${L("/")}" data-link>Return to today</a></p></div>`; return; }
  const d = exp.devotional;
  document.title = `${exp.intentionTitle} · A Saint for Me`;
  const paras = d.prayer.body.split(/\n\s*\n/).map((p) => `<p>${esc(p.trim())}</p>`).join("");

  main.innerHTML = `
  <header class="exp-head">
    <span class="date">${fmtDate(exp.createdAt)}${exp.personName ? ` · Praying for ${esc(exp.personName)}` : ""}</span>
    <h1>${esc(exp.intentionTitle)}</h1>
    <p class="opening">${esc(d.opening)}</p>
  </header>
  ${exp.care ? `<aside class="care" role="note"><h2>${esc(exp.care.heading)}</h2><p>${esc(exp.care.body)}</p><ul>${exp.care.links.map((l) => `<li><a href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a></li>`).join("")}</ul></aside>` : ""}
  <div class="diptych">
    <div class="art-col" id="artCol"></div>
    <div>
      <article class="card prayer" id="prayer">
        <span class="badge ai" title="Composed for you with AI. Not an official prayer of the Church.">✦ Written for you</span>
        <h2>${esc(d.prayer.title)}</h2>
        <div class="prayer-body">${paras}<p class="closing">${esc(d.prayer.closing)}</p></div>
        <div class="row" style="margin-top:6px">
          ${"speechSynthesis" in window ? `<button class="btn small ghost" id="listen" aria-pressed="false">${ICON.play} Listen</button>` : ""}
          <button class="btn small ghost" id="savePrayer">${exp.prayerSaved ? ICON.heart + " Prayer saved" : ICON.book + " Save this prayer"}</button>
        </div>
        <p class="provenance">This prayer was composed ${d.source === "claude" ? "with AI" : "from our prayer library"} for what you shared. It is not an official prayer of the Church. Traditional prayers below are marked “Traditional”.</p>
      </article>
    </div>
  </div>

  <div class="tabbar" role="tablist" aria-label="More for today">
    <button role="tab" aria-selected="true" data-tab="saints">Saints <span>${d.saints.length}</span></button>
    <button role="tab" aria-selected="false" data-tab="scripture">Scripture</button>
    <button role="tab" aria-selected="false" data-tab="trad">Prayers of the Church</button>
  </div>
  <div class="tabpanel" data-panel="saints">${d.saints.map((s) => `
    <article class="saint-row">
      <img src="${s.emblem}" alt="Symbolic emblem for ${esc(s.name)} (artistic interpretation)" loading="lazy" width="96" height="120">
      <div>
        <h3>${esc(s.name)}</h3>
        <p class="facts">${esc(s.years)} · Feast ${esc(s.feast)} · Patron of ${esc(s.patronages.slice(0, 2).join(", "))}</p>
        ${symbolNote(s) ? `<p class="symbol-note">✦ ${esc(symbolNote(s))}</p>` : ""}
        <p class="why">${esc(s.why)}</p>
        <details><summary>Their story</summary><p>${esc(s.story)}</p></details>
      </div>
    </article>`).join("")}
    <p class="hint">Emblems are symbolic, artistic interpretations.</p>
  </div>
  <div class="tabpanel" data-panel="scripture" hidden>
    ${d.scripture.map((s) => `<div class="scripture"><blockquote>${esc(s.text)}</blockquote><cite>${esc(s.ref)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">Read in context</a></cite><p class="conn">${esc(s.connection)}</p></div>`).join("")}
    <p class="hint">Adapted from the World English Bible (public domain). “Read in context” opens the NABRE on usccb.org.</p>
  </div>
  <div class="tabpanel" data-panel="trad" hidden>
    ${d.devotions.map((v) => `<details class="devotion" ${v.kind === "prayer" ? "open" : ""}><summary><span class="badge trad">✝ Traditional</span> ${esc(v.title)}</summary>
      ${v.kind === "prayer" ? `<p class="text">${esc(v.text)}</p>${v.note ? `<p class="hint">${esc(v.note)}</p>` : ""}` : ""}
      ${v.kind === "rosary" ? `<p class="hint">Traditionally prayed on ${esc(v.days)}</p><ol>${v.mysteries.map((m) => `<li>${esc(m)}</li>`).join("")}</ol>` : ""}
      ${v.kind === "devotion" ? `<p>${esc(v.description)} <a href="${esc(v.url)}" target="_blank" rel="noopener">Learn more</a></p>` : ""}
      <p class="suggest">${esc(v.suggestion)}</p></details>`).join("")}
  </div>

  <section class="card reflection"><p>${esc(d.reflection)}</p><a class="btn" href="${L("/journey")}" data-link>Visit my collection</a></section>`;

  $$(".tabbar button").forEach((t) => t.addEventListener("click", () => {
    $$(".tabbar button").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    $$(".tabpanel").forEach((pnl) => (pnl.hidden = pnl.dataset.panel !== t.dataset.tab));
  }));
  $("#listen")?.addEventListener("click", (e) => toggleListen(e.currentTarget, d));
  $("#savePrayer").addEventListener("click", async () => {
    exp = await api(`/api/experiences/${exp.id}/save`, { method: "POST", body: { prayerSaved: !exp.prayerSaved } });
    $("#savePrayer").innerHTML = exp.prayerSaved ? ICON.heart + " Prayer saved" : ICON.book + " Save this prayer";
    toast(exp.prayerSaved ? "Prayer saved to your collection" : "Prayer removed from saved");
  });
  renderArt(exp);
  scrollTo({ top: 0 });
}

function renderArt(exp) {
  const col = $("#artCol"); if (!col) return;
  const d = exp.devotional, art = exp.art, cur = art.current;
  const busy = art.status === "queued" || art.status === "generating";
  const imgOrPending = cur && !(busy && !cur)
    ? `<img src="${cur.url}" alt="Original devotional artwork: ${esc(cur.title || d.art_brief.title)}">`
    : "";
  const pending = busy ? `<div class="art-pending" style="${cur ? "background:rgba(36,22,58,.65)" : ""}"><div><div class="glass" aria-hidden="true"></div><p>Your artwork is being made…</p></div></div>` : "";
  const failed = !cur && art.status === "failed" ? `<div class="art-pending"><p>No artwork yet. Your prayer is ready.</p></div>` : "";
  const firstLines = d.prayer.body.split(/\n\s*\n/).slice(0, 2).join(" ");
  const saintNames = d.saints.slice(0, 3).map((s) => s.name).join(" · ");

  let framed;
  if (VIEW === "card") framed = `<div class="collectible"><div class="artframe">${imgOrPending}${pending}${failed}</div><div class="meta"><div class="t">${esc(d.prayer.title)}</div><div class="p">${esc(firstLines)}</div><div class="s">${esc(saintNames)}<br>${fmtDate(exp.createdAt, { month: "long", day: "numeric", year: "numeric" })}</div></div></div>`;
  else framed = `<div class="artframe">${imgOrPending}${pending}${failed}${VIEW === "prayer" && cur ? `<div class="overlay-prayer"><h2>${esc(d.prayer.title)}</h2><p>${esc(firstLines)}</p></div>` : ""}</div>`;

  col.innerHTML = `
    <div class="view-switch" role="group" aria-label="Artwork view">
      ${[["art", "Artwork"], ["prayer", "With prayer"], ["card", "Devotional card"]].map(([v, l]) => `<button data-view="${v}" aria-pressed="${VIEW === v}">${l}</button>`).join("")}
    </div>
    ${framed}
    <div class="art-label">
      <span><strong>${esc(cur?.title || d.art_brief.title)}</strong></span>
      ${cur ? `<span class="badge">${cur.kind === "ai-generated" ? "Original AI artwork" : "One-of-a-kind collage"}</span>` : ""}
    </div>
    ${cur ? `<p class="art-credit">Cut from original works by Sierra Renee. <a href="https://www.juujuumama.art/work" target="_blank" rel="noopener">See the originals</a></p>` : ""}
    ${art.notice ? `<p class="notice">${esc(art.notice)}</p>` : ""}
    <div class="art-actions" ${exp.example ? "hidden" : ""}>
      <button class="btn small" id="saveArt" ${!cur ? "disabled" : ""}>${exp.saved ? ICON.heart + " In my collection" : ICON.heartO + " Save to collection"}</button>
      <button class="btn small ghost" id="shareArt" ${!cur ? "disabled" : ""}>${ICON.share} Download or share</button>
      <button class="btn small ghost" id="regen" ${busy ? "disabled" : ""}>${ICON.refresh} New artwork</button>
    </div>
    ${art.history.length > 1 ? `<div class="history" role="group" aria-label="Artwork versions">${art.history.map((h) => `<button data-i="${h.index}" aria-pressed="${cur?.url === h.url}" aria-label="Version ${h.index + 1}"><img src="${h.url}" alt=""></button>`).join("")}</div>` : ""}`;

  $$(".view-switch button", col).forEach((b) => b.addEventListener("click", () => { VIEW = b.dataset.view; store.set("asfm:view", VIEW); renderArt(exp); }));
  $("#saveArt", col).addEventListener("click", async () => {
    exp = await api(`/api/experiences/${exp.id}/save`, { method: "POST", body: { saved: !exp.saved } });
    toast(exp.saved ? "Saved to My Devotional Collection" : "Removed from your collection");
    renderArt(exp);
  });
  $("#regen", col).addEventListener("click", async () => {
    try { exp = await api(`/api/experiences/${exp.id}/art/regenerate`, { method: "POST", body: {} }); renderArt(exp); poll(exp.id); }
    catch (e) { toast(e.message); }
  });
  $("#shareArt", col).addEventListener("click", () => openShare(exp));
  $$(".history button", col).forEach((b) => b.addEventListener("click", async () => { exp = await api(`/api/experiences/${exp.id}/art/select`, { method: "POST", body: { index: Number(b.dataset.i) } }); renderArt(exp); }));
  if (busy) poll(exp.id);
}

function poll(id) {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(async () => {
    if (currentPath() !== `/e/${id}`) return;
    try {
      const exp = await api(`/api/experiences/${id}`);
      if (exp.art.status === "queued" || exp.art.status === "generating") return poll(id);
      renderArt(exp);
    } catch { poll(id); }
  }, 2500);
}

// ---------------- devotional card (canvas) ----------------
function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/), lines = []; let line = "";
  for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
function cover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
async function drawCard(canvas, exp, mode, format) {
  await document.fonts.ready;
  const W = 1080, H = format === "square" ? 1080 : 1350;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const d = exp.devotional, img = await loadImage(exp.art.current.url);
  const serif = '"Fraunces", Georgia, serif', sans = '"Instrument Sans", system-ui, sans-serif';
  const body = d.prayer.body.replace(/\n\s*\n/g, " ");
  if (mode === "art") {
    cover(ctx, img, 0, 0, W, H);
    ctx.font = `600 20px ${sans}`; const label = `${SITE}  ·  ART BY JUUJUUMAMA`, tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(251,246,236,.92)"; roundRect(ctx, W - tw - 64, H - 70, tw + 32, 40, 20); ctx.fill();
    ctx.fillStyle = "#1E1530"; ctx.fillText(label, W - tw - 48, H - 43);
    return;
  }
  if (mode === "prayer") {
    cover(ctx, img, 0, 0, W, H);
    const g = ctx.createLinearGradient(0, H * 0.3, 0, H); g.addColorStop(0, "rgba(20,15,31,0)"); g.addColorStop(0.45, "rgba(20,15,31,.82)"); g.addColorStop(1, "rgba(20,15,31,.95)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FFF4EA"; ctx.font = `600 54px ${serif}`;
    const pad = 80; let lines = wrap(ctx, d.prayer.title, W - pad * 2);
    ctx.font = `italic 34px ${serif}`;
    let pl = wrap(ctx, body, W - pad * 2); const maxL = format === "square" ? 9 : 13;
    if (pl.length > maxL) { pl = pl.slice(0, maxL); pl[maxL - 1] = pl[maxL - 1].replace(/\s+\S*$/, "") + " …"; }
    let y = H - pad - pl.length * 48 - 30 - lines.length * 62;
    ctx.font = `600 54px ${serif}`; for (const l of lines) { ctx.fillText(l, pad, y); y += 62; }
    y += 16; ctx.font = `italic 34px ${serif}`; for (const l of pl) { ctx.fillText(l, pad, y); y += 48; }
    ctx.font = `600 22px ${sans}`; ctx.fillStyle = "#FFC9A8"; ctx.fillText(`A SAINT FOR ME  ·  ${SITE}`, pad, H - 44);
    ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,244,234,.7)"; ctx.fillText("ART BY JUUJUUMAMA", W - pad, H - 44); ctx.textAlign = "left";
    return;
  }
  // collectible card
  ctx.fillStyle = "#FFF6EC"; ctx.fillRect(0, 0, W, H);
  const m = 44, artH = format === "square" ? 620 : 820;
  ctx.save(); roundRect(ctx, m, m, W - m * 2, artH, 28); ctx.clip(); cover(ctx, img, m, m, W - m * 2, artH); ctx.restore();
  const grad = ctx.createLinearGradient(m, 0, W - m, 0); ["#FF5FA2", "#FF7A1A", "#FFC9A8", "#1FC8C0"].forEach((c, i) => grad.addColorStop(i / 3, c));
  ctx.fillStyle = grad; ctx.fillRect(m, m + artH + 26, W - m * 2, 6);
  ctx.textAlign = "center"; ctx.fillStyle = "#1E1530";
  let y = m + artH + 96; ctx.font = `650 50px ${serif}`;
  for (const l of wrap(ctx, d.prayer.title, W - 200).slice(0, 2)) { ctx.fillText(l, W / 2, y); y += 58; }
  ctx.font = `italic 30px ${serif}`; ctx.fillStyle = "#3A2D4C";
  const maxL = format === "square" ? 3 : 5; let pl = wrap(ctx, body, W - 220);
  if (pl.length > maxL) { pl = pl.slice(0, maxL); pl[maxL - 1] = pl[maxL - 1].replace(/\s+\S*$/, "") + " …"; }
  y += 6; for (const l of pl) { ctx.fillText(l, W / 2, y); y += 42; }
  ctx.font = `600 22px ${sans}`; ctx.fillStyle = "#8A4B6B";
  const saints = d.saints.slice(0, 3).map((s) => s.name.replace(/\s*\(.*\)/, "")).join("  ·  ").toUpperCase();
  ctx.fillText(wrap(ctx, saints, W - 160)[0], W / 2, H - 82);
  ctx.fillStyle = "#5B4E6B"; ctx.fillText(`${SITE}  ·  ART BY JUUJUUMAMA`, W / 2, H - 46);
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

function openShare(exp) {
  let mode = VIEW === "art" ? "art" : VIEW === "card" ? "card" : "prayer", format = "portrait";
  const dlg = document.createElement("dialog"); dlg.className = "sheet share-sheet";
  dlg.innerHTML = `<div class="sheet-inner"><h2>Your devotional card</h2>
    <div class="formats"><div class="tabs" id="mode">${[["art", "Artwork"], ["prayer", "With prayer"], ["card", "Collectible card"]].map(([v, l]) => `<button data-v="${v}" aria-pressed="${v === mode}">${l}</button>`).join("")}</div>
    <div class="tabs" id="fmt">${[["portrait", "Portrait"], ["square", "Square"]].map(([v, l]) => `<button data-v="${v}" aria-pressed="${v === format}">${l}</button>`).join("")}</div></div>
    <div class="share-preview"><canvas aria-label="Card preview"></canvas></div>
    <p class="hint">Cards include your prayer and saints, but never what you wrote privately.</p>
    <div class="sheet-actions"><button class="btn ghost" data-close>Close</button><div class="row"><button class="btn ghost" id="dl">Download</button>${navigator.share ? `<button class="btn" id="sh">${ICON.share} Share</button>` : ""}</div></div></div>`;
  document.body.append(dlg); dlg.showModal();
  const canvas = $("canvas", dlg);
  const redraw = () => drawCard(canvas, exp, mode, format).catch(() => toast("Couldn't draw the card."));
  redraw();
  $$("#mode button", dlg).forEach((b) => b.onclick = () => { mode = b.dataset.v; $$("#mode button", dlg).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); redraw(); });
  $$("#fmt button", dlg).forEach((b) => b.onclick = () => { format = b.dataset.v; $$("#fmt button", dlg).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); redraw(); });
  const blob = () => new Promise((r) => canvas.toBlob(r, "image/png"));
  const name = `a-saint-for-me-${exp.intentionTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  $("#dl", dlg).onclick = async () => { const a = document.createElement("a"); a.href = URL.createObjectURL(await blob()); a.download = name; a.click(); };
  $("#sh", dlg)?.addEventListener("click", async () => {
    const file = new File([await blob()], name, { type: "image/png" });
    try { await navigator.share({ files: [file], title: exp.devotional.prayer.title }); } catch {}
  });
  $("[data-close]", dlg).onclick = () => dlg.close();
  dlg.addEventListener("close", () => dlg.remove());
}

// ---------------- JOURNEY ----------------
function tile(x) {
  return `<a class="tile" href="${L(`/e/${x.id}`)}" data-link>
    <div class="img">${x.art.current ? `<img src="${x.art.current.url}" alt="" loading="lazy">` : ""}</div>
    <div class="info"><strong>${esc(x.intentionTitle)}</strong><small>${fmtDate(x.createdAt, { month: "short", day: "numeric", year: "numeric" })} ${x.saved ? '<span class="heart" aria-label="Saved">♥</span>' : ""}${x.prayerSaved ? " · prayer saved" : ""}</small></div></a>`;
}
let JFILTER = "all";
async function renderJourney() {
  document.title = "My Devotional Collection · A Saint for Me";
  const { experiences } = await api(`/api/journey${JFILTER === "all" ? "" : `?filter=${JFILTER}`}`);
  main.innerHTML = `
    <div class="journey-head"><div><p class="eyebrow" style="color:var(--accent)">Your prayer journey</p><h1>My Devotional Collection</h1></div>
      <div class="tabs" role="group" aria-label="Filter">${[["all", "All days"], ["saved", "Saved art"], ["prayers", "Saved prayers"]].map(([v, l]) => `<button data-f="${v}" aria-pressed="${JFILTER === v}">${l}</button>`).join("")}</div></div>
    <div class="backup-note">
      <p><strong>Saved on this device.</strong> Your collection lives in this browser, so clearing your browsing data would erase it. Download a backup now and then, and save art you love to your photos with <em>Download or share</em>.</p>
      <div class="row"><button class="btn small" id="backupDl">Download backup</button>${STATIC ? `<label class="btn small ghost">Restore from backup<input type="file" id="backupIn" accept="application/json,.json" hidden></label>` : ""}</div>
    </div>
    ${experiences.length ? `<div class="gallery">${experiences.map(tile).join("")}</div>`
      : `<div class="empty"><h2>${JFILTER === "all" ? "Your collection begins today" : "Nothing saved here yet"}</h2><p>Each devotional you receive keeps its artwork, prayer and saints together here, whether you visit every day or once in a while.</p><a class="btn primary" href="${L("/")}" data-link>What's on your heart?</a></div>`}`;
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => { JFILTER = b.dataset.f; renderJourney(); }));
  $("#backupDl").addEventListener("click", async () => {
    const text = STATIC ? local.exportDb() : JSON.stringify(await api("/api/journey"), null, 1);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    a.download = `a-saint-for-me-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    toast("Backup downloaded");
  });
  $("#backupIn")?.addEventListener("change", async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { const n = local.importDb(await f.text()); toast(n ? `Restored ${n} devotional${n === 1 ? "" : "s"}` : "Everything in that backup is already here"); renderJourney(); }
    catch (err) { toast(err.message || "Couldn't read that file."); }
  });
}

// ---------------- EXAMPLE ----------------
async function renderExample() {
  const base = STATIC ? "showcase/" : "/showcase/";
  const ex = await fetch(base + "example.json").then((r) => r.json());
  ex.art.current.url = base + ex.art.current.file;
  ex.devotional.saints.forEach((s) => (s.emblem = base + s.emblem));
  ex.art.history = [];
  await renderExperience(ex.id, ex);
  document.title = "Example · A Saint for Me";
  main.insertAdjacentHTML("afterbegin", `<div class="example-banner"><p><strong>This is an example.</strong> Someone wrote: <em>“${esc(ex.exampleText)}”</em> Here's what they received.</p><a class="btn small primary" href="${L("/")}" data-link>Try it yourself</a></div>`);
}

// ---------------- ABOUT ----------------
async function renderAbout() {
  document.title = "About · A Saint for Me";
  const showcase = (STATIC ? "showcase/" : "/showcase/");
  const [symbols, shots] = await Promise.all([api("/api/symbols").catch(() => []), fetch(showcase + "showcase.json").then((r) => r.json()).catch(() => [])]);
  const sample = { images: shots.map((f) => showcase + f) };
  const order = ["palm", "lily", "roses", "chains_broken", "flame", "heart", "tears", "book", "sword", "scales", "fish", "hand", "rays", "broom", "bread", "wheat", "sun", "rings", "lamp", "ladder", "thorn", "castle", "water", "jar", "cross", "rosary", "medallion", "tools", "dove", "star", "moon"];
  const byKey = Object.fromEntries(symbols.map((x) => [x.key, x.svg]));
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  main.innerHTML = `
  <article class="about">
    <header class="about-head">
      <p class="eyebrow" style="color:var(--accent)">About</p>
      <h1>A daily prayer, and a piece of art made for it</h1>
      <p class="lead">Share what's on your heart, in your own words or out loud. A Saint for Me answers with a personal prayer, saints to walk with you, Scripture, prayers of the Church, and a one-of-a-kind collage built from the original artwork of Sierra Renee (juujuumama).</p>
    </header>
    ${sample.images.length ? `<div class="about-strip" tabindex="0" role="region" aria-label="Sample saint collages">${sample.images.map((u) => `<img src="${u}" alt="A saint or angel collage made by the app" loading="lazy">`).join("")}</div>` : ""}

    <section class="about-sec why">
      <h2>Why I made this</h2>
      <p>I've struggled to pray consistently my whole life. I believe, and I've always wanted a deeper prayer life, but routines never stuck, and the words didn't always feel connected to what I was actually going through.</p>
      <p>Making art is where I feel most like myself. So I made A Saint for Me for me first: a way to bring what's really on my heart to prayer, and to meet it with saints, Scripture and something beautiful cut from my own work. It turned prayer into something I look forward to.</p>
      <p>If you've ever felt like you're not "good" at praying, this is for you too.</p>
      <p class="why-sign">— Sierra</p>
    </section>

    <div class="about-cols">
    <section class="about-sec">
      <h2>How it works</h2>
      <ol class="steps">
        <li><strong>You share.</strong> Type or speak what's going on: a worry, a loss, a celebration, someone you're praying for. There are no forms or categories to pick.</li>
        <li><strong>We listen for what matters.</strong> The app notices the themes in your words, like grief, fear, motherhood, work or gratitude, and chooses from a library of real saints, Scripture passages and traditional Catholic prayers.</li>
        <li><strong>A prayer is written for you.</strong> Prayers marked <em>Written for you</em> are composed for your situation. They're guided by Catholic teaching, but they aren't official prayers of the Church. Prayers marked <em>Traditional</em> are the Church's own, word for word.</li>
        <li><strong>A collage is made for you.</strong> Every artwork is assembled from pieces of Sierra Renee's own work: her backgrounds, textures and portraits, cut and layered into a saint or angel. No two are the same, and you can ask for a new one anytime.</li>
        <li><strong>It's yours to keep.</strong> Save the art and prayer to My Collection, download a card to share, and come back whenever you need to, every day or once a month.</li>
      </ol>
    </section>

    <div>
    <section class="about-sec">
      <h2>About the artwork</h2>
      <p>Every collage is cut from Sierra Renee's original works: her red wave paintings, florals, crystals, textile pieces and portraits. <a href="https://www.juujuumama.art/work" target="_blank" rel="noopener">See the original works on juujuumama.art</a>.</p>
      <p>The saints and angels in each collage are <strong>artistic interpretations, not portraits</strong>. Any face from Sierra's work can become any saint, whatever that saint's historical gender or race. It's meant to say that holiness looks like all of us, not to show what a saint looked like. Saints wear halos. Angels have wings, and sometimes one of Sierra's robot faces, because angels aren't human.</p>
    </section>
    <section class="about-sec">
      <h2>Your privacy</h2>
      <p>What you write stays private to you. It's never shown to anyone else, and the art is made without it. "Remember my intentions" is off unless you turn it on, and you can delete everything anytime from the shield menu. If your words suggest you might be in danger, crisis resources appear alongside your prayer.</p>
    </section>
    </div>
    </div>

    <section class="about-sec">
      <h2>The symbols</h2>
      <p>In Catholic art, saints are recognized by what they carry. The small emblem on each figure is that saint's traditional symbol. Each saint's description tells you what theirs means.</p>
      <div class="symbol-grid" id="symbolGrid">${order.filter((k) => byKey[k] && SYMBOLS[k]).map((k) => `<div class="symbol"><span class="symbol-icon">${byKey[k]}</span><span>${esc(cap(SYMBOLS[k]))}</span></div>`).join("")}</div>
      <button class="btn small ghost symbol-more" id="symbolMore" aria-expanded="false">Show all 31 symbols</button>
    </section>


    <section class="about-sec artist">
      <h2>About the artist</h2>
      <div class="artist-body">
      <p><strong>Sierra Renee</strong> (juujuumama) is a Catholic, multidisciplinary artist rooted in Afrofuturism and surrealism. She works in hand-cut collage, acrylic and mixed media, and AI models she trains on her own art to represent Black features, hair and adornment truthfully.</p>
      <p>Raised in the Hudson Valley in a Black, Italian and Puerto Rican family, she has shown her work from Tokyo, London and Lisbon to Times Square. Every collage here is cut from her original work.</p>
      </div>
      <p><a class="btn" href="https://www.juujuumama.art/work" target="_blank" rel="noopener">See her work at juujuumama.art</a></p>
    </section>

  </article>`;
  $("#symbolMore")?.addEventListener("click", (e) => {
    const open = $("#symbolGrid").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
    e.currentTarget.textContent = open ? "Show fewer" : "Show all 31 symbols";
  });
  scrollTo({ top: 0 });
}

// ---------------- settings ----------------
async function openSettings() {
  const me = await api("/api/me");
  $("#memoryToggle").checked = me.settings.memoryConsent;
  $("#settings").showModal();
}
$("#settingsBtn").addEventListener("click", openSettings);
$("#memoryToggle").addEventListener("change", async (e) => {
  await api("/api/me/settings", { method: "POST", body: { memoryConsent: e.target.checked } });
  toast(e.target.checked ? "We'll remember your intentions" : "Memory off. Your words have been forgotten.");
  if (currentPath() === "/") renderHome();
});
$("#deleteAll").addEventListener("click", async () => {
  if (!confirm("Delete all your devotionals, artwork and settings? This can't be undone.")) return;
  await api("/api/me", { method: "DELETE" });
  $("#settings").close(); toast("Everything has been deleted."); navigate("/");
});

route();
