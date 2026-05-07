import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "GGType — type fast or get rekt",
  description: "Esports-themed chat typing test. Hype or Rage. Your call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${notoSansThai.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
