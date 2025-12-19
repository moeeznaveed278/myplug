"use client";

import { useState } from "react";
import OrderDetailModal from "./order-detail-modal";
import { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
};

interface OrdersListProps {
  orders: OrderWithItems[];
}

const deliveryMethodPrices: Record<string, number> = {
  standard: 20.0,
  express: 37.0,
  pickup: 0,
  us: 30.0,
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
}

export default function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const rows = orders.map((order) => {
    const subtotal = order.orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = deliveryMethodPrices[order.deliveryMethod] || 0;
    const total = subtotal + shippingCost;
    const shortId = order.id.slice(-6);
    const date = new Date(order.createdAt).toLocaleDateString();
    const products = order.orderItems.map((item) => {
      const sizeLabel = item.size ? `(${item.size})` : "";
      return `${item.product.name} ${sizeLabel} x${item.quantity}`.replace(/\s+/g, " ").trim();
    });

    return { order, shortId, date, total, products };
  });

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <p className="text-neutral-600 dark:text-neutral-400">No orders found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-4 sm:hidden">
        {rows.map(({ order, shortId, date, total, products }) => (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order)}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">Order</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">#{shortId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Total</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{formatMoney(total)}</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm text-neutral-500">Products</p>
              <ul className="mt-1 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
                {products.map((p, idx) => (
                  <li key={`${order.id}-${idx}`}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <p className="text-sm text-neutral-500">Customer</p>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">{order.phone || "—"}</p>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">{order.address || "—"}</p>
            </div>

            <div className="mt-3 text-sm text-neutral-500">Date: {date}</div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-950">
            <tr className="text-left text-neutral-600 dark:text-neutral-300">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Customer Info</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {rows.map(({ order, shortId, date, total, products }) => (
              <tr
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="text-neutral-800 dark:text-neutral-200 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <td className="px-4 py-3 font-mono">#{shortId}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-1">
                    {products.map((p, idx) => (
                      <li key={`${order.id}-${idx}`}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div>{order.phone || "—"}</div>
                    <div className="text-neutral-600 dark:text-neutral-400">{order.address || "—"}</div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{formatMoney(total)}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />
      )}
    </>
  );
}

