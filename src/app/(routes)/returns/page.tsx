export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Returns &amp; Refunds</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Returns are accepted on eligible items within 7 days of delivery, subject to the conditions below.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">All sales final on hype items</h2>
            <p className="mt-2">
              Limited releases and “hype” items are final sale and not eligible for returns or exchanges.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Return eligibility</h2>
            <p className="mt-2">
              Eligible items must be unworn, in original condition, and returned with original packaging.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">How to start a return</h2>
            <p className="mt-2">
              Email us at <a className="underline hover:text-white dark:hover:text-white" href="mailto:support@myplug.ca">support@myplug.ca</a> with your order number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




