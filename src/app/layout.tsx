import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaaS Prime | AI Employee Happiness Intelligence",
  description:
    "SaaS Prime helps teams detect burnout, monitor sentiment, and turn workplace insight into practical culture action.",
  metadataBase: new URL("https://sass-prime.vercel.app"),
  openGraph: {
    title: "SaaS Prime",
    description: "AI-powered employee happiness and workplace intelligence.",
    images: ["/assets/prime-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
