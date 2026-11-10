/*
 * Digito's own words, in English (the first language). Another language is
 * a file beside this one with the same keys (da.ts, ar.ts…), added to
 * index.ts when the owner enables that language in the shop; a missing key
 * falls back to English. Use them through t() from the region switcher:
 *   import { t } from "../../region-switcher/region";
 *   {{ t("header.account") }}
 */
export const en: Record<string, string> = {
  // The region switcher (pill, panel, phone row and sheet)
  "region.title": "Language & currency",
  "region.language": "Language",
  "region.currency": "Currency",
  "region.done": "Done",
  "region.close": "Close",
  "region.note": "Prices everywhere change at once: cards, filters, cart and checkout.",

  // Header
  "header.account": "Account",
  "header.signIn": "Sign in",
  "header.cart": "Cart",
  "header.empty": "Empty",
  "header.shop": "Shop",
  "header.deals": "Deals",
  "header.new": "New arrivals",
  "header.brands": "Brands",
  "header.track": "Track order",
  "header.blog": "Blog",
  "header.help": "Help",
  "header.search": "Search {shop}",

  // Phone menu
  "menu.shopByCategory": "Shop by category",
  "menu.todaysDeals": "Today’s deals",
  "menu.todaysDealsLine": "Every saving in one place",
  "menu.newLine": "Just landed",
  "menu.showMore": "Show {n} more",
  "menu.showFewer": "Show fewer",

  // Money lines
  "money.upToOff": "Up to {amount} off",
  "money.from": "From {amount}",
  "money.save": "Save {amount}",
  "money.freeOver": "Free over {amount}",
};
