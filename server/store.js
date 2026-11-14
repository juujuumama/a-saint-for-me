// Minimal JSON-file persistence. Swap for Postgres/SQLite in production;
// the interface (getUser, saveUser, ...) is intentionally small.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const DATA_DIR = process.env.DATA_DIR || path.resolve("data");
export const ART_DIR = path.join(DATA_DIR, "art");
export const REF_DIR = path.join(DATA_DIR, "references");
const DB_FILE = path.join(DATA_DIR, "db.json");

for (const d of [DATA_DIR, ART_DIR, REF_DIR]) fs.mkdirSync(d, { recursive: true });

let db = { users: {}, references: [] };
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
db.references ||= [];

let timer = null;
function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const tmp = DB_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  }, 50);
}

export const newId = (n = 12) => crypto.randomBytes(n).toString("base64url");

export function getUser(uid) {
  if (!db.users[uid]) {
    db.users[uid] = {
      id: uid,
      createdAt: new Date().toISOString(),
      // Memory is OFF until the person turns it on.
      settings: { memoryConsent: false },
      experiences: [],
    };
    persist();
  }
  return db.users[uid];
}

export function saveUser() { persist(); }

export function findExperience(uid, id) {
  return getUser(uid).experiences.find((e) => e.id === id);
}

export function deleteExperience(uid, id) {
  const u = getUser(uid);
  const e = u.experiences.find((x) => x.id === id);
  if (!e) return false;
  for (const a of e.artHistory || []) removeArtFile(a.file);
  u.experiences = u.experiences.filter((x) => x.id !== id);
  persist();
  return true;
}

export function deleteUser(uid) {
  const u = db.users[uid];
  if (!u) return;
  for (const e of u.experiences) for (const a of e.artHistory || []) removeArtFile(a.file);
  delete db.users[uid];
  persist();
}

function removeArtFile(file) {
  if (!file) return;
  const p = path.join(ART_DIR, path.basename(file));
  fs.rmSync(p, { force: true });
}

// Who owns an art file? Used to keep artwork private to its owner.
export function artOwner(file) {
  for (const u of Object.values(db.users))
    for (const e of u.experiences)
      if ((e.artHistory || []).some((a) => a.file === file)) return u.id;
  return null;
}

// Founder reference artworks
export const listReferences = () => db.references;
export function addReference(ref) { db.references.push(ref); persist(); return ref; }
export function updateReference(id, patch) {
  const r = db.references.find((x) => x.id === id);
  if (r) { Object.assign(r, patch); persist(); }
  return r;
}
export function removeReference(id) {
  const r = db.references.find((x) => x.id === id);
  if (!r) return false;
  fs.rmSync(path.join(REF_DIR, path.basename(r.file)), { force: true });
  db.references = db.references.filter((x) => x.id !== id);
  persist();
  return true;
}
