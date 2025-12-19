import { db } from "@/lib/db";
import ProductCard from "@/components/product/product-card";
import ProductFilters from "@/components/product/product-filters";
import FilterSidebar from "@/components/shop/filter-sidebar";
import MobileFilterButton from "@/components/shop/mobile-filter-button";
import type { Metadata } from "next";

export const revalidate = 0; // Ensure we always see the latest products

interface ShopPageProps {
  searchParams?: Promise<{ 
    gender?: string;
    type?: string;
    size?: string;
    search?: string;
    categoryId?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const gender = sp?.gender;

  let title = "Shop All Products";
  let description = "Browse our complete collection of sneakers, streetwear, and accessories.";

  if (gender === "MEN") {
    title = "Men's Sneakers & Clothing";
    description = "Shop the latest men's sneakers, streetwear, and accessories. Exclusive drops and limited editions.";
  } else if (gender === "WOMEN") {
    title = "Women's Collection";
    description = "Discover women's sneakers, streetwear, and fashion-forward accessories. Latest trends and exclusive releases.";
  } else if (gender === "KIDS") {
    title = "Kids' Collection";
    description = "Find the perfect sneakers and streetwear for kids. Comfortable, stylish, and built to last.";
  } else if (gender === "UNISEX") {
    title = "Unisex Collection";
    description = "Browse our unisex sneakers and streetwear collection. Perfect for everyone.";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function getGenderLabel(gender: string | undefined): string {
  switch (gender) {
    case "MEN":
      return "Men's Collection";
    case "WOMEN":
      return "Women's Collection";
    case "KIDS":
      return "Kids' Collection";
    case "UNISEX":
      return "Unisex Collection";
    default:
      return "All Products";
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const gender = sp?.gender;
  const type = sp?.type;
  const size = sp?.size;
  const search = typeof sp?.search === "string" ? sp.search : "";
  const categoryId = typeof sp?.categoryId === "string" ? sp.categoryId : "";

  // Build where clause
  const where: any = { isArchived: false };
  if (gender && (gender === "MEN" || gender === "WOMEN" || gender === "KIDS" || gender === "UNISEX")) {
    where.gender = gender;
  }
  if (type && (type === "SHOES" || type === "CLOTHING" || type === "ACCESSORIES")) {
    where.productType = type;
  }
  if (size) {
    where.sizes = {
      some: {
        value: size,
      },
    };
  }
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Fetch products and categories
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const categoryLabel = getGenderLabel(gender);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              {categoryLabel}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {products.length} product{products.length === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MobileFilterButton />
          </div>
        </div>

        <div className="mb-8">
          <ProductFilters categories={categories} basePath="/shop" />
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar />

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-10 text-center">
                <p className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  No products found.
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Try adjusting your search or clearing filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

