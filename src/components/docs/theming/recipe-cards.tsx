import { darkAccent, globalCss, lightAccent, recipes } from "@/lib/docs/theme-colors";
import { CopyButton } from "../copy-button";
import { Glow, Rise } from "./motion";

/** Six ready-made themes. Each one is the same global CSS with different colours. */
export function RecipeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recipes.map((recipe, n) => {
        const light = lightAccent(recipe);
        const dark = darkAccent(recipe);
        const code = `/* ${recipe.name} */\n${globalCss(light, dark)}`;
        return (
          <Rise key={recipe.name} i={n % 2} className="min-w-0">
            <Glow tilt style={{ "--r-l": light, "--r-d": dark } as React.CSSProperties} className="tm-rc min-w-0 rounded-xl border border-border bg-surface p-4">
              <div className="contents">
                <div className="flex items-center gap-3">
                  <div className="flex overflow-hidden rounded-lg border border-black/10 dark:border-white/15" aria-hidden="true">
                    <span className="grid h-10 w-10 place-items-center" style={{ background: "#ffffff" }}>
                      <span className="size-5 rounded-full" style={{ background: light }} />
                    </span>
                    <span className="grid h-10 w-10 place-items-center" style={{ background: "#171717" }}>
                      <span className="size-5 rounded-full" style={{ background: dark }} />
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{recipe.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {light} · {dark}
                    </p>
                  </div>
                  <CopyButton text={code} className="ml-auto" />
                </div>
                <div className="tm-rc-ui mt-3" aria-hidden="true">
                  <div className="tm-rc-row">
                    <span className="tm-rc-btn" />
                    <span className="tm-rc-sw" />
                    <span className="tm-rc-track">
                      <b />
                    </span>
                  </div>
                  <span className="tm-line" style={{ width: "86%" }} />
                  <span className="tm-line" style={{ width: "58%" }} />
                </div>
                <pre className="mt-3 max-h-40 overflow-auto rounded-md border border-border bg-background p-3 font-mono text-[11.5px] leading-6 text-muted-foreground">
                  <code>{code}</code>
                </pre>
              </div>
            </Glow>
          </Rise>
        );
      })}
    </div>
  );
}