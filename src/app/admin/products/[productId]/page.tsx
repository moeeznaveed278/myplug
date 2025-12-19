import ProductForm from "@/components/admin/product-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { sizes: true },
  });

  if (!product) return notFound();

  return <ProductForm initialData={product} />;
}


