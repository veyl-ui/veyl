# Bento Grid

A five-column, two-row grid of photo cards. Each card holds a small animated panel. The demo is themed around a coffee roastery.

## What it needs from your project

| Need | Details |
|---|---|
| Framework | Next.js (App Router). `BentoCard` uses `next/image`, and the skeletons are client components |
| Packages | `motion`, `clsx`, `tailwind-merge` |
| Utility | `cn()` at `@/lib/utils` |
| Tailwind | v4. It uses the default palette (`neutral`, `amber`, `white`, `black`). If your project replaces the default colours, these classes will have no effect |
| Font | Manrope, read from the `--font-manrope` CSS variable, falling back to your system font. Load it as shown below |
| Photos | Each card needs an `image`. The remote host must be allowed in `next.config.ts` (see below) |
| Parent size | The grid fills its parent. Give the parent a height, and the two rows split it evenly. On screens below `md` it becomes one column of 16rem cards |
| Dark mode | The cards look the same in light and dark. Only the border colour changes with `dark:` |

## Load the font

```tsx
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

<main className={manrope.variable}> ... </main>
```

## Allow the photo host (next.config.ts)

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
```

Using your own files instead? Put them in `public/` and pass `src: "/coffee/farm.jpg"`. No config change needed.

## Props

**BentoGrid**

| Prop | Purpose |
|---|---|
| `className` | Size it (for example `h-full w-full`) |

**BentoCard**

| Prop | Default | Purpose |
|---|---|---|
| `title` | required | Card heading |
| `description` | none | One short line under the heading |
| `image` | required | `{ src, alt? }`. Leave `alt` empty for decorative photos |
| `align` | `"top"` | `"top"` or `"bottom"`. Where the text sits |
| `className` | none | Grid placement, such as `md:col-span-3` |
| children | none | A skeleton or any content for the lower part of the card |

## Skeletons

`OriginTrail`, `RoastCurve`, `TastingNotes` and `FreshnessTracker` are example panels. They are plain components, so replace them with your own content for a different theme.

With "reduce motion" turned on, every loop stops and the panels show their finished state.

## Photo credits (Unsplash, free to use)

Michael Starkie (farm), Zoshua Colah (roaster), Hannah Busing (beans), pouchdirect Australia (bag).