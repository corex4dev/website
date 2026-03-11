import type { ImageMetadata } from "astro";
import type { CollectionEntry, CollectionKey } from "astro:content";

export type SeoOptions = {
  title?: string;
  description?: string;
  type?: "website" | "article" | "product";
  image?: ImageMetadata;
  keywords?: string[];
  overwriteKeywords?: boolean;
};

export type PaginatedCollection<C extends CollectionKey> = {
  items: CollectionEntry<C>[];
  total: number;
  totalPages: number;
};
