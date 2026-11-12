import { Glow, Rise } from "./motion";

const options = [
  { title: "On one component", text: "Only one spot should look different. Add a className to that component.", on: [4] },
  { title: "On one section", text: "A themed area, such as a pricing page. Wrap it in a div with your own class, then write the CSS once.", on: [3, 4, 5] },
  { title: "Everywhere", text: "Your brand colour across the whole site. Paste the CSS into your global stylesheet.", on: [0, 1, 2, 3, 4, 5] },
];

/** Three ways to apply a theme, each with a tiny page that shows how much of it changes. */
export function WhereCards() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {options.map((o, n) => (
        <Rise key={o.title} i={n}>
          <Glow className="h-full rounded-xl border border-border bg-background p-4">
            <div className="tm-sk" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <i key={k} data-on={o.on.includes(k) ? "" : undefined} style={{ "--k": k } as React.CSSProperties} />
              ))}
            </div>
            <h3 className="mt-3 font-medium text-foreground">{o.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{o.text}</p>
          </Glow>
        </Rise>
      ))}
    </div>
  );
}