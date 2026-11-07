/* ━━━━━━━━━━━━ The Layout's own name and logo ━━━━━━━━━━━━
   Tario Market runs on its own address of the shop molino (one shop, a Layout
   per domain), so the shop's own title would put "molino" in its header,
   footer, page titles and every line that names the shop. The owner asked
   for Tario's own name and logo (7 November 2026): the title is
   replaced here, as soon as the shop is read, for this Layout only. The shop
   record on Selldone (its emails, dashboard, the SEO page Selldone serves to
   crawlers) keeps "molino".

   The mark (assets/brand/tario-mark.svg, 64x64 SVG) stands before the wordmark in
   the header and footer and is the browser tab's icon. */

import mark from "../../assets/brand/tario-mark.svg?url";

export const BRAND: { name: string | null; mark: string } = {
  name: "Tario",
  mark,
};

/** Put the Layout's name on the shop record the storefront reads. */
export function applyBrand(shop: any): void {
  if (shop && BRAND.name && shop.title && shop.title !== BRAND.name) {
    renameTab(shop.title);
    shop.title = BRAND.name;
  }
  brandIcon();
}

/** The first page keeps the head the server wrote ("… | molino"); later pages
    build their titles from the renamed shop. Put the Layout's name in the tab. */
function renameTab(original: string): void {
  if (typeof document === "undefined" || !document.title.includes(original)) return;
  document.title = document.title.split(original).join(BRAND.name as string);
}

/** The tab's icon (and the home-screen icon) is the Layout's mark. */
export function brandIcon(): void {
  if (typeof document === "undefined") return;
  for (const rel of ["icon", "apple-touch-icon"]) {
    let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (link.href !== BRAND.mark) {
      link.href = BRAND.mark;
      if (rel === "icon") link.type = "image/svg+xml";
    }
  }
}
