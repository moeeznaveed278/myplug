"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  const content = useMemo(() => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[9999]">
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onCancel}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/90 dark:bg-black/70 backdrop-blur-xl shadow-xl"
          >
            <div className="p-5">
              <h2 id="confirm-dialog-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h2>
              {description ? (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 transition"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={[
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition",
                    destructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
                  ].join(" ")}
                >
                  {isLoading ? "Working..." : confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [open, onCancel, onConfirm, title, description, confirmText, cancelText, destructive, isLoading]);

  if (!mounted || !content) return null;

  return createPortal(content, document.body);
}


