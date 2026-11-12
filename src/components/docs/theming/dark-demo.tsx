import { Rise } from "./motion";

function Panel({ dark }: { dark: boolean }) {
  const ac = dark ? "#f8a444" : "#aa610e";
  return (
    <div
      className="flex h-full flex-col justify-between p-5 sm:p-6"
      style={{ background: dark ? "#171717" : "#ffffff", color: dark ? "#fafafa" : "#171717" }}
    >
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full" style={{ background: ac }} />
        <span className="h-2 w-24 rounded-full" style={{ background: dark ? "#ffffff22" : "#00000014" }} />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-medium">Make it yours</p>
        <span className="block h-2 w-3/5 rounded-full" style={{ background: dark ? "#ffffff22" : "#00000014" }} />
        <span className="block h-2 w-2/5 rounded-full" style={{ background: dark ? "#ffffff22" : "#00000014" }} />
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-md px-3 py-1.5 text-[13px] font-medium" style={{ background: ac, color: dark ? "#171717" : "#fff" }}>
          Get started
        </span>
        <span className="font-mono text-xs" style={{ color: ac }}>
          {dark ? "Dark  #f8a444" : "Light  #aa610e"}
        </span>
      </div>
    </div>
  );
}

/** A glowing line sweeps between a light and a dark version of the same card. Pauses on hover. */
export function DarkDemo() {
  return (
    <Rise soft>
      <div className="tm-dd h-52 sm:h-56" aria-hidden="true">
        <Panel dark={false} />
        <div className="tm-dd-top">
          <Panel dark />
        </div>
        <div className="tm-dd-line" />
      </div>
    </Rise>
  );
}