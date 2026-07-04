import { NEWS, TEAMS } from "@/lib/data";
import BracketApp from "./BracketApp";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="wrap header-row">
          <a className="brand" href="#bracket" aria-label="Bracketeer home">
            <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
              <path d="M6 6 h10 v5 H11 v22 h5 v5 H6 Z" fill="var(--accent)" />
              <path d="M38 6 H28 v5 h5 v22 h-5 v5 h10 Z" fill="var(--accent-3)" />
              <circle cx="22" cy="22" r="7.5" fill="#fff" stroke="#101828" strokeWidth="2" />
              <path d="M22 17.5 l3.6 2.6 -1.4 4.3 h-4.4 l-1.4 -4.3 Z" fill="#101828" />
            </svg>
            <span>
              Bracket<em>eer</em>
            </span>
          </a>
          <nav className="main-nav" aria-label="Main">
            <a href="#bracket">Bracket</a>
            <a href="#how">How it works</a>
            <a href="#updates">Updates</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="btn btn-donate" href="#support">
            ☕ Support
          </a>
        </div>
      </header>

      {/* Ad slot: top leaderboard. Replace the inner div with your AdSense unit. */}
      <div className="wrap">
        <div className="ad-slot ad-leaderboard" aria-label="Advertisement">
          <span>Advertisement</span>
          {/* Paste Google AdSense ad unit code here */}
        </div>
      </div>

      <main>
        {/* Hero toolbar + interactive bracket (client component) */}
        <BracketApp />

        <section id="how" className="wrap band">
          <h2>How it works</h2>
          <div className="steps">
            <article className="step">
              <span className="step-num">1</span>
              <h3>Pick winners</h3>
              <p>
                Tap the team you think wins each match. Winners move to the next round
                automatically, all the way to the trophy.
              </p>
            </article>
            <article className="step">
              <span className="step-num">2</span>
              <h3>Download &amp; share</h3>
              <p>
                Save your finished bracket as an image or share a link that rebuilds your exact
                prediction for anyone who opens it.
              </p>
            </article>
            <article className="step">
              <span className="step-num">3</span>
              <h3>Check your score</h3>
              <p>
                After each matchday, come back and hit “Check my score” — every decided match gets a
                ✓ or ✗ against your pick.
              </p>
            </article>
          </div>
        </section>

        {/* Ad slot: in-content. Replace with your AdSense unit. */}
        <div className="wrap">
          <div className="ad-slot ad-rect" aria-label="Advertisement">
            <span>Advertisement</span>
            {/* Paste Google AdSense ad unit code here */}
          </div>
        </div>

        <section id="updates" className="wrap band">
          <h2>Latest World Cup 2026 updates</h2>
          <p className="section-sub">
            Hand-picked stories from trusted outlets — FIFA, Sky Sports, ESPN, Al Jazeera and more.
          </p>
          <div className="news-grid">
            {NEWS.map((n, i) => {
              const [a, b] = n.teams;
              return (
                <a
                  key={i}
                  className="news-card"
                  href={n.url}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  <div className="news-visual">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w160/${TEAMS[a].flag}.png`}
                      alt={`${TEAMS[a].name} flag`}
                      loading="lazy"
                    />
                    <span className="vs">vs</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w160/${TEAMS[b].flag}.png`}
                      alt={`${TEAMS[b].name} flag`}
                      loading="lazy"
                    />
                  </div>
                  <div className="news-body">
                    <span className="news-date">{n.date}</span>
                    <h3>{n.title}</h3>
                    <p>{n.text}</p>
                    <span className="news-source">Read on {n.source} →</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section id="faq" className="wrap band">
          <h2>World Cup 2026 bracket — FAQ</h2>
          <details open>
            <summary>How does the bracket predictor work?</summary>
            <p>
              Click the team you think wins each knockout match, starting from the Round of 32. Your
              pick advances to the next round automatically until you have crowned a World Cup 2026
              champion. Picks are saved in your browser — no account needed.
            </p>
          </details>
          <details>
            <summary>Can I download or print my bracket?</summary>
            <p>
              Yes — the Download button exports your full prediction as a PNG image, ready to print,
              post on social media or drop in the group chat.
            </p>
          </details>
          <details>
            <summary>How do I see if my predictions were right?</summary>
            <p>
              Return after the matches and press “Check my score”. The site compares your picks with
              the real results and shows a running score across all 31 knockout matches.
            </p>
          </details>
          <details>
            <summary>How is the 2026 knockout stage different?</summary>
            <p>
              It is the first World Cup with 48 teams, so the knockout stage starts with a brand-new{" "}
              <strong>Round of 32</strong>: 16 matches, then the Round of 16, quarter-finals,
              semi-finals and the final at MetLife Stadium, New Jersey on <strong>July 19, 2026</strong>.
            </p>
          </details>
          <details>
            <summary>Is it free?</summary>
            <p>
              Completely free, no sign-up. The site is supported by ads and optional donations — and
              it will return, re-skinned, for future tournaments.
            </p>
          </details>
        </section>

        <section id="support" className="wrap band support">
          <h2>Enjoying the bracket? Support the project ☕</h2>
          <p>
            This site is free and always will be. If it made your World Cup more fun, you can buy me
            a coffee — no strings attached.
          </p>
          <div className="support-buttons">
            {/* Create your page at buymeacoffee.com or ko-fi.com and paste the link below */}
            <a
              className="btn btn-primary"
              href="https://www.buymeacoffee.com/YOUR-HANDLE"
              rel="noopener"
              target="_blank"
            >
              ☕ Buy me a coffee
            </a>
            <a className="btn" href="https://ko-fi.com/YOUR-HANDLE" rel="noopener" target="_blank">
              💙 Ko-fi
            </a>
            <a
              className="btn"
              href="https://paypal.me/YOUR-HANDLE"
              rel="noopener"
              target="_blank"
            >
              PayPal
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>
            <strong>Bracketeer</strong> — a free fan project. Not affiliated with FIFA. Team names
            and flags are used for identification only.
          </p>
          <p>
            Fixtures &amp; results are updated through the tournament · Final: July 19, 2026, MetLife
            Stadium.
          </p>
        </div>
      </footer>
    </>
  );
}
