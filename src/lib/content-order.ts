export type ContentSort = "priority" | "newest" | "oldest" | "alphabetical";

export const normalizeSearch = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();

const dateValue = (value?: string | null) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

export function sortContent<T extends { order?: number | null }>(
  items: T[],
  sort: ContentSort,
  title: (item: T) => string,
  date: (item: T) => string | null | undefined = () => null,
): T[] {
  const alphabetical = (a: T, b: T) => title(a).localeCompare(title(b), "pt-BR", { sensitivity: "base", numeric: true });
  const chronological = (a: T, b: T, oldest = false) => {
    const first = dateValue(date(a));
    const second = dateValue(date(b));
    if (first === null) return second === null ? 0 : 1;
    if (second === null) return -1;
    return oldest ? first - second : second - first;
  };
  return [...items].sort((a, b) => {
    if (sort === "alphabetical") return alphabetical(a, b);
    if (sort === "newest" || sort === "oldest") return chronological(a, b, sort === "oldest") || alphabetical(a, b);
    const first = typeof a.order === "number" && Number.isFinite(a.order) ? a.order : null;
    const second = typeof b.order === "number" && Number.isFinite(b.order) ? b.order : null;
    if (first === null && second !== null) return 1;
    if (first !== null && second === null) return -1;
    return (first !== null && second !== null ? first - second : 0) || chronological(a, b) || alphabetical(a, b);
  });
}
