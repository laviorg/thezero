import type { Category, Subcategory } from "@/lib/categories";
import Link from "next/link";

/**
 * One contextual link to the desk the story belongs to, after the body.
 * Anchor text is the hub label readers already see — not a keyword list.
 */
export function ArticleDeskLinks({
  category,
  subcategory,
}: {
  category: Category;
  subcategory?: Subcategory;
}) {
  const blurb = subcategory?.description ?? category.description;

  return (
    <nav className="story-desk" aria-label={`Mais em ${category.label}`}>
      <p className="story-pager-label">Nesta editoria</p>
      <p className="story-desk-links">
        {subcategory ? (
          <Link href={subcategory.href}>{subcategory.label}</Link>
        ) : null}
        {subcategory ? (
          <span className="story-desk-dot" aria-hidden>
            ·
          </span>
        ) : null}
        <Link href={category.href}>Tudo em {category.label}</Link>
      </p>
      <p className="story-desk-blurb">{blurb}</p>
    </nav>
  );
}
