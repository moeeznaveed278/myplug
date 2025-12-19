"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePreorderStatus(preorderId: string, status: string) {
  try {
    // Validate status
    if (!["PENDING", "CONTACTED", "CLOSED"].includes(status)) {
      return { success: false, message: "Invalid status" };
    }

    await db.preorder.update({
      where: { id: preorderId },
      data: { status },
    });

    revalidatePath("/admin/preorders");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update preorder status" };
  }
}

