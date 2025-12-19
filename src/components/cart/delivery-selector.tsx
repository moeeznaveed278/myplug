"use client";

import { useCart, type DeliveryMethod } from "@/store/use-cart";
import { Truck, Zap, MapPin, Globe } from "lucide-react";

const deliveryOptions: Array<{
  value: DeliveryMethod;
  label: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}> = [
  {
    value: "standard",
    label: "Standard Delivery",
    description: "Canada Post (2 Business Days)",
    price: 20.0,
    icon: <Truck className="h-5 w-5" />,
  },
  {
    value: "express",
    label: "Express Delivery",
    description: "Same/Next Day Delivery",
    price: 37.0,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    value: "us",
    label: "US Shipping",
    description: "United States (Duties & taxes are buyer's responsibility)",
    price: 30.0,
    icon: <Globe className="h-5 w-5" />,
  },
  {
    value: "pickup",
    label: "Pickup",
    description: "Richmond Hill Pickup (Contact for details)",
    price: 0,
    icon: <MapPin className="h-5 w-5" />,
  },
];

export default function DeliverySelector() {
  const cart = useCart();
  const priceFormat = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Delivery Method</h3>
      <div className="space-y-3">
        {deliveryOptions.map((option) => {
          const isSelected = cart.deliveryMethod === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-black"
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.value}
                checked={isSelected}
                onChange={() => cart.setDeliveryMethod(option.value)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500/40 border-neutral-300 dark:border-neutral-700"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">{option.label}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{option.description}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {option.price === 0 ? "FREE" : priceFormat.format(option.price)}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

