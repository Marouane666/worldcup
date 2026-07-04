# Bracketeer — World Cup 2026 Bracket Predictor (Next.js)

A free interactive bracket predictor for the FIFA World Cup 2026 knockout stage.
Click a team to advance it, round by round, until you've crowned a champion — then
download the bracket as a PNG or share it as a link. This is the **Next.js (App
Router + TypeScript)** port of the original static site; the design and behaviour
are identical.

## Run locally

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Production build:

```bash
pnpm build && pnpm start
```

## Project structure

```
app/
  layout.tsx      Root layout: SEO metadata (Next Metadata API) + JSON-LD, globals.css
  page.tsx        Server-rendered sections: header, ads, how-it-works, news, FAQ, support, footer
  BracketApp.tsx  "use client" — the interactive bracket, toolbar, PNG export, share, drag-scroll
  globals.css     Styles (verbatim from the original site)
  robots.ts       Generates /robots.txt
  sitemap.ts      Generates /sitemap.xml
lib/
  data.ts         Tournament data — TEAMS, MATCHES, RESULTS, NEWS, SITE (typed)
  bracket.ts      Pure bracket-resolution helpers (resolveTeams, effectivePick, encode/decode…)
```

## Before launch

1. **Domain.** Set `SITE.url` in [`lib/data.ts`](lib/data.ts) to your real domain.
   It feeds `metadataBase`, the canonical URL, Open Graph tags, `robots.txt` and
   `sitemap.xml` automatically.
2. **Donations.** Replace `YOUR-HANDLE` in the three donate links in
   [`app/page.tsx`](app/page.tsx) (the `#support` section) with your Buy Me a
   Coffee / Ko-fi / PayPal handles.
3. **Ads.** Paste your Google AdSense units into the two `.ad-slot` placeholders in
   [`app/page.tsx`](app/page.tsx).

## Updating results during the tournament

Everything editors touch lives in [`lib/data.ts`](lib/data.ts):

- `RESULTS` — add `matchId: "WINNER_CODE"` after each match is decided. Visitors'
  saved predictions are scored against it automatically ("Check my score").
- `NEWS` — short items for the "Latest updates" section, newest first.

> **TODO (carried over from the source data):** two Round-of-32 winners were not yet
> confirmed when the data was captured — `m88` (Argentina vs Cape Verde) and `m84`
> (Colombia vs Ghana). Add them to `RESULTS` once final.

Match ids: `m73`–`m88` (Round of 32), `r16-1`–`r16-8`, `qf1`–`qf4`, `sf1`, `sf2`,
`f` (final) and `tp` (third-place play-off — its slots are filled by the losers of
the two semi-final picks).

## How predictions are stored & shared

- Picks live in `localStorage` (no accounts, no backend, no cookie banner needed).
- Share encodes all 32 matches into a `?p=…` URL that rebuilds the exact bracket.
- Download draws the bracket to a `<canvas>` and saves a PNG — no libraries.

## Reusing for a future competition

The bracket is fully data-driven. Edit [`lib/data.ts`](lib/data.ts): swap `TEAMS`
(name + [flagcdn](https://flagcdn.com) country code), rebuild the `MATCHES` tree
(`teams` for first-round matches, `feed` for the rest, `feedLoser` for a third-place
play-off), clear `RESULTS`/`NEWS`, and update the copy/metadata in `app/`.
