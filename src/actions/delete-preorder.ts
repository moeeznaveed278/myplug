"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePreorder(preorderId: string) {
  try {
    await db.preorder.delete({
      where: { id: preorderId },
    });

    revalidatePath("/admin/preorders");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete preorder" };
  }
}

