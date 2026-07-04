/* ============================================================
   TOURNAMENT DATA — FIFA World Cup 2026 knockout stage
   To reuse this site for a future competition, edit this file:
   teams, matches (bracket tree), results, and news.
   ============================================================ */

export type TeamCode = string;

export interface Team {
  name: string;
  flag: string;
}

export type RoundId = "r32" | "r16" | "qf" | "sf" | "final" | "tp";
export type Side = "L" | "R" | "C";

export interface Match {
  id: string;
  round: RoundId;
  side: Side;
  /** First-round matches carry their two teams directly. */
  teams?: [TeamCode, TeamCode];
  /** Later matches are fed by the winners of two earlier matches. */
  feed?: [string, string];
  /** The third-place play-off is fed by the losers of two matches. */
  feedLoser?: [string, string];
  date?: string;
  label?: string;
}

export interface NewsItem {
  date: string;
  title: string;
  text: string;
  teams: [TeamCode, TeamCode];
  source: string;
  url: string;
}

export const TEAMS: Record<TeamCode, Team> = {
  CAN: { name: "Canada", flag: "ca" },
  RSA: { name: "South Africa", flag: "za" },
  GER: { name: "Germany", flag: "de" },
  PAR: { name: "Paraguay", flag: "py" },
  FRA: { name: "France", flag: "fr" },
  SWE: { name: "Sweden", flag: "se" },
  NED: { name: "Netherlands", flag: "nl" },
  MAR: { name: "Morocco", flag: "ma" },
  ESP: { name: "Spain", flag: "es" },
  AUT: { name: "Austria", flag: "at" },
  POR: { name: "Portugal", flag: "pt" },
  CRO: { name: "Croatia", flag: "hr" },
  USA: { name: "United States", flag: "us" },
  BIH: { name: "Bosnia & Herz.", flag: "ba" },
  BEL: { name: "Belgium", flag: "be" },
  SEN: { name: "Senegal", flag: "sn" },
  BRA: { name: "Brazil", flag: "br" },
  JPN: { name: "Japan", flag: "jp" },
  NOR: { name: "Norway", flag: "no" },
  CIV: { name: "Ivory Coast", flag: "ci" },
  MEX: { name: "Mexico", flag: "mx" },
  ECU: { name: "Ecuador", flag: "ec" },
  ENG: { name: "England", flag: "gb-eng" },
  COD: { name: "DR Congo", flag: "cd" },
  EGY: { name: "Egypt", flag: "eg" },
  AUS: { name: "Australia", flag: "au" },
  ARG: { name: "Argentina", flag: "ar" },
  CPV: { name: "Cape Verde", flag: "cv" },
  SUI: { name: "Switzerland", flag: "ch" },
  ALG: { name: "Algeria", flag: "dz" },
  COL: { name: "Colombia", flag: "co" },
  GHA: { name: "Ghana", flag: "gh" },
};

/* Bracket tree. Order matters: earlier rounds first (picks propagate).
   R32 matches carry `teams`; later matches carry `feed` = the two
   matches whose winners meet. `side` places the match in the left or
   right half of the bracket. */
