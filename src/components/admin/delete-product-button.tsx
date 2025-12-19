"use client";

import { deleteProduct } from "@/actions/delete-product";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const res = await deleteProduct(productId);
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to delete product.");
        return;
      }
      toast.success("Product deleted.");
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsConfirmOpen(true)}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete this product?"
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



