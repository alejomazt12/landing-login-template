import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";

// The CSS variable names are the font families themselves; the semantic names
// (--font-display, --font-body, --font-mono) are mapped in globals.css so
// Tailwind can generate utilities from them without recursing.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030"),
  title: {
    default: "Template App · Catálogo y disponibilidad",
    template: "%s · Template App",
  },
  description:
    "Catálogo de marcas y productos con disponibilidad en tiempo real y panel de administración.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Template App",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceae4" },
    { media: "(prefers-color-scheme: dark)", color: "#101217" },
  ],
};

// Applies the stored theme before first paint so the page never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col [&>main]:flex-1">{children}</body>
    </html>
  );
}
