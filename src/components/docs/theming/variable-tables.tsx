import { themeTables } from "@/lib/docs/theming";
import { Rise, SwatchCopy } from "./motion";

/** One table per component, written from the real CSS. Click a value to copy it. */
export function VariableTables() {
  return (
    <div className="space-y-10">
      {themeTables.map((table) => (
        <Rise key={table.slug} soft>
          <h3 className="font-medium text-foreground">{table.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach it with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">{table.root}</code>
          </p>
          {table.note ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{table.note}</p> : null}
          <div className="mt-3 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-border bg-surface text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Variable</th>
                  <th className="px-4 py-2.5 font-medium">What it changes</th>
                  <th className="px-4 py-2.5 font-medium">Light</th>
                  <th className="px-4 py-2.5 font-medium">Dark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {table.vars.map((v) => (
                  <tr key={v.name} className="align-top transition-colors duration-200 hover:bg-surface">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{v.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.controls}</td>
                    <td className="px-4 py-3">
                      <SwatchCopy value={v.light} />
                    </td>
                    <td className="px-4 py-3">
                      <SwatchCopy value={v.dark} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rise>
      ))}
    </div>
  );
}