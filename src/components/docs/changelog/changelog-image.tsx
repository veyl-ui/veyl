
"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./changelog.css";

interface ChangelogImageProps {
  src?: string;
  images?: string[];
  alt: string;
}

const frame =
  "relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface";

function resolveImagePath(src: string) {
  if (src.startsWith("/") || src.startsWith("http")) return src;
  return `/changelog/${src}`;
}

export function ChangelogImage({
  src,
  images,
  alt,
}: ChangelogImageProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const imageList = images?.length ? images : src ? [src] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const validImages = imageList
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => !failedImages.includes(index));

  if (validImages.length === 0) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          frame,
          "bg-[radial-gradient(60%_70%_at_50%_100%,color-mix(in_srgb,var(--brand)_18%,transparent),transparent)]"
        )}
      />
    );
  }

  const openImage = (index: number) => {
    setActiveIndex(index);
    dialog.current?.showModal();
  };

  const navigate = (direction: number) => {
    const currentPosition = validImages.findIndex(
      ({ index }) => index === activeIndex
    );

    const nextPosition =
      (currentPosition + direction + validImages.length) %
      validImages.length;

    setActiveIndex(validImages[nextPosition].index);
  };

  return (
    <>
      {/* Image Gallery */}
      <div
        className={cn(
          "grid gap-3",
          validImages.length === 1
            ? "grid-cols-1"
            : validImages.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
        )}
      >
        {validImages.map(({ image, index }) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => openImage(index)}
            aria-label={`View image ${index + 1} of ${imageList.length}: ${alt}`}
            className={cn(
              frame,
              "group block cursor-zoom-in p-0 shadow-[0_20px_40px_-28px_rgb(0_0_0/0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_28px_48px_-26px_rgb(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImagePath(image)}
              alt={`${alt} - Image ${index + 1}`}
              loading="lazy"
              onError={() =>
                setFailedImages((prev) => [...prev, index])
              }
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />

            <span className="absolute bottom-3 right-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              View larger
            </span>
          </button>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <dialog
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.close();
          }
        }}
        aria-label={alt}
        className="cl-dialog m-auto max-h-[92vh] max-w-[min(1200px,94vw)] bg-transparent p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImagePath(imageList[activeIndex])}
            alt={`${alt} - Image ${activeIndex + 1}`}
            className="max-h-[88vh] w-auto max-w-full rounded-xl border border-white/10 shadow-2xl"
          />

          {/* Close */}
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-border bg-background text-foreground shadow-md transition-transform hover:scale-110"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Previous / Next */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Previous image"
                className="absolute left-3 grid size-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-transform hover:scale-110"
              >
                &#8592;
              </button>

              <button
                type="button"
                onClick={() => navigate(1)}
                aria-label="Next image"
                className="absolute right-3 grid size-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-transform hover:scale-110"
              >
                &#8594;
              </button>

              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                {validImages.findIndex(({ index }) => index === activeIndex) + 1}
                {" / "}
                {validImages.length}
              </span>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
