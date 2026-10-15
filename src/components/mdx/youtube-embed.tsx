/**
 * Vídeo do YouTube em modo privacidade (youtube-nocookie), responsivo, sem autoplay,
 * com JSON-LD VideoObject. Uso no MDX:
 * <YouTube id="ID" title="..." description="..." uploadDate="2026-10-15" />
 */
export function YouTube({
  id,
  title,
  description,
  uploadDate,
}: {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
}) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate,
    embedUrl,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
  };
  return (
    <figure className="youtube-embed not-prose my-8">
      <div className="relative w-full overflow-hidden rounded-md border border-border bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={`${embedUrl}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
      <figcaption className="mt-2 text-sm text-muted">{title} · vídeo no YouTube</figcaption>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
    </figure>
  );
}
