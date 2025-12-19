"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/store/use-cart';

export default function CheckoutSuccessPage() {
  const clearCart = useCart((state) => state.clearCart);

  // Clear the cart when the user lands on this page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-neutral-500 mb-6">
        Thank you for your order. A confirmation has been sent to your email.
      </p>
      <Link href="/" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
        Continue Shopping
      </Link>
    </div>
  );
}