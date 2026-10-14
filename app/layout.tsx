import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ForestStage from "@/components/ForestStage";
import ForestFX from "@/components/ForestFX";
import IntroCurtain, { INTRO_SCRIPT } from "@/components/IntroCurtain";
import { SITE } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const SITE_URL = "https://vivian4fb.github.io/nature_trip/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wildora Expeditions | Expert-led Western Ghats Nature Trips",
    template: "%s | Wildora Expeditions",
  },
  description:
    "Small-group nature and wildlife trips in the Western Ghats of South India, guided by doctorate-holding naturalists: endemic birds, Nilgiri tahr, lion-tailed macaques, monsoon frogs, butterflies, shola grasslands and tiger country. Families, birders, photographers and international guests welcome.",
  keywords: [
    "western ghats nature tour", "western ghats birding tour", "kerala wildlife tour", "munnar nature walk",
    "thattekad birding", "valparai lion-tailed macaque", "nilgiri tahr eravikulam", "monsoon herping india",
    "india butterfly tour", "guided nature tour india", "india endemic species tour", "family wildlife holiday india",
  ],
  openGraph: {
    title: "Wildora Expeditions | Expert-led Western Ghats Nature Trips",
    description: "Small-group, naturalist-led journeys into the rainforests, shola grasslands and tiger country of South India.",
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Wildora Expeditions",
    images: [{ url: "photos/mammals/lion-tailed-macaque-wide.webp", width: 1600, height: 900, alt: "Lion-tailed macaque in the Western Ghats rainforest" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07140d",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Wildora Expeditions",
  url: SITE_URL,
  telephone: `+${SITE.whatsapp.e164}`,
  areaServed: "Western Ghats, South India",
  description: "Naturalist-led small-group nature and wildlife trips in the Western Ghats of South India.",
  ...(SITE.email ? { email: SITE.email } : {}),
  sameAs: [SITE.social.facebook, SITE.social.instagram].filter(Boolean),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <IntroCurtain />
        <a className="skip-link" href="#main">Skip to content</a>
        <ForestStage />
        <Navigation />
        <main id="main">{children}</main>
        <FloatingCTA />
        <Footer />
        <ForestFX />
      </body>
    </html>
  );
}
