import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/data";
import "./globals.css";

const SITE_URL = SITE.url; // set to your real domain before launch

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Bracketeer — World Cup 2026 Bracket Predictor | Pick Every Knockout Winner",
  description:
    "Bracketeer is a free interactive FIFA World Cup 2026 bracket predictor. Click your way through the Round of 32 to the final, download your prediction, share it with friends, and come back to see how many you got right.",
  keywords: [
    "world cup 2026 bracket",
    "world cup 2026 predictions",
    "fifa world cup 2026 bracket predictor",
    "world cup knockout stage bracket",
    "world cup 2026 round of 32",
    "predict world cup winner",
    "printable world cup bracket",
    "world cup bracket challenge",
    "world cup 2026 bracket maker",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>",
  },
  openGraph: {
    type: "website",
    siteName: "Bracketeer",
    title: "Bracketeer — World Cup 2026 Bracket Predictor. Who Wins It All?",
    description:
      "Click who wins each knockout match, build your full World Cup 2026 bracket, download it and challenge your friends. Free, no sign-up.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bracketeer — World Cup 2026 Bracket Predictor",
    description:
      "Pick every knockout winner from the Round of 32 to the final. Download and share your bracket.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1226",
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bracketeer — World Cup 2026 Bracket Predictor",
  url: SITE_URL,
  applicationCategory: "SportsApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free interactive bracket predictor for the FIFA World Cup 2026 knockout stage. Pick winners from the Round of 32 to the final, download and share your prediction.",
  about: {
    "@type": "SportsEvent",
    name: "FIFA World Cup 2026 Knockout Stage",
    startDate: "2026-06-28",
    endDate: "2026-07-19",
    location: { "@type": "Place", name: "Canada, Mexico and United States" },
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the World Cup 2026 bracket predictor work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Click the team you think wins each knockout match, starting from the Round of 32. Your pick automatically advances to the next round, all the way to the final. Your bracket is saved in your browser and can be downloaded as an image or shared with a link.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download or print my World Cup 2026 bracket?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once you have made your picks, use the Download button to save your full bracket as a PNG image you can print, post or send to friends.",
      },
    },
    {
      "@type": "Question",
      name: "How do I see if my predictions were right?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Come back after the matches are played — the site compares your saved picks against the real results and shows your score with a tick or cross on every decided match.",
      },
    },
    {
      "@type": "Question",
      name: "How many teams are in the World Cup 2026 knockout stage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "32 teams. The 2026 World Cup is the first with 48 teams and a Round of 32: 16 knockout matches lead to the Round of 16, quarter-finals, semi-finals and the final at MetLife Stadium on July 19, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Is the bracket predictor free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completely free, with no sign-up. The site is supported by ads and optional donations.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
