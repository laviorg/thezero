const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export type PublicationOrderItem = {
  /** Original frontmatter `date`. Date-only values have no clock. */
  date: string;
  /** Normalized America/Sao_Paulo timestamp from `toIsoDate`. */
  dateIso: string;
  slug: string;
};

function calendarDay(dateIso: string): string {
  return dateIso.slice(0, 10);
}

/** Clock time only when the author wrote one. Date-only stays timeless. */
function explicitTimestamp(date: string, dateIso: string): string | null {
  if (DATE_ONLY.test(date.trim())) return null;
  return dateIso;
}

/**
 * Newest publication first.
 *
 * 1. Calendar day in America/Sao_Paulo (`dateIso`, already normalized).
 * 2. Same day: later explicit timestamp wins. A real clock outranks a
 *    date-only value — we do not invent 08:00 and let it beat a morning time.
 * 3. No clock, or equal clocks: slug ascending. Deterministic, independent
 *    of filesystem order.
 */
export function comparePublicationRecency(
  a: PublicationOrderItem,
  b: PublicationOrderItem,
): number {
  const byDay = calendarDay(b.dateIso).localeCompare(calendarDay(a.dateIso));
  if (byDay !== 0) return byDay;

  const timeA = explicitTimestamp(a.date, a.dateIso);
  const timeB = explicitTimestamp(b.date, b.dateIso);
  if (timeA && timeB && timeA !== timeB) return timeB.localeCompare(timeA);
  if (timeA && !timeB) return -1;
  if (!timeA && timeB) return 1;

  return a.slug.localeCompare(b.slug);
}

export function selectMostRecentPublication<T extends PublicationOrderItem>(
  posts: readonly T[],
): T | undefined {
  if (posts.length === 0) return undefined;
  return [...posts].sort(comparePublicationRecency)[0];
}
