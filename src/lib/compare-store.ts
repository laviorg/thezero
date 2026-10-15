/** Seleção do comparador: até 3 portáteis, guardada no localStorage. */
const KEY = "tz-compare";
export const MAX_COMPARE = 3;

export function readCompare(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function writeCompare(list: string[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_COMPARE)));
  window.dispatchEvent(new Event("tz-compare"));
}
