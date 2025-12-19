"use client";

import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { useCallback } from "react";

export type ImageUploadProps = {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

export default function ImageUpload({ disabled, onChange, onRemove, value }: ImageUploadProps) {
  const handleSuccess = useCallback(
    (results: CloudinaryUploadWidgetResults) => {
      const info: any = (results as any)?.info;
      const url =
        typeof info === "string" ? info : info?.secure_url || info?.secureUrl || info?.url;

      if (typeof url === "string" && url.length > 0) onChange(url);
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <Image src={url} alt="Uploaded image" fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                disabled={disabled}
                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md bg-black/70 text-white p-2 hover:bg-black/80 disabled:opacity-50"
                aria-label="Remove image"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleSuccess}
        onError={(error) => {
          // Helpful when uploads "finish" but nothing comes back
          console.error("Cloudinary upload error:", error);
        }}
        options={{
          multiple: true,
          maxFiles: 10,
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            disabled={disabled}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-50"
          >
            <ImagePlus className="h-5 w-5" />
            Upload images
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}


