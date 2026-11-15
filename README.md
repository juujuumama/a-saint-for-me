# A Saint for Me

A daily Catholic devotional with original art. Each day a person shares what's on their heart. In return they get:

- **An original artwork** in one recognizable house style: surrealist, Afrofuturist, hand-cut and torn paper collage, with crystals, stained glass and celestial imagery.
- **2–5 saints** to walk with them, chosen from a curated library.
- **An original prayer** written for their actual circumstances.
- **Scripture**, chosen and explained.
- **Traditional prayers and devotions**, shown word for word.
- **A closing reflection** to carry into the day.

Everything is kept in **My Devotional Collection**: a private visual archive of their prayer journey.

## Run it

```bash
npm install
```

```bash
cp .env.example .env    # add keys you have; everything is optional
```

```bash
npm start               # http://localhost:3000   ·   founder tools at /studio
```

With no keys at all, the app still works. Prayers come from the offline composer and the art comes from the built-in procedural "studio sketch" artist. Add `ANTHROPIC_API_KEY` for AI-written devotionals and an image-provider key for AI artwork.

## How it works

```
check-in ──► Claude (structured output) ──► devotional + symbolic art brief
                │ saints/scripture/devotions are ENUMS of the curated library
                ▼
         prayer shown immediately
                │
                ▼ (async; never blocks the prayer)
   art brief + house style ──► prompt ──► active image provider ──► fallback chain ──► procedural sketch
```

| Piece | File |
|---|---|
| Curated saints (facts, patronages, emblem symbols) | `server/library/saints.js` |
| Scripture passages | `server/library/scripture.js` |
| Traditional prayers, Rosary mysteries, devotions | `server/library/devotions.js` |
| Check-in vocabulary and theme detection | `server/library/themes.js` |
| Devotional engine (Claude + offline composer) | `server/devotional.js` |
| **House style configuration** | `config/style.json` |
| Style → prompt builder | `server/art/style.js` |
| **Image provider config** (hot-reloaded) | `config/providers.json` |
| Provider adapters: OpenAI, Replicate, Stability, custom HTTP, procedural | `server/art/providers.js` |
| Procedural collage artist and saint emblems | `server/art/procedural.js` |
| Crisis-language safety net | `server/safety.js` |
| Founder Style Studio | `public/studio.html` |

### Accuracy guardrails
- The model can only choose saints, Scripture and traditional prayers from the curated library. The schema enforces this with enums. Names, dates, patronages and prayer texts always come from these reviewed files, never from the model.
- AI-written prayers are labeled **"Written for you"**. The Church's own prayers are labeled **"Traditional"** and shown exactly as stored.
- Saint images are symbolic emblems built from traditional attributes (lilies, roses, palms, broken chains…). They are labeled *artistic interpretation* and never shown as likenesses.
- The style config has `sacredIconographyRules`: no photoreal sacred figures, no invented or occult symbols, no halos on the user's figure, no text in images.

### Privacy
- Identity is an anonymous, httpOnly cookie. There are no accounts in this version.
- **The image provider never sees the person's words.** It receives only the symbolic art brief, which Claude is told to keep free of names and private details.
- **Memory is off by default.** When off, the person's own words are not stored; only the neutral intention title, prayer and art are kept. Turning memory off erases stored words immediately. Continuing an earlier intention requires memory to be on.
- Artwork files are served only to their owner. "Delete all my data" removes everything, artwork files included.
- When someone's words suggest they may be in danger, crisis resources appear above their prayer, alongside it rather than in place of it.

### Continuity without pressure
Returning visitors see "Welcome back." There are no streaks, no missed-day counts and no "you haven't prayed in…" messages. They can choose *Something new*, *Keep praying about something* (from earlier intentions, if memory is on), *Pray for someone* or *Give thanks*. When an earlier intention is continued, the prompt tells the model not to assume the situation is unchanged.

## The art system

