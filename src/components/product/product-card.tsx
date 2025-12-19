"use client";

import Image from "next/image";
import Link from "next/link";
// 1. Import Category too
import { Product, Category } from "@prisma/client";

// 2. Define a new type that includes the relation
type ProductWithCategory = Product & {
  category: Category | null;
};

interface ProductCardProps {
  // 3. Use the new type here
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceLabel = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-black shadow-sm overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
          {product.category?.name ? (
            <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-end">
              <span className="inline-flex items-center rounded-full bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-neutral-100 text-[11px] px-2.5 py-1 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/60">
                {product.category.name}
              </span>
            </div>
          ) : null}
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {product.category?.name || "Sneakers"}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{priceLabel}</p>
            <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition">View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}