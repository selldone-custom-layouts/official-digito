# Customize

The design lives in Molino's own components and style sheets. Selldone's commerce logic underneath stays untouched.

## Colours, type and spacing

- **Tokens:** `style/kalio-tokens.scss` holds the brand green (`--k-green`, `--k-green-deep`, `--k-green-lift`), the coral used for savings, ink, the stone "well" behind photos, radii and shadows.
- **Vuetify's primary colour** is set to the brand green in the same file (`--v-theme-primary`, `--v-theme-secondary`), so Selldone's own parts (gift cards, addresses, the payment window) don't show the theme's purple.
- **Typefaces:** Fraunces for headings and DM Sans for text, loaded in `components/kalio/kalio-fonts.ts` (from the app, not `index.html`).

Change the tokens and the whole site follows: buttons, badges, the compare badge, checkout and account.

## Where each part is

| Part | Files |
| --- | --- |
| Home sections (design A) | `components/tario/TarioHome.vue`, `TarioHero.vue`, `TarioCircles.vue`, `TarioRow.vue`, `TarioCard.vue`, `TarioTiles.vue`, `TarioWays.vue`, `TarioFinds.vue`, `TarioSellers.vue`, `tario-home.ts`; styles in `style/tario-home.scss` |
| Home photos | `assets/tario/` (eleven files; a missing one becomes a still life of the aisle's packshots) |
| Aisle, search, Deals, All products (chip bar of filters) | `pages/products/StorefrontPageProducts.vue`, `components/tario/shop/TarioShelfTop.vue`, `TarioFilterBar.vue`, `tario-filters.ts`; styles in `style/tario-pages.scss` |
| Seller page | `components/tario/shop/TarioSellerTop.vue` |
| Product page (buy box, Compare sellers, Goes well with, folding sections) | `components/tario/product/TarioProductOverview.vue`, `pages/product/StorefrontPageProduct.vue`, `components/kalio/product/KalioSellerOffers.vue` |
| About, journal, 404 | `pages/official/about-us/`, `pages/blog/list/`, `pages/errors/404/` |
| Card foot ("Add to cart" ↔ "− n +") | `components/kalio/KalioCardStep.vue`, `kalio-card-basket.ts`, `kalio-basket.ts` |
| Header, footer, drawers, sign-in | `components/kalio/shell/`, `style/kalio-shell.scss` |
| Shop pages (aisle, catalogue, seller) | `pages/products/StorefrontPageProducts.vue`, `KalioShelfHead.vue`, `KalioAisleHeader.vue`, `KalioSellerHero.vue` |
| Product page | `pages/product/StorefrontPageProduct.vue`, `components/kalio/product/`, `style/kalio-product.scss` |
| Basket, address sheet, delivery, payment window | `pages/basket/cart/`, `components/kalio/checkout/`, `style/kalio-checkout.scss` |
| Order page | `pages/basket/order/`, `components/kalio/order/` |
| Buyer account | `components/kalio/account/`, `pages/user/`, `style/kalio-account.scss` |
| Content pages | `components/kalio/pages/`, `style/kalio-pages.scss` |
| Skin for Selldone's own components | `style/kalio-platform.scss` |

[`KALIO.md`](https://github.com/selldone-custom-layouts/official-tario/blob/main/KALIO.md) explains every part, the reason behind each decision, and each workaround.

## Rules that keep it working

- **Re-skin, don't replace.** Keep Selldone's scripts for the basket, bill, checkout, variants, vendor offers and orders; change templates and styles.
- **Prefix every class** (`k-…`). Short names collide with Selldone's.
- **Live data only.** Never hard-code product names, prices, categories or URLs.
- **Vuetify draws icons as `<i>`.** Style decorative icons with `> i`, or you will move the icon inside them.
- **Sticky needs `overflow: clip`.** `.v-application` has `overflow: hidden`.
- **Android search:** `v-model` waits for the keyboard's composition to end. Use `:value` with `@input` for live search.
- **Never commit inside `modules/*`.** Keep a fix there as a patch in `patches/`.

## Two account designs

- `desk`: a side rail with order cards. This is the default for releases.
- `home`: tabs with an overview.

Pick at build time: `bash scripts/release.sh <version> desk` or `… home`.

## Test before you release

- Check the phone first: 360 and 390 px wide. Then tablet (768, 1024), laptop (1366, 1440) and desktop (1920).
- Walk through as a shopper: add products from cards and rows, add and save an address on the map, fill the checkout up to Pay, and tour the account.
- Look for:
  - overlapping or clipped text;
  - off-centre icons;
  - empty boxes;
  - anything hidden under a fixed bar;
  - Selldone's default look showing through.
