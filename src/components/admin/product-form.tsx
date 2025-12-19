"use client";

import { createProduct } from "@/actions/create-product";
import { updateProduct } from "@/actions/update-product";
import ImageUpload from "@/components/ui/image-upload";
import type { Product, Size } from "@prisma/client";
import { useActionState, useMemo, useState } from "react";

type GenderValue = "MEN" | "WOMEN" | "KIDS" | "UNISEX";
type ProductTypeValue = "SHOES" | "CLOTHING" | "ACCESSORIES";

type FormState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    gender?: string[];
    productType?: string[];
    imageUrl?: string[];
  };
  message?: string;
} | undefined;

export type ProductFormProps = {
  initialData?: (Product & { sizes?: Size[] }) | null;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const isEdit = !!initialData;
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [sizes, setSizes] = useState<Array<{ value: string; quantity: number }>>(
    (initialData?.sizes ?? []).map((s) => ({ value: s.value, quantity: s.quantity }))
  );
  const initialGender = (((initialData as any)?.gender as GenderValue) ?? "MEN") as GenderValue;
  const initialProductType = (((initialData as any)?.productType as ProductTypeValue) ?? "SHOES") as ProductTypeValue;

  const actionFn = useMemo(() => {
    if (initialData?.id) return updateProduct.bind(null, initialData.id) as unknown as (s: FormState, f: FormData) => Promise<FormState>;
    return createProduct as unknown as (s: FormState, f: FormData) => Promise<FormState>;
  }, [initialData?.id]);

  const [state, action, isPending] = useActionState<FormState, FormData>(actionFn, undefined);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form action={action} className="space-y-6 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 shadow-sm">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            name="name"
            type="text"
            placeholder="Air Jordan 1 Retro"
            defaultValue={initialData?.name ?? ""}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            name="gender"
            defaultValue={initialGender}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
            <option value="UNISEX">Unisex</option>
          </select>
          {state?.errors?.gender && <p className="text-red-500 text-sm mt-1">{state.errors.gender}</p>}
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Type</label>
          <select
            name="productType"
            defaultValue={initialProductType}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="SHOES">Shoes</option>
            <option value="CLOTHING">Clothing</option>
            <option value="ACCESSORIES">Accessories/Bags</option>
          </select>
          {state?.errors?.productType && <p className="text-red-500 text-sm mt-1">{state.errors.productType}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price (CAD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="199.99"
            defaultValue={initialData?.price ?? ""}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {state?.errors?.price && <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Product details..."
            defaultValue={initialData?.description ?? ""}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {state?.errors?.description && <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>

          {images.map((url) => (
            <input key={url} type="hidden" name="imageUrl" value={url} />
          ))}

          <ImageUpload
            disabled={isPending}
            value={images}
            onChange={(url) => setImages((prev) => (prev.includes(url) ? prev : [...prev, url]))}
            onRemove={(url) => setImages((prev) => prev.filter((x) => x !== url))}
          />

          {state?.errors?.imageUrl && <p className="text-red-500 text-sm mt-1">{state.errors.imageUrl}</p>}
        </div>

        {/* Featured Product */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            defaultChecked={initialData?.isFeatured ?? false}
            className="h-5 w-5 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer">
            Featured Product (Show in Top Selling carousel)
          </label>
        </div>

        {/* Sizes & Stock */}
        <div>
          <label className="block text-sm font-medium mb-2">Sizes & Stock</label>

          {/* Submit sizes as JSON for the server action */}
          <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />

          {sizes.length === 0 ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">No sizes added yet.</p>
          ) : (
            <div className="space-y-3">
              {sizes.map((s, idx) => (
                <div key={`${s.value}-${idx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSizes((prev) => prev.map((x, i) => (i === idx ? { ...x, value: v } : x)));
                      }}
                      placeholder='e.g. "US 10"'
                      className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(s.quantity) ? s.quantity : 0}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        setSizes((prev) => prev.map((x, i) => (i === idx ? { ...x, quantity: Number.isFinite(q) ? q : 0 } : x)));
                      }}
                      placeholder="Qty"
                      className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setSizes((prev) => prev.filter((_, i) => i !== idx))}
                      className="w-full inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setSizes((prev) => [...prev, { value: "", quantity: 0 }])}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 transition"
            >
              Add Size
            </button>
          </div>
        </div>

        <div className="pt-4">
          {state?.message && <p className="text-red-500 mb-2">{state.message}</p>}
          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full transition-all disabled:opacity-50 shadow-sm"
          >
            {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}


