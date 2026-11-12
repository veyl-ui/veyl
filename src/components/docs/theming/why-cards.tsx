import { Glow, Rise } from "./motion";

const cards = [
  {
    title: "Match your brand",
    text: "Swap the amber for your own colour, so Veyl looks like it was built for your site.",
    icon: (
      <span className="tm-cycle tm-ico">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5c3.4 4 6 7.2 6 10.6A6 6 0 0 1 6 13.1C6 9.7 8.6 6.5 12 2.5Z" />
        </svg>
      </span>
    ),
  },
  {
    title: "Stay in sync",
    text: "Light and dark come from one system, so one change updates both.",
    icon: (
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="tm-sw" />
        <span className="tm-sw" style={{ animationDelay: "0.15s" }} />
      </span>
    ),
  },
  {
    title: "Update with ease",
    text: "Your colours live outside the component code. Copy a newer version and your theme is still there.",
    icon: (
      <span className="tm-cycle tm-ico">
        <svg className="tm-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" />
          <path d="M18 3v4h-4M6 21v-4h4" />
        </svg>
      </span>
    ),
  },
];

export function WhyCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((c, i) => (
        <Rise key={c.title} i={i}>
          <Glow className="h-full rounded-xl border border-border bg-background p-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-surface">{c.icon}</div>
            <h3 className="mt-3 font-medium text-foreground">{c.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{c.text}</p>
          </Glow>
        </Rise>
      ))}
    </div>
  );
}