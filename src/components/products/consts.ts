import {
  Box,
  CodeXml,
  PackageOpen,
  PanelsTopLeft,
  type AstroComponent,
} from "@lucide/astro";
import type { CollectionEntry } from "astro:content";

export const IconsMap: Record<
  CollectionEntry<"product">["data"]["type"],
  { Icon: AstroComponent; name: string }
> = {
  "open-source": { Icon: CodeXml, name: "Open Source" },
  package: { Icon: Box, name: "NPM" },
  product: { Icon: PackageOpen, name: "Producto" },
  project: { Icon: PanelsTopLeft, name: "Proyecto" },
};
