/* ============ Bracket resolution — pure helpers ============
   Every function is pure over a `picks` map so the same logic can run
   on the server, in the client component, or in tests. `picks[matchId]`
   is the team code the user advanced from that match. */

import { MATCHES, Match, TeamCode } from "./data";

export type Picks = Record<string, TeamCode>;

export const byId: Record<string, Match> = {};
MATCHES.forEach((m) => (byId[m.id] = m));

/** Teams currently occupying a match's two slots (null = TBD). */
export function resolveTeams(m: Match, picks: Picks): (TeamCode | null)[] {
  if (m.teams) return m.teams.slice();
  if (m.feedLoser) return m.feedLoser.map((fid) => loserOf(byId[fid], picks));
  return (m.feed ?? []).map((fid) => effectivePick(byId[fid], picks));
}

/** The team the user eliminated from a match (for the 3rd-place play-off). */
export function loserOf(m: Match, picks: Picks): TeamCode | null {
  const p = effectivePick(m, picks);
  if (!p) return null;
  return resolveTeams(m, picks).find((t) => t && t !== p) || null;
}

/** A pick only counts if that team is actually in the match — invalidated
    picks cascade away automatically when an upstream result changes. */
export function effectivePick(m: Match, picks: Picks): TeamCode | null {
  const p = picks[m.id];
  if (!p) return null;
  return resolveTeams(m, picks).includes(p) ? p : null;
}

export function pickCount(picks: Picks): number {
  return MATCHES.reduce((n, m) => n + (effectivePick(m, picks) ? 1 : 0), 0);
}

/** One char per match, in MATCHES order: 0 = first slot, 1 = second, x = no pick. */
export function encodePicks(picks: Picks): string {
  return MATCHES.map((m) => {
    const p = effectivePick(m, picks);
    if (!p) return "x";
    return String(resolveTeams(m, picks).indexOf(p));
  }).join("");
}

/** Rebuild a picks map from an encoded share code. Returns null if invalid. */
export function decodePicks(code: string | null): Picks | null {
  if (!code || code.length !== MATCHES.length) return null;
  const next: Picks = {};
  // resolveTeams/effectivePick read the map as we build it, so pass `next`.
  MATCHES.forEach((m, i) => {
    const c = code[i];
    if (c !== "0" && c !== "1") return;
    const t = resolveTeams(m, next)[Number(c)];
    if (t) next[m.id] = t;
  });
  return Object.keys(next).length === 0 ? null : next;
}
