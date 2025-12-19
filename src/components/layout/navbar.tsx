"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Shield } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  // This pattern prevents hydration errors with localStorage
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();
  // To set an admin role:
  // Go to Clerk Dashboard -> Users -> Select User -> Metadata -> Public Metadata -> Add {'role': 'admin'}.
  const { isSignedIn, user } = useUser();
  const role = (user?.publicMetadata as any)?.role;
  
  // Calculate total items
  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

  if (!isMounted) {
    // Render a placeholder on the server and during initial client render
    return null; 
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation Links */}
        <div className="md:hidden flex items-center gap-3 py-2 border-b border-neutral-200/70 dark:border-neutral-800/70">
          <Link
            href="/shop"
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            All
          </Link>
          <Link
            href="/gender/MEN"
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Men
          </Link>
          <Link
            href="/gender/WOMEN"
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Women
          </Link>
          <Link
            href="/gender/KIDS"
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Kids
          </Link>
        </div>

        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              MP
            </span>
            <span>
              My<span className="text-blue-600">Plug</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/shop"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              All Products
            </Link>
            <Link
              href="/gender/MEN"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Men
            </Link>
            <Link
              href="/gender/WOMEN"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Women
            </Link>
            <Link
              href="/gender/KIDS"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Kids
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isSignedIn && role === "admin" ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              >
                <Shield className="h-4 w-4 text-blue-600" />
                Admin
              </Link>
            ) : null}

            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              >
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 text-neutral-900 dark:text-white" />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-5 px-1 text-[11px] font-bold text-white bg-blue-600 rounded-full">
                  {totalItems}
                </span>
              ) : null}
            </Link>

            {/* Mobile sign-in/admin shortcut */}
            {!isSignedIn ? (
              <Link
                href="/sign-in"
                className="sm:hidden inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            ) : isSignedIn && role === "admin" ? (
              <Link
                href="/admin"
                className="sm:hidden inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}