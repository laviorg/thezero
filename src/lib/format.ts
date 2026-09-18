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

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(`${iso}T12:00:00-03:00`));
}

export function formatShortDate(iso: string) {
  return shortDateFormatter.format(new Date(`${iso}T12:00:00-03:00`));
}

export function toIsoDate(iso: string) {
  return `${iso}T08:00:00-03:00`;
}

export function readingTimeMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function readingTimeLabel(minutes: number) {
  return minutes === 1 ? "1 min de leitura" : `${minutes} min de leitura`;
}
