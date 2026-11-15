// Procedural "studio sketch" generator — the always-available fallback artist.
// Produces an original SVG collage in the house style (torn paper, stained glass,
// crystals, celestial forms, halftone & archival textures), driven by the art
// brief's themes and composition and a per-artwork seed. Never identical twice.
// Pure module (no Node APIs): runs on the server and in the browser. Pass the style config in.

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

// ---------- shape helpers ----------
function tornPoly(points, r, rough = 6) {
  // densify edges and jitter for a torn-paper outline
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    const len = Math.hypot(x2 - x1, y2 - y1), steps = Math.max(2, Math.floor(len / 14));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push([x1 + (x2 - x1) * t + (r() - 0.5) * rough, y1 + (y2 - y1) * t + (r() - 0.5) * rough]);
    }
  }
  return "M" + out.map(([x, y]) => `${f(x)},${f(y)}`).join("L") + "Z";
}
function tornRect(x, y, w, h, r, rough, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot), cx = x + w / 2, cy = y + h / 2;
  const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(([px, py]) => [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c]);
  return tornPoly(pts, r, rough);
}
function tornCircle(cx, cy, rad, r, rough = 8) {
  const pts = [], n = Math.max(24, Math.floor(rad / 5));
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
  return tornPoly(pts, r, rough);
}
function archPts(x, y, w, h) {
  const pts = [[x, y + h], [x, y + w / 2]];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + (i / 16) * Math.PI; pts.push([x + w / 2 + Math.cos(a) * w / 2, y + w / 2 + Math.sin(a) * w / 2]); }
  pts.push([x + w, y + h]);
  return pts;
}
function star(cx, cy, R, rIn = R * 0.38, points = 8) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? rIn : R;
    d += (i ? "L" : "M") + f(cx + Math.cos(a) * rr) + "," + f(cy + Math.sin(a) * rr);
  }
  return d + "Z";
}
function stainedGlass(cx, cy, R, r, pal, rings = 3, ink = "#140F1F") {
  let out = "";
  for (let ring = 0; ring < rings; ring++) {
    const r0 = (R * ring) / rings, r1 = (R * (ring + 1)) / rings;
    const n = ring === 0 ? 6 : 6 + ring * 6, off = r() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a0 = off + (i / n) * Math.PI * 2, a1 = off + ((i + 1) / n) * Math.PI * 2;
      const p = (a, rr) => `${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)}`;
      const d = ring === 0
        ? `M${cx},${cy}L${p(a0, r1)}A${r1},${r1} 0 0 1 ${p(a1, r1)}Z`
        : `M${p(a0, r0)}L${p(a0, r1)}A${r1},${r1} 0 0 1 ${p(a1, r1)}L${p(a1, r0)}A${r0},${r0} 0 0 0 ${p(a0, r0)}Z`;
      out += `<path d="${d}" fill="${pal[Math.floor(r() * pal.length)]}" fill-opacity="${f(0.7 + r() * 0.3)}" stroke="${ink}" stroke-width="${f(R / 70 + 1)}" stroke-linejoin="round"/>`;
    }
  }
  return out;
}
function crystal(cx, cy, s, color, r, rot = 0) {
  const pts = [[0, -1.6], [0.55, -0.7], [0.55, 0.9], [0, 1.3], [-0.55, 0.9], [-0.55, -0.7]];
  const tr = ([x, y]) => { const c = Math.cos(rot), sn = Math.sin(rot); return [cx + (x * c - y * sn) * s, cy + (x * sn + y * c) * s]; };
  const P = pts.map(tr), C = tr([0, -0.2]);
  const poly = (arr) => "M" + arr.map(([x, y]) => `${f(x)},${f(y)}`).join("L") + "Z";
  return `<g filter="url(#shadow)">
    <path d="${poly(P)}" fill="${color}"/>
    <path d="${poly([P[0], P[1], C])}" fill="#fff" fill-opacity=".45"/>
    <path d="${poly([P[1], P[2], C])}" fill="#fff" fill-opacity=".15"/>
    <path d="${poly([P[3], P[4], C])}" fill="#000" fill-opacity=".22"/>
    <path d="${poly([P[4], P[5], C])}" fill="#000" fill-opacity=".1"/>
    <path d="${poly(P)}" fill="none" stroke="#140F1F" stroke-opacity=".5" stroke-width="2"/></g>`;
}
function crescent(cx, cy, R, color, rot = -0.6) {
  const dx = Math.cos(rot) * R * 0.45, dy = Math.sin(rot) * R * 0.45;
  return `<mask id="m${Math.round(cx)}_${Math.round(cy)}"><rect width="100%" height="100%" fill="#fff"/><circle cx="${f(cx + dx)}" cy="${f(cy + dy)}" r="${f(R * 0.86)}" fill="#000"/></mask>
  <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${color}" mask="url(#m${Math.round(cx)}_${Math.round(cy)})" filter="url(#shadow)"/>`;
}
const PROFILE = "M10,300 C25,275 45,262 68,245 L70,200 C58,185 52,172 55,160 C30,120 40,40 100,30 C160,20 188,70 160,100 C150,110 135,104 120,95 C124,108 128,118 128,125 L142,148 L130,155 C134,158 135,161 134,163 L128,168 C133,171 133,174 132,176 C128,184 126,188 124,190 C118,198 110,203 105,205 L108,232 C125,245 150,258 190,300 Z";

