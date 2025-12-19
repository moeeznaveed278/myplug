"use client";

import { deletePreorder } from "@/actions/delete-preorder";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";

export default function DeletePreorderButton({ preorderId }: { preorderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const res = await deletePreorder(preorderId);
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to delete preorder.");
        return;
      }
      toast.success("Preorder deleted.");
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsConfirmOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete"}
      </button>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete this preorder?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isLoading={isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onDelete();
        }}
      />
    </>
  );
}

