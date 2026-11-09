/**
 * Soft light behind a GlassCta, so the glass has something to frost.
 * Put it first inside a `relative` wrapper that also holds the GlassCta.
 * It is only visible in light mode; in dark mode it becomes a faint glow.
 */
export function GlassBackdrop() {
  return (
    <div aria-hidden className="gc-backdrop">
      <span className="gc-blob gc-blob-1" />
      <span className="gc-blob gc-blob-2" />
      <span className="gc-blob gc-blob-3" />
    </div>
  );
}