// ---------- theme motifs ----------
const MOTIFS = {
  motherhood: (cx, cy, s, P) => `${crescent(cx, cy, s, P.peach, -0.2)}<circle cx="${f(cx - s * 0.15)}" cy="${f(cy + s * 0.1)}" r="${f(s * 0.28)}" fill="${P.pink}" filter="url(#shadow)"/><circle cx="${f(cx - s * 0.15)}" cy="${f(cy + s * 0.1)}" r="${f(s * 0.12)}" fill="${P.gold}"/>`,
  addiction: (cx, cy, s, P, r) => {
    let o = "";
    for (let i = 0; i < 2; i++) o += `<ellipse cx="${f(cx - s * 0.5 + i * s * 0.35)}" cy="${f(cy + s * 0.55)}" rx="${f(s * 0.2)}" ry="${f(s * 0.12)}" fill="none" stroke="${P.ink}" stroke-width="${f(s * 0.05)}" transform="rotate(${i ? 25 : -15} ${f(cx)} ${f(cy)})"/>`;
    for (let i = 0; i < 7; i++) { const x = cx - s * 0.2 + i * s * 0.18 + r() * 20, y = cy + s * 0.3 - i * s * 0.22; o += bird(x, y, s * (0.14 + r() * 0.06), [P.pink, P.turq, P.orange, P.peach][i % 4]); }
    return o;
  },
  grief: (cx, cy, s, P) => `<path d="${tornCircle(cx, cy, s * 0.55, rng(7), 10)}" fill="${P.indigo}" filter="url(#shadow)"/>${crystal(cx - s * 0.32, cy + s * 0.2, s * 0.12, P.turq, rng(3), -0.4)}${crystal(cx + s * 0.34, cy + s * 0.22, s * 0.1, P.pink, rng(4), 0.5)}<rect x="${f(cx - s * 0.08)}" y="${f(cy - s * 0.05)}" width="${f(s * 0.16)}" height="${f(s * 0.4)}" fill="${P.paper}"/><path d="M${f(cx)},${f(cy - s * 0.35)} C${f(cx + s * 0.1)},${f(cy - s * 0.2)} ${f(cx + s * 0.06)},${f(cy - s * 0.08)} ${f(cx)},${f(cy - s * 0.07)} C${f(cx - s * 0.06)},${f(cy - s * 0.08)} ${f(cx - s * 0.1)},${f(cy - s * 0.2)} ${f(cx)},${f(cy - s * 0.35)}Z" fill="${P.orange}"/>`,
  gratitude: (cx, cy, s, P, r) => {
    let o = "";
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; o += `<path d="${star(cx + Math.cos(a) * s * 0.75, cy + Math.sin(a) * s * 0.75, s * 0.12, s * 0.05, 6)}" fill="${[P.orange, P.pink, P.turq, P.coral, P.gold][i % 5]}"/>`; }
    return o + `<circle cx="${cx}" cy="${cy}" r="${f(s * 0.45)}" fill="${P.orange}" filter="url(#shadow)"/><circle cx="${cx}" cy="${cy}" r="${f(s * 0.3)}" fill="url(#halftone)"/>` + crystal(cx, cy, s * 0.2, P.pink, r);
  },
  finances: (cx, cy, s, P, r) => {
    let o = `<path d="M${f(cx - s * 0.6)},${f(cy + s * 0.1)} C${f(cx - s * 0.5)},${f(cy + s * 0.7)} ${f(cx + s * 0.5)},${f(cy + s * 0.7)} ${f(cx + s * 0.6)},${f(cy + s * 0.1)} Z" fill="${P.peach}" filter="url(#shadow)"/>`;
    for (let i = 0; i < 14; i++) o += `<ellipse cx="${f(cx - s * 0.4 + r() * s * 0.8)}" cy="${f(cy - s * 0.8 + r() * s * 0.85)}" rx="${f(s * 0.03)}" ry="${f(s * 0.05)}" fill="${[P.gold, P.turq, P.pink][i % 3]}"/>`;
    return o + crystal(cx - s * 0.2, cy + s * 0.05, s * 0.12, P.turq, r, -0.3) + crystal(cx + s * 0.18, cy + s * 0.08, s * 0.1, P.pink, r, 0.3);
  },
  relationships: (cx, cy, s, P) => `<ellipse cx="${f(cx - s * 0.28)}" cy="${cy}" rx="${f(s * 0.55)}" ry="${f(s * 0.3)}" fill="none" stroke="${P.gold}" stroke-width="5" transform="rotate(-20 ${cx} ${cy})"/><ellipse cx="${f(cx + s * 0.28)}" cy="${cy}" rx="${f(s * 0.55)}" ry="${f(s * 0.3)}" fill="none" stroke="${P.turq}" stroke-width="5" transform="rotate(20 ${cx} ${cy})"/><circle cx="${f(cx - s * 0.5)}" cy="${f(cy - s * 0.12)}" r="${f(s * 0.12)}" fill="${P.pink}" filter="url(#shadow)"/><circle cx="${f(cx + s * 0.5)}" cy="${f(cy + s * 0.12)}" r="${f(s * 0.12)}" fill="${P.orange}" filter="url(#shadow)"/>`,
  decisions: (cx, cy, s, P) => `<path d="M${f(cx)},${f(cy + s * 0.9)} L${f(cx)},${f(cy + s * 0.2)} L${f(cx - s * 0.5)},${f(cy - s * 0.4)} M${f(cx)},${f(cy + s * 0.2)} L${f(cx + s * 0.5)},${f(cy - s * 0.4)}" stroke="${P.paper}" stroke-width="${f(s * 0.12)}" fill="none" stroke-linecap="round" filter="url(#shadow)"/><path d="${star(cx + s * 0.5, cy - s * 0.65, s * 0.18)}" fill="${P.gold}"/>`,
  peace: (cx, cy, s, P) => bird(cx, cy, s * 0.6, P.paper, true),
  faith: (cx, cy, s, P) => { let o = ""; for (let i = 0; i < 7; i++) o += `<rect x="${f(cx - s * 0.3)}" y="${f(cy + s * 0.8 - i * s * 0.26)}" width="${f(s * 0.6)}" height="${f(s * 0.05)}" fill="${P.paper}"/>`; return `<rect x="${f(cx - s * 0.32)}" y="${f(cy - s)}" width="${f(s * 0.05)}" height="${f(s * 1.9)}" fill="${P.paper}"/><rect x="${f(cx + s * 0.27)}" y="${f(cy - s)}" width="${f(s * 0.05)}" height="${f(s * 1.9)}" fill="${P.paper}"/>${o}${bird(cx, cy - s * 1.1, s * 0.25, P.paper, true)}`; },
  growth: (cx, cy, s, P) => `<path d="M${cx},${f(cy + s * 0.8)} C${f(cx - s * 0.05)},${f(cy + s * 0.2)} ${f(cx + s * 0.05)},${f(cy)} ${cx},${f(cy - s * 0.3)}" stroke="${P.turq}" stroke-width="${f(s * 0.06)}" fill="none"/><path d="M${cx},${f(cy - s * 0.1)} C${f(cx - s * 0.5)},${f(cy - s * 0.5)} ${f(cx - s * 0.6)},${f(cy - s * 0.1)} ${cx},${f(cy - s * 0.1)}Z" fill="${P.turq}" filter="url(#shadow)"/><path d="M${cx},${f(cy - s * 0.3)} C${f(cx + s * 0.5)},${f(cy - s * 0.75)} ${f(cx + s * 0.6)},${f(cy - s * 0.3)} ${cx},${f(cy - s * 0.3)}Z" fill="${P.pink}" filter="url(#shadow)"/>`,
  hope: (cx, cy, s, P, r) => MOTIFS.growth(cx, cy, s, P, r),
  health: (cx, cy, s, P) => `<path d="${tornPoly(archPts(cx - s * 0.45, cy - s * 0.7, s * 0.9, s * 1.4), rng(11), 5)}" fill="${P.turq}" filter="url(#shadow)"/><circle cx="${cx}" cy="${f(cy + s * 0.05)}" r="${f(s * 0.22)}" fill="${P.peach}"/><path d="${star(cx, cy + s * 0.05, s * 0.14, s * 0.05, 4)}" fill="${P.gold}"/>`,
  anxiety: (cx, cy, s, P) => `${crescent(cx, cy - s * 0.4, s * 0.35, P.peach)}${[0, 1, 2, 3].map((i) => `<path d="M${f(cx - s)},${f(cy + s * 0.3 + i * s * 0.14)} q${f(s * 0.25)},-${f(s * 0.08)} ${f(s * 0.5)},0 t${f(s * 0.5)},0 t${f(s * 0.5)},0 t${f(s * 0.5)},0" stroke="${[P.turq, P.paper, P.turq, P.pink][i]}" stroke-width="${f(s * 0.04)}" fill="none" stroke-linecap="round"/>`).join("")}`,
  fear: (cx, cy, s, P, r) => MOTIFS.health(cx, cy, s, P, r),
  loneliness: (cx, cy, s, P, r) => { let o = ""; for (let i = 0; i < 22; i++) o += `<path d="${star(cx - s + r() * s * 2, cy - s + r() * s * 1.2, s * (0.03 + r() * 0.05))}" fill="${P.gold}"/>`; return o + figure(cx - s * 0.25, cy - s * 0.1, s * 0.9, P.ink); },
  sadness: (cx, cy, s, P, r) => { let o = `<path d="M${f(cx - s * 0.45)},${f(cy + s * 0.1)} C${f(cx - s * 0.4)},${f(cy + s * 0.6)} ${f(cx + s * 0.4)},${f(cy + s * 0.6)} ${f(cx + s * 0.45)},${f(cy + s * 0.1)}Z" fill="${P.peach}" filter="url(#shadow)"/>`; o += `<path d="M${cx},${f(cy + s * 0.3)} C${f(cx - s * 0.3)},${f(cy + s * 0.05)} ${f(cx - s * 0.2)},${f(cy - s * 0.25)} ${cx},${f(cy - s * 0.1)} C${f(cx + s * 0.2)},${f(cy - s * 0.25)} ${f(cx + s * 0.3)},${f(cy + s * 0.05)} ${cx},${f(cy + s * 0.3)}Z" fill="${P.pink}"/>`; for (let i = 0; i < 12; i++) o += crystal(cx - s * 0.8 + r() * s * 1.6, cy - s * 1 + r() * s * 0.6, s * 0.03, P.turq, r); return o; },
  anger: (cx, cy, s, P) => `<path d="M${cx},${f(cy - s * 0.6)} C${f(cx + s * 0.3)},${f(cy - s * 0.2)} ${f(cx + s * 0.45)},${f(cy + s * 0.1)} ${f(cx + s * 0.3)},${f(cy + s * 0.35)} C${f(cx + s * 0.15)},${f(cy + s * 0.55)} ${f(cx - s * 0.15)},${f(cy + s * 0.55)} ${f(cx - s * 0.3)},${f(cy + s * 0.35)} C${f(cx - s * 0.45)},${f(cy + s * 0.1)} ${f(cx - s * 0.2)},${f(cy - s * 0.1)} ${cx},${f(cy - s * 0.6)}Z" fill="${P.coral}" filter="url(#shadow)"/><ellipse cx="${cx}" cy="${f(cy + s * 0.55)}" rx="${f(s * 0.6)}" ry="${f(s * 0.12)}" fill="${P.turq}"/>`,
};
MOTIFS.parenting = MOTIFS.motherhood; MOTIFS.marriage = MOTIFS.relationships; MOTIFS.family = MOTIFS.relationships;
MOTIFS.work = MOTIFS.decisions; MOTIFS.confusion = MOTIFS.decisions; MOTIFS.overwhelm = MOTIFS.anxiety;
MOTIFS.discouragement = MOTIFS.hope; MOTIFS.inspiration = MOTIFS.gratitude;

function bird(cx, cy, s, color, dove = false) {
  const d = `M${f(cx - s)},${f(cy + s * 0.1)} C${f(cx - s * 0.5)},${f(cy - s * 0.4)} ${f(cx - s * 0.1)},${f(cy - s * 0.3)} ${f(cx + s * 0.1)},${f(cy - s * 0.1)} L${f(cx + s * 0.7)},${f(cy - s * 0.7)} C${f(cx + s * 0.65)},${f(cy - s * 0.2)} ${f(cx + s * 0.45)},${f(cy + s * 0.05)} ${f(cx + s * 0.3)},${f(cy + s * 0.12)} C${f(cx + s * 0.55)},${f(cy + s * 0.2)} ${f(cx + s * 0.8)},${f(cy + s * 0.15)} ${f(cx + s)},${f(cy + s * 0.1)} C${f(cx + s * 0.6)},${f(cy + s * 0.5)} ${f(cx - s * 0.2)},${f(cy + s * 0.5)} ${f(cx - s)},${f(cy + s * 0.1)}Z`;
  return `<path d="${d}" fill="${color}" filter="url(#shadow)"${dove ? ` stroke="#140F1F" stroke-opacity=".25" stroke-width="2"` : ""}/>`;
}
function figure(x, y, h, color, fill) {
  const k = h / 300;
  return `<g transform="translate(${f(x - 100 * k)} ${f(y - 150 * k)}) scale(${f(k * 100) / 100})" filter="url(#shadow)"><path d="${PROFILE}" fill="${fill || color}"/><path d="M55,160 C30,120 40,40 100,30 C160,20 188,70 160,100 C150,110 135,104 120,95 C100,90 70,110 55,160Z" fill="url(#mudcloth)"/></g>`;
}

// ---------- defs ----------
function defs(P, r) {
  return `<defs>
  <filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="${Math.floor(r() * 999)}"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .2  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#140F1F" flood-opacity=".35"/></filter>
  <pattern id="halftone" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(${f(r() * 45)})"><circle cx="7" cy="7" r="3.2" fill="${P.ink}" fill-opacity=".28"/></pattern>
  <pattern id="ledger" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="${P.paper}"/><line x1="0" y1="21" x2="40" y2="21" stroke="${P.turq}" stroke-opacity=".5"/><line x1="8" y1="0" x2="8" y2="22" stroke="${P.coral}" stroke-opacity=".35"/></pattern>
  <pattern id="mudcloth" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="${P.orange}"/><path d="M0 9h36M0 27h36" stroke="${P.ink}" stroke-width="3"/><path d="M6 14l6 8 6-8 6 8 6-8" stroke="${P.paper}" stroke-width="2.5" fill="none"/><circle cx="9" cy="3" r="2" fill="${P.paper}"/><circle cx="27" cy="33" r="2" fill="${P.paper}"/></pattern>
  <pattern id="starchart" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="${P.indigo}"/><circle cx="60" cy="60" r="56" fill="none" stroke="${P.peach}" stroke-opacity=".25"/><path d="M0 60h120M60 0v120" stroke="${P.peach}" stroke-opacity=".15"/><circle cx="22" cy="30" r="1.6" fill="#fff"/><circle cx="90" cy="18" r="1.2" fill="#fff"/><circle cx="76" cy="88" r="2" fill="#fff"/><circle cx="35" cy="96" r="1" fill="#fff"/></pattern>
  <linearGradient id="iri" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9BD0"/><stop offset=".35" stop-color="#C3A6FF"/><stop offset=".65" stop-color="#8FEDE6"/><stop offset="1" stop-color="#FFD9BE"/></linearGradient>
  <linearGradient id="iri2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FF3EC"/><stop offset=".5" stop-color="#FFB3DA"/><stop offset="1" stop-color="#B9A0FF"/></linearGradient>
  <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB8C6"/><stop offset="1" stop-color="#D9E6D6"/></linearGradient>
  <filter id="faded"><feColorMatrix type="matrix" values=".85 .1 .05 0 .06  .08 .82 .1 0 .05  .05 .1 .72 0 .04  0 0 0 1 0"/></filter>
  </defs>`;
}

function palette(style) {
  const all = [...style.palette.primary, ...style.palette.grounds, ...style.palette.accents];
  const by = (name) => all.find((c) => c.name.toLowerCase().split(/\s+/).includes(name))?.hex;
  return {
    pink: by("pink") || "#FF5FA2", turq: by("turquoise") || "#1FC8C0", orange: by("orange") || "#FF7A1A",
    coral: by("coral") || "#FF6F61", peach: by("peach") || "#FFC9A8", paper: by("cream") || "#F6EBDD",
    red: by("red") || "#E8364F", lav: by("lavender") || "#A98BEA",
    night: by("aubergine") || "#24163A", indigo: by("indigo") || "#1B2A5C", gold: by("gold") || "#D9A441", ink: by("ink") || "#140F1F",
  };
}


