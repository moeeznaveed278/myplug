"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type CategoryOption = { id: string; name: string };

export default function ProductFilters({
  categories,
  basePath = "/shop",
}: {
  categories: CategoryOption[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Use current pathname if basePath not provided, otherwise use basePath
  const currentPath = basePath || pathname;

  const initialSearch = searchParams.get("search") ?? "";
  const initialCategoryId = searchParams.get("categoryId") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);

  // Keep local state in sync if the user navigates via back/forward.
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setCategoryId(initialCategoryId), [initialCategoryId]);

  const apply = useMemo(() => {
    return (next: { search?: string; categoryId?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const setOrDelete = (key: string, value: string | undefined) => {
        const v = (value ?? "").trim();
        if (v) params.set(key, v);
        else params.delete(key);
      };

      setOrDelete("search", next.search);
      setOrDelete("categoryId", next.categoryId);

      startTransition(() => {
        const qs = params.toString();
        router.replace(qs ? `${currentPath}?${qs}` : currentPath);
      });
    };
  }, [router, searchParams, currentPath]);

  return (
    <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-black/40 backdrop-blur-md p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Search</label>
          <input
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              apply({ search: v, categoryId });
            }}
            placeholder="Search products..."
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              const v = e.target.value;
              setCategoryId(v);
              apply({ search, categoryId: v });
            }}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setSearch("");
            setCategoryId("");
            apply({ search: "", categoryId: "" });
          }}
          className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-blue-600 disabled:opacity-50"
        >
          Clear filters
        </button>

        {isPending ? <span className="text-sm text-neutral-500">Updating…</span> : null}
      </div>
    </div>
  );
}


