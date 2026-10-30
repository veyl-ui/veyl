import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import "./docs.css";

export const metadata: Metadata = {
  title: { default: "Veyl", template: "%s · Veyl" },
  description: "Quietly alive. Beautifully built. Animated React components you copy into your project.",
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-svh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <DocsHeader />
        <div className="mx-auto flex w-full max-w-[88rem] gap-10 px-4 md:px-6">
          <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 md:block">
            <DocsSidebar />
          </aside>
          <main className="min-w-0 flex-1 py-10 md:py-12">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