// ---------- founder signatures (from juujuumama.art) ----------
let clipN = 0;
// Thick impasto paint: overlapping short, fat strokes with wet highlights.
function impasto(clipD, box, colors, r, density = 1) {
  const id = `cp${clipN++}`, [x, y, w, h] = box;
  let o = `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${colors[0]}"/>`;
  const n = Math.floor((w * h) / 2600 * density);
  for (let i = 0; i < n; i++) {
    const px = x + r() * w, py = y + r() * h, len = 40 + r() * 110, a = (r() - 0.5) * 0.7;
    const ex = px + Math.cos(a) * len, ey = py + Math.sin(a) * len, cy2 = py - 10 + r() * 20;
    const c = colors[Math.floor(r() * colors.length)], sw = 10 + r() * 22;
    o += `<path d="M${f(px)},${f(py)} Q${f((px + ex) / 2)},${f(cy2)} ${f(ex)},${f(ey)}" stroke="${c}" stroke-width="${f(sw)}" stroke-linecap="round" fill="none"/>`;
    if (i % 3 === 0) o += `<path d="M${f(px + 4)},${f(py - sw / 3)} Q${f((px + ex) / 2)},${f(cy2 - sw / 3)} ${f(ex - 4)},${f(ey - sw / 3)}" stroke="#fff" stroke-opacity=".28" stroke-width="${f(sw / 5)}" stroke-linecap="round" fill="none"/>`;
  }
  return o + "</g>";
}
// A faded mid-century snapshot: sky, lawn, houses, trees, white print border.
function snapshot(x, y, w, h, r, P) {
  let o = `<g filter="url(#shadow)"><rect x="${f(x - 16)}" y="${f(y - 16)}" width="${f(w + 32)}" height="${f(h + 32)}" fill="#FBF6EC"/></g><g filter="url(#faded)">`;
  o += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="url(#vsky)"/>`;
  const horizon = y + h * (0.42 + r() * 0.1);
  o += `<rect x="${f(x)}" y="${f(horizon)}" width="${f(w)}" height="${f(y + h - horizon)}" fill="#7E9460"/>`;
  for (let i = 0; i < 7; i++) { const tx = x + r() * w, th = 60 + r() * 120; o += `<path d="M${f(tx)},${f(horizon - th)} L${f(tx + th * 0.28)},${f(horizon + 4)} L${f(tx - th * 0.28)},${f(horizon + 4)}Z" fill="${r() > 0.5 ? "#2F4A33" : "#3E5B3A"}"/>`; }
  const houses = 1 + Math.floor(r() * 3);
  for (let i = 0; i < houses; i++) {
    const hw = w * (0.18 + r() * 0.12), hx = x + (w / (houses + 0.4)) * (i + 0.3) + r() * 20, hh = hw * 0.55, hy = horizon - hh * 0.6;
    const wall = ["#E9DCC4", "#C9D5C9", "#E4C9B8", "#D8D0E6"][Math.floor(r() * 4)];
    o += `<rect x="${f(hx)}" y="${f(hy)}" width="${f(hw)}" height="${f(hh)}" fill="${wall}"/><path d="M${f(hx - 10)},${f(hy)} L${f(hx + hw / 2)},${f(hy - hh * 0.55)} L${f(hx + hw + 10)},${f(hy)}Z" fill="#6B5B57"/>`;
    o += `<rect x="${f(hx + hw * 0.15)}" y="${f(hy + hh * 0.3)}" width="${f(hw * 0.18)}" height="${f(hh * 0.25)}" fill="#3B4A5A"/><rect x="${f(hx + hw * 0.62)}" y="${f(hy + hh * 0.35)}" width="${f(hw * 0.16)}" height="${f(hh * 0.65)}" fill="#5B4636"/>`;
  }
  return o + `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#C9A27A" opacity=".16"/><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="url(#halftone)" opacity=".35"/></g>`;
}
// Banded agate slice: nested wobbly rings.
function agate(cx, cy, R, r, P) {
  const bands = [P.paper, P.turq, P.coral, P.lav, P.peach, P.red, P.paper, P.pink, P.turq, P.orange, P.paper];
  let o = "";
  const ph = Array.from({ length: 5 }, () => r() * 6.28), amp = Array.from({ length: 5 }, () => 0.03 + r() * 0.06);
  for (let b = 0; b < 16; b++) {
    const rr = R * (1 - b / 17), pts = [];
    for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; const k = 1 + amp.reduce((s, m, j) => s + m * Math.sin(a * (j + 2) + ph[j] + b * 0.15), 0); pts.push(`${f(cx + Math.cos(a) * rr * k)},${f(cy + Math.sin(a) * rr * k * 0.82)}`); }
    o += `<path d="M${pts.join("L")}Z" fill="${bands[b % bands.length]}" stroke="${P.ink}" stroke-opacity=".12" stroke-width="1.5"/>`;
  }
  return `<g filter="url(#shadow)">${o}</g>`;
}
// Iridescent bloom: layered petals in holographic gradients.
function bloom(cx, cy, R, r, P) {
  let o = "";
  for (let layer = 0; layer < 3; layer++) {
    const n = 6 + layer * 2, rr = R * (1 - layer * 0.26), off = r() * 6.28;
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * Math.PI * 2, px = cx + Math.cos(a) * rr * 0.45, py = cy + Math.sin(a) * rr * 0.45;
      o += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(rr * 0.5)}" ry="${f(rr * 0.3)}" transform="rotate(${f((a * 180) / Math.PI)} ${f(px)} ${f(py)})" fill="${["url(#iri)", "url(#iri2)", P.pink, P.red][(i + layer) % 4]}" fill-opacity="${f(0.7 + r() * 0.3)}" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;
    }
  }
  return `<g filter="url(#shadow)">${o}<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.12)}" fill="${P.gold}"/></g>`;
}
// Cut-out found-word strips (real words from the person's prayer, never garbled).
function wordStrips(words, x, y, r, maxW) {
  let o = "", yy = y;
  for (const w of words) {
    const size = 46 + r() * 10, tw = Math.min(maxW, w.length * size * 0.56 + 28), rot = (r() - 0.5) * 7;
    const xx = x + (r() - 0.3) * 40;
    o += `<g transform="rotate(${f(rot)} ${f(xx + tw / 2)} ${f(yy)})" filter="url(#shadow)"><rect x="${f(xx)}" y="${f(yy - size * 0.95)}" width="${f(tw)}" height="${f(size * 1.35)}" fill="${r() > 0.75 ? "#F3E6C8" : "#FBF7EE"}"/><text x="${f(xx + 14)}" y="${f(yy)}" font-family="Georgia, 'Times New Roman', serif" font-size="${f(size)}" fill="#1B1420">${w.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</text></g>`;
    yy += size * 1.65;
  }
  return o;
}
export function wordsFrom(text = "") {
  // A complete short phrase: the shortest whole sentence,
  // packed into strips of up to ~16 characters. Returns [] if it needs more than 3 strips.
  const sents = text.replace(/[“”"]/g, "").split(/(?<=[.!?])\s+/).map((x) => x.trim().replace(/[.!?]+$/, "")).filter(Boolean);
  if (!sents.length) return [];
  const phrase = sents.sort((x, y) => x.length - y.length)[0]; // whole sentences only
  const lines = [];
  for (const w of phrase.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + w).length <= 16) lines[lines.length - 1] = last + " " + w; else lines.push(w);
  }
  return lines.length <= 3 ? lines : [];
}


// ---------- Saint figures (stylized collage portraits, never likenesses) ----------
const TONE = { deep: "#4E2F20", deep2: "#6B4129", brown: "#8A5A3C", medium: "#AE7A55", mlight: "#C99C78", light: "#E4BFA0" };
const SAINT_FIG = {
  monica: ["brown", "veil"], gianna: ["light", "short"], anne: ["medium", "veil"], joseph: ["medium", "short"],
  zelie_louis: ["light", "bun"], rita: ["mlight", "veil"], thomas_more: ["light", "short"], bakhita: ["deep", "veil"],
  moses_black: ["deep", "hood"], matt_talbot: ["light", "short"], augustine: ["brown", "short"], martin_porres: ["deep2", "hood"],
  benedict_moor: ["deep", "hood"], perpetua_felicity: ["brown", "bun"], charles_lwanga: ["deep", "short"], katharine_drexel: ["light", "veil"],
  cajetan: ["mlight", "short"], jude: ["medium", "short"], dymphna: ["light", "long"], padre_pio: ["mlight", "hood"],
  therese: ["light", "veil"], teresa_avila: ["mlight", "veil"], john_cross: ["mlight", "hood"], teresa_calcutta: ["mlight", "veilWhite"],
  peregrine: ["mlight", "hood"], bernadette: ["mlight", "veil"], elizabeth_seton: ["light", "veil"], ignatius: ["mlight", "short"],
  francis: ["mlight", "hood"], mary_magdalene: ["medium", "long"], thomas_apostle: ["medium", "short"], anthony: ["mlight", "hood"],
  faustina: ["light", "veil"], kateri: ["brown", "long"],
  dismas: ["medium", "short"], cabrini: ["light", "veil"], gerard: ["light", "short"],
  // angels have no ethnicity; the artist's palette of tones and styles rotates
  michael: ["*", "curls"], raphael: ["*", "long"], gabriel: ["*", "curls"], guardian_angel: ["*", "long"],
};

function wings(cx, sy, R, r, P) {
  let o = "";
  for (const side of [-1, 1]) {
    const ox = cx + side * R * 1.4;
    [[R * 5.2, "url(#iri)", 11], [R * 3.9, side < 0 ? P.pink : P.peach, 9], [R * 2.6, "#FBF6EC", 8]].forEach(([len, fill, n]) => {
      for (let i = 0; i < n; i++) {
        const a = (-172 + (i / (n - 1)) * 125) * (Math.PI / 180), ang = side < 0 ? a : Math.PI - a;
        const l = len * (0.75 + 0.25 * Math.sin((i / (n - 1)) * Math.PI)) * (0.9 + r() * 0.15);
        const ex = ox + Math.cos(ang) * l, ey = sy + Math.sin(ang) * l * 0.85, nx = -Math.sin(ang) * R * 0.42, ny = Math.cos(ang) * R * 0.42;
        o += `<path d="M${f(ox)},${f(sy)} Q${f((ox + ex) / 2 + nx)},${f((sy + ey) / 2 + ny)} ${f(ex)},${f(ey)} Q${f((ox + ex) / 2 - nx)},${f((sy + ey) / 2 - ny)} ${f(ox)},${f(sy)}Z" fill="${fill}" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>`;
      }
    });
  }
  return `<g filter="url(#shadow)">${o}</g>`;
}

