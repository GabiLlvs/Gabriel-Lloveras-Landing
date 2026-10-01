import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { site, themeScript } from "@/content/site";
import { ThemeSync } from "@/components/theme";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const metadataBase = site.url ? new URL(site.url) : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  alternates: site.url ? { canonical: "/" } : undefined,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    url: site.url || undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8eef7" },
    { media: "(prefers-color-scheme: dark)", color: "#070b12" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: site.email,
  ...(site.url ? { url: site.url } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mendoza",
    addressCountry: "AR",
  },
  sameAs: [site.linkedin],
  knowsAbout: ["React", "TypeScript", "Next.js", "Java", "C#", "Node.js", "UX/UI"],
  knowsLanguage: ["es", "en"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${mono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeSync />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        {children}
      </body>
    </html>
  );
}
