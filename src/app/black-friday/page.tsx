import { BlackFridayGuide } from "@/components/deals/black-friday-guide";
import { dealEvent } from "@/lib/deals";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

const event = dealEvent("black-friday");

export const metadata: Metadata = buildPageMetadata({
  title: event.documentTitle,
  description: event.description,
  path: event.path,
  brand: "auto",
  imagePath: event.cover,
  imageAlt: event.coverAlt,
});

export default function Page() {
  return <BlackFridayGuide event={event} />;
}
