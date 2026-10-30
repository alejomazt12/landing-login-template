/**
 * Sites served by this app. The header selector switches between them; each
 * one owns its landing page and, through `data-site`, its own color tokens.
 */

export type SiteId = "carros" | "lavanderia";

export type Site = {
  id: SiteId;
  name: string;
  tagline: string;
  href: string;
};

export const sites: readonly Site[] = [
  {
    id: "carros",
    name: "Carros",
    tagline: "Catálogo y disponibilidad",
    href: "/",
  },
  {
    id: "lavanderia",
    name: "Lavandería",
    tagline: "Servicio a domicilio",
    href: "/lavanderia",
  },
];

export function getSite(id: SiteId): Site {
  return sites.find((site) => site.id === id) ?? sites[0];
}
