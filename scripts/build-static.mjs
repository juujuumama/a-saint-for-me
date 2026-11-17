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
// Fetch every module and data file in parallel instead of one import at a time (faster on slow phones).
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const mods = ["local-api.js", ...walk(path.join(out, "lib")).filter((f) => f.endsWith(".js")).map((f) => path.relative(out, f))];
const preload = mods.map((m) => `<link rel="modulepreload" href="${m}">`).join("\n  ") +
  '\n  <link rel="preload" href="lib/style.json" as="fetch" crossorigin>\n  <link rel="preload" href="kit/kit.json" as="fetch" crossorigin>';
html = html.replace("</head>", `  ${preload}\n</head>`);
fs.writeFileSync(path.join(out, "index.html"), html);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("Built browser-only edition → dist/");
