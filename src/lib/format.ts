const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

/** Date-only frontmatter stays at noon so the calendar day does not shift. */
function parseEditorialDate(iso: string) {
  const value = iso.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00-03:00`);
  }
  return new Date(value);
}

export function formatDate(iso: string) {
  return dateFormatter.format(parseEditorialDate(iso));
}

export function formatShortDate(iso: string) {
  return shortDateFormatter.format(parseEditorialDate(iso));
}

const todayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export function formatToday(date = new Date()) {
  return todayFormatter.format(date);
}

/**
 * News sitemap / JSON-LD timestamp.
 * A date-only MDX value stays at 08:00 America/Sao_Paulo — we do not invent
 * a clock time. A full timestamp is kept and normalized to -03:00.
 */
export function toIsoDate(iso: string) {
  const value = iso.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T08:00:00-03:00`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return `${value.slice(0, 10)}T08:00:00-03:00`;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsed);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}-03:00`;
}

export function readingTimeMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function readingTimeLabel(minutes: number) {
  return minutes === 1 ? "1 min de leitura" : `${minutes} min de leitura`;
}
