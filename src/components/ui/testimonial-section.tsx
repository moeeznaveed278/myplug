import type { Product, Review } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

function clampRating(rating: number) {
  if (!Number.isFinite(rating)) return 0;
  return Math.max(0, Math.min(5, Math.floor(rating)));
}

export default function TestimonialSection({
  reviews,
}: {
  reviews: (Review & { product: Product })[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">What Our Customers Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => {
          const rating = clampRating(review.rating);
          const img = review.product.images?.[0];

          return (
            <div
              key={review.id}
              className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={[
                      "h-4 w-4",
                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-300 dark:text-neutral-700",
                    ].join(" ")}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm text-neutral-800 dark:text-neutral-200 italic">
                “{review.comment}”
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{review.userName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified Buyer</p>
                </div>

                <Link
                  href={`/product/${review.productId}`}
                  className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300 hover:text-blue-600 transition"
                >
                  <span className="inline-flex h-9 w-9 rounded-xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                    {img ? (
                      <Image src={img} alt={review.product.name} width={36} height={36} className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <span className="max-w-[10rem] truncate">
                    Purchased: <span className="font-semibold">{review.product.name}</span>
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


