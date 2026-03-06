import type { ImageMetadata } from "astro";

export type SeoOptions = {
  title?: string;
  description?: string;
  type?: "website" | "article" | "product";
  image?: ImageMetadata;
  keywords?: string[];
  overwriteKeywords?: boolean;
};
