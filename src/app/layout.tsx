import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
    // suppressHydrationWarning is needed by next-themes (it adds a class to <html>).
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${geistMono.variable}`}>
      <body>
        {/* One theme provider for the whole site: landing page and docs share it. */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FaviconAnimator />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
