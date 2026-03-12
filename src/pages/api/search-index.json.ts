import type { SearchEntityType, SearchIndexItem } from "@/utils/search.service";
import type { APIContext } from "astro";
import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";

export const prerender = true;

export const GET = async (ctx: APIContext) => {
  const posts = await getCollection("blog");
  const products = await getCollection("product");
  const videos = await getCollection("video");

  const transformEntityToIndex = <T extends CollectionKey>(
    entity: CollectionEntry<T>,
  ): SearchIndexItem => {
    const content = entity.body
      ?.replace(/^---[\s\S]*?---/, "") // Remove frontmatter
      ?.replace(/^#+\s.*$/gm, "") // Remove headers
      ?.replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
      ?.replaceAll("\n", "") // Remove line break
      ?.replaceAll("\r", "") // Remove line break
      ?.trim();

    let description: string = "";
    let categories: string[] = [];
    let link = "/";
    let image: string | undefined = undefined;
    let date: string | undefined = undefined;

    switch (entity.collection) {
      case "blog":
        description = entity.data.description;
        categories = entity.data.categories;
        link = `/blog/${entity.id}`;
        image = entity.data.image;
        date = entity.data.date.toISOString();
        break;
      case "product":
        description = entity.data.description;
        categories = entity.data.tech;
        link = entity.data.isExternal
          ? entity.data.link
          : new URL(entity.data.link, ctx.url).toString();
        image = entity.data.thumbnail;
        break;
      case "video":
        description = entity.data.description ?? entity.data.title;
        categories = [entity.data.categories];
        link = entity.data.youtubeUrl;
        image = entity.data.thumbnail;
        date = entity.data.date.toISOString();
        break;
    }

    return {
      id: entity.id,
      title: entity.data.title,
      content,
      description,
      type: entity.collection as SearchEntityType,
      categories,
      link,
      date,
      image,
    };
  };

  const searchIndex: SearchIndexItem[] = [
    ...posts.map(transformEntityToIndex),
    ...products.map(transformEntityToIndex),
    ...videos.map(transformEntityToIndex),
  ];

  return new Response(JSON.stringify(searchIndex, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
