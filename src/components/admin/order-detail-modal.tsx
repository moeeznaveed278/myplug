"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";
import { Order, OrderItem, Product } from "@prisma/client";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order & {
    orderItems: (OrderItem & {
      product: Product;
    })[];
  };
}

const deliveryMethodLabels: Record<string, string> = {
  standard: "Standard Delivery (Canada Post - 2 Business Days)",
  express: "Express Delivery (Same/Next Day)",
  pickup: "Pickup (Richmond Hill)",
  us: "US Shipping",
};

const deliveryMethodPrices: Record<string, number> = {
  standard: 20.0,
  express: 37.0,
  pickup: 0,
  us: 30.0,
};

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const formatPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = deliveryMethodPrices[order.deliveryMethod] || 0;
  const total = subtotal + shippingCost;
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const content = useMemo(() => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[9999]">
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        />

        <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="w-full max-w-3xl rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-black shadow-xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 id="order-detail-title" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Order Details
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                </button>
              </div>

              {/* Customer Information */}
              <div className="mb-6 p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-neutral-900/50">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Name: </span>
                    <span className="text-neutral-900 dark:text-neutral-100">{order.customerName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Email: </span>
                    <span className="text-neutral-900 dark:text-neutral-100">{order.customerEmail || "—"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Phone: </span>
                    <span className="text-neutral-900 dark:text-neutral-100">{order.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Address: </span>
                    <span className="text-neutral-900 dark:text-neutral-100">{order.address || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Order Items ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-black"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Size: {item.size || "One Size"} • Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
                          {formatPrice.format(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="mb-6 p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-neutral-900/50">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Delivery Method
                </h3>
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                </p>
              </div>

              {/* Order Summary */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {formatPrice.format(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Shipping</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {shippingCost === 0 ? "FREE" : formatPrice.format(shippingCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                    <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Total</span>
                    <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {formatPrice.format(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Order placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isOpen, onClose, order, subtotal, shippingCost, total, totalQuantity, formatPrice]);

  if (!mounted || !content) return null;

  return createPortal(content, document.body);
}

