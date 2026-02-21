import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const category = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/categories" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    date: z.coerce.date(),
    image: z.string(),
    published: z.boolean(),
    featured: z.boolean(),
    youtubeId: z.string().optional(),
    reading_time: z.number().optional(),
    categories: z.array(z.string()).min(1),
  }),
});

const product = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(["product", "package", "project", "open-source"]),
    thumbnail: z.string().optional(),
    link: z.string(),
    isExternal: z.boolean(),
    featured: z.boolean(),
    listOrder: z.number(),
    price: z.number(),
    tech: z.array(z.string()),
  }),
});

const video = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string(),
    categories: z.string(),
    date: z.coerce.date(),
    featured: z.boolean(),
    youtubeUrl: z.string(),
  }),
});

export const collections = { category, blog, product, video };
