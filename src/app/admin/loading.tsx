export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="h-10 w-56 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4 animate-pulse">
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-3 h-8 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-2 h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4 animate-pulse">
        <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    </div>
  );
}







