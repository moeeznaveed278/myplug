import { db } from "@/lib/db";
import OrdersList from "@/components/admin/orders-list";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    where: { isPaid: true },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">Orders</h1>
      <OrdersList orders={orders} />
    </div>
  );
}


