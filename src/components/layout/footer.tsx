import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold tracking-tight">
              MyPlug <span className="text-blue-500">Canada</span>
            </div>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed max-w-md">
              Curated releases, real-time stock, and fast checkout across Canada.
            </p>
            <p className="mt-6 text-xs text-neutral-400">© 2024 MyPlug Canada. All rights reserved.</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Support</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>
                <a href="mailto:support@myplug.ca" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Returns &amp; Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}




