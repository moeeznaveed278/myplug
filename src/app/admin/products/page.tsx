import DeleteProductButton from "@/components/admin/delete-product-button";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import FilterSidebar from "@/components/shop/filter-sidebar";
import MobileFilterButton from "@/components/shop/mobile-filter-button";
import ProductFilters from "@/components/product/product-filters";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
}

interface AdminProductsPageProps {
  searchParams?: Promise<{
    gender?: string;
    type?: string;
    size?: string;
    search?: string;
    categoryId?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
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
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        createdAt: true,
        _count: { select: { sizes: true } },
      },
    }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Products</h1>
          <div className="flex items-center gap-4">
            <MobileFilterButton />
            <Link
              href="/admin/products/new"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2"
            >
              Add Product
            </Link>
          </div>
        </div>
        <div className="mb-8">
          <ProductFilters categories={categories} basePath="/admin/products" />
        </div>
        <div className="flex gap-8">
          <FilterSidebar basePath="/admin/products" />
          <div className="flex-1">
            <p className="text-neutral-600 dark:text-neutral-400">No products found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Products</h1>
        <div className="flex items-center gap-4">
          <MobileFilterButton />
          <Link
            href="/admin/products/new"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 shadow-sm transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <ProductFilters categories={categories} basePath="/admin/products" />
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar basePath="/admin/products" />

        {/* Products Content */}
        <div className="flex-1">

          {/* Mobile cards */}
          <div className="space-y-4 sm:hidden">
        {products.map((p) => {
          const img = p.images?.[0];
          const sizesLabel = `${p._count.sizes} Sizes`;
          const date = new Date(p.createdAt).toLocaleDateString();
          return (
            <div key={p.id} className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                  {img ? <Image src={img} alt={p.name} fill className="object-cover" sizes="64px" /> : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{sizesLabel}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Created: {date}</p>
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{formatMoney(p.price)}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-950">
            <tr className="text-left text-neutral-600 dark:text-neutral-300">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock / Sizes</th>
              <th className="px-4 py-3 font-medium">Date Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {products.map((p) => {
              const img = p.images?.[0];
              const sizesLabel = `${p._count.sizes} Sizes`;
              const date = new Date(p.createdAt).toLocaleDateString();
              return (
                <tr key={p.id} className="text-neutral-800 dark:text-neutral-200">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                      {img ? (
                        <Image src={img} alt={p.name} fill className="object-cover" sizes="48px" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{formatMoney(p.price)}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{sizesLabel}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/products/${p.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Edit
                      </Link>
                      <DeleteProductButton productId={p.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        </div>
      </div>
    </div>
  );
}


