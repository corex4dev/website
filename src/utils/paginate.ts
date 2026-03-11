import type { PaginatedCollection } from "@/types";
import type { CollectionEntry, CollectionKey } from "astro:content";

export function paginateArray<C extends CollectionKey>(
  arr: CollectionEntry<C>[],
  page = 1,
  perPage = 12,
): PaginatedCollection<C> {
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return {
    items: arr.slice(start, start + perPage),
    total,
    totalPages,
  };
}
