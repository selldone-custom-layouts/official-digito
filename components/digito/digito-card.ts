/*
 * Digito — every listing draws Digito's card.
 *
 * SProductsListing (a category, the catalogue, a search, the deals) draws
 * Selldone's SShopProductCard for each product. Its render is replaced here,
 * once, before the first card mounts, by DigitoCard with the same product:
 * the swatches, Save chip, "Add to cart" that turns into − n + in place,
 * "Choose capacity", Compare and Save look and behave as on the home page.
 * The listing's own attributes (its column classes, its click for
 * analytics) fall through to the card. Imported by the shop page.
 */
import { h } from "vue";
import SShopProductCard from "@selldone/components-vue/storefront/product/card/SShopProductCard.vue";
import DigitoCard from "./DigitoCard.vue";

const card: any = SShopProductCard;

if (!card.__digito) {
  card.__digito = true;
  card.render = function (this: any) {
    return h(DigitoCard, { product: this.product, class: "-listed" });
  };
}
