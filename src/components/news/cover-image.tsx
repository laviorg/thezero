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
};

export function CoverImage({
  src,
  alt,
  credit,
  priority = false,
  sizes = "100vw",
  className,
  crop = false,
}: CoverImageProps) {
  return (
    <figure className={cn("block", className)}>
      {crop ? (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes={sizes}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1960}
          height={1400}
          priority={priority}
          className="h-auto w-full rounded-xl bg-surface"
          sizes={sizes}
        />
      )}
      {credit ? (
        <figcaption className="mt-2 text-sm text-muted italic">{credit}</figcaption>
      ) : null}
    </figure>
  );
}
