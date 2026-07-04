"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MATCHES, TEAMS, RESULTS, SITE, Match, TeamCode } from "@/lib/data";
import {
  byId,
  resolveTeams,
  effectivePick,
  loserOf,
  pickCount,
  encodePicks,
  decodePicks,
  Picks,
} from "@/lib/bracket";

const STORAGE_KEY = "wc2026-picks";

const ROUND_LABELS: Record<string, string> = {
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-finals",
  sf: "Semi-finals",
};

type Column =
  | { center: true; round?: undefined; side?: undefined }
  | { center?: false; round: string; side: "L" | "R" };

const COLUMNS: Column[] = [
  { round: "r32", side: "L" },
  { round: "r16", side: "L" },
  { round: "qf", side: "L" },
  { round: "sf", side: "L" },
  { center: true },
  { round: "sf", side: "R" },
  { round: "qf", side: "R" },
  { round: "r16", side: "R" },
  { round: "r32", side: "R" },
];

const centerMatches = () => MATCHES.filter((m) => m.side === "C");

function flagSrc(code: TeamCode, size = "w40") {
  return `https://flagcdn.com/${size}/${TEAMS[code].flag}.png`;
}

function Trophy() {
  return (
    <svg className="trophy" viewBox="0 0 120 170" role="img" aria-label="World Cup trophy">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset=".45" stopColor="#e8b83a" />
          <stop offset="1" stopColor="#b8860b" />
        </linearGradient>
        <radialGradient id="tglobe" cx=".35" cy=".3" r="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#c9971c" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="36" r="25" fill="url(#tglobe)" />
      <path
        d="M35 36h50M60 11v50M42 19c10 8 26 8 36 0M42 53c10-8 26-8 36 0"
        stroke="#a87708"
        strokeWidth="2"
        fill="none"
        opacity=".55"
      />
      <path
        d="M38 44 C 26 74, 44 92, 50 104 L 70 104 C 76 92, 94 74, 82 44 C 76 56, 68 60, 60 61 C 52 60, 44 56, 38 44 Z"
        fill="url(#tg)"
      />
      <path d="M50 104 h20 l3 12 h-26 Z" fill="#c9971c" />
      <path d="M40 120 q20 -8 40 0 l4 16 q-24 -8 -48 0 Z" fill="url(#tg)" />
      <rect x="34" y="138" width="52" height="14" rx="4" fill="#7a5a06" />
      <rect x="34" y="140" width="52" height="4" rx="2" fill="#ffe9a8" opacity=".35" />
    </svg>
  );
}

