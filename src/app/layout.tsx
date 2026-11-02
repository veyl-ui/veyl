import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { FaviconAnimator } from "@/components/brand/favicon-animator";
import "./globals.css";

// Nunito is the font of the whole site. It is a variable font, so every weight is included.
const nunito = Nunito({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});

// Used only for code (`font-mono`).
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});


export const metadata: Metadata = {
  title: { default: "Veyl", template: "%s · Veyl" },
  description:
    "Quietly alive. Beautifully built. Animated React components you copy into your project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FaviconAnimator />
        {children}
      </body>
    </html>
  );
}