function halo(cx, cy, R, kind, r, P) {
  if (kind === 0) return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 1.02)}" fill="${P.paper}" filter="url(#shadow)"/>${stainedGlass(cx, cy, R * 0.95, r, [P.gold, P.peach, P.pink, P.turq, P.lav], 2)}`;
  if (kind === 1) { let o = ""; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, l = i % 2 ? R * 1.25 : R * 1.05; o += `<path d="M${f(cx + Math.cos(a - 0.05) * R * 0.55)},${f(cy + Math.sin(a - 0.05) * R * 0.55)} L${f(cx + Math.cos(a) * l)},${f(cy + Math.sin(a) * l)} L${f(cx + Math.cos(a + 0.05) * R * 0.55)},${f(cy + Math.sin(a + 0.05) * R * 0.55)}Z" fill="${i % 2 ? P.gold : P.orange}"/>`; } return `<g filter="url(#shadow)">${o}<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.82)}" fill="${P.gold}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.82)}" fill="url(#halftone)"/></g>`; }
  if (kind === 2) return agate(cx, cy, R * 1.05, r, P);
  let o = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="url(#iri)" filter="url(#shadow)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.9)}" fill="none" stroke="${P.gold}" stroke-width="${f(R * 0.06)}"/>`;
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; o += i % 4 ? `<circle cx="${f(cx + Math.cos(a) * R * 0.9)}" cy="${f(cy + Math.sin(a) * R * 0.9)}" r="${f(R * 0.035)}" fill="#FBF6EC"/>` : `<path d="${star(cx + Math.cos(a) * R * 0.9, cy + Math.sin(a) * R * 0.9, R * 0.09)}" fill="${P.gold}"/>`; }
  return o;
}

// Returns [body, hands] so a flood can rise between them.
function saintFigure(saint, cx, hy, R, H, r, P) {
  let [toneKey, head] = SAINT_FIG[saint.id] || ["medium", "short"];
  if (toneKey === "*") toneKey = ["deep", "deep2", "brown", "medium"][Math.floor(r() * 4)];
  const skin = TONE[toneKey], hair = ["#1C1212", "#2B1B14", "#3A2418"][Math.floor(r() * 3)];
  const robes = ["url(#mudcloth)", "url(#iri)", "url(#starchart)", P.turq, P.lav, P.pink, P.red];
  const robe = robes[Math.floor(r() * robes.length)];
  const mantle = [P.indigo, P.turq, P.red, P.lav, "#3B2A55"][Math.floor(r() * 5)];
  const veilC = head === "veilWhite" ? "#FBF8F2" : ["#1E1A2E", "#4A3426", "#24305E", "#FBF6EC"][Math.floor(r() * 4)];
  const isVeil = head === "veil" || head === "veilWhite";
  const by = hy + R * 1.15, bottom = H + 20, sw = R * (saint.kind === "angel" ? 2.2 : 2.7);
  let b = saint.kind === "angel" ? wings(cx, by + R * 0.2, R, r, P) : "";
  b += halo(cx, hy, R * 2, Math.floor(r() * 4), r, P);
  if (head === "curls") { for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; b += `<circle cx="${f(cx + Math.cos(a) * R * 0.95)}" cy="${f(hy - R * 0.25 + Math.sin(a) * R * 1.0)}" r="${f(R * 0.42)}" fill="${hair}"/>`; } }
  // hair / veil / hood behind head
  if (isVeil) b += `<path d="M${f(cx - R * 1.05)},${f(hy - R * 0.2)} C${f(cx - R * 1.15)},${f(hy - R * 1.45)} ${f(cx + R * 1.15)},${f(hy - R * 1.45)} ${f(cx + R * 1.05)},${f(hy - R * 0.2)} L${f(cx + R * 1.6)},${f(by + R * 1.4)} L${f(cx - R * 1.6)},${f(by + R * 1.4)}Z" fill="${veilC}" filter="url(#shadow)"/>`;
  if (head === "hood") b += `<path d="M${f(cx - R * 1.1)},${f(hy + R * 0.3)} C${f(cx - R * 1.25)},${f(hy - R * 1.5)} ${f(cx + R * 1.25)},${f(hy - R * 1.5)} ${f(cx + R * 1.1)},${f(hy + R * 0.3)} L${f(cx + R * 1.5)},${f(by + R * 0.8)} L${f(cx - R * 1.5)},${f(by + R * 0.8)}Z" fill="#8B6A4E" filter="url(#shadow)"/>`;
  if (head === "long") b += `<path d="M${f(cx - R * 0.95)},${f(hy - R * 0.3)} C${f(cx - R * 1.1)},${f(hy - R * 1.4)} ${f(cx + R * 1.1)},${f(hy - R * 1.4)} ${f(cx + R * 0.95)},${f(hy - R * 0.3)} L${f(cx + R * 1.15)},${f(by + R * 1.6)} L${f(cx - R * 1.15)},${f(by + R * 1.6)}Z" fill="${hair}"/>`;
  if (head === "bun") b += `<circle cx="${f(cx)}" cy="${f(hy - R * 1.15)}" r="${f(R * 0.55)}" fill="${hair}"/>`;
  // robe + mantle
  b += `<g filter="url(#shadow)"><path d="M${f(cx - R * 0.5)},${f(by)} C${f(cx - R * 1.6)},${f(by + R * 0.2)} ${f(cx - sw)},${f(by + R * 0.9)} ${f(cx - sw)},${f(by + R * 2.4)} L${f(cx - sw - R * 0.3)},${f(bottom)} L${f(cx + sw + R * 0.3)},${f(bottom)} L${f(cx + sw)},${f(by + R * 2.4)} C${f(cx + sw)},${f(by + R * 0.9)} ${f(cx + R * 1.6)},${f(by + R * 0.2)} ${f(cx + R * 0.5)},${f(by)}Z" fill="${mantle}"/>`;
  b += `<path d="M${f(cx - R * 0.55)},${f(by)} L${f(cx + R * 0.55)},${f(by)} L${f(cx + R * 1.5)},${f(bottom)} L${f(cx - R * 1.5)},${f(bottom)}Z" fill="${robe}"/>`;
  b += `<path d="M${f(cx - R * 0.55)},${f(by)} L${f(cx - R * 1.5)},${f(bottom)} M${f(cx + R * 0.55)},${f(by)} L${f(cx + R * 1.5)},${f(bottom)}" stroke="${P.gold}" stroke-width="${f(R * 0.08)}"/></g>`;
  // neck + head
  b += `<rect x="${f(cx - R * 0.36)}" y="${f(hy + R * 0.6)}" width="${f(R * 0.72)}" height="${f(R * 0.7)}" fill="${skin}"/>`;
  b += `<ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(R * 0.8)}" ry="${f(R)}" fill="${skin}" filter="url(#shadow)"/>`;
  if (head === "short") b += `<path d="M${f(cx - R * 0.82)},${f(hy - R * 0.05)} C${f(cx - R * 0.9)},${f(hy - R * 1.35)} ${f(cx + R * 0.9)},${f(hy - R * 1.35)} ${f(cx + R * 0.82)},${f(hy - R * 0.05)} C${f(cx + R * 0.6)},${f(hy - R * 0.7)} ${f(cx - R * 0.6)},${f(hy - R * 0.7)} ${f(cx - R * 0.82)},${f(hy - R * 0.05)}Z" fill="${hair}"/>`;
  if (head === "bun" || head === "long" || head === "curls") b += `<path d="M${f(cx - R * 0.84)},${f(hy)} C${f(cx - R * 0.9)},${f(hy - R * 1.3)} ${f(cx + R * 0.9)},${f(hy - R * 1.3)} ${f(cx + R * 0.84)},${f(hy)} C${f(cx + R * 0.5)},${f(hy - R * 0.75)} ${f(cx - R * 0.5)},${f(hy - R * 0.75)} ${f(cx - R * 0.84)},${f(hy)}Z" fill="${hair}"/>`;
  if (isVeil) b += `<path d="M${f(cx - R * 0.86)},${f(hy + R * 0.1)} C${f(cx - R * 0.95)},${f(hy - R * 1.25)} ${f(cx + R * 0.95)},${f(hy - R * 1.25)} ${f(cx + R * 0.86)},${f(hy + R * 0.1)} C${f(cx + R * 0.7)},${f(hy - R * 0.55)} ${f(cx - R * 0.7)},${f(hy - R * 0.55)} ${f(cx - R * 0.86)},${f(hy + R * 0.1)}Z" fill="${head === "veilWhite" ? "#FBF8F2" : "#FBF6EC"}"/>` + (head === "veilWhite" ? `<path d="M${f(cx - R * 0.9)},${f(hy - R * 0.62)} C${f(cx - R * 0.4)},${f(hy - R * 1.05)} ${f(cx + R * 0.4)},${f(hy - R * 1.05)} ${f(cx + R * 0.9)},${f(hy - R * 0.62)}" stroke="#2F5DA8" stroke-width="${f(R * 0.09)}" fill="none"/>` : "");
  if (head === "hood") b += `<path d="M${f(cx - R * 0.9)},${f(hy + R * 0.2)} C${f(cx - R * 1.0)},${f(hy - R * 1.3)} ${f(cx + R * 1.0)},${f(hy - R * 1.3)} ${f(cx + R * 0.9)},${f(hy + R * 0.2)} C${f(cx + R * 0.75)},${f(hy - R * 0.75)} ${f(cx - R * 0.75)},${f(hy - R * 0.75)} ${f(cx - R * 0.9)},${f(hy + R * 0.2)}Z" fill="#8B6A4E"/>`;
  // serene face: closed eyes, soft cheeks
  b += `<path d="M${f(cx - R * 0.42)},${f(hy + R * 0.02)} q${f(R * 0.15)},${f(R * 0.12)} ${f(R * 0.3)},0 M${f(cx + R * 0.12)},${f(hy + R * 0.02)} q${f(R * 0.15)},${f(R * 0.12)} ${f(R * 0.3)},0" stroke="#1B1420" stroke-width="${f(R * 0.05)}" fill="none" stroke-linecap="round"/>`;
  b += `<circle cx="${f(cx - R * 0.42)}" cy="${f(hy + R * 0.32)}" r="${f(R * 0.13)}" fill="${P.pink}" opacity=".45"/><circle cx="${f(cx + R * 0.42)}" cy="${f(hy + R * 0.32)}" r="${f(R * 0.13)}" fill="${P.pink}" opacity=".45"/>`;
  b += `<path d="M${f(cx - R * 0.14)},${f(hy + R * 0.52)} q${f(R * 0.14)},${f(R * 0.09)} ${f(R * 0.28)},0" stroke="#7A2E3A" stroke-width="${f(R * 0.06)}" fill="none" stroke-linecap="round"/>`;
  // hands holding the saint's traditional attribute
  const sym = (saint.emblem?.symbols || ["star"]).find((x) => ICONS[x]) || "star";
  const ix = cx, iy = by + R * 1.75, k = R * 0.016;
  const hands = `<g transform="translate(${f(ix - 50 * k)} ${f(iy - 50 * k)}) scale(${f(k)})" filter="url(#shadow)">${ICONS[sym](P)}</g>
    <ellipse cx="${f(ix - R * 0.42)}" cy="${f(iy + R * 0.85)}" rx="${f(R * 0.32)}" ry="${f(R * 0.22)}" fill="${skin}" stroke="#FBF6EC" stroke-opacity=".5" stroke-width="2" filter="url(#shadow)"/><ellipse cx="${f(ix + R * 0.42)}" cy="${f(iy + R * 0.85)}" rx="${f(R * 0.32)}" ry="${f(R * 0.22)}" fill="${skin}" stroke="#FBF6EC" stroke-opacity=".5" stroke-width="2" filter="url(#shadow)"/>`;
  return [b, hands];
}

