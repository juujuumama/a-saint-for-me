// Builds the free, browser-only edition into dist/ for GitHub Pages.
// Everything runs on the visitor's device: offline prayer composer + procedural art.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve("dist");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const cp = (from, to) => fs.cpSync(path.resolve(from), path.join(out, to), { recursive: true });

for (const f of fs.readdirSync("public")) if (f !== "studio.html") cp(`public/${f}`, f);
cp("server/library", "lib/library");
cp("server/art/procedural.js", "lib/art/procedural.js");
cp("server/art/kit.js", "lib/art/kit.js");
cp("server/compose-offline.js", "lib/compose-offline.js");
cp("server/safety.js", "lib/safety.js");
cp("config/style.json", "lib/style.json");

let html = fs.readFileSync(path.join(out, "index.html"), "utf8");
html = html
  .replace('href="/styles.css"', 'href="styles.css"')
  .replace('href="/icon.svg"', 'href="icon.svg"')
  .replace('href="/manifest.webmanifest"', 'href="manifest.webmanifest"')
  .replace('href="/icon-180.png"', 'href="icon-180.png"')
  .replace(/href="\/example"/g, 'href="#/example"')
  .replace('<script type="module" src="/app.js"></script>', '<script>window.ASFM_STATIC = true;</script>\n  <script type="module" src="app.js"></script>')
  .replace(/href="\/"/g, 'href="#/"')
  .replace(/href="\/journey"/g, 'href="#/journey"')
  .replace(/href="\/about"/g, 'href="#/about"')
  .replace("Your devotionals are private to this device's account.", "Your devotionals are saved only on this device, in this browser.");
// Version every script and stylesheet, so phones load the new code right after a deploy
// instead of a cached copy of the old one.
const V = (process.env.GITHUB_SHA || String(Date.now())).slice(0, 10);
const tag = (u) => `${u}?v=${V}`;
const walkJs = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walkJs(path.join(d, e.name)) : e.name.endsWith(".js") ? [path.join(d, e.name)] : []));
for (const f of walkJs(out)) {
  const src = fs.readFileSync(f, "utf8")
    .replace(/(\bfrom\s*["'])(\.{1,2}\/[^"'?]+\.js)(["'])/g, (_, a, u, b) => a + tag(u) + b)
    .replace(/(\bimport\(\s*["'])(\.{1,2}\/[^"'?]+\.js)(["']\s*\))/g, (_, a, u, b) => a + tag(u) + b);
  fs.writeFileSync(f, src);
}
// The Home Screen app can stay open for days: when it comes back to the front and a newer
// version is live, reload (never while someone is typing).
const updater = `<script>addEventListener("visibilitychange",()=>{if(document.visibilityState!=="visible")return;fetch(location.pathname,{cache:"no-store"}).then(r=>r.text()).then(t=>{const m=t.match(/app\\.js\\?v=(\\w+)/),box=document.querySelector("#text");if(m&&m[1]!=="${V}"&&!(box&&box.value.trim()))location.reload()}).catch(()=>{})});</script>`;
html = html.replace("</head>", `  ${updater}\n</head>`);
html = html.replace('src="app.js"', `src="${tag("app.js")}"`).replace('href="styles.css"', `href="${tag("styles.css")}"`);

// Fetch every module and data file in parallel instead of one import at a time (faster on slow phones).
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const mods = ["local-api.js", ...walk(path.join(out, "lib")).filter((f) => f.endsWith(".js")).map((f) => path.relative(out, f))];
const preload = mods.map((m) => `<link rel="modulepreload" href="${tag(m)}">`).join("\n  ") +
  '\n  <link rel="preload" href="lib/style.json" as="fetch" crossorigin>\n  <link rel="preload" href="kit/kit.json" as="fetch" crossorigin>';
html = html.replace("</head>", `  ${preload}\n</head>`);
fs.writeFileSync(path.join(out, "index.html"), html);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("Built browser-only edition → dist/");