**Style configuration** (`config/style.json`, editable in `/studio`) holds:
- the palette, with names and hex values
- techniques and textures
- 10 composition archetypes, rotated so images don't repeat
- motifs by theme
- Afrocentric references
- sacred motifs
- lighting
- typography
- iconography rules
- an avoid-list
- the prompt template

The theme motifs follow your brief. Financial hardship, for example, gets "cupped hands receiving falling seeds of light" and never money. Addiction gets "a broken chain transforming into a flock of paper birds."

**Reference artworks.** Upload your own pieces in `/studio`. For each one:
- **Guide generation** sends it as a style reference to providers that accept reference images. OpenAI uses its edits endpoint, with an instruction to use the images only for style and to make a new composition.
- **Analyze style** has Claude read the image and describe its style: palette, technique, composition, motifs and a generalizable style note.
- **Adopt note** folds that note into the house style, so every provider benefits, including ones that can't take images.

**Switching providers.** In `/studio`, or by editing `config/providers.json`:

```json
"active": "replicate",
"providers": { "replicate": { "model": "black-forest-labs/flux-1.1-pro" } }
```

Changes apply to the next artwork, with no rebuild or restart. Keys live only in `.env`; the config file just names the env var, and the API refuses to write secrets into it. If a provider fails, the app tries `fallbackChain` and then the procedural artist, so a devotional always has art. The prayer is delivered first, so it never waits on art.

**Custom model server.** Use the `custom` provider with this contract:
- Request: `POST {endpoint}` with `{ prompt, negative_prompt, aspect_ratio, reference_images: [base64] }`
- Response: `{ image_base64, mime }` or `{ image_url }`

People can regenerate the artwork without regenerating the prayer, keep every version, and choose their favorite. Cards render in the browser as artwork only, artwork with prayer, or a collectible card, in portrait (1080×1350) or square (1080×1080), and can be downloaded or shared.

## Before launch: checklist
- [ ] **Theological review** of `saints.js`, `devotions.js` and the system prompt in `devotional.js`, by a priest or catechist. Consider seeking an ecclesiastical review if you plan to market it as Catholic.
- [ ] **Bible text:** quotes are adapted from the public-domain World English Bible. For a commercial launch, consider licensing the NABRE (USCCB) or RSV-2CE.
- [ ] **Accounts:** replace the anonymous cookie with real sign-in so collections survive across devices.
- [ ] **Database:** swap `server/store.js`, a JSON file, for Postgres or SQLite, and art storage for S3/R2.
- [ ] **Image moderation:** add a review or safety check on generated images, and test each provider against the iconography rules.
- [ ] **Rate limits and cost caps** per user. A basic daily cap is in place.
- [ ] **Privacy policy** describing exactly what is sent to Claude and to the image provider.

## The art kit (Sierra Renee's own work)

The free artist builds each image from `public/kit/`, made from Sierra Renee's published work on juujuumama.art (all rights reserved by the artist):
- **95 backgrounds**: red wave scenes, florals and opals, pastel landscapes, tarot arches and crystals.
- **39 textures**: knit, tufted, agate, glitter and paint, cut into robes, halos and wings.
- **145 faces**: 132 portraits plus 13 robot faces.

`server/art/kit.js` chooses the pieces for each artwork, the same way every time for a given seed. `kitArtwork()` in `server/art/procedural.js` cuts and layers them into a saint or angel collage.

- **Faces** were found with a face detector across all 438 works, then reviewed and labeled by hand (`scripts/kit-faces.json`). Crops are computed from each face's eye line and chin, so every face sits the same way under a veil, hood or halo.
- **Face choice:** saints are artistic interpretations, so any of her portraits can become any saint, whatever the saint's historical gender or race. Angels can also get one of her robot faces, about half the time. Robot faces are never used for saints.
- **Changing the kit:** edit the lists in `scripts/fetch-kit.mjs` (positions in the site's image list) or `scripts/kit-faces.json`, then run `node scripts/fetch-kit.mjs`.