// ---------- main ----------
export function proceduralArtwork({ brief, themes = [], seed = Date.now(), aspect = "portrait", words = [], saint = null, style, kit = null }) {
  if (kit?.bg?.href) return kitArtwork({ themes, seed, aspect, words, saint, style, kit });
  const P = palette(style);
  const r = rng(seed);
  const W = 1024, H = aspect === "square" ? 1024 : 1536;
  const comp = brief?.composition || "halo_icon";
  const theme = themes.find((t) => MOTIFS[t]) || "peace";
  const second = themes.filter((t) => MOTIFS[t] && t !== theme)[0];
  const glassPal = [P.pink, P.turq, P.red, P.coral, P.lav, P.peach];
  const flood = [P.red, P.pink, P.red, P.coral, P.pink, P.turq, "#FF8FB5"];
  const night = r() > 0.4;
  const ground = night ? P.night : P.paper;
  const cx = W / 2, cy = saint ? H * (aspect === "square" ? 0.3 : 0.31) : H * (aspect === "square" ? 0.5 : 0.46);
  const headR = W * (aspect === "square" ? 0.072 : 0.088);
  const figParts = saint ? saintFigure(saint, cx, cy, headR, H, rng(seed + 991), P) : null;
  let L = [];

  // ground + texture
  L.push(`<rect width="${W}" height="${H}" fill="${ground}"/>`);
  if (night) L.push(`<rect width="${W}" height="${H}" fill="url(#starchart)" opacity=".55"/>`);
  // archival strips
  for (let i = 0; i < 3; i++) {
    const w = 260 + r() * 380, h = 70 + r() * 160;
    L.push(`<path d="${tornRect(r() * (W - w), r() * H, w, h, r, 9, (r() - 0.5) * 0.5)}" fill="${i % 2 ? "url(#ledger)" : P.peach}" opacity="${night ? 0.5 : 0.85}" filter="url(#shadow)"/>`);
  }
  L.push(`<path d="${tornRect(-40, H * (0.55 + r() * 0.2), W * 0.7, H * 0.25, r, 14, -0.12)}" fill="url(#halftone)" opacity=".9"/>`);

  const motifSize = (aspect === "square" ? 230 : 260) * (0.9 + r() * 0.25);
  const drawMotif = (t, x, y, s) => (saint ? "" : MOTIFS[t](x, y, s, P, r));

  switch (comp) {
    case "arched_window": {
      const w = W * 0.66, h = H * 0.72, x = cx - w / 2, y = H * 0.1;
      L.push(`<path d="${tornPoly(archPts(x - 18, y - 18, w + 36, h + 36), r, 10)}" fill="${P.paper}" filter="url(#shadow)"/>`);
      L.push(`<path d="${tornPoly(archPts(x, y, w, h), r, 5)}" fill="url(#starchart)"/>`);
      for (let i = 0; i < 4; i++) L.push(`<path d="${tornRect(x - 10, y + h - 90 - i * 60, w + 20, 140, r, 16, (r() - 0.5) * 0.15)}" fill="${[P.coral, P.orange, P.pink, P.turq][i]}" opacity=".95"/>`);
      L.push(crescent(cx + w * 0.22, y + w * 0.3, 60, P.peach));
      L.push(drawMotif(theme, cx, y + h * 0.5, motifSize));
      break;
    }
    case "orbital": {
      for (let i = 0; i < 6; i++) L.push(`<ellipse cx="${cx}" cy="${cy}" rx="${f(160 + i * 70)}" ry="${f(70 + i * 34)}" fill="none" stroke="${i % 2 ? P.gold : P.turq}" stroke-width="${f(2 + r() * 3)}" transform="rotate(${f(-18 + r() * 8)} ${cx} ${cy})"/>`);
      for (let i = 0; i < 5; i++) { const a = r() * Math.PI * 2, rr = 200 + i * 60; L.push(`<circle cx="${f(cx + Math.cos(a) * rr)}" cy="${f(cy + Math.sin(a) * rr * 0.45)}" r="${f(14 + r() * 26)}" fill="${glassPal[i]}" filter="url(#shadow)"/>`); }
      L.push(stainedGlass(cx, cy, 170, r, glassPal, 2));
      L.push(drawMotif(theme, cx, cy, motifSize * 0.75));
      break;
    }
    case "ascending_stack": {
      for (let i = 0; i < 7; i++) { const y = H - 140 - i * (H / 9); L.push(`<path d="${tornRect(cx - 300 + i * 20, y, 600 - i * 40, 150, r, 14, (r() - 0.5) * 0.2)}" fill="${glassPal[i % glassPal.length]}" filter="url(#shadow)"/>`); if (i % 2) L.push(crystal(cx - 230 + r() * 460, y + 30, 26, P.paper, r, r())); }
      L.push(drawMotif(theme, cx, H * 0.2, motifSize * 0.7));
      break;
    }
    case "diptych": {
      L.push(`<path d="${tornRect(-30, -30, W / 2 + 30, H + 60, r, 18)}" fill="${P.turq}"/><path d="${tornRect(W / 2, -30, W / 2 + 30, H + 60, r, 18)}" fill="${P.pink}"/>`);
      L.push(`<rect x="${cx - 4}" y="0" width="8" height="${H}" fill="${P.gold}"/>`);
      L.push(drawMotif(theme, cx - W * 0.22, cy, motifSize * 0.7));
      L.push(drawMotif(second || "peace", cx + W * 0.22, cy + 80, motifSize * 0.7));
      break;
    }
    case "rose_window": {
      L.push(`<path d="${tornCircle(cx, cy, W * 0.47, r, 12)}" fill="${P.paper}" filter="url(#shadow)"/>`);
      L.push(stainedGlass(cx, cy, W * 0.43, r, glassPal, 4));
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; L.push(`<circle cx="${f(cx + Math.cos(a) * W * 0.45)}" cy="${f(cy + Math.sin(a) * W * 0.45)}" r="18" fill="${glassPal[i % 6]}" stroke="${P.ink}" stroke-width="4"/>`); }
      L.push(`<circle cx="${cx}" cy="${cy}" r="${f(motifSize * 0.95)}" fill="${ground}" stroke="${P.ink}" stroke-width="8"/>`);
      L.push(drawMotif(theme, cx, cy, motifSize * 0.7));
      break;
    }
    case "horizon_strata": {
      L.push(`<circle cx="${f(cx + (r() - 0.5) * 300)}" cy="${f(H * 0.3)}" r="${f(W * 0.3)}" fill="${P.orange}" filter="url(#shadow)"/><circle cx="${f(cx)}" cy="${f(H * 0.3)}" r="${f(W * 0.22)}" fill="url(#halftone)"/>`);
      for (let i = 0; i < 6; i++) L.push(`<path d="${tornRect(-60, H * 0.5 + i * (H * 0.09), W + 120, H * 0.5, r, 30, (r() - 0.5) * 0.12)}" fill="${[P.coral, P.pink, P.peach, P.turq, P.indigo, P.night][i]}" filter="url(#shadow)"/>`);
      L.push(drawMotif(theme, cx, H * 0.44, motifSize * 0.8));
      break;
    }
    case "constellation": {
      const pts = Array.from({ length: 9 }, () => [80 + r() * (W - 160), 100 + r() * (H - 200)]);
      L.push(`<path d="M${pts.map((p) => p.map(f).join(",")).join("L")}" stroke="${P.gold}" stroke-width="2" fill="none" stroke-dasharray="6 6"/>`);
      pts.forEach(([x, y], i) => L.push(i % 3 === 0 ? crystal(x, y, 22 + r() * 14, glassPal[i % 6], r, r()) : `<path d="${star(x, y, 16 + r() * 18)}" fill="${glassPal[i % 6]}"/>`));
      L.push(drawMotif(theme, cx, cy, motifSize));
      break;
    }
    case "silhouette_cosmos": {
      L.push(`<circle cx="${f(cx + 120)}" cy="${f(cy - 120)}" r="${f(W * 0.36)}" fill="${P.pink}" filter="url(#shadow)"/>`);
      L.push(stainedGlass(cx + 120, cy - 120, W * 0.3, r, [P.peach, P.coral, P.orange, P.gold], 2));
      L.push(figure(cx - 60, cy + 120, H * 0.62, P.ink, "url(#starchart)"));
      L.push(drawMotif(theme, cx + 40, cy + 30, motifSize * 0.45));
      break;
    }
    case "triptych": {
      const pw = W * 0.28;
      [-1, 0, 1].forEach((k, i) => {
        const x = cx + k * (pw + 26) - pw / 2, h = i === 1 ? H * 0.72 : H * 0.6, y = H * 0.5 - h / 2 + (i === 1 ? 0 : 60);
        L.push(`<path d="${tornPoly(archPts(x, y, pw, h), r, 5)}" fill="${[P.turq, P.night, P.pink][i]}" filter="url(#shadow)"/>`);
        L.push(drawMotif(i === 1 ? theme : second || theme, x + pw / 2, y + h * 0.5, motifSize * (i === 1 ? 0.5 : 0.38)));
      });
      break;
    }
    case "flooded_snapshot": {
      const x = W * 0.08, y = H * 0.07, w = W * 0.84, h = H * 0.86;
      L.push(snapshot(x, y, w, h, r, P));
      if (figParts) L.push(figParts[0]);
      const top = y + h * (0.38 + r() * 0.12), pts = [[x - 4, y + h + 4], [x - 4, top + 40]];
      for (let i = 0; i <= 10; i++) pts.push([x + (w * i) / 10, top + (r() - 0.5) * 120]);
      pts.push([x + w + 4, top + 30], [x + w + 4, y + h + 4]);
      L.push(impasto(tornPoly(pts, r, 22), [x - 10, top - 80, w + 20, y + h - top + 100], flood, r, 1.3));
      L.push(`<path d="${tornRect(x + w * (0.2 + r() * 0.4), top + h * 0.18, w * 0.22, h * 0.12, r, 18, (r() - 0.5) * 0.4)}" fill="${P.turq}" opacity=".95"/>`);
      L.push(drawMotif(theme, x + w * (0.3 + r() * 0.4), y + h * 0.22, motifSize * 0.45));
      if (figParts) L.push(figParts[1]);
      break;
    }
    case "crystal_bloom": {
      L.push(impasto(`M0,0H${W}V${H}H0Z`, [0, 0, W, H], [P.turq, "#7FD9D3", P.peach, P.pink, P.lav], r, 0.7));
      const blooms = 2 + Math.floor(r() * 3);
      for (let i = 0; i < blooms; i++) L.push(bloom(W * (0.2 + r() * 0.6), H * (0.18 + (i / blooms) * 0.7), W * (0.22 + r() * 0.14), r, P));
      for (let i = 0; i < 9; i++) L.push(crystal(W * r(), H * (0.3 + r() * 0.7), 30 + r() * 50, i % 2 ? "url(#iri)" : "url(#iri2)", r, (r() - 0.5) * 1.2));
      L.push(drawMotif(theme, cx, cy, motifSize * 0.55));
      break;
    }
    case "agate_bands": {
      L.push(impasto(tornRect(-20, H * 0.55, W + 40, H * 0.5, r, 24), [0, H * 0.5, W, H * 0.5], [P.lav, P.pink, P.turq], r, 0.6));
      L.push(agate(cx, cy, W * 0.4, r, P));
      L.push(`<circle cx="${cx}" cy="${cy}" r="${f(motifSize * 0.8)}" fill="${ground}" stroke="${P.ink}" stroke-opacity=".4" stroke-width="4"/>`);
      L.push(drawMotif(theme, cx, cy, motifSize * 0.6));
      break;
    }
    default: { // halo_icon
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; L.push(`<path d="${tornPoly([[cx, cy], [cx + Math.cos(a - 0.06) * W * 0.8, cy + Math.sin(a - 0.06) * W * 0.8], [cx + Math.cos(a + 0.06) * W * 0.8, cy + Math.sin(a + 0.06) * W * 0.8]], r, 8)}" fill="${glassPal[i % 6]}" opacity=".55"/>`); }
      L.push(`<path d="${tornCircle(cx, cy, W * 0.36, r, 10)}" fill="${P.paper}" filter="url(#shadow)"/>`);
      L.push(stainedGlass(cx, cy, W * 0.32, r, glassPal, 3));
      L.push(`<circle cx="${cx}" cy="${cy}" r="${f(motifSize * 0.9)}" fill="${ground}" stroke="${P.gold}" stroke-width="10"/>`);
      L.push(drawMotif(theme, cx, cy, motifSize * 0.7));
    }
  }

  if (figParts && comp !== "flooded_snapshot") L.push(figParts[0], figParts[1]);
  if (saint) L.push(MOTIFS[theme](W * (r() > 0.5 ? 0.16 : 0.84), H * 0.1, motifSize * 0.3, P, r));
  // scattered gems and stars
  for (let i = 0; i < 6; i++) L.push(crystal(60 + r() * (W - 120), 60 + r() * (H - 120), 14 + r() * 18, glassPal[Math.floor(r() * 6)], r, r() * 3));
  for (let i = 0; i < 10; i++) L.push(`<path d="${star(r() * W, r() * H, 6 + r() * 12)}" fill="${night ? P.peach : P.ink}" opacity=".8"/>`);
  // found words go on top of everything except the paper grain, so gems never cover them
  if (words.length) L.push(wordStrips(words, saint ? W * (r() > 0.5 ? 0.6 : 0.04) : W * (r() > 0.5 ? 0.52 : 0.08), saint ? H * 0.8 : H * (0.62 + r() * 0.08), r, W * 0.4));
  // paper grain over everything + deckled border
  L.push(`<rect width="${W}" height="${H}" fill="#fff" filter="url(#paper)" opacity=".9" style="mix-blend-mode:multiply"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs(P, r)}${L.join("")}</svg>`;
}