export const MATCHES: Match[] = [
  // ---- Round of 32 · left half (top of draw) ----
  { id: "m74", round: "r32", side: "L", teams: ["GER", "PAR"], date: "Jun 29" },
  { id: "m78", round: "r32", side: "L", teams: ["FRA", "SWE"], date: "Jun 30" },
  { id: "m73", round: "r32", side: "L", teams: ["CAN", "RSA"], date: "Jun 28" },
  { id: "m75", round: "r32", side: "L", teams: ["NED", "MAR"], date: "Jun 30" },
  { id: "m85", round: "r32", side: "L", teams: ["ESP", "AUT"], date: "Jul 2" },
  { id: "m87", round: "r32", side: "L", teams: ["POR", "CRO"], date: "Jul 3" },
  { id: "m81", round: "r32", side: "L", teams: ["USA", "BIH"], date: "Jul 2" },
  { id: "m82", round: "r32", side: "L", teams: ["BEL", "SEN"], date: "Jul 1" },
  // ---- Round of 32 · right half (bottom of draw) ----
  { id: "m76", round: "r32", side: "R", teams: ["BRA", "JPN"], date: "Jun 29" },
  { id: "m77", round: "r32", side: "R", teams: ["NOR", "CIV"], date: "Jun 30" },
  { id: "m79", round: "r32", side: "R", teams: ["MEX", "ECU"], date: "Jul 1" },
  { id: "m80", round: "r32", side: "R", teams: ["ENG", "COD"], date: "Jul 1" },
  { id: "m86", round: "r32", side: "R", teams: ["EGY", "AUS"], date: "Jul 3" },
  { id: "m88", round: "r32", side: "R", teams: ["ARG", "CPV"], date: "Jul 3" },
  { id: "m83", round: "r32", side: "R", teams: ["SUI", "ALG"], date: "Jul 3" },
  { id: "m84", round: "r32", side: "R", teams: ["COL", "GHA"], date: "Jul 3" },
  // ---- Round of 16 ----
  { id: "r16-1", round: "r16", side: "L", feed: ["m74", "m78"], date: "Jul 4" },
  { id: "r16-2", round: "r16", side: "L", feed: ["m73", "m75"], date: "Jul 4" },
  { id: "r16-3", round: "r16", side: "L", feed: ["m85", "m87"], date: "Jul 6" },
  { id: "r16-4", round: "r16", side: "L", feed: ["m81", "m82"], date: "Jul 6–7" },
  { id: "r16-5", round: "r16", side: "R", feed: ["m76", "m77"], date: "Jul 5" },
  { id: "r16-6", round: "r16", side: "R", feed: ["m79", "m80"], date: "Jul 5–6" },
  { id: "r16-7", round: "r16", side: "R", feed: ["m86", "m88"], date: "Jul 7" },
  { id: "r16-8", round: "r16", side: "R", feed: ["m83", "m84"], date: "Jul 7" },
  // ---- Quarter-finals ----
  { id: "qf1", round: "qf", side: "L", feed: ["r16-1", "r16-2"], date: "Jul 9–11" },
  { id: "qf2", round: "qf", side: "L", feed: ["r16-3", "r16-4"], date: "Jul 9–11" },
  { id: "qf3", round: "qf", side: "R", feed: ["r16-5", "r16-6"], date: "Jul 9–11" },
  { id: "qf4", round: "qf", side: "R", feed: ["r16-7", "r16-8"], date: "Jul 9–11" },
  // ---- Semi-finals ----
  { id: "sf1", round: "sf", side: "L", feed: ["qf1", "qf2"], date: "Jul 14" },
  { id: "sf2", round: "sf", side: "R", feed: ["qf3", "qf4"], date: "Jul 15" },
  // ---- Final ----
  { id: "f", round: "final", side: "C", feed: ["sf1", "sf2"], date: "Jul 19 · MetLife Stadium", label: "The Final" },
  // ---- Third-place play-off (losers of the semi-finals) ----
  { id: "tp", round: "tp", side: "C", feedLoser: ["sf1", "sf2"], date: "Jul 18 · Miami", label: "Third place" },
];

/* Real results — the winner's team code per match.
   UPDATE THIS after each matchday; visitors' saved predictions are
   scored against it automatically. Leave a match out until decided. */
