export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          This is placeholder content. We’ll outline what information we collect, how we use it, and how you can request access or deletion.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            We may collect information you provide (like your name, email, shipping address) and basic analytics to improve the site.
          </p>
          <p>
            We do not sell your personal information. We share data only with service providers needed to process payments and fulfill orders.
          </p>
          <p>
            For privacy questions, contact us at <a className="underline hover:text-white dark:hover:text-white" href="mailto:support@myplug.ca">support@myplug.ca</a>.
          </p>
        </div>
      </div>
    </div>
  );
}




