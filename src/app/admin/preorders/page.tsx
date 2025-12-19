import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import DeletePreorderButton from "@/components/admin/delete-preorder-button";
import PreorderStatusSelect from "@/components/admin/preorder-status-select";

export default async function AdminPreordersPage() {
  const preorders = await db.preorder.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (preorders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Preorders</h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">No preorder requests found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Preorders</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {preorders.length} request{preorders.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-950">
            <tr className="text-left text-neutral-600 dark:text-neutral-300">
              <th className="px-4 py-3 font-medium">Image/Product</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {preorders.map((preorder) => {
              const date = new Date(preorder.createdAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={preorder.id} className="text-neutral-800 dark:text-neutral-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                        <Image
                          src={preorder.productImage}
                          alt={preorder.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {preorder.productName}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Size: {preorder.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{preorder.customerName}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a
                        href={`tel:${preorder.phoneNumber}`}
                        className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                      >
                        {preorder.phoneNumber}
                      </a>
                      {preorder.instagram && (
                        <a
                          href={`https://instagram.com/${preorder.instagram.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-xs"
                        >
                          @{preorder.instagram.replace(/^@/, "")}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">{date}</td>
                  <td className="px-4 py-3">
                    <PreorderStatusSelect preorderId={preorder.id} currentStatus={preorder.status} />
                  </td>
                  <td className="px-4 py-3">
                    <DeletePreorderButton preorderId={preorder.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 sm:hidden">
        {preorders.map((preorder) => {
          const date = new Date(preorder.createdAt).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={preorder.id}
              className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-4 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                  <Image
                    src={preorder.productImage}
                    alt={preorder.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {preorder.productName}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Size: {preorder.size}</p>
                  <div className="mt-2">
                    <PreorderStatusSelect preorderId={preorder.id} currentStatus={preorder.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400">Customer</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{preorder.customerName}</p>
                </div>
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400">Contact</p>
                  <a
                    href={`tel:${preorder.phoneNumber}`}
                    className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    {preorder.phoneNumber}
                  </a>
                  {preorder.instagram && (
                    <a
                      href={`https://instagram.com/${preorder.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-xs mt-1"
                    >
                      @{preorder.instagram.replace(/^@/, "")}
                    </a>
                  )}
                </div>
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400">Date</p>
                  <p className="text-neutral-900 dark:text-neutral-100">{date}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <DeletePreorderButton preorderId={preorder.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

