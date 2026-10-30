import { promises as fs } from "node:fs";
import path from "node:path";
import { codeToHtml } from "shiki";

/** Where the real component files live. Read at build time, never at runtime. */
const REGISTRY_ROOT = path.join(process.cwd(), "src", "registry", "veyl");

export type Lang = "tsx" | "ts" | "css" | "bash";

export function langOf(file: string): Lang {
  if (file.endsWith(".tsx")) return "tsx";
  if (file.endsWith(".ts")) return "ts";
  if (file.endsWith(".css")) return "css";
  return "bash";
}

/** Reads one component file. If it is missing, the page still builds. */
export async function readSource(slug: string, file: string): Promise<string> {
  "use cache";
  try {
    const text = await fs.readFile(path.join(REGISTRY_ROOT, slug, file), "utf8");
    return text.trimEnd();
  } catch {
    return `// Could not find ${slug}/${file}`;
  }
}

/** Turns code into HTML with a light and a dark colour set (switched by CSS). */
export async function highlight(code: string, lang: Lang): Promise<string> {
  "use cache";
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
