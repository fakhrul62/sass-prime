import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
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
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
