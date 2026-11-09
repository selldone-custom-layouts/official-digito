# Digito — Selldone Layout

**Digito Electronics** (package `digito-electronics`) is a Layout for the Selldone shop **Digini** (shop 15549), a single-seller electronics shop, shown only on **https://digito.selldone.shop** (domain 1239). It started on 9 November 2026 as a copy of Tario (`tario-market` 1.2.10, itself Molino Market Hall re-dressed), so every Kalio behaviour the owner asked for is kept — read [`KALIO.md`](KALIO.md) and [`TARIO.md`](TARIO.md) before changing anything:

- "Add to cart" turns into "− n in cart +" in place; taps never wait for the server;
- no "Added to cart" pop-up, no phone bottom bar;
- the two-step, map-first address sheet, with suggestions while typing;
- the receipt that follows Selldone's bill, Pay leading to whatever is missing, no empty payment window;
- the guest's order page right after paying (guest code at Pay);
- the compare page (design 1), the buyer account (design A, "desk"), the content pages.

## The design: Home A "Deals hub" (approved by the owner, 8 November 2026)

Best Buy's sections and layout, not a copy: a light grey floor (#f0f2f5) with white rounded section cards; blue #0a4bd8 for every button (white words, flat, hover = a deeper blue only); yellow #ffd91a only as an accent (the logo's dots, eyebrow chips, the cart count, the clock); sale red #c4122f for "Save $X"; navy #071634; Plus Jakarta Sans; Material Symbols Rounded for Digito's own icons (only the icons listed in `kalio-fonts.ts` are loaded). No line under any word or icon (only links inside an article's text).

The mockups (one HTML page per page, desktop and phone shots) are in `../digini-design/` (`home-a.html` and `<page>-a.html`, index `pages-a.html`).

