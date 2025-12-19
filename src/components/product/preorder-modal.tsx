"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";
import { createPreorder, type PreorderFormState } from "@/actions/create-preorder";
import { useActionState } from "react";
import { toast } from "sonner";

interface PreorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  size: string;
}

export default function PreorderModal({
  isOpen,
  onClose,
  productName,
  productImage,
  size,
}: PreorderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [state, action, isPending] = useActionState<PreorderFormState, FormData>(createPreorder, undefined);

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

  // Handle success
  useEffect(() => {
    if (state?.success) {
      toast.success("Request Sent!");
      onClose();
    }
  }, [state?.success, onClose]);

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
            aria-labelledby="preorder-modal-title"
            className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/90 dark:bg-black/70 backdrop-blur-xl shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 id="preorder-modal-title" className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    Preorder Request
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    This size is currently out of stock. Fill this form and we will contact you.
                  </p>
                  <p className="mt-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                    ⏱️ Estimated delivery: Around 2 weeks
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

              {/* Preview */}
              <div className="mb-6 p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {productName}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Size: {size}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form action={action} className="space-y-4">
                <input type="hidden" name="productName" value={productName} />
                <input type="hidden" name="productImage" value={productImage} />
                <input type="hidden" name="size" value={size} />

                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  {state?.errors?.customerName && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.customerName[0]}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  {state?.errors?.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.phoneNumber[0]}</p>
                  )}
                </div>

                {/* Instagram */}
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Instagram <span className="text-neutral-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    placeholder="@username"
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  {state?.errors?.instagram && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.instagram[0]}</p>
                  )}
                </div>

                {/* Error Message */}
                {state?.message && !state.success && (
                  <p className="text-red-500 text-sm">{state.message}</p>
                )}

                {/* Submit Button */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {isPending ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isOpen, onClose, productName, productImage, size, state, action, isPending]);

  if (!mounted || !content) return null;

  return createPortal(content, document.body);
}