// ---------- Collage from the artist's kit (her own work, cut and layered) ----------
// kit = pickKit(...) result where each piece also carries `href` (a data: URI).
function kitArtwork({ themes = [], seed, aspect = "portrait", words = [], saint = null, style, kit }) {
  const P = palette(style), r = rng(seed);
  const W = 1024, H = aspect === "square" ? 1024 : 1536;
  const cx = W / 2, hy = H * (aspect === "square" ? 0.3 : 0.29), R = W * (aspect === "square" ? 0.078 : 0.094);
  const defsExtra = [], L = [];
  let n = 0;
  // A texture tile, repeated like fabric; `slice` fills one box (for halos and faces).
  const tile = (piece, scale) => { const id = `k${n++}`; const w = piece.w * scale, h = piece.h * scale; defsExtra.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${f(w)}" height="${f(h)}" patternTransform="rotate(${f((r() - 0.5) * 30)})"><image href="${piece.href}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="xMidYMid slice"/></pattern>`); return `url(#${id})`; };
  const slice = (piece, x, y, w, h) => { const id = `k${n++}`; defsExtra.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"><image href="${piece.href}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="xMidYMid slice"/></pattern>`); return `url(#${id})`; };
  const CUT = `stroke="#FBF6EC" stroke-width="5" stroke-linejoin="round"`;

  // 1. Her artwork as the ground
  L.push(`<image href="${kit.bg.href}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`);
  L.push(`<rect width="${W}" height="${H}" fill="#24163A" opacity=".12"/>`);

  // 2. Sometimes a torn flood of her paint rises from below
  if (r() < 0.55) {
    const top = H * (0.74 + r() * 0.06), pts = [[-20, H + 20], [-20, top + 30]];
    for (let i = 0; i <= 10; i++) pts.push([(W * i) / 10, top + (r() - 0.5) * 90]);
    pts.push([W + 20, top + 20], [W + 20, H + 20]);
    L.push(`<path d="${tornPoly(pts, r, 20)}" fill="${tile(kit.paint, 1.9)}" ${CUT} filter="url(#shadow)"/>`);
  }

  const figure = [];
  if (saint) {
    const angel = saint.kind === "angel";
    const [, head] = SAINT_FIG[saint.id] || ["medium", "short"];
    const isVeil = head === "veil" || head === "veilWhite", hasFace = Boolean(kit.face);
    const Rh = R * 1.3, by = hy + Rh * 1.12, bottom = H + 30, sw = R * (angel ? 2.3 : 2.75);
    const skin = TONE[(SAINT_FIG[saint.id] || [])[0]] || "#8A5A3C";

    // 3. Halo cut from her crystals, with lead lines like stained glass
    const hr = Rh * 2.0;
    if (r() < 0.45) { let rays = ""; for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, l = i % 2 ? hr * 1.45 : hr * 1.22; rays += `<path d="M${f(cx + Math.cos(a - 0.045) * hr * 0.8)},${f(hy + Math.sin(a - 0.045) * hr * 0.8)} L${f(cx + Math.cos(a) * l)},${f(hy + Math.sin(a) * l)} L${f(cx + Math.cos(a + 0.045) * hr * 0.8)},${f(hy + Math.sin(a + 0.045) * hr * 0.8)}Z" fill="${i % 2 ? P.gold : "#F2D27A"}"/>`; } figure.push(`<g filter="url(#shadow)">${rays}</g>`); }
    let lead = "";
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; lead += `<path d="M${f(cx + Math.cos(a) * hr * 0.55)},${f(hy + Math.sin(a) * hr * 0.55)} L${f(cx + Math.cos(a) * hr)},${f(hy + Math.sin(a) * hr)}" stroke="#140F1F" stroke-opacity=".55" stroke-width="3"/>`; }
    figure.push(`<path d="${tornCircle(cx, hy, hr, r, 9)}" fill="${slice(kit.crystal, cx - hr, hy - hr, hr * 2, hr * 2)}" ${CUT} filter="url(#shadow)"/>${lead}<circle cx="${f(cx)}" cy="${f(hy)}" r="${f(hr * 0.55)}" fill="none" stroke="#140F1F" stroke-opacity=".5" stroke-width="3"/><circle cx="${f(cx)}" cy="${f(hy)}" r="${f(hr - 6)}" fill="none" stroke="${P.gold}" stroke-width="7"/>`);

    // 4. Wings (angels only): feathers cut from her textures
    if (angel) {
      const wingFill = tile(kit.wing, 1.1); let o = "";
      for (const side of [-1, 1]) {
        const ox = cx + side * R * 1.4, sy = by + R * 0.2;
        [[R * 5.4, wingFill, 11], [R * 4.0, "url(#iri)", 9], [R * 2.7, "#FBF6EC", 8]].forEach(([len, fill, cnt]) => {
          for (let i = 0; i < cnt; i++) {
            const a = (-172 + (i / (cnt - 1)) * 125) * (Math.PI / 180), ang = side < 0 ? a : Math.PI - a;
            const l = len * (0.75 + 0.25 * Math.sin((i / (cnt - 1)) * Math.PI)) * (0.9 + r() * 0.15);
            const ex = ox + Math.cos(ang) * l, ey = sy + Math.sin(ang) * l * 0.85, nx = -Math.sin(ang) * R * 0.42, ny = Math.cos(ang) * R * 0.42;
            o += `<path d="M${f(ox)},${f(sy)} Q${f((ox + ex) / 2 + nx)},${f((sy + ey) / 2 + ny)} ${f(ex)},${f(ey)} Q${f((ox + ex) / 2 - nx)},${f((sy + ey) / 2 - ny)} ${f(ox)},${f(sy)}Z" fill="${fill}" stroke="#FBF6EC" stroke-width="3"/>`;
          }
        });
      }
      figure.unshift(`<g filter="url(#shadow)">${o}</g>`);
    }

    // 5. Veil / hood behind the head
    const veilC = head === "veilWhite" ? "#FBF8F2" : ["#1E1A2E", "#24305E", "#3B2A55"][Math.floor(r() * 3)];
    if (isVeil) figure.push(`<path d="M${f(cx - Rh * 1.08)},${f(hy - Rh * 0.2)} C${f(cx - Rh * 1.18)},${f(hy - Rh * 1.5)} ${f(cx + Rh * 1.18)},${f(hy - Rh * 1.5)} ${f(cx + Rh * 1.08)},${f(hy - Rh * 0.2)} L${f(cx + Rh * 1.65)},${f(by + Rh * 1.5)} L${f(cx - Rh * 1.65)},${f(by + Rh * 1.5)}Z" fill="${veilC}" ${CUT} filter="url(#shadow)"/><path d="M${f(cx - Rh * 1.08)},${f(hy - Rh * 0.2)} C${f(cx - Rh * 1.18)},${f(hy - Rh * 1.5)} ${f(cx + Rh * 1.18)},${f(hy - Rh * 1.5)} ${f(cx + Rh * 1.08)},${f(hy - Rh * 0.2)} L${f(cx + Rh * 1.65)},${f(by + Rh * 1.5)} L${f(cx - Rh * 1.65)},${f(by + Rh * 1.5)}Z" fill="url(#halftone)" opacity=".35"/>`);
    if (head === "hood") figure.push(`<path d="M${f(cx - Rh * 1.12)},${f(hy + Rh * 0.3)} C${f(cx - Rh * 1.28)},${f(hy - Rh * 1.55)} ${f(cx + Rh * 1.28)},${f(hy - Rh * 1.55)} ${f(cx + Rh * 1.12)},${f(hy + Rh * 0.3)} L${f(cx + Rh * 1.55)},${f(by + Rh * 0.9)} L${f(cx - Rh * 1.55)},${f(by + Rh * 0.9)}Z" fill="#7A5A42" ${CUT} filter="url(#shadow)"/>`);

    // 6. Mantle and robe cut from her textures
    const mantleD = `M${f(cx - R * 0.5)},${f(by)} C${f(cx - R * 1.6)},${f(by + R * 0.2)} ${f(cx - sw)},${f(by + R * 0.9)} ${f(cx - sw)},${f(by + R * 2.4)} L${f(cx - sw - R * 0.3)},${f(bottom)} L${f(cx + sw + R * 0.3)},${f(bottom)} L${f(cx + sw)},${f(by + R * 2.4)} C${f(cx + sw)},${f(by + R * 0.9)} ${f(cx + R * 1.6)},${f(by + R * 0.2)} ${f(cx + R * 0.5)},${f(by)}Z`;
    figure.push(`<path d="${mantleD}" fill="${kit.mantle ? tile(kit.mantle, 2.0) : ["#24305E", "#5B1F3E", "#1F5C5A", "#3B2A55", "#7A1F2B"][Math.floor(r() * 5)]}" ${CUT} filter="url(#shadow)"/>`);
    figure.push(`<path d="M${f(cx - R * 0.58)},${f(by)} L${f(cx + R * 0.58)},${f(by)} L${f(cx + R * 1.55)},${f(bottom)} L${f(cx - R * 1.55)},${f(bottom)}Z" fill="${tile(kit.robe, 1.3)}" ${CUT}/>`);
    figure.push(`<path d="M${f(cx - R * 0.58)},${f(by)} L${f(cx - R * 1.55)},${f(bottom)} M${f(cx + R * 0.58)},${f(by)} L${f(cx + R * 1.55)},${f(bottom)}" stroke="${P.gold}" stroke-width="${f(R * 0.07)}"/>`);

    // 7. Head: a face cut from her portraits, or a cut-paper silhouette
    const fx = cx - Rh * 0.86, fy = hy - Rh * 1.08, fw = Rh * 1.72, fh = Rh * 2.16;
    figure.push(`<rect x="${f(cx - Rh * 0.34)}" y="${f(hy + Rh * 0.7)}" width="${f(Rh * 0.68)}" height="${f(Rh * 0.6)}" fill="${skin}"/>`);
    if (hasFace) {
      const cid = `hc${n++}`;
      defsExtra.push(`<clipPath id="${cid}"><ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(Rh * 0.86)}" ry="${f(Rh * 1.08)}"/></clipPath>`);
      figure.push(`<ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(Rh * 0.86)}" ry="${f(Rh * 1.08)}" fill="${skin}" filter="url(#shadow)"/><image href="${kit.face.href}" x="${f(fx)}" y="${f(fy)}" width="${f(fw)}" height="${f(fh)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${cid})"/><ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(Rh * 0.86)}" ry="${f(Rh * 1.08)}" fill="none" ${CUT}/>`);
    } else {
      const gid = `g${n++}`;
      defsExtra.push(`<radialGradient id="${gid}" cx=".45" cy=".4" r=".75"><stop offset="0" stop-color="#F6DE8E"/><stop offset=".6" stop-color="#D9A441"/><stop offset="1" stop-color="#9C6B22"/></radialGradient>`);
      figure.push(`<ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(Rh * 0.82)}" ry="${f(Rh * 1.02)}" fill="url(#${gid})" ${CUT} filter="url(#shadow)"/><ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(Rh * 0.82)}" ry="${f(Rh * 1.02)}" fill="url(#halftone)" opacity=".35"/><path d="M${f(cx - Rh * 0.42)},${f(hy + Rh * 0.02)} q${f(Rh * 0.15)},${f(Rh * 0.1)} ${f(Rh * 0.3)},0 M${f(cx + Rh * 0.12)},${f(hy + Rh * 0.02)} q${f(Rh * 0.15)},${f(Rh * 0.1)} ${f(Rh * 0.3)},0 M${f(cx)},${f(hy + Rh * 0.1)} l${f(-Rh * 0.06)},${f(Rh * 0.28)} l${f(Rh * 0.1)},0 M${f(cx - Rh * 0.1)},${f(hy + Rh * 0.56)} l${f(Rh * 0.2)},0" stroke="#3A2410" stroke-width="${f(Rh * 0.035)}" fill="none" stroke-linecap="round"/>${[...Array(7)].map((_, i) => `<circle cx="${f(cx - Rh * 0.3 + i * Rh * 0.1)}" cy="${f(hy + Rh * 0.36 + Math.abs(i - 3) * -Rh * 0.015)}" r="${f(Rh * 0.022)}" fill="#C0392B"/>`).join("")}`);
    }
    // veil band / hood rim framing the face
    if (isVeil) figure.push(`<path d="M${f(cx - Rh * 0.95)},${f(hy - Rh * 0.25)} C${f(cx - Rh * 0.95)},${f(hy - Rh * 1.32)} ${f(cx + Rh * 0.95)},${f(hy - Rh * 1.32)} ${f(cx + Rh * 0.95)},${f(hy - Rh * 0.25)} C${f(cx + Rh * 0.78)},${f(hy - Rh * 0.85)} ${f(cx - Rh * 0.78)},${f(hy - Rh * 0.85)} ${f(cx - Rh * 0.95)},${f(hy - Rh * 0.25)}Z" fill="#FBF6EC"/>` + (head === "veilWhite" ? `<path d="M${f(cx - Rh * 0.92)},${f(hy - Rh * 0.72)} C${f(cx - Rh * 0.4)},${f(hy - Rh * 1.12)} ${f(cx + Rh * 0.4)},${f(hy - Rh * 1.12)} ${f(cx + Rh * 0.92)},${f(hy - Rh * 0.72)}" stroke="#2F5DA8" stroke-width="${f(Rh * 0.09)}" fill="none"/>` : ""));
    if (head === "hood") figure.push(`<path d="M${f(cx - Rh * 0.98)},${f(hy + Rh * 0.25)} C${f(cx - Rh * 1.05)},${f(hy - Rh * 1.38)} ${f(cx + Rh * 1.05)},${f(hy - Rh * 1.38)} ${f(cx + Rh * 0.98)},${f(hy + Rh * 0.25)} C${f(cx + Rh * 0.84)},${f(hy - Rh * 0.85)} ${f(cx - Rh * 0.84)},${f(hy - Rh * 0.85)} ${f(cx - Rh * 0.98)},${f(hy + Rh * 0.25)}Z" fill="#7A5A42" ${CUT}/>`);

    // 8. The saint's traditional symbol as a cut-out sticker
    const sym = (saint.emblem?.symbols || ["star"]).find((x) => ICONS[x]) || "star";
    const ix = cx, iy = by + R * 2.05, k = R * 0.0115;
    figure.push(`<path d="${tornCircle(ix, iy, R * 0.72, r, 5)}" fill="#FBF6EC" filter="url(#shadow)"/><g transform="translate(${f(ix - 50 * k)} ${f(iy - 50 * k)}) scale(${f(k)})">${ICONS[sym](P)}</g>`);
  }
  L.push(...figure);

  // 9. Her found-word strips on top
  if (words.length) L.push(wordStrips(words, W * (r() > 0.5 ? 0.56 : 0.05), H - 70 - (words.length - 1) * 86, r, W * 0.42));

  // 10. A deckled paper mat and grain unify it as one hand-made piece
  if (r() < 0.6) { const m = 30; L.push(`<path fill-rule="evenodd" d="M-10,-10H${W + 10}V${H + 10}H-10Z ${tornRect(m, m, W - m * 2, H - m * 2, r, 10)}" fill="#FBF6EC" filter="url(#shadow)"/>`); }
  L.push(`<rect width="${W}" height="${H}" fill="#fff" filter="url(#paper)" opacity=".75" style="mix-blend-mode:multiply"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs(P, r).replace("</defs>", defsExtra.join("") + "</defs>")}${L.join("")}</svg>`;
}

// ---------- Saint emblems (symbolic, never likenesses) ----------
const ICONS = {
  star: (P) => `<path d="${star(50, 50, 40)}" fill="${P.gold}"/>`,
  heart: (P) => `<path d="M50 85 C20 62 10 45 22 30 C34 16 48 24 50 34 C52 24 66 16 78 30 C90 45 80 62 50 85Z" fill="${P.coral}"/>`,
  flame: (P) => `<path d="M50 10 C60 30 78 40 72 64 C68 80 58 88 50 88 C38 88 26 78 28 62 C30 48 42 44 40 30 C48 36 50 44 52 48 C56 36 50 22 50 10Z" fill="${P.orange}"/>`,
  book: (P) => `<path d="M10 25 L48 32 L48 85 L10 78Z" fill="${P.paper}"/><path d="M90 25 L52 32 L52 85 L90 78Z" fill="${P.peach}"/>`,
  lily: (P) => `<path d="M50 58 L50 94" stroke="${P.turq}" stroke-width="5"/><path d="M50 12 C59 28 59 44 50 56 C41 44 41 28 50 12Z M50 56 C38 40 22 38 14 42 C25 51 38 56 50 58Z M50 56 C62 40 78 38 86 42 C75 51 62 56 50 58Z" fill="${P.paper}"/>`,
  roses: (P) => [[35, 40], [65, 42], [50, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${P.pink}"/><path d="M${x - 8} ${y} a8 8 0 1 1 8 8 a5 5 0 1 1 -4 -6" stroke="${P.ink}" stroke-opacity=".4" stroke-width="2" fill="none"/>`).join(""),
  tears: (P) => `<path d="M22 34 Q50 52 78 34" stroke="${P.ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 38 l-4 7 M42 43 l-2 8 M58 43 l2 8 M70 38 l4 7" stroke="${P.ink}" stroke-width="4" stroke-linecap="round"/>${[[38, 62, 0.42], [60, 74, 0.5]].map(([x, y, k]) => `<path transform="translate(${x - 50 * k} ${y - 50 * k}) scale(${k})" d="M50 8 C64 34 70 48 70 60 C70 74 61 82 50 82 C39 82 30 74 30 60 C30 48 36 34 50 8Z" fill="${P.turq}"/>`).join("")}`,
  tools: (P) => `<rect x="46" y="30" width="8" height="60" fill="${P.peach}"/><rect x="28" y="18" width="44" height="16" rx="3" fill="${P.ink}"/>`,
  rings: (P) => `<circle cx="40" cy="50" r="22" fill="none" stroke="${P.gold}" stroke-width="7"/><circle cx="60" cy="50" r="22" fill="none" stroke="${P.gold}" stroke-width="7"/>`,
  thorn: (P) => `<ellipse cx="50" cy="52" rx="38" ry="18" fill="none" stroke="#5B4636" stroke-width="7"/><ellipse cx="50" cy="52" rx="38" ry="18" fill="none" stroke="#8B6A4E" stroke-width="3" stroke-dasharray="6 5"/>${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, x = 50 + Math.cos(a) * 38, y = 52 + Math.sin(a) * 18, dx = Math.cos(a) * 12, dy = Math.sin(a) * 8 - 6; return `<path d="M${f(x - 3)} ${f(y)} L${f(x + dx)} ${f(y + dy)} L${f(x + 3)} ${f(y)}Z" fill="#5B4636"/>`; }).join("")}`,
  key: (P) => `<circle cx="30" cy="50" r="16" fill="none" stroke="${P.gold}" stroke-width="7"/><path d="M46 50 H88 M74 50 V64 M84 50 V60" stroke="${P.gold}" stroke-width="7"/>`,
  chains_broken: (P) => `<g fill="none" stroke="#4A4552" stroke-width="7"><ellipse cx="16" cy="76" rx="11" ry="7" transform="rotate(-40 16 76)"/><ellipse cx="29" cy="64" rx="11" ry="7" transform="rotate(-40 29 64)" stroke="#6E6878"/><path d="M38 52 a11 7 -40 0 1 6 -8"/><ellipse cx="84" cy="24" rx="11" ry="7" transform="rotate(-40 84 24)"/><ellipse cx="71" cy="36" rx="11" ry="7" transform="rotate(-40 71 36)" stroke="#6E6878"/><path d="M62 48 a11 7 -40 0 1 -6 8"/></g><path d="M50 50 l-12 -4 M50 50 l4 -13 M50 50 l12 4 M50 50 l-4 13" stroke="${P.gold}" stroke-width="4" stroke-linecap="round"/>`,
  palm: (P) => `<path d="M30 96 C40 70 50 46 66 20" stroke="#245E3B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M66 6 C92 22 86 62 50 78 C42 70 40 64 40 58 C40 34 52 16 66 6Z" fill="#2F8A55"/><path d="M66 10 C58 34 54 52 46 72" stroke="#A8E0B8" stroke-width="3" fill="none"/>${[18, 28, 38, 48, 58].map((y, i) => `<path d="M${62 - i * 3} ${y} l${16 - i} -6 M${60 - i * 3} ${y + 4} l-${12 - i} -2" stroke="#F6EBDD" stroke-width="2.5" stroke-linecap="round"/>`).join("")}`,
  broom: (P) => `<path d="M70 10 L45 62" stroke="${P.peach}" stroke-width="6"/><path d="M45 60 L20 90 L60 90 L52 62Z" fill="${P.gold}"/>`,
  dove: (P) => `<path d="M15 55 C30 40 45 42 55 48 L80 30 C78 45 70 55 62 58 C70 62 80 62 88 60 C78 72 60 75 45 70 C35 67 25 62 15 55Z" fill="${P.paper}"/>`,
  bread: (P) => `<ellipse cx="50" cy="55" rx="38" ry="22" fill="${P.orange}"/><path d="M32 48 l8 12 M48 44 l8 14 M64 46 l8 12" stroke="${P.paper}" stroke-width="4"/>`,
  sun: (P) => `${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${f(50 + Math.cos(a) * 26)} ${f(50 + Math.sin(a) * 26)} L${f(50 + Math.cos(a) * 44)} ${f(50 + Math.sin(a) * 44)}" stroke="${P.orange}" stroke-width="6" stroke-linecap="round"/>`; }).join("")}<circle cx="50" cy="50" r="20" fill="${P.gold}"/>`,
  ladder: (P) => `<path d="M34 8 V92 M66 8 V92" stroke="${P.paper}" stroke-width="5"/>${[20, 38, 56, 74].map((y) => `<path d="M34 ${y} H66" stroke="${P.paper}" stroke-width="5"/>`).join("")}`,
  medallion: (P) => `<path d="M50 6 V18" stroke="${P.gold}" stroke-width="4"/><ellipse cx="50" cy="56" rx="32" ry="38" fill="${P.gold}"/><ellipse cx="50" cy="56" rx="24" ry="30" fill="#F6E7C1"/><path d="M50 36 V78 M38 50 H62" stroke="${P.coral}" stroke-width="7" stroke-linecap="round"/>`,
  lamp: (P) => `<path d="M18 66 C30 80 70 80 82 66 L70 58 H30Z" fill="${P.gold}"/><path d="M50 22 C58 36 58 48 50 54 C42 48 42 36 50 22Z" fill="${P.orange}"/>`,
  rosary: (P) => `${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${f(50 + Math.cos(a) * 26)}" cy="${f(42 + Math.sin(a) * 26)}" r="4.5" fill="${P.pink}"/>`; }).join("")}<path d="M50 70 V94 M42 80 H58" stroke="${P.gold}" stroke-width="5"/>`,
  cross: (P) => `<path d="M50 10 V92 M28 34 H72" stroke="${P.gold}" stroke-width="10" stroke-linecap="square"/>`,
  moon: (P) => `<path d="M62 12 A40 40 0 1 0 62 88 A32 32 0 1 1 62 12Z" fill="${P.peach}"/>`,
  castle: (P) => `<path d="M14 90 V40 H26 V50 H38 V40 H50 V50 H62 V40 H74 V50 H86 V90Z" fill="${P.peach}"/><path d="M44 90 V70 A6 6 0 0 1 56 70 V90Z" fill="${P.ink}"/>`,
  water: (P) => [30, 48, 66].map((y) => `<path d="M10 ${y} q10 -10 20 0 t20 0 t20 0 t20 0" stroke="${P.turq}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join(""),
  jar: (P) => `<path d="M38 14 H62 V24 C78 34 80 60 70 82 H30 C20 60 22 34 38 24Z" fill="${P.paper}"/><rect x="34" y="10" width="32" height="8" fill="${P.gold}"/>`,
  hand: (P) => `<path d="M30 90 V50 C30 44 38 44 38 50 V30 C38 24 46 24 46 30 V24 C46 18 54 18 54 24 V30 C54 24 62 24 62 30 V52 L70 44 C74 40 80 46 76 50 L62 74 C58 84 50 90 40 90Z" fill="${P.peach}"/><circle cx="48" cy="58" r="5" fill="${P.coral}"/>`,
  rays: (P) => `<path d="M50 30 L20 95 H45Z" fill="#E8F4FF" fill-opacity=".9"/><path d="M50 30 L55 95 H80Z" fill="${P.coral}"/><circle cx="50" cy="28" r="10" fill="${P.gold}"/>`,
  sword: (P) => `<path d="M50 6 L57 20 L55 64 H45 L43 20Z" fill="#E8EEF4" stroke="#140F1F" stroke-opacity=".3" stroke-width="2"/><rect x="28" y="62" width="44" height="8" rx="3" fill="${P.gold}"/><rect x="46" y="70" width="8" height="18" fill="#6B4A35"/><circle cx="50" cy="92" r="5" fill="${P.gold}"/>`,
  scales: (P) => `<path d="M50 12 V86 M30 86 H70 M18 30 H82" stroke="${P.gold}" stroke-width="5" stroke-linecap="round"/><path d="M18 30 L8 56 H28Z M82 30 L72 56 H92Z" fill="${P.gold}" opacity=".85"/>`,
  fish: (P) => `<path d="M14 50 C30 26 62 26 76 50 C62 74 30 74 14 50Z" fill="${P.turq}"/><path d="M74 50 L94 34 V66Z" fill="${P.turq}"/><circle cx="30" cy="46" r="4" fill="#140F1F"/>`,
  wheat: (P) => `<path d="M50 96 V30" stroke="#B5852A" stroke-width="5"/>${[22, 34, 46, 58].map((y) => `<ellipse cx="40" cy="${y}" rx="11" ry="6" transform="rotate(-35 40 ${y})" fill="${P.gold}"/><ellipse cx="60" cy="${y}" rx="11" ry="6" transform="rotate(35 60 ${y})" fill="${P.gold}"/>`).join("")}<ellipse cx="50" cy="12" rx="6" ry="10" fill="${P.gold}"/>`,
};

// Small standalone icon for the symbol key on the About page.
export function symbolIcon(key, style) {
  if (!ICONS[key]) return "";
  const P = palette(style);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 116 116"><circle cx="50" cy="50" r="56" fill="#EADFF0"/>${ICONS[key](P)}</svg>`;
}
export const SYMBOL_KEYS = () => Object.keys(ICONS);

export function saintEmblem(saint, seed = 1, style) {
  const P = palette(style);
  const r = rng(seed + saint.id.length * 97);
  const [c1, c2] = saint.emblem?.colors || [P.turq, P.pink];
  const W = 480, H = 600;
  const syms = (saint.emblem?.symbols || ["star"]).filter((s) => ICONS[s]);
  const layout = syms.length === 1 ? [[240, 300, 2.2]] : syms.length === 2 ? [[240, 250, 1.9], [240, 440, 1.15]] : [[240, 250, 1.7], [140, 440, 1], [340, 440, 1]];
  const icons = syms.map((s, i) => { const [x, y, k] = layout[i]; return `<g transform="translate(${x - 50 * k} ${y - 50 * k}) scale(${k})" filter="url(#shadow)">${ICONS[s](P)}</g>`; }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Symbolic emblem for ${saint.name} (artistic interpretation)">${defs(P, r)}
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
  <rect width="${W}" height="${H}" fill="${P.paper}"/>
  <path d="${tornPoly(archPts(30, 24, 420, 556), r, 7)}" fill="${P.ink}" filter="url(#shadow)"/>
  <path d="${tornPoly(archPts(46, 40, 388, 524), r, 4)}" fill="url(#g)"/>
  <path d="${tornPoly(archPts(46, 40, 388, 524), r, 4)}" fill="url(#halftone)" opacity=".5"/>
  <circle cx="240" cy="${layout[0][1]}" r="140" fill="none" stroke="${P.gold}" stroke-width="10" stroke-dasharray="2 14" stroke-linecap="round"/>
  <g opacity=".55">${stainedGlass(240, layout[0][1], 128, r, [c1, c2, P.peach, P.gold, P.paper], 2)}</g>
  ${icons}
  <rect width="${W}" height="${H}" fill="#fff" filter="url(#paper)" opacity=".8" style="mix-blend-mode:multiply"/></svg>`;
}
