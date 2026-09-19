import {
  WatermarkedPhoto,
  type PhotoWatermarkSize,
} from "@/components/brand/photo-watermark";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CoverImageProps = {
  src: string;
  alt: string;
  credit?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Crop to 16:9 for cards. Article heroes use `hero` instead. */
  crop?: boolean;
  watermarkSize?: PhotoWatermarkSize;
  /** Subtle zoom on card hover. Disabled when the user prefers reduced motion. */
  zoom?: boolean;
  /** Edge-to-edge on small screens (article covers). */
  flush?: boolean;
  /** Magazine hero: 3:2 on phones, 16:9 from lg up. */
  hero?: boolean;
};

export function CoverImage({
  src,
  alt,
  credit,
  priority = false,
  sizes = "100vw",
  className,
  crop = false,
  watermarkSize,
  zoom = false,
  flush = false,
  hero = false,
}: CoverImageProps) {
  const framed = crop || hero;
  const badge = watermarkSize ?? (crop && !hero ? "compact" : "default");

  return (
    <figure
      className={cn(
        "reveal-media block",
        priority && "reveal-immediate",
        className,
      )}
    >
      <WatermarkedPhoto
        size={badge}
        className={cn(
          hero && "aspect-[3/2] lg:aspect-video",
          crop && !hero && "aspect-video",
          flush && "rounded-none sm:rounded-md",
        )}
      >
        {framed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={cn(
              "object-cover",
              zoom &&
                "cover-zoom transition-transform duration-500 ease-out group-hover:scale-[1.03]",
            )}
            sizes={sizes}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1960}
            height={1400}
            priority={priority}
            className="h-auto w-full"
            sizes={sizes}
          />
        )}
      </WatermarkedPhoto>
      {credit ? (
        <figcaption
          className={cn(
            "cover-credit",
            hero && "cover-credit-hero",
            flush && "px-[var(--shell-gutter)] sm:px-0",
          )}
        >
          <span className="cover-credit-label">Foto</span>
          <span className="cover-credit-text">{credit}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
