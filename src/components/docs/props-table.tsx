import type { PropRow } from "@/lib/docs/components";

const code =
  "rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground";

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="border-b border-border bg-surface text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">What it does</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="px-4 py-3">
                <code className={code}>{row.name}</code>
              </td>
              <td className="px-4 py-3">
                <code className={code}>{row.type}</code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.default ?? "None"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
