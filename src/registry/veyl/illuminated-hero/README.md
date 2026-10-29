# Illuminated Hero

A dark hero section with two glowing circles and a headline whose middle line glows and has a band of light flowing through it.

## What it needs from your project

| Need | Details |
|---|---|
| Framework | React 18 or 19 with Next.js (App Router). It is a client component (`"use client"`) |
| Packages | None. No `motion`, no Tailwind classes. It only uses React and its own CSS file |
| Utilities | None. It does not use `cn()` |
| Font | Instrument Sans (500, 600, 700), passed in through the `--vh-font` CSS variable. If you skip this, it falls back to your system font and the text will not match the design exactly |
| Browser support | Needs CSS container queries (`container-type: size`): Chrome 105+, Safari 16+, Firefox 110+ |
| Parent size | It fills its parent's width and height. **Give the parent a height**, such as `h-svh` or a fixed height. With no height it collapses to its minimum of 20rem |

## Load the font (Next.js)

```tsx
import { Instrument_Sans } from "next/font/google";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--vh-font",
  display: "swap",
});

<div className={`${sans.variable} h-svh`}>
  <IlluminatedHero />
</div>
```

## Props

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `headline` | `[string, string, string]` | "Introducing / Illuminated Glow Text. / Highlight the main focus text." | Intro line, glowing line, closing line |
| `description` | `ReactNode[]` | Four default lines | One entry per line of the paragraph. Entries may contain `<b>` |
| `headingLevel` | `"h1" \| "h2" \| "h3"` | `"h1"` | Use `h1` once per page |
| `className` | `string` | none | Extra classes on the section |
| `style` | `CSSProperties` | none | Inline styles. Use this to set a `height`, because inline styles always win |

## Good to know

- With **no props**, the text is stretched to the original design widths, so it looks exactly like the original.
- With **your own text**, lines keep their natural width and the widest line sets the font size. Keep each line short, because a line never wraps.
- The hero never touches `html`, `body` or `:root`, and its CSS classes all start with `vh-`.
- With "reduce motion" turned on, the circles and the flowing light stay still.
- Colours are golden. They are CSS variables at the top of `illuminated-hero.css` (`--rim`, `--g-mid`, `--t3a` and so on) if you want to change them.