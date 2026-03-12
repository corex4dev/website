export type SearchEntityType = "blog" | "video" | "product";

export interface SearchResult extends SearchResultBase {
  score: number;
}

export interface SearchResultBase {
  id: string;
  title: string;
  description: string;
  type: SearchEntityType;
  link: string;
  image?: string;
  categories?: string[];
  date?: string;
}

export interface SearchIndexItem extends SearchResultBase {
  content?: string;
}

let indexCache: SearchIndexItem[] | null = null;

export const getSearchIndex = async (): Promise<SearchIndexItem[]> => {
  if (!indexCache) {
    const res = await fetch("/api/search-index.json");
    indexCache = (await res.json()) as SearchIndexItem[];
  }

  return indexCache;
};

export const globalSearch = (
  query: string,
  index: SearchIndexItem[] = [],
): SearchResult[] => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  const calculateScore = (item: SearchIndexItem): number => {
    let score = 0;
    const title = item.title.toLowerCase();
    const description = (item.description || "").toLowerCase();
    const content = (item.content || "").toLowerCase();

    // Exact title match (Highest priority)
    if (title === normalizedQuery) score += 100;
    // Title starts with query
    else if (title.startsWith(normalizedQuery)) score += 80;
    // Title contains query
    else if (title.includes(normalizedQuery)) score += 60;

    // Description matches
    if (description.includes(normalizedQuery)) score += 30;

    // Content matches (for posts)
    if (content.includes(normalizedQuery)) score += 10;

    // Category matches
    if (
      item.categories?.some((t: string) =>
        t.toLowerCase().includes(normalizedQuery),
      )
    ) {
      score += 20;
    }

    return score;
  };

  index.forEach((item) => {
    const score = calculateScore(item);
    if (score > 0) {
      results.push({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        link: item.link,
        image: item.image,
        categories: item.categories,
        date: item.date,
        score,
      });
    }
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};

export const getSuggestions = (
  query: string,
  index: SearchIndexItem[] = [],
): string[] => {
  if (!query.trim() || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  // Helper to add if matches
  const addIfMatches = (text: string) => {
    if (text.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(text);
    }
  };

  index.forEach((item) => {
    addIfMatches(item.title);
    item.categories?.forEach(addIfMatches);
  });

  // Convert to array, sort by length (shorter first usually better for suggestions) and limit
  return Array.from(suggestions)
    .sort((a, b) => {
      // Prioritize those that start with the query
      const aStarts = a.toLowerCase().startsWith(normalizedQuery);
      const bStarts = b.toLowerCase().startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    })
    .slice(0, 6);
};
