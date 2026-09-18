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
}: CoverImageProps) {
  const badge = watermarkSize ?? (crop ? "compact" : "default");

  return (
    <figure className={cn("block", className)}>
      <WatermarkedPhoto
        size={badge}
        className={crop ? "aspect-video" : undefined}
      >
        {crop ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
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
        <figcaption className="mt-2 text-sm text-muted italic">{credit}</figcaption>
      ) : null}
    </figure>
  );
}
