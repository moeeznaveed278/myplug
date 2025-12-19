"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  price: z.coerce.number().min(0, "Price must be positive"),
  gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]).default("MEN"),
  productType: z.enum(["SHOES", "CLOTHING", "ACCESSORIES"]).default("SHOES"),
  imageUrl: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
  isFeatured: z.preprocess((val) => val === "on" || val === true, z.boolean()).default(false),
  sizes: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val ?? [];
  }, z.array(
    z.object({
      value: z.string().min(1, "Size is required"),
      quantity: z.coerce.number().int().min(0, "Quantity must be 0 or more"),
    })
  )).default([]),
});

export type FormState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    gender?: string[];
    productType?: string[];
    imageUrl?: string[];
  };
  message?: string;
} | undefined;

export async function updateProduct(productId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const imageUrls = formData
    .getAll("imageUrl")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    gender: formData.get("gender"),
    productType: formData.get("productType"),
    imageUrl: imageUrls,
    isFeatured: formData.get("isFeatured"),
    sizes: formData.get("sizes"),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Product.",
    };
  }

  const { name, description, price, gender, productType, imageUrl, isFeatured, sizes } = validatedFields.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price,
          brand: "", // Empty string as default since brand is no longer required
          gender,
          productType,
          images: imageUrl,
          isFeatured,
        },
      });

      // Replace sizes with the submitted set (simple + predictable for admin edits)
      await tx.size.deleteMany({ where: { productId } });
      if (sizes.length > 0) {
        await tx.size.createMany({
          data: sizes.map((s) => ({
            productId,
            value: s.value,
            quantity: s.quantity,
          })),
        });
      }
    });
  } catch (error) {
    return { message: "Database Error: Failed to update product" };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}


