"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const preorderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  instagram: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  productImage: z.string().url("Product image must be a valid URL"),
  size: z.string().min(1, "Size is required"),
});

export type PreorderFormState = {
  errors?: {
    customerName?: string[];
    phoneNumber?: string[];
    instagram?: string[];
    productName?: string[];
    productImage?: string[];
    size?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;

export async function createPreorder(prevState: PreorderFormState, formData: FormData): Promise<PreorderFormState> {
  const rawData = {
    customerName: formData.get("customerName"),
    phoneNumber: formData.get("phoneNumber"),
    instagram: formData.get("instagram"),
    productName: formData.get("productName"),
    productImage: formData.get("productImage"),
    size: formData.get("size"),
  };

  const validatedFields = preorderSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Preorder.",
    };
  }

  const { customerName, phoneNumber, instagram, productName, productImage, size } = validatedFields.data;

  try {
    await db.preorder.create({
      data: {
        customerName,
        phoneNumber,
        instagram: instagram || null,
        productName,
        productImage,
        size,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error) {
    return { message: "Database Error: Failed to create preorder" };
  }
}

