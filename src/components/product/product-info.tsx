"use client";

import { Product, Size } from "@prisma/client";
import { useState, useMemo } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import PreorderModal from "./preorder-modal";

interface ProductInfoProps {
  product: Product & {
    sizes: Size[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  // If there are no sizes, default to a value. Otherwise, start with null.
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 0 ? "One Size" : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isPreorderModalOpen, setIsPreorderModalOpen] = useState(false);
  const cart = useCart();

  // Determine if selected size is out of stock (preorder)
  const isPreorder = useMemo(() => {
    if (!selectedSize || product.sizes.length === 0) return false;
    const selectedSizeObj = product.sizes.find((s) => s.value === selectedSize);
    return selectedSizeObj ? selectedSizeObj.quantity === 0 : false;
  }, [selectedSize, product.sizes]);

  const onAddToCart = () => {
    // This check is now robust for both cases
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    const maxAvailable =
      product.sizes.length === 0
        ? 10
        : product.sizes.find((s) => s.value === selectedSize)?.quantity ?? 0;

    if (product.sizes.length > 0 && maxAvailable <= 0) {
      toast.error("Selected size is out of stock.");
      return;
    }

    const existingQty =
      cart.items.find((i) => i.id === product.id && i.selectedSize === selectedSize)?.quantity ?? 0;
    const remaining = Math.max(0, maxAvailable - existingQty);

    if (remaining <= 0) {
      toast.error(`Only ${maxAvailable} left in stock for this size.`);
      return;
    }

    const desired = Math.max(1, Math.floor(quantity));
    const qtyToAdd = Math.min(desired, remaining);

    cart.addItem(product, selectedSize, qtyToAdd, maxAvailable);
    toast.success(`Added ${qtyToAdd} × ${product.name} (Size: ${selectedSize}) to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
          Select Size
        </h3>
        
        {product.sizes.length === 0 ? (
           <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 text-center border border-neutral-200/70 dark:border-neutral-800/70">
             This item is one size.
           </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <span key={`${size.id}-wrap`} className="contents">
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size.value);
                  setQuantity(1);
                }}
                className={cn(
                  "py-3 text-sm font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 relative",
                  selectedSize === size.value 
                    ? size.quantity === 0
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-sm"
                      : "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : size.quantity === 0
                    ? "border-orange-500/50 bg-white text-neutral-900 hover:border-orange-500 hover:bg-orange-50/50 dark:border-orange-500/50 dark:bg-black dark:text-white dark:hover:bg-orange-950/30"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:hover:bg-neutral-900"
                )}
              >
                {size.value}
                {size.quantity === 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/50 px-1.5 py-0.5 rounded">
                    Preorder
                  </span>
                )}
              </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preorder Note - Show when preorder is selected */}
      {isPreorder && (
        <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            ⏱️ Preorder Notice
          </p>
          <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
            This size is currently out of stock. Estimated delivery: Around 2 weeks. We will contact you once the item is available.
          </p>
        </div>
      )}

      {/* Quantity - Only show if not preorder */}
      {!isPreorder && (
        <div>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Quantity</h3>

          <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-black/30 px-3 py-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!selectedSize || quantity <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="min-w-10 text-center text-sm font-semibold text-neutral-900 dark:text-white">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => {
                const max =
                  product.sizes.length === 0
                    ? 10
                    : selectedSize
                      ? product.sizes.find((s) => s.value === selectedSize)?.quantity ?? 1
                      : 1;
                const existingQty =
                  selectedSize
                    ? cart.items.find((i) => i.id === product.id && i.selectedSize === selectedSize)?.quantity ?? 0
                    : 0;
                const remaining = Math.max(1, max - existingQty);
                setQuantity((q) => Math.min(remaining, q + 1));
              }}
              disabled={
                !selectedSize ||
                (() => {
                  const max =
                    product.sizes.length === 0
                      ? 10
                      : selectedSize
                        ? product.sizes.find((s) => s.value === selectedSize)?.quantity ?? 1
                        : 1;
                  const existingQty =
                    selectedSize
                      ? cart.items.find((i) => i.id === product.id && i.selectedSize === selectedSize)?.quantity ?? 0
                      : 0;
                  const remaining = Math.max(0, max - existingQty);
                  return quantity >= Math.max(1, remaining);
                })()
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {!selectedSize && product.sizes.length > 0 ? (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Select a size to set quantity.</p>
          ) : null}
        </div>
      )}

      {/* Add to Cart / Preorder Button */}
      {/* Mobile: fixed bottom bar so the primary action is always reachable */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-4 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="max-w-7xl mx-auto md:max-w-none">
          {isPreorder ? (
            <button
              onClick={() => setIsPreorderModalOpen(true)}
              disabled={!selectedSize}
              className={cn(
                "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "md:hover:scale-[1.02]"
              )}
            >
              <ShoppingBag size={20} />
              Preorder this Size
            </button>
          ) : (
            <button
              onClick={onAddToCart}
              disabled={product.sizes.length > 0 && !selectedSize}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "md:hover:scale-[1.02]"
              )}
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Spacer so mobile fixed bar doesn't cover content */}
      <div className="h-20 md:hidden" />

      {/* Preorder Modal */}
      {selectedSize && (
        <PreorderModal
          isOpen={isPreorderModalOpen}
          onClose={() => setIsPreorderModalOpen(false)}
          productName={product.name}
          productImage={product.images[0]}
          size={selectedSize}
        />
      )}
    </div>
  );
}