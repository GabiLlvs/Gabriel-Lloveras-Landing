import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { themeScript } from "@/lib/theme-mix";
import { readLocale } from "@/lib/request-locale";
import { LocaleProvider } from "@/components/locale";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await readLocale();
  const description = site.description[locale];

  return {
    metadataBase,
    title: {
      default: site.title,
      template: `%s · ${site.name}`,
    },
    description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.linkedin }],
    creator: site.name,
    alternates: site.url ? { canonical: "/" } : undefined,
    openGraph: {
      title: site.title,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_AR",
      siteName: site.name,
      url: site.url || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await readLocale();

  return (
    <html
      lang={locale}
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
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
