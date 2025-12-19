"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  try {
    // Prefer soft-delete so we don't break past orders that reference this product.
    await db.product.update({
      where: { id: productId },
      data: { isArchived: true },
    });
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_PRODUCT_ERROR]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message: `Database Error: Failed to delete product (${message})` };
  }
}


