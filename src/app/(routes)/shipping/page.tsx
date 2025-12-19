export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Shipping Policy</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          We ship within Canada. Delivery times and fees may vary by location and carrier availability.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Carriers</h2>
            <p className="mt-2">
              Orders are typically shipped via Canada Post or UPS. We’ll select the best option based on destination and package size.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Processing time</h2>
            <p className="mt-2">
              Most orders are processed within 1–3 business days. During high-volume drops, processing may take longer.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Tracking</h2>
            <p className="mt-2">
              Once shipped, you’ll receive tracking details via email (if provided at checkout).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




