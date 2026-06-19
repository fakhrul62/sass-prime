import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime | Workplace Signal Intelligence",
  description:
    "Prime helps teams detect burnout, understand sentiment, and turn quiet workplace signals into clear action.",
  metadataBase: new URL("https://sass-prime.vercel.app"),
  openGraph: {
    title: "Prime | Workplace Signal Intelligence",
    description: "Hear what work feels like, see what changed, and know where to act.",
    images: ["/assets/prime-signal-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
