import { AUTHOR_NAME, SITE_URL, SITE_NAME } from "@/consts";
import type { CollectionEntry } from "astro:content";

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: AUTHOR_NAME,
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#personImage`,
    url: `${SITE_URL}/images/daniel.jpg`,
    caption: AUTHOR_NAME,
  },
  description:
    "Desarrollador Web Full-Stack experto en CMS, Pasarelas de Pago y Autenticación.",
  sameAs: [
    "https://youtube.com/@CoreX4Dev",
    "https://github.com/corex4dev",
    "https://instagram.com/corex4dev",
    "https://linkedin.com/in/danny98cuba",
  ],
  jobTitle: "Web Developer & Content Creator",
};

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/favicon.svg`,
    contentUrl: `${SITE_URL}/favicon.svg`,
    caption: SITE_NAME,
    width: "200",
    height: "200",
  },
  image: { "@id": `${SITE_URL}/#logo` },
  sameAs: ["https://youtube.com/@CoreX4Dev", "https://instagram.com/corex4dev"],
};

export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: "Plataforma de aprendizaje para desarrolladores web full-stack.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "es-ES",
});

export const getBreadcrumbSchema = (
  items: { name: string; item: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.item.startsWith("http") ? item.item : `${SITE_URL}${item.item}`,
  })),
});

export const getBlogPostSchema = (post: CollectionEntry<"blog">) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${SITE_URL}/blog/${post.id}/#post`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/blog/${post.id}`,
  },
  headline: post.data.title,
  description: post.data.description,
  image: post.data.image,
  datePublished: post.data.date,
  dateModified: post.data.date,
  author: { "@id": `${SITE_URL}/#person` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  articleSection: post.data.categories,
  inLanguage: "es-ES",
});

export const getProductSchema = (
  product: CollectionEntry<"product"> & { price: string },
) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${SITE_URL}/productos/${product.id}`,
  name: product.data.title,
  description: product.data.description,
  image: product.data.thumbnail,
  brand: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/productos`,
    priceCurrency: "EUR",
    price: product.price || "0",
    availability: "https://schema.org/InStock",
  },
});
