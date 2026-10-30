/**
 * Shown for an instant while a component page loads. It also gives Next.js a
 * <Suspense> boundary around the page, which is what lets navigations stay
 * instant when `cacheComponents` is on.
 */
export default function Loading() {
  const bar = "rounded-md bg-neutral-100 dark:bg-neutral-900 motion-safe:animate-pulse";
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className={`${bar} h-9 w-56`} />
      <div className={`${bar} h-5 w-full max-w-xl`} />
      <div className={`${bar} h-80 w-full`} />
    </div>
  );
}