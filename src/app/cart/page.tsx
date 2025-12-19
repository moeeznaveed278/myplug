"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/store/use-cart";
import type { CartItem } from "@/store/use-cart"; // Import the type
import { checkout } from "@/actions/checkout";
import { toast } from "sonner";
import DeliverySelector from "@/components/cart/delivery-selector";

export default function CartPage() {
  // This is the same hydration-safe pattern we used in the Navbar
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  const subtotal = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate shipping cost based on delivery method
  const shippingCost =
    cart.deliveryMethod === "standard"
      ? 20.0
      : cart.deliveryMethod === "express"
      ? 37.0
      : cart.deliveryMethod === "us"
      ? 30.0
      : 0;

  const orderTotal = subtotal + shippingCost;

  const formatPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  const subtotalLabel = formatPrice.format(subtotal);
  const shippingLabel = formatPrice.format(shippingCost);
  const totalLabel = formatPrice.format(orderTotal);

  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }

  const onCheckout = async () => {
    try {
      // Pass the cart items and delivery method to the server action
      await checkout(cart.items, cart.deliveryMethod);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Something went wrong with the checkout process. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Shopping Cart</h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {cart.items.length} item{cart.items.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            Continue shopping
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-16 border border-neutral-200/70 dark:border-neutral-800/70 rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-md">
            <p className="text-neutral-900 dark:text-neutral-100 font-semibold">Your cart is empty.</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Browse the latest drops and add your size.</p>
            <Link href="/" className="mt-5 inline-flex bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-full hover:bg-blue-700 shadow-sm transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
            
            {/* Left Side: Cart Items */}
            <div className="lg:col-span-2">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {cart.items.map((item) => (
                  <CartItemRow key={`${item.id}-${item.selectedSize}`} item={item} />
                ))}
              </ul>
              
              {/* Delivery Selector */}
              <DeliverySelector />

              {/* Delivery Information Note */}
              {cart.deliveryMethod === "us" ? (
                <div className="mt-6 p-4 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    ⚠️ US Shipping Notice
                  </p>
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                    Duties and taxes are the buyer's responsibility. Additional charges may apply upon delivery.
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    📍 Delivery Information
                  </p>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    We deliver all across GTA (Greater Toronto Area). For beyond, contact us.
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="sticky top-24 p-6 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Subtotal</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{subtotalLabel}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Shipping</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {shippingCost === 0 ? "FREE" : shippingLabel}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <p className="text-base font-medium text-neutral-900 dark:text-white">Order total</p>
                    <p className="text-base font-medium text-neutral-900 dark:text-white">{totalLabel}</p>
                  </div>
                </div>
                <button 
                    onClick={onCheckout} // <-- ADD THIS
                    disabled={cart.items.length === 0} // Disable if cart is empt 
                    className="mt-6 w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50">
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for a single cart item row
function CartItemRow({ item }: { item: CartItem }) {
  const cart = useCart();
  const itemTotalLabel = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(item.price * item.quantity);

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={item.images[0]}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-semibold text-neutral-900 dark:text-white">
            <h3>
              <Link href={`/product/${item.id}`}>{item.name}</Link>
            </h3>
            <p className="ml-4">{itemTotalLabel}</p>
          </div>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Size: {item.selectedSize}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 dark:text-neutral-400">Qty</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-black/30 px-2 py-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => cart.setQuantity(item.id, item.selectedSize, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center font-semibold text-neutral-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => cart.setQuantity(item.id, item.selectedSize, item.quantity + 1)}
                disabled={typeof item.maxAvailable === "number" ? item.quantity >= item.maxAvailable : false}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex">
            <button 
              type="button" 
              className="font-semibold text-red-600 hover:text-red-700"
              onClick={() => cart.removeItem(item.id, item.selectedSize)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}