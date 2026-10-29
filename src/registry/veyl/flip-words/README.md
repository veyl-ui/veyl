# Flip Words

A word that turns letter by letter through 360 degrees, then gives way to the next word, which turns in the same way.

> This note was written without seeing your latest `flip-words.tsx`. Check the table below against your file and correct anything that differs.

## What it needs from your project

| Need | Details |
|---|---|
| Framework | React 18 or 19 with Next.js (App Router). It is a client component |
| Packages | `motion` (import from `"motion/react"`), `clsx`, `tailwind-merge` |
| Utility | `cn()` at `@/lib/utils` (clsx plus tailwind-merge) |
| Styles | `flip-words.css` must be imported by the component. It sets the font and the 3D perspective on `.flip-words-container` |
| Font | Manrope. The CSS file loads it with an `@import` from Google Fonts, which must stay at the very top of the file. For production, `next/font` is faster and avoids a third-party request (see below) |
| Tailwind | v4. It uses `neutral` colours and `dark:` classes. For `dark:` to follow your toggle, your project needs the class-based dark variant that `shadcn init` sets up |
| Parent | Put it inline inside a heading or a line of text. The word measures its own width |

## Optional: load Manrope with next/font instead of @import

```tsx
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
```

Add `${manrope.variable}` to a parent's `className`, then in `flip-words.css` replace the `@import` line and use:

```css
.flip-words-container {
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-optical-sizing: auto;
  perspective: 1000px;
}
```

## Props

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `words` | `string[]` | required | Words to cycle through, in order |
| `duration` | `number` (ms) | `3000` | How long each word stays |
| `className` | `string` | none | Style the animated word (colour, size, weight) |

## Good to know

- The 360-degree turn happens on the X axis, one letter after another, so the word needs room to rotate without being clipped by `overflow: hidden` on a parent.
- The words list should not change on every render. Define it outside the component, or memoise it.