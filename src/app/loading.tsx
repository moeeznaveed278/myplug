export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero skeleton */}
      <section className="relative h-[50vh] flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
        <div className="w-full max-w-2xl px-4 text-center space-y-4 animate-pulse">
          <div className="h-10 md:h-14 w-3/4 mx-auto rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-5/6 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-2/3 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>

      {/* Filters + grid skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-40 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>

        <div className="mb-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            <div className="h-12 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 rounded-md bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}







