import { db } from "@/lib/db";
import ProductCarousel from "@/components/product/product-carousel";
import TestimonialSection from "@/components/ui/testimonial-section";
import Image from "next/image";

export const revalidate = 0; // Ensure we always see the latest products

export default async function HomePage() {
  const [featuredProductsRaw, latestProducts, latestReviews] = await Promise.all([
    db.product.findMany({
      take: 8,
      where: { isArchived: false, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      take: 8,
      where: { isArchived: false },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.review.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  // Fallback: If no featured products, use latest products instead
  const featuredProducts = featuredProductsRaw.length > 0 ? featuredProductsRaw : latestProducts;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200/70 dark:border-neutral-800/70">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-48 right-0 h-96 w-96 rounded-full bg-gradient-to-l from-blue-600/15 to-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-0 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="inline-flex items-center rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/60 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                New drops weekly • Canada shipping
              </p>

              <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Discover your next
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  favorite pair
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Curated sneaker releases with real-time stock and fast checkout. Browse our collection to find your perfect pair.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Shop Now
                </a>
                <a
                  href="/shop?gender=MEN"
                  className="inline-flex items-center justify-center rounded-full border-2 border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-black/60 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white font-semibold px-8 py-4 text-base backdrop-blur-sm transition-all"
                >
                  Browse Collection
                </a>
              </div>
            </div>

            {/* Hero Sneaker Image */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-2xl mx-auto">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 rounded-3xl blur-3xl transform rotate-6" />
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-full blur-2xl" />
                    <Image
                      src="/sneaker2.png"
                      alt="Sneaker"
                      fill
                      className="object-contain object-center p-4 drop-shadow-2xl"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-2xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductCarousel title="Top Selling" products={featuredProducts} />

      <TestimonialSection reviews={latestReviews} />
    </div>
  );
}