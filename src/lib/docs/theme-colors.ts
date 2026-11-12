/* Small colour helpers for the Theming page. Pure functions, so they run on the server and in the browser. */

/** Turn hue (0-360), saturation (0-100) and lightness (0-100) into a #rrggbb string. */
export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = light - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colours. 4.5 or more is good for text. */
export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export type Theme = { hue: number; sat: number };

/** The accent for light mode: the given colour, made just dark enough to read on white (4.5 to 1). */
export function lightAccent({ hue, sat }: Theme): string {
  let l = 46;
  let hex = hslToHex(hue, sat, l);
  while (contrast(hex, "#ffffff") < 4.6 && l > 16) hex = hslToHex(hue, sat, (l -= 1));
  return hex;
}

/** The accent for dark mode: the same hue, made just light enough to read on near-black (4.5 to 1). */
export function darkAccent({ hue, sat }: Theme): string {
  const s = sat === 0 ? 0 : Math.min(sat + 8, 95);
  let l = 62;
  let hex = hslToHex(hue, s, l);
  while (contrast(hex, "#171717") < 4.6 && l < 90) hex = hslToHex(hue, s, (l += 1));
  return hex;
}

export type Recipe = Theme & { name: string };

export const recipes: Recipe[] = [
  { name: "Amber", hue: 32, sat: 85 },
  { name: "Rose", hue: 346, sat: 78 },
  { name: "Violet", hue: 262, sat: 70 },
  { name: "Emerald", hue: 160, sat: 80 },
  { name: "Sky", hue: 200, sat: 85 },
  { name: "Mono", hue: 0, sat: 0 },
];

/** The global CSS for a theme: light values first, then dark. */
export function globalCss(light: string, dark: string): string {
  const block = (prefix: string) =>
    `${prefix}.fq-root { --fq-accent: ${prefix ? dark : light}; --fq-accent-ink: ${prefix ? dark : light}; }\n` +
    `${prefix}.gc-root, ${prefix}.gc-backdrop { --gc-accent: ${prefix ? dark : light}; }\n` +
    `${prefix}.gc-root { --gc-accent-ink: ${prefix ? dark : light}; }\n` +
    `${prefix}.sf-root { --sf-accent: ${prefix ? dark : light}; --sf-accent-ink: ${prefix ? dark : light}; }\n` +
    `${prefix}.ba-root { --ba-accent: ${prefix ? dark : light}; }\n`;
  return `${block("")}\n${block(".dark ")}`.trimEnd();
}