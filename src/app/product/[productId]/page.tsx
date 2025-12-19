import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductInfo } from "@/components/product/product-info";
import type { Metadata } from "next";

// --- THIS LINE WAS MISSING ---
// Regular expression to check for a valid 24-character hex string (MongoDB ObjectId)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// --- END FIX ---

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  
  if (!objectIdRegex.test(productId)) {
    return {
      title: "Product Not Found",
    };
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      name: true,
      brand: true,
      description: true,
      images: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = product.description.substring(0, 160);
  const title = `${product.name} - ${product.brand}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params in Next.js 15+
  const { productId } = await params;
  
  // Now this check will work correctly
  if (!objectIdRegex.test(productId)) {
    return notFound();
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      sizes: true,
      category: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const priceLabel = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(product.price);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-black shadow-sm overflow-hidden">
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 sm:p-6 shadow-sm">
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                {product.category?.name || "Sneakers"}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-extrabold text-neutral-900 dark:text-white">{priceLabel}</p>
            </div>

            <div className="mt-6">
              <ProductInfo product={product} />
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-5 sm:p-6">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}