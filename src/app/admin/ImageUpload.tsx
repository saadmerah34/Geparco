"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

export function ImageUpload({ defaultUrl = "" }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("uploading");
    setError(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setUrl(blob.url);
      setStatus("idle");
    } catch (err) {
      setError(
        (err as Error).message.includes("Not authorized")
          ? "Your session expired — sign in again."
          : "Upload failed. Try a smaller JPG or PNG.",
      );
      setStatus("error");
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="text-xs font-medium text-muted">
        Photo <span className="font-normal">(optional — JPG or PNG)</span>
      </span>

      <input type="hidden" name="imageUrl" value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div className="mt-1 flex items-center gap-3">
        {url ? (
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
            <Image
              src={url}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </span>
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-2xl text-muted">
            🖼️
          </span>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-background disabled:opacity-50"
          >
            {status === "uploading"
              ? "Uploading…"
              : url
                ? "Replace photo"
                : "Choose photo"}
          </button>
          {url && status !== "uploading" && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-danger"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