export const RESULTS: Record<string, TeamCode> = {
  m73: "CAN", // Canada 1–0 South Africa
  m74: "PAR", // Paraguay 1–1 Germany (4–3 pens)
  m75: "MAR", // Morocco 1–1 Netherlands (3–2 pens)
  m76: "BRA", // Brazil 2–1 Japan
  m77: "NOR", // Norway 2–1 Ivory Coast
  m78: "FRA", // France 3–0 Sweden
  m79: "MEX", // Mexico 2–0 Ecuador
  m80: "ENG", // England 2–1 DR Congo
  m81: "USA", // USA 2–0 Bosnia & Herzegovina
  m82: "BEL", // Belgium 3–2 Senegal
  m83: "SUI", // Switzerland 2–0 Algeria
  m85: "ESP", // Spain 3–0 Austria
  m86: "EGY", // Egypt 1–1 Australia (4–2 pens)
  m87: "POR", // Portugal 2–1 Croatia
  // TODO: fill in once confirmed —
  // m88: Argentina vs Cape Verde (Argentina led 1–0 at HT, Messi 29')
  // m84: Colombia vs Ghana (kicked off late Jul 3)
};

/* News cards shown in the "Latest updates" section. Newest first.
   UPDATE alongside RESULTS. Each card links out to a real, trusted
   source — `teams` picks the two flags used as the card image. */
export const NEWS: NewsItem[] = [
  {
    date: "Jul 3",
    title: "Messi on the scoresheet as Argentina meet Cape Verde",
    text: "The holders face World Cup debutants in Miami to close out the Round of 32 — follow the official match centre for line-ups and the final score.",
    teams: ["ARG", "CPV"],
    source: "FIFA",
    url: "https://www.fifa.com/en/match-centre/match/17/285023/289287/400021521",
  },
  {
    date: "Jul 3",
    title: "Round of 16 bracket takes shape",
    text: "France–Paraguay, Canada–Morocco and an Iberian blockbuster between Spain and Portugal headline the last 16. Full schedule and predictions.",
    teams: ["FRA", "PAR"],
    source: "Al Jazeera",
    url: "https://www.aljazeera.com/sports/2026/7/3/fifa-world-cup-2026-round-of-16-bracket-friday-schedule-predictions",
  },
  {
    date: "Jul 3",
    title: "Egypt survive Australia shootout, Matchday 23 recap",
    text: "Egypt held their nerve 4–2 on penalties after a 1–1 draw. Recap every twist of the day Messi and co. took the stage.",
    teams: ["EGY", "AUS"],
    source: "FOX Sports",
    url: "https://www.foxsports.com/stories/soccer/world-cup-messi-argentina-cape-verde-colombia-ghana-egypt-australia-matchday23",
  },
  {
    date: "Jul 1",
    title: "Who's facing who — the full route to the final",
    text: "Every confirmed knockout tie and each contender's path to MetLife Stadium on July 19, updated after every matchday.",
    teams: ["ENG", "BRA"],
    source: "Sky Sports",
    url: "https://www.skysports.com/football/news/11095/13556636/world-cup-2026-bracket-and-knockout-fixtures-whos-facing-who-in-the-last-32-and-route-to-final",
  },
  {
    date: "Jun 30",
    title: "Shootout shocks: Morocco and Paraguay advance",
    text: "Morocco knocked out the Netherlands and Paraguay eliminated Germany — two of the biggest upsets of the tournament so far, both on penalties.",
    teams: ["MAR", "NED"],
    source: "Yahoo Sports",
    url: "https://sports.yahoo.com/soccer/article/world-cup-2026-round-of-32-full-bracket-matchups-schedule-and-how-each-team-qualified-164942403.html",
  },
  {
    date: "Jun 28",
    title: "Africa's historic nine — how far can they go?",
    text: "A record nine African nations reached the World Cup knockout rounds. ESPN breaks down each team's chances.",
    teams: ["SEN", "GHA"],
    source: "ESPN",
    url: "https://www.espn.com/espn/story/_/id/49204443/african-teams-2026-fifa-world-cup-round-32-ed-dove-predictions",
  },
];

export const SITE = {
  name: "Bracketeer",
  url: "https://YOUR-DOMAIN.com/", // set to your real domain before launch
  champion_hashtag: "#WorldCup2026",
};
