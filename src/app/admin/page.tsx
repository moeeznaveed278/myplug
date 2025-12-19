import { db } from "@/lib/db";
import Link from "next/link";

function formatMoneyCAD(value: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
}

export default async function AdminDashboardPage() {
  const [productCount, paidOrders] = await Promise.all([
    db.product.count({ where: { isArchived: false } }),
    db.order.findMany({
      where: { isPaid: true },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const paidOrderCount = await db.order.count({ where: { isPaid: true } });

  const revenue = paidOrders.reduce((sum, order) => {
    return sum + order.orderItems.reduce((s, item) => s + item.product.price * item.quantity, 0);
  }, 0);

  const lowStockCount = await db.size.count({ where: { quantity: { lte: 2 } } });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 shadow-sm transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Products</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{productCount}</p>
          <Link href="/admin/products" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            Manage products →
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Paid orders</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{paidOrderCount}</p>
          <Link href="/admin/orders" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            View orders →
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Recent revenue (last 5 orders)</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{formatMoneyCAD(revenue)}</p>
          <p className="mt-2 text-xs text-neutral-500">Calculated from product prices × quantities.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Low stock sizes</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{lowStockCount}</p>
          <p className="mt-2 text-xs text-neutral-500">Sizes with quantity ≤ 2.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>

        {paidOrders.length === 0 ? (
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">No paid orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-neutral-600 dark:text-neutral-300">
                <tr>
                  <th className="py-2 pr-4 font-medium">Order</th>
                  <th className="py-2 pr-4 font-medium">Items</th>
                  <th className="py-2 pr-4 font-medium">Total</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paidOrders.map((o) => {
                  const total = o.orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                  return (
                    <tr key={o.id} className="text-neutral-800 dark:text-neutral-200">
                      <td className="py-2 pr-4 font-mono">#{o.id.slice(-6)}</td>
                      <td className="py-2 pr-4">{o.orderItems.length}</td>
                      <td className="py-2 pr-4 font-semibold">{formatMoneyCAD(total)}</td>
                      <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


