import type { Metadata } from "next";
import { Space_Mono, Playball } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const playball = Playball({
  variable: "--font-playball",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pyarcel",
  description: "Send emotions with every parcel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${playball.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
