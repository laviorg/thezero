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
  /** Crop to 16:9 for cards. Article pages keep the photo’s natural ratio. */
  crop?: boolean;
  watermarkSize?: PhotoWatermarkSize;
  /** Subtle zoom on card hover. Disabled when the user prefers reduced motion. */
  zoom?: boolean;
  /** Edge-to-edge on small screens (article covers). */
  flush?: boolean;
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
}: CoverImageProps) {
  const badge = watermarkSize ?? (crop ? "compact" : "default");

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
          crop && "aspect-video",
          flush && "rounded-none sm:rounded-md",
        )}
      >
        {crop ? (
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
            "mt-2 text-[0.8rem] leading-5 text-muted",
            flush && "px-[var(--shell-gutter)] sm:px-0",
          )}
        >
          <span className="font-medium tracking-[0.14em] text-muted/80 uppercase">
            Foto
          </span>
          <span className="mx-2 text-hairline" aria-hidden>
            /
          </span>
          <span className="italic">{credit}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
