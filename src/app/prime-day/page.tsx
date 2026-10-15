import { EventGuide } from "@/components/deals/event-guide";
import { dealEvent } from "@/lib/deals";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

const event = dealEvent("prime-day");

export const metadata: Metadata = buildPageMetadata({
  title: event.documentTitle,
  description: event.description,
  path: event.path,
  brand: "auto",
  imagePath: event.cover,
  imageAlt: event.coverAlt,
});

export default function Page() {
  return <EventGuide event={event} />;
}
