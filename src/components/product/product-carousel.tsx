"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Product } from "@prisma/client";
import ProductCard from "@/components/product/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProductWithCategory = Product & {
  category: Category | null;
};

export default function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: ProductWithCategory[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  if (products.length === 0) return null;

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const isAtStart = scrollLeft <= 10;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    
    setShowLeftFade(!isAtStart);
    setShowRightFade(!isAtEnd);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);
    
    // Check on resize
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Scroll by 300px
    const newScrollLeft = 
      direction === "left" 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Handpicked favorites from our collection
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Left Navigation Button */}
        {showLeftFade && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg hover:bg-white dark:hover:bg-black transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-900 dark:text-white" />
          </button>
        )}

        {/* Right Navigation Button */}
        {showRightFade && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg hover:bg-white dark:hover:bg-black transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-neutral-900 dark:text-white" />
          </button>
        )}

        {/* Gradient fade edges - always present but with opacity control */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black via-white/60 dark:via-black/60 to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
            showLeftFade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div 
          className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black via-white/60 dark:via-black/60 to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
        />

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-hide -mx-4 px-4 scroll-smooth"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-center min-w-[280px] w-[280px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


