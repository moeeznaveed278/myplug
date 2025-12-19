"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const TOAST_MESSAGES: Record<string, { type: "success" | "error"; message: string }> = {
  created: { type: "success", message: "Product created." },
  updated: { type: "success", message: "Product updated." },
  deleted: { type: "success", message: "Product deleted." },
};

export default function AdminToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key) return;
    if (lastKeyRef.current === key) return;

    lastKeyRef.current = key;

    const config = TOAST_MESSAGES[key];
    if (config) {
      if (config.type === "success") toast.success(config.message);
      else toast.error(config.message);
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}




