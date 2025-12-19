"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import FilterSidebar from "./filter-sidebar";

export default function MobileFilterButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>
      <FilterSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} mobileOnly />
    </>
  );
}

