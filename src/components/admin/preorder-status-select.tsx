"use client";

import { updatePreorderStatus } from "@/actions/update-preorder-status";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface PreorderStatusSelectProps {
  preorderId: string;
  currentStatus: string;
}

export default function PreorderStatusSelect({ preorderId, currentStatus }: PreorderStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const statuses = [
    { value: "PENDING", label: "Pending", color: "yellow" },
    { value: "CONTACTED", label: "Contacted", color: "green" },
    { value: "CLOSED", label: "Completed", color: "blue" },
  ];

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const res = await updatePreorderStatus(preorderId, newStatus);
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to update status.");
        return;
      }
      toast.success("Status updated successfully.");
      setIsOpen(false);
      router.refresh();
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160, // 160px is dropdown width (w-40)
      });
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const currentStatusObj = statuses.find((s) => s.value === currentStatus) || statuses[0];

  const dropdownContent = useMemo(() => {
    if (!isOpen || !mounted) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
        <div
          className="fixed z-[9999] w-40 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black shadow-xl overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {statuses.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => {
                if (status.value === currentStatus) {
                  setIsOpen(false);
                  return;
                }
                startTransition(async () => {
                  const res = await updatePreorderStatus(preorderId, status.value);
                  if (!res?.success) {
                    toast.error(res?.message ?? "Failed to update status.");
                    return;
                  }
                  toast.success("Status updated successfully.");
                  setIsOpen(false);
                  router.refresh();
                });
              }}
              disabled={isPending || status.value === currentStatus}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                status.value === currentStatus
                  ? "bg-neutral-100 dark:bg-neutral-900 font-semibold"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between`}
            >
              <span>{status.label}</span>
              {status.value === currentStatus && (
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </>
    );
  }, [isOpen, mounted, position, statuses, currentStatus, isPending, preorderId, router]);

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
            currentStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
              : currentStatus === "CONTACTED"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40"
          } disabled:opacity-50`}
        >
          {currentStatusObj.label}
          {isPending ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <span className="text-[10px]">▼</span>
          )}
        </button>
      </div>
      {mounted && dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}

