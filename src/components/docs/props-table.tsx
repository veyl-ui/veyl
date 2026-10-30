import type { PropRow } from "@/lib/docs/components";

const code =
  "rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12.5px] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <tr>
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">What it does</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="px-4 py-3">
                <code className={code}>{row.name}</code>
              </td>
              <td className="px-4 py-3">
                <code className={code}>{row.type}</code>
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {row.default ?? "None"}
              </td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