| Area | Where |
| --- | --- |
| The name and mark (one place: `BRAND.name`) | `components/kalio/kalio-brand.ts`, `assets/brand/digito-mark.svg`, `components/digito/DigitoWordmark.vue` (every "i" gets a yellow square dot) |
| "cart" everywhere, Selldone's own strings too | `cartWords()` in `kalio-brand.ts` (every English message that says basket) |
| Header: blue bar, search, Account, Cart with count and total; pills Shop ▾ (mega menu, click to open, click again to close, no scrim), Deals, New arrivals, Brands; live categories; Track order, Blog, Help | `components/kalio/shell/KalioHeader.vue`, `components/digito/DigitoMegaMenu.vue` |
| Footer: service row, link columns, newsletter card, legal row, small "made with selldone" | `components/kalio/shell/KalioFooter.vue` |
| Home (photo hero + Deal of the Day, categories, Top deals, doorbusters, tag rows, best-seller bento, sign-in nudge, Gear for every moment, Trending, Shop by budget, New arrivals, brands, articles) | `components/digito/DigitoHome.vue` and the `Digito*.vue` beside it; shared reads in `digito-home.ts` |
| The product card (swatches pick the colour, capacity chips, Save chip, Was, Add to cart → − n +, Choose capacity → quick-buy sheet, Compare, Save) — on the home and in every listing | `components/digito/DigitoCard.vue`; `digito-card.ts` draws it in place of Selldone's card |
| One quick-buy sheet for the whole site | `digito-quick.ts`, `DigitoQuickHost.vue` (mounted in `layouts/StorefrontLayout.vue`) |
| Category, catalogue, search, deals: short head, filter panel (price, colour, capacity, the category's spec keys, brands, Only deals), sort menu, five cards a row; a phone sheet | `pages/products/StorefrontPageProducts.vue`, `DigitoShopTop.vue`, `DigitoFilterPanel.vue` |
| Product page: gallery · product · sticky buy card, then Specifications, About this product, Reviews, Frequently bought together, More in the category | `DigitoProductOverview.vue`, `DigitoFbt.vue`, `pages/product/StorefrontPageProduct.vue` |
| Cart drawer (design C) | `components/kalio/shell/KalioBasketDrawer.vue` |
| Cart page, checkout, order page, account (desk), sign-in, compare | Kalio's, in Digito's dress (`style/digito-pages.scss`), with every seller heading removed |
| About, Contact (no "Store profile not found"), 404 (with header and footer), empty cart | `pages/official/about-us/`, `pages/official/contact-us/`, `pages/errors/404/`, `pages/basket/cart/` |
| Styles | `style/kalio-tokens.scss` (the tokens), `style/digito-skin.scss` (home, header, footer, cards, listings), `style/digito-pages.scss` (every other page) — both loaded last |

### Lifestyle photos

The owner's textless photos (`../digini-design/banners/`) are bundled as WebP in `assets/digito/`, named `<shape>-<category name>.webp` (`wide-tv`, `portrait-headphone`, `square-keyboard`…). The file name is the whole map: a category is matched by its `name` (the slug in its address). A category without a photo gets a collage of its own products (`DigitoPhoto.vue`), so the Layout is complete without any photo. 15 photos, 770 KB.

### Single seller

Digini sells everything itself. There is no "Sold by", no seller choice on the product page, no seller pages or sections, and the cart, drawer and order list are one list. Kalio's marketplace code that is left (vendor offers in the quick-buy overview, seller names on account rows) draws nothing when the shop has no vendors.

### Live data and its rules

- **Discount dates.** A saving counts only between its start and end dates, as Selldone's own price rule does (`savingOf` in `digito-home.ts`, `priceOf` in `kalio-catalog.ts`). On 9 November 2026 Digini has 61 products with a discount, but 33 of them carry a 2023 end date, so 28 deals show (in Laptop, Microphones, Monitors and Printers): the cart would not charge the others' discounts either.
- **The whole catalogue in one read.** `products/list` returns every product with its brand, spec and variants (about 40 KB compressed for Digini); the home's computed sections (deals by saving, savings per category, price bands, brands) and the cards' brand line use it (`allProducts()`).
- **Tags.** Selldone's storefront has no list of a shop's tags, but products can be asked for by tag, and the answer carries every tag of each product. One request with a vocabulary of common merchandising tags finds the tags in use (and any other tag those products also carry). A tag with no products shows nothing; best-seller drives the bento, new-arrival drives New arrivals (else Selldone's newest), every other tag gets its own "<Tag> Items" row (two side by side past the third, so tag rows never stand one under the other). A tag that no product with a known tag also carries cannot be found.
- **Categories in two even rows** (the owner's rule, 9 November 2026): 16 or more → the first 15 and an "All categories" tile; odd → all and the tile; even → all. Columns = tiles / 2 (`categoryTiles`).
- **Article pictures** live on the shop's own host (GitHub), not Selldone's CDN, so the blog's pictures come resized through wsrv.nl (`imageSrcset`; 17 KB instead of 1.6 MB); a failure falls back to the original.

## Release

`bash scripts/release.sh <version> desk` with `SELLDONE_CLI_SRC` and `SELLDONE_CLI` set, then pin **only digito.selldone.shop**: `selldone_current_connection` must say shop 15549, then `selldone_api_call` `api.shops.domains.layout.set`, `path_params {"domain_key":"1239"}`, body `{"mode":"private","layout_id":<id>,"layout_version":"<exact version>"}`, `confirm: true`. Never `api.shops.layout.set` (the shop default; besti.selldone.shop belongs to another Layout).

## Releases

- **1.0.1 (9 November 2026):** one blue for every button at rest and one deeper blue on hover, in Kalio's own sheets too (the address sheet's Save and Continue were the deeper blue); cents at full size in every price; "Often added" draws from the whole catalogue (it read the marketplace's sellers, so a single-seller shop showed none) and adds a colour product in its first colour; Buy again maps past orders onto the full catalogue; rails always open at their first card (a browser kept a snapped card in view when a rail's list was replaced, and Top deals opened scrolled to its end); the heart stays on narrow cards; the phone footer's service row is a list; doorbuster prices and "Shop now" wrap on narrow tiles; blog titles turn blue on hover instead of underlined. Pinned on domain 1239.
- **1.0.0 (9 November 2026):** the first Digito: Home A, the header and mega menu, the footer, Digito's card in every listing, the filter panel, the three-column product page, the cart drawer (design C), About, Contact and 404 of its own, no seller interface. Layout 30 (created by this upload). Pinned on domain 1239 (`api.shops.domains.layout.set`, mode private) with the domain's own Home set to the shop page (`selldone_shop_home_domain_set`); the shop default and besti.selldone.shop untouched. Built and checked on the dev server while Selldone's storefront API answered 500 "Update in progress" for every shop (the shop's `/info` was served from a stand-in built from the dashboard's shop record).
