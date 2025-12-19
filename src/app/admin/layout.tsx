import Link from "next/link";
import { Package, ShoppingCart, LayoutDashboard, Boxes, ClipboardList } from "lucide-react";
import AdminToastListener from "@/components/admin/admin-toast-listener";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 dark:bg-black/40 backdrop-blur-md border-r border-neutral-200/70 dark:border-neutral-800/70 p-6 hidden md:block">
        <div className="text-2xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
          MyPlug<span className="text-blue-600">Admin</span>
        </div>
        <nav className="space-y-4">
          <Link href="/admin" className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600">
            <Boxes size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/products/new" className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600">
            <Package size={20} />
            <span>Add Product</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link href="/admin/preorders" className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600">
            <ClipboardList size={20} />
            <span>Preorders</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <AdminToastListener />
        {/* Mobile top nav (sidebar is hidden on small screens) */}
        <div className="md:hidden sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-neutral-100/70 dark:bg-neutral-900/70 backdrop-blur-xl border-b border-neutral-200/70 dark:border-neutral-800/70 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
              MyPlug<span className="text-blue-600">Admin</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Link href="/admin" className="hover:text-blue-600">Dashboard</Link>
              <Link href="/admin/products" className="hover:text-blue-600">Products</Link>
              <Link href="/admin/orders" className="hover:text-blue-600">Orders</Link>
              <Link href="/admin/preorders" className="hover:text-blue-600">Preorders</Link>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}