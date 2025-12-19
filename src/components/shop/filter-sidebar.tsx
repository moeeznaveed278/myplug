"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

interface FilterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  mobileOnly?: boolean;
  basePath?: string;
}

export default function FilterSidebar({ isOpen = false, onClose, mobileOnly = false, basePath = "/shop" }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const type = searchParams.get("type") || "";
  const currentSize = searchParams.get("size") || "";

  // Determine which sizes to show based on product type
  const getSizes = () => {
    if (type === "CLOTHING") {
      return ["XS", "S", "M", "L", "XL", "XXL"];
    } else if (type === "SHOES") {
      return ["7", "8", "9", "10", "11", "12", "13", "14"];
    } else if (type === "ACCESSORIES") {
      return ["One Size"];
    } else {
      // No type selected - show both
      return ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "12", "13", "14"];
    }
  };

  const sizes = getSizes();

  const updateSize = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (size === currentSize) {
      // If clicking the same size, remove the filter
      params.delete("size");
    } else {
      params.set("size", size);
    }

    startTransition(() => {
      const qs = params.toString();
      router.replace(qs ? `${basePath}?${qs}` : basePath);
    });
  };

  const clearSize = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("size");
    
    startTransition(() => {
      const qs = params.toString();
      router.replace(qs ? `${basePath}?${qs}` : basePath);
    });
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Size Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Size</h3>
          {currentSize && (
            <button
              onClick={clearSize}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = currentSize === size;
            return (
              <button
                key={size}
                onClick={() => updateSize(size)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                    : "bg-white dark:bg-black text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500"
                } disabled:opacity-50`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Filter (only show on "All Products" - when no type is selected) */}
      {!type && (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Product Type</h3>
          <div className="space-y-2">
            {[
              { value: "SHOES", label: "Shoes" },
              { value: "CLOTHING", label: "Clothing" },
              { value: "ACCESSORIES", label: "Accessories" },
            ].map((typeOption) => (
              <label
                key={typeOption.value}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <input
                  type="checkbox"
                  checked={searchParams.get("type") === typeOption.value}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.checked) {
                      params.set("type", typeOption.value);
                    } else {
                      params.delete("type");
                    }
                    startTransition(() => {
                      const qs = params.toString();
                      router.replace(qs ? `${basePath}?${qs}` : basePath);
                    });
                  }}
                  className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{typeOption.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!mobileOnly && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 shadow-sm">
            {sidebarContent}
          </div>
        </aside>
      )}

      {/* Mobile Drawer */}
      {mobileOnly && isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </aside>
        </>
      )}
    </>
  );
}