export default function BracketApp() {
  const [picks, setPicks] = useState<Picks>({});
  const [scoreMode, setScoreMode] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });

  const scrollRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }, []);

  /* ---------- load: localStorage + shared ?p= link ---------- */
  useEffect(() => {
    let initial: Picks = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) initial = JSON.parse(raw) || {};
    } catch {
      initial = {};
    }
    const shared = new URLSearchParams(window.location.search).get("p");
    const decoded = decodePicks(shared);
    if (decoded) {
      initial = decoded;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
      } catch {}
      setTimeout(() => showToast("Shared bracket loaded — tweak it or make your own!"), 500);
    }
    setPicks(initial);
  }, [showToast]);

  const persist = (next: Picks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  /* ---------- actions ---------- */
  const pick = (id: string, team: TeamCode) => {
    setPicks((prev) => {
      const next = { ...prev, [id]: team };
      persist(next);
      return next;
    });
  };

  const resetPicks = () => {
    setPicks({});
    persist({});
    setScoreMode(false);
    showToast("Bracket cleared — start predicting!");
  };

  const shareURL = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("p", encodePicks(picks));
    return url.toString();
  };

  const share = async () => {
    const champ = effectivePick(byId["f"], picks);
    const text = champ
      ? `I'm predicting ${TEAMS[champ].name} to win the 2026 World Cup 🏆 Think you know better? Build your bracket:`
      : `I'm building my World Cup 2026 bracket — make yours and let's compare:`;
    const url = shareURL();
    if (navigator.share) {
      try {
        await navigator.share({ title: "My World Cup 2026 Bracket", text, url });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast("Link copied — send it to your friends!");
    } catch {
      window.prompt("Copy your bracket link:", url);
    }
  };

  const toggleScore = () => setScoreMode((s) => !s);

  /* ---------- desktop click & drag scrolling ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let down = false,
      dragged = false,
      startX = 0,
      startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return; // touch scrolls natively
      down = true;
      dragged = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        el.classList.add("dragging");
      }
      if (dragged) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.classList.remove("dragging");
    };
    // swallow the click that follows a drag so it doesn't pick a team
    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  /* ---------- PNG download ---------- */
  const downloadPNG = async () => {
    showToast("Rendering your bracket…");

    const loadFlag = (code: TeamCode): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = flagSrc(code);
        setTimeout(() => resolve(null), 4000);
      });

    const codes = Object.keys(TEAMS);
    const flags: Record<string, HTMLImageElement | null> = {};
    await Promise.all(codes.map(async (c) => (flags[c] = await loadFlag(c))));

    const W = 2200,
      H = 1460,
      PAD = 40;
    const colW = 216,
      gap = (W - 2 * PAD - 9 * colW) / 8;
    const topY = 250,
      colH = H - topY - 80;
    const boxW = colW,
      boxH = 84,
      rowH = boxH / 2;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      showToast("Could not export the image in this browser, sorry!");
      return;
    }

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // background
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b1226");
    g.addColorStop(1, "#101c3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // title + champion
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 54px Segoe UI, Arial, sans-serif";
    ctx.fillText("MY WORLD CUP 2026 BRACKET", W / 2, 88);
    const champ = effectivePick(byId["f"], picks);
    ctx.font = "700 34px Segoe UI, Arial, sans-serif";
    ctx.fillStyle = "#ffd76a";
    ctx.fillText(champ ? `🏆 Champion: ${TEAMS[champ].name} 🏆` : "🏆 Who wins it all?", W / 2, 148);
    const second = loserOf(byId["f"], picks),
      third = effectivePick(byId["tp"], picks);
    ctx.font = "400 24px Segoe UI, Arial, sans-serif";
    ctx.fillStyle = "#8fa3c8";
    ctx.fillText(
      second || third
        ? `🥈 ${second ? TEAMS[second].name : "—"}   ·   🥉 ${third ? TEAMS[third].name : "—"}   ·   Round of 32 → Final, Jun 28 – Jul 19`
        : "Round of 32 → Final · June 28 – July 19, 2026",
      W / 2,
      196
    );

    const roundTag: Record<string, string> = {
      r32: "ROUND OF 32",
      r16: "ROUND OF 16",
      qf: "QUARTERS",
      sf: "SEMIS",
      final: "THE FINAL",
      tp: "3RD PLACE",
    };

    COLUMNS.forEach((col, ci) => {
      const x = PAD + ci * (colW + gap);
      const ms = col.center
        ? centerMatches()
        : MATCHES.filter((m) => m.round === col.round && m.side === col.side);
      ctx.font = "800 18px Segoe UI, Arial, sans-serif";
      ctx.fillStyle = "#5f74a0";
      ctx.textAlign = "center";
      if (!col.center) ctx.fillText(roundTag[col.round], x + colW / 2, topY - 16);

      ms.forEach((m, i) => {
        if (col.center) {
          ctx.font = "800 18px Segoe UI, Arial, sans-serif";
          ctx.fillStyle = m.round === "final" ? "#ffd76a" : "#5f74a0";
          ctx.textAlign = "center";
          ctx.fillText(
            roundTag[m.round],
            x + colW / 2,
            topY + (colH * (i + 0.5)) / ms.length - boxH / 2 - 12
          );
        }
        const cy = topY + (colH * (i + 0.5)) / ms.length;
        const y = cy - boxH / 2;
        const teams = resolveTeams(m, picks);
        const isFinal = m.round === "final";

        rr(x, y, boxW, boxH, 10);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        if (isFinal) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#d4a017";
          ctx.stroke();
        }

        teams.forEach((code, s) => {
          const ry = y + s * rowH;
          if (s === 1) {
            ctx.strokeStyle = "#e3e9f2";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 8, ry);
            ctx.lineTo(x + boxW - 8, ry);
            ctx.stroke();
          }
          if (!code) {
            ctx.fillStyle = "#b6c1d1";
            ctx.font = "600 17px Segoe UI, Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("—", x + 16, ry + rowH / 2 + 6);
            return;
          }
          const picked = effectivePick(m, picks) === code;
          if (picked) {
            ctx.fillStyle = "#e7f5ec";
            ctx.fillRect(x + 2, ry + 2, boxW - 4, rowH - 4);
          }
          const f = flags[code];
          if (f) ctx.drawImage(f, x + 12, ry + rowH / 2 - 9, 27, 18);
          else {
            ctx.fillStyle = "#c8d2e0";
            ctx.font = "800 13px Segoe UI, Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(code, x + 12, ry + rowH / 2 + 5);
          }
          ctx.fillStyle = picked ? "#0e7a3d" : "#101828";
          ctx.font = `${picked ? "800" : "600"} 17px Segoe UI, Arial, sans-serif`;
          ctx.textAlign = "left";
          ctx.fillText(TEAMS[code].name, x + 48, ry + rowH / 2 + 6, boxW - 78);
          if (picked) {
            ctx.fillStyle = "#0e7a3d";
            ctx.font = "900 17px Segoe UI, Arial, sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("✓", x + boxW - 12, ry + rowH / 2 + 6);
          }
        });
      });
    });

    // footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#8fa3c8";
    ctx.font = "600 22px Segoe UI, Arial, sans-serif";
    ctx.fillText(
      `Make your own bracket → ${SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}  ${SITE.champion_hashtag}`,
      W / 2,
      H - 34
    );

    try {
      const a = document.createElement("a");
      a.download = "my-world-cup-2026-bracket.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast("Bracket image downloaded ✔");
    } catch {
      showToast("Could not export the image in this browser, sorry!");
    }
  };

  /* ---------- rendering helpers ---------- */
  const TeamRow = ({ m, code }: { m: Match; code: TeamCode | null }) => {
    if (!code) {
      return (
        <button className="team-row" disabled>
          <span className="tname" style={{ opacity: 0.55 }}>
            — TBD —
          </span>
        </button>
      );
    }
    const picked = effectivePick(m, picks) === code;
    const elim = !!m.teams && !!effectivePick(m, picks) && !picked;
    let mark: React.ReactNode = null;
    if (scoreMode && picked && RESULTS[m.id]) {
      mark =
        RESULTS[m.id] === code ? (
          <span className="mark ok">✓</span>
        ) : (
          <span className="mark bad">✗</span>
        );
    }
    return (
      <button
        className={`team-row${picked ? " picked" : ""}${elim ? " eliminated" : ""}`}
        aria-pressed={picked}
        title={`Advance ${TEAMS[code].name}`}
        onClick={() => pick(m.id, code)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flagSrc(code)} alt="" width={22} loading="lazy" />
        <span className="tname">{TEAMS[code].name}</span>
        {mark}
      </button>
    );
  };

  const MatchBox = ({ m, extraClass }: { m: Match; extraClass?: string }) => {
    const [a, b] = resolveTeams(m, picks);
    return (
      <div className={`match${extraClass ? " " + extraClass : ""}`}>
        {m.label && <div className="match-label">{m.label}</div>}
        {m.date && <div className="match-date">{m.date}</div>}
        <TeamRow m={m} code={a} />
        <TeamRow m={m} code={b} />
      </div>
    );
  };

  const Podium = () => {
    const first = effectivePick(byId["f"], picks);
    const second = loserOf(byId["f"], picks);
    const third = effectivePick(byId["tp"], picks);
    const fourth = loserOf(byId["tp"], picks);
    const Row = ({ medal, code, ph }: { medal: string; code: TeamCode | null; ph: string }) => (
      <div className="podium-row">
        <span className="medal">{medal}</span>
        {code ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flagSrc(code)} alt="" width={22} loading="lazy" />
            <span>{TEAMS[code].name}</span>
          </>
        ) : (
          <span className="ph">{ph}</span>
        )}
      </div>
    );
    return (
      <div className="podium">
        <Row medal="🥇" code={first} ph="Champion" />
        <Row medal="🥈" code={second} ph="Runner-up" />
        <Row medal="🥉" code={third} ph="Third" />
        <Row medal="4" code={fourth} ph="Fourth" />
      </div>
    );
  };

  const champ = effectivePick(byId["f"], picks);

  let scoreBanner: React.ReactNode = null;
  if (scoreMode) {
    let right = 0,
      decided = 0;
    MATCHES.forEach((m) => {
      const res = RESULTS[m.id];
      const p = effectivePick(m, picks);
      if (res && p) {
        decided++;
        if (p === res) right++;
      }
    });
    scoreBanner = decided ? (
      <>
        Your score so far: <strong>{`${right} / ${decided}`}</strong> decided matches correct{" "}
        {right / Math.max(decided, 1) >= 0.7 ? "🔥" : "⚽"}
      </>
    ) : (
      "No decided matches overlap your picks yet — make picks, then check back after the games!"
    );
  }

  return (
    <>
      <section className="hero wrap">
        <h1>Bracketeer — World Cup 2026 Bracket Predictor</h1>
        <p className="tagline">
          Click who wins each knockout match — from the <strong>Round of 32</strong> to the{" "}
          <strong>final on July 19</strong>. Download your bracket, challenge your friends, and come
          back to see how many you got right.
        </p>
        <div className="toolbar" role="toolbar" aria-label="Bracket actions">
          <button className="btn btn-primary" onClick={downloadPNG}>
            ⬇ Download bracket
          </button>
          <button className="btn" onClick={share}>
            🔗 Share prediction
          </button>
          <button className="btn" onClick={toggleScore}>
            ✅ Check my score
          </button>
          <button className="btn btn-ghost" onClick={resetPicks}>
            ↺ Reset
          </button>
        </div>
        <p className="progress-line">{`${pickCount(picks)} / ${MATCHES.length} picks made`}</p>
        {scoreMode && <div className="score-banner">{scoreBanner}</div>}
      </section>

      <section id="bracket" className="bracket-section" aria-label="World Cup 2026 knockout bracket">
        <div className="champion-box">
          <span className="champ-label">Your champion</span>
          <span className="champ-team">
            {champ ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flagSrc(champ)} alt="" width={22} loading="lazy" /> {TEAMS[champ].name} 🏆
              </>
            ) : (
              "Make your picks 👇"
            )}
          </span>
        </div>
        <p className="swipe-hint">
          Tap a team to advance it · drag or swipe sideways to explore the full bracket ⟷
        </p>
        <div className="bracket-scroll" ref={scrollRef}>
          <div className="bracket">
            {COLUMNS.map((col, ci) => {
              if (col.center) {
                return (
                  <div key={ci} className="round-col final-col">
                    <div className="round-title">The Final · Jul 19</div>
                    <div className="center-stack">
                      <div className="trophy-wrap">
                        <Trophy />
                        <span className="trophy-caption">World Cup 2026</span>
                      </div>
                      <MatchBox m={byId["f"]} />
                      <MatchBox m={byId["tp"]} extraClass="third-place" />
                      <Podium />
                    </div>
                  </div>
                );
              }
              const ms = MATCHES.filter((m) => m.round === col.round && m.side === col.side);
              return (
                <div key={ci} className="round-col">
                  <div className="round-title">{ROUND_LABELS[col.round]}</div>
                  <div className="col-matches">
                    {ms.map((m) => (
                      <MatchBox key={m.id} m={m} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
    </>
  );
}
