import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-8 sm:p-10 shadow-sm text-center">
          <p className="text-sm font-semibold text-blue-600">404</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Sneaker not found.
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow-sm transition"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




