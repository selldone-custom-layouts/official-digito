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
| Footer: service row, link columns, newsletter card, the Theme row (showcase shops only), legal row, small "made with selldone" | `components/kalio/shell/KalioFooter.vue` |
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

- **1.0.29 (11 November 2026):** the compare page's ✕ never sits on words (the owner, on Molino 11 November 2026: "the ✕ went onto the card, over the name"; the same card is here). With three or four picks each pick card was about 240px wide and the name ran under the ✕; at 768–1024px the name got no room at all and the Add button was squeezed. The card now takes its shape from its own width (a container query on the card): 316px and up, the photo beside the words, which stop 8px short of the ✕; narrower, the photo on top, centred and narrower than the card so the ✕ sits in the empty corner beside it, and the name, price and Add underneath at full width. The ✕ sits inside the card's corner at every width (it hung 8px outside, where the phone's sideways strip cuts it). A long word breaks instead of being cut sideways. The page's narrow layout starts at 960px (was 760). corner-clear-check (new in both kits) on the live compare page before: 8 hits.
- **1.0.28 (11 November 2026, deploy 573, release `01M74B57H7D18TS5QSAFKZW5ZY`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`; the release script's own verify step died, so it was run again and showed js_match and css_match): no letter-spacing on joined scripts.** Arabic letters join and Devanagari letters hang from one line, so any tracking pulls them apart: wide tracking on eyebrows and buttons, tight tracking on headings. Under `:lang(ar)` and `:lang(hi)`, every element now has `letter-spacing: 0` and `word-spacing: normal`.
  - The rule carries an id's weight (`:not(#dg-joined)`), so it beats the few `!important` trackings of two classes.
  - The Latin wordmark carries `lang="en"` and keeps its tight tracking.
  - Selldone's "20 %" badge keeps the word spacing that closes its gap.
  - **Checked live** (with the language picked through the pill or the sheet):
    - The saved block names 1.0.28.
    - Arabic, light and dark, home and a category, 1440 and 390, `dir` `rtl` throughout: contrast 0 and rings 0.
    - box-check finds 51 overlaps at 1440 home: the hero's words over its photo by design. Five of the six more than in 1.0.25 are the new description spans, one per slide.
    - The text check (`digito-ar-bidi.cjs`, home, a category and a product at 1440 and 390):
      - in Arabic: 418 elements, 0 tracked, 0 signs on the wrong side, and every Latin merchant line reads left to right;
      - in Hindi: 0 tracked and 0 signs on the wrong side.
    - The only lines it flags are the product article's paragraphs at 390. Selldone's article editor forces `unicode-bidi: embed !important` on them and sets the direction from the article's own language, so they read correctly anyway (none reversed).
    - By eye, on the Arabic and Hindi shots at 1440 and 390:
      - the badges read "22% خصم" and the prices "162.90 US$";
      - the English hero description has its full stop on the right;
      - the scrim sits behind the words;
      - eyebrows, buttons and headings join with no gaps.
    - `currency-check`, DKK and EUR at 1440 and 390:
      - every DKK line was ok;
      - the price filter was not drawn in DKK (Selldone's 429; not counted);
      - one EUR step at 1440, the cart drawer, found the whole page back in USD. The EUR steps before it had passed and so had the drawer at 390. A re-run of EUR at 1440 (home, price filter "€", category, product, deals, cart drawer, mega menu) gave TOTAL 0.

- **1.0.27 (11 November 2026, deploy 569, release `01M74A5ZB50Q9DEVMD165FW7HH`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`; the first try waited the guard's full 30 minutes behind other Layouts' uploads and was run again): signed numbers, photo framing and the FAQ under load, in Arabic.**
  - **Signed numbers** (Walio's lesson): in Arabic, Unicode turns the digits after an Arabic word into Arabic numbers and moves the sign to the other side, so the badges read "%22" and a "-20%" would read "20%-". The fixes:
    - the Arabic percent badges ("خصم {percent}%" on cards and doorbusters) wrap the number and its sign in LRI…PDI, written as `⁦`/`⁩` escapes in `digito.ar.ts`;
    - the receipt's minus amounts (cart page, cart drawer, order receipt; class `k-neg`), the "+N" after capacities and swatches, and the compare page's "-N%" are left-to-right isolates.
  - **Photo scrims** (Walio's lesson): the hero's dark scrim already moved to the words' side in 1.0.25. The hero and About photos now also frame their subject on the other side in Arabic (`object-position: 30%`), so it is not under the words.
  - Checked by eye on the Arabic shots at 1440 and 390. The phone hero showing two half slides was autoplay caught mid-scroll: the pane shows each slide snapping to 0.
  - **FAQ under load:** both FAQ requests now catch Selldone's 429 and try once more after 3 s. Before, the rejection went uncaught (a page error) and the list stayed empty.
  - **The cart page in Arabic** (Dino's lesson), checked in the pane with an item in the basket: the line, the two delivery ways and Pay are drawn, a way opens the address map, Pay opens sign-in, and there are no errors. A guest cannot add on Digini ("Add to cart" opens sign-in), so the walk uses i18n-check's store stub for the basket.
  - **Checked live:**
    - The saved block names 1.0.27.
    - Arabic console walk (`dir` is `rtl` on every page, 1440 and 390), with 0 page errors and 0 script errors on: home, a category, a product, the cart page with a line (its two delivery ways, one opening the address map), checkout up to sign-in, FAQ, About, Contact, Terms, Privacy, compare, the blog, a post and 404.
    - `region.ts` matches the kit's (amounts in LRI…PDI on right-to-left pages).

- **1.0.26 (11 November 2026, deploy 558, release `01M746SGGQNX14DTBQ6AMJPZ46`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`; the first upload got Cloudflare's 524 after 134 s and never landed, so the same build went again with `scripts/ship-built.sh`): merchant text keeps its own direction in Arabic.**
  - **The problem:** product, category, brand, spec and article text comes from the merchant in the language they typed it in, mostly English on Digini. Under `<html dir="rtl">` an English line such as a category description took the page's direction, so its full stop landed on the left.
  - **The fix:** `style/digito-skin.scss` gives every element that prints only merchant data `unicode-bidi: plaintext` in right-to-left pages. Each one now takes its direction from its own first letter. The elements:
    - card, cart and compare titles;
    - header, menu and mega-menu category names;
    - category, brand and moment tiles;
    - doorbusters and Frequently bought together;
    - tag-row titles;
    - blog cards and posts;
    - the product title, its brand and aisle links, and the breadcrumbs;
    - spec names and values;
    - footer category links;
    - search suggestions;
    - each paragraph of the product article and journal posts.
  - Sentences built from Digito's own Arabic templates keep the page direction, since an English category name at their start would otherwise flip them. Examples are the hero headline and the "From {amount}" lines.
  - The hero line was one string: the merchant's description plus "From {brands}." It is now two spans, so only the description (`.dg-bill__desc`) is isolated.
  - The shop-top title and line get `.dg-merch` only on a category page; there they are the category's own name and description.
  - **Already in place from 1.0.24/1.0.25** (the other two Senso lessons):
    - the Arabic audits pick the language through the UI and check `document.documentElement.dir === "rtl"`. Selldone's saved-language key is case-sensitive, `local-shop-digini-hZGabLru`, and is ignored while `/info` answers 429.
    - the region pill and the menu's region row redraw when the language file arrives (`state.words` in the region package's `t()`).
  - **Checked live:**
    - The saved block names 1.0.26.
    - An Arabic console walk on 1.0.26 (every page, 1440 and 390) found no script errors on any page.
    - It also found two things, both handled in 1.0.27:
      - the filled cart page had not been drawn, because a guest's "Add to cart" opens sign-in on Digini;
      - the FAQ let Selldone's 429 go uncaught.

- **1.0.25 (11 November 2026, deploy 548, release `01M7449MQQKNY9AGWWA9VRG198`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`): Arabic polish from the live walk.**
  - **Wordmark:** "digito" read "toigid" right to left. The letters are laid out in a row, so `DigitoWordmark` now sets `dir="ltr"` on it.
  - **Amounts:** they read "$US 589". In a right-to-left language, `money()` (the region package, kit first) now wraps each amount in Unicode isolates (LRI…PDI), and `.u--price` / `.dg-price__now` are left-to-right isolates, so "589 US$" stays one piece inside an Arabic sentence.
  - **Hero:** the dark gradient now sits on the right in Arabic, where the words are.
  - **Checked live:**
    - The saved block names 1.0.25.
    - With Arabic picked through the pill or the sheet, `<html dir>` was `rtl` on every page.
    - Light and dark, home and a category, 1440 and 390: contrast 0 and rings 0.
    - box-check found the same 45 hero overlaps as in English.

- **1.0.24 (11 November 2026, deploy 541, release `01M74260MNS7Y244DKE7HC93V3`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`): every word Digito writes is in the shop's languages — Arabic (right to left), Hindi and Danish.** The owner enabled ar, hi and da on Digini. After a pick in the header pill or the phone menu's sheet, every word Digito writes changes; product data (titles, descriptions, categories, brands) stays as the merchant wrote it.
  - **On the shared Kalio i18n** (`new-shop-kits/i18n`, Molino's phase 3a): `components/kalio/i18n/kalio-i18n.ts` (the runtime: `t()` with plurals, `<html lang dir>`, the script's font on demand), `base/{en,ar,hi,da}.ts` (the shared Kalio words; Digito uses 724 of the 941, every one with the base's exact English) and Digito's own `digito.{en,ar,hi,da}.ts` (346 strings, `digito.*` keys), plus `digito-overrides.ts` for the region note ("cards, filters, cart and checkout"). English is bundled; each other language is one lazy chunk. Digito's earlier `components/digito/i18n` structure (1.0.22) is gone; its keys moved here.
  - **The wrapping:** 26 shared files were identical to Molino's and took its wrapped copies; the rest took Molino's diff where it applied and were wrapped by hand where Digito's wording differs ("cart", "categories", one seller) under `digito.*` keys, so no English changed. Digito's own components, the header, footer, cart drawer and sign-in, the pages (cart, product, blog, 404, about, contact, listings) and the Selldone components Kalio patches (Save, compare, "Show N more", empty listings, the update banner) all go through `t()`. Words built at import time are getters (`digito-theme.ts` labels and palette names, `tario-filters.ts` group and sort names, the delivery ways).
  - **Shared package fixes** (kit first, then copied): the theme switcher no longer copies its labels into plain strings (`liveLabels()`), and the region package's `t()` redraws when a language's words arrive (`state.words`); both had left the Theme row and "Language & currency" in English until the next redraw.
  - **Right to left:** 38 one-sided `left/right/margin/padding` declarations became logical (`inset-inline-*`, `margin-inline-*`); centred and symmetric ones stay. Directional icons mirror (`DigitoIcon` marks chevrons and arrows; `k-flip` on 19 `v-icon` ligatures). The hero carousel moves by measured offsets, so its arrows and dots work in both directions; the rails already did. Drawers open from the reading side. Prices and clocks keep left-to-right digits (bidi isolation). Arabic and Hindi get Noto Sans Arabic / Devanagari after Digito's face.
  - **Checked:**
    - All 110 changed files compile.
    - `i18n-lint`: OK for `digito.{ar,hi,da}` and `base/{ar,hi,da}`.
    - The extractor reports 0 clashes, and every base key Digito uses has the base's English.
    - Live `i18n-check`, ar, hi and da at 1440 and 390 (home, footer, a category, a product, the cart drawer empty and filled, the phone menu, sign-in, FAQ, 404): TOTAL 0. `IGNORE` covers the merchant's own footer menu ("Home", "Shop", "Privacy", "Blog", "About Us") and two product description lines that match base patterns.
    - In Arabic, with the language picked through the pill (light and dark, home and a category, 1440 and 390):
      - contrast 0;
      - rings 0;
      - box-check: 45 overlaps at 1440 home, the same 45 as in English (the hero and bento words drawn over their photos by design).
    - `card-edge-check` finds no boxed cards on Digito in any language, so it does not apply.
    - The Arabic walk found the reversed wordmark and the split "US$". Both are fixed in 1.0.25.

- **1.0.23 (10 November 2026, deploy 523, release `01M73MC8ZQ9X3W248X57BFV724`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`): "Gear for every moment" follows a currency pick at once.**
  - Found live on 1.0.22. Selldone was answering 429, so its own redraw after a pick was late. The live currency check then caught five lines still in DKK after a pick of EUR: "Up to DKK 720 off" and "From DKK 253".
  - `DigitoMoments` made its category lines as strings when it mounted, so they waited for that redraw. They are now drawn at render (`lineOf`), from a frozen copy of the catalogue.
  - `currency-check.cjs` now also scans the page "at once", right after the pick and before Selldone's redraw, to catch any amount that waits.
  - **Checked live:**
    - The saved block names 1.0.23.
    - `currency-check` for DKK and EUR at 1440 and 390: TOTAL 0, and every "at once" scan is clean.
    - Selldone was answering 429 ("Too Many Attempts") to the product lists while several Layouts were tested. The live category and deals pages came back empty, so the price filter was checked on dev only (all six currencies).

- **1.0.22 (10 November 2026, deploy 515, release `01M73JC216MBBZYFKESV5SHW8X`, pinned on domain 1239; uploaded through `new-shop-kits/upload-guard.sh`): language and currency in the header, and every amount in the shopper's currency.** The owner chose mockup B (`digini-design/region/region-b.html`): "I want it in the header; Walmart and Amazon have it in the header".
  - **The switcher** is a shared package, `components/region-switcher/` (source and porting guide: `new-shop-kits/region-switcher/`).
    - Desktop: a pill at the end of the header's second row, after Help: a globe and "DKK", or "EN · DKK" once the shop has a second language. A click opens a small panel with Currency chips (code and sign; the chosen chip is ringed inside its box) and, from two languages on, Language chips. It has no scrim. It closes on a second click, on Esc (focus back to the pill), on a click outside and on a page change. Tab walks into it, and the arrow keys move along a group.
    - Phone: a row "Language & currency  DKK ›" in the menu, under Help. It opens a bottom sheet (teleported to `<body>`) with the same chips and Done. Esc, Done or a tap on the dim area close it, and Tab stays inside.
    - With one currency and one language, neither shows.
    - The old pickers are gone: the currency icon beside Account, the menu's two dropdowns and the footer's two dropdowns.
  - **Selldone's own currency, not a copy.**
    - The choice is `window.$storefront.currency` (the storefront SDK's stored choice, read by `CurrencyHelper.GetUserSelectedCurrency` and `u-price`).
    - A pick calls the global `onChangeUserSelectedCurrency()`. It tells the server (guest or signed in), refetches the cart and the shop in the new currency, and redraws the app.
    - `regionState` mirrors the code, so Digito's own amounts change at once.
    - Rates are `shop.shop_exchange_rates`, read with `PriceHelper.getBuyRateValue`.
    - The language uses `ShopOptionsHelper.GetLanguages` and `setCurrentLanguage`. The old pickers were gated on `$shop.languages`, which does not exist.
  - **Every amount converts.** Digito's `money(amount, currency)` now means "an amount in `currency`, shown in the shopper's currency". Every caller that passed `$shop.currency || "USD"` (always "USD": the field does not exist) now passes the shop's base currency.
    - Converted: the hero, doorbusters, the mega menu, the phone menu lines, Gear for every moment, the category rails, Shop by budget, the deals head, and Frequently bought together.
    - The cards, the product page and the compare page price products in the reactive currency. `priceOf` falls back to the product's own price in its own currency when the shop has no rate (it used to show 0).
    - The product page's and the cart's "Free over" thresholds are converted from the delivery way's currency. The cart's free-shipping meter subtracts in one currency.
    - The cart drawer and the header's cart total format through `money()` in the cart's currency.
  - **The price filter** (the owner: "it still said $ 6 … $ 21890"). As Selldone's `SCategoryFilter` and Tario's filter bar do, it converts every per-currency row of the category's price range into the shopper's currency. The boxes carry the shopper's sign, and the filter goes back to Selldone keyed by each row's own currency. Action Cameras in DKK: kr 1247 to 2370.
  - **Digito's own words** have an i18n structure: `components/digito/i18n/en.ts`, registered with `defineMessages()` and read with `t()`. The header and the phone menu use it. Another language is a file with the same keys, added when the owner enables that language.
  - **Checked on dev (10 November 2026):**
    - `currency-check.cjs`, all six Digini currencies (USD, DKK, AED, EUR, SAR, AUD) at 1440 and 390, picked through the pill or the sheet: TOTAL 0. It walks home, a category (the filter's sign: $, kr, د.إ, €, ﷼, A$), its first product, the deals page, the cart drawer with one line, the phone menu and the mega menu.
    - Contrast audit (the kit's fixed one) and ring sweep with the panel open (1440: blue light, blue dark, custom `#ffff00` dark) and the sheet open (390: blue light, blue dark, emerald dark): TOTAL 0. The first run caught the open pill's 24% white ground at 4.25:1 (3.85:1 on a custom yellow), so the pill is now 10% at rest and 14% open, with a ring inside.
    - Keyboard:
      - Tab reaches the chosen chip; the arrows move along it; Enter picks.
      - Esc closes and the focus goes back to the pill; a second click or a click outside closes.
      - The sheet opens on the chosen chip and Tab stays inside; Esc, Done and the dim area close it.
    - A reload keeps the choice (EUR: pill "EUR", cards in €).
    - The theme switcher's non-showcase stub still renders (header, 76 cards, no Theme row).
    - The production build passes.

- **1.0.21 (10 November 2026, deploy 503, release `01M72R11PN77W615END9PH0QVT`, pinned on domain 1239): the phone menu shows 6 categories, then "Show N more"** (the owner's option A; mockup `kalio-design/menu-more/menu-a.html`).
  - Today's deals and New arrivals stay pinned at the top of "Shop by category" and are not counted. Then come the first 6 categories in the merchant's order, then a "Show N more" row. N is the number hidden, read from the shop's live categories (Digini: 15, so "Show 9 more").
  - The row is a real `<button>` with `aria-expanded` and `aria-controls`, on the category rows' grid: a tinted round chip with a chevron in the ring column, and bold words in the brand ink in the words column (same left edges, 20px and 76px).
  - A tap opens the rest inline: height and fade, with the rows 20ms apart and no motion under `prefers-reduced-motion`. The button moves to the end and reads "Show fewer" with a chevron up; another tap closes them. With 8 or fewer categories all are shown and there is no button. Each opening of the menu starts collapsed. While closed the hidden rows are `inert`, so neither Tab nor a screen reader reaches them.
  - Their pictures are not lazy, so the rows never open without photos.
  - The mega menu at 1440 is unchanged (`KalioHeader.vue`, `style/digito-skin.scss`).
  - **Checked on dev:** at 390 and 360, light and dark:
    - collapsed: 6 rows and "Show 9 more";
    - click, Enter and Space each expand (15 rows, "Show fewer" after the last) and collapse again;
    - reopening starts collapsed;
    - no sideways scroll; the rows and the button share one left edge.
  - **Contrast and rings (dev, with the fixed `contrast-audit.cjs`):** the menu open at 390, collapsed and expanded, dark in Digito blue, Emerald and custom `#ffff00`: contrast TOTAL 0, ring sweep TOTAL 0.
  - **Checked live:**
    - the saved block names 1.0.21;
    - at 390, "Show 9 more" with `aria-expanded=false`, and after a tap "Show fewer" with `aria-expanded=true` and all 9 pictures loaded;
    - at 1440, Shop opens the mega menu as before, with no toggle shown.

    Screenshots: `menu-more-shots/digito-collapsed-390.png` and `digito-expanded-390.png`.

- **1.0.20 (10 November 2026, deploy 498, release `01M72N7KYQ0N6BQFMFD31225QM`, pinned on domain 1239): the search badge, and the new contrast audit.**
  - Selldone's amber category badge in search suggestions now has a dark folder icon in both modes. Its rule names `html.dg-dark` as well, which keeps the build's dark-token step off it.
  - `components/theme-switcher/tools/contrast-audit.cjs` replaced by the fixed one from `new-shop-kits/theme-switcher/` (the old one read only `rgb()` colours and skipped `color-mix()` and oklab grounds).
  - **Checked live, with the new audit, on 1.0.19:**
    - dark home, empty cart drawer, cart page, phone menu (mega menu at 1440) and sign-in sheet in Digito blue, Emerald and custom `#ffff00`, at 1440 and 390: TOTAL 0;
    - contrast audit on home, blue dark: TOTAL 0;
    - the photo sweep (home, menu, cart drawer and page with three lines, compare, quick-buy, search, empty drawer, brands, 404): no contrast failure except the search badge, fixed here, and one Selldone error toast caught mid fade-in on the simulated cart (the guest refusal "Your token does not have access…"; settled it reads 6:1, as noted under 1.0.14).
  - **Checked live on 1.0.20:** the saved block names 1.0.20; the compiled rule is intact (`#241a00` in both modes); search suggestions and the menus at 1440 and 390, dark: no contrast failure.

- **1.0.19 (10 November 2026, deploy 494, release `01M72KR2ZRDCCCRY9ZGG1AAAGM`, pinned on domain 1239): product photos on light tiles in dark mode.** The owner's rule: in dark mode a packshot sits on a light tile. A sweep of every dark state (the contrast audit's photo check over home, the phone menu, the mega menu, the cart drawer and page with three lines, compare, quick-buy, search suggestions and 404, at 1440 and 390) found 49 photos on the dark ground before the fix:
  - the home's and 404's "Shop by category" circles (`.dg-cat__ring`, on the page colour);
  - the phone menu's category thumbnails (`.k-drawer__ring`) and the mega menu's category rings and product tiles (`.dg-mega__ring`, `.dg-mega__pimg`);
  - the cart lines' photos in the drawer and on the cart page (`.dg-crow__pic`: its `#fff` was darkened by the build's dark-token step);
  - the "Shop by brand" logos (`.dg-brand img`) and the empty cart's category chips (`.dg-chip img`).

  Each now gets the cards' photo well (`--k-well`, white in both modes) in its own rounded shape, in `style/digito-pages.scss` (`html.dg-dark`). Icon tiles (Today's deals, New arrivals, All categories) keep their tint. The quick-buy sheet, search suggestions and compare cards already had white tiles. The only photo left on a dark colour is the shop's own mark on the blue compare cards, by design.
  - **Two contrast fixes found by the same sweep:**
    - the empty compare card's "Side by side" eyebrow used the link colour on the brand-coloured card (3.26:1 in dark, near 1:1 in light); it now takes the card's own words;
    - Selldone's amber category badge in search suggestions had a white folder icon (2.04:1). The fix in this build did not take in dark (the build's dark-token step turned its dark literal into the dark ink, 1.72:1); 1.0.20 carries it.
  - **Checked live:** the saved block names 1.0.19. The same sweep after the fix: 21 photo reports left, none a packshot on a dark ground. The brand logos and chip pictures carry their own white tile (the probe reads the parent's colour, so it still lists them); the shop's mark on the blue compare cards is the brand, not a product. Screenshots at 390 and 1440 of the phone menu, the mega menu, the cart drawer, the empty cart's chips and Shop by brand show every photo on white.

- **1.0.18 (10 November 2026, deploy 487, release `01M72J6A1XTQSY6BP1ZJTYK0QX`, pinned on domain 1239): the theme switcher moves from the header to the footer.** The owner, after talking with the Selldone team: the header's Theme button takes room and does not suit every shop.
  - **Header.** The Theme button, its import and its `palette` icon are gone. The header actions (Account, Cart) are back to even gaps.
  - **Footer.** A Theme strip of its own, just above the legal row: full width, 16px top and bottom, a top hairline in the footer's line colour, on the same left edge as the link columns. It holds the five palettes, **Custom colour** (a colour wheel that opens the native picker, applied while dragging) and Light / Dark. On a phone the palettes stay on one line and the name and Light / Dark wrap under; no sideways scroll at 360px; every target is 32px or more. Its words and rings come from Digito's tokens, so they follow light and dark.
  - **Showcase only, as before.** On any shop other than 15549 and 15645 the strip is not rendered (no empty hairline) and a stored theme is not applied.
  - **Package.** `ThemeSwitcherRow.vue` and `theme-switcher.scss` copied unchanged from `new-shop-kits/theme-switcher/` (the row's Custom colour swatch). `ThemeSwitcherButton.vue` stays in the package as an option, unused.
  - **Docs.** README, AGENTS.md (Theme), the wiki pages Customize and Theme and colours: "header" became "footer"; the header check is replaced by a dark contrast audit.
  - **Checked on dev (1440, 390, 360; light and dark):** no Theme button in the header and even gaps; the strip right above the legal row, on the columns' edge; each of the five palettes repaints the header and buttons; Custom `#ffff00` (input value + change) repaints and survives a reload; Light / Dark switches Digito and Vuetify and survives a reload; Tab walks the six swatches and the arrows move along them. Contrast audit on home: blue dark 0, custom `#ffff00` dark 0 (blue light timed out on the loaded dev server and was run live: see below). Ring sweep on home, light and dark: TOTAL 0. A stub shop (99999) with a planted dark `#ff00ff`: no strip, no row, light, Digito blue. `theme-color.test.mjs`: ALL PASS.
  - **Checked live:** the saved block names 1.0.18; at 1440 and 390 the header has no Theme button (Account and Cart, even gaps), the strip shows six swatches, no sideways scroll. Contrast audit on home, blue light: TOTAL 0.
  - **Dark text on fixed light tints** (the owner's Walio bug, 10 November 2026: pastel aisle chips with white words in a dark empty cart). Digito's dark empty cart drawer, empty cart page, phone menu (the category drawer; the mega menu at 1440), sign-in sheet and home were checked live with the contrast audit's probe in Digito blue, Emerald and custom `#ffff00`, all dark, at 1440 and 390: TOTAL 0 before any change. Digito draws no tinted chips there (its sign-in sheet shows no aisles and its empty states use the dark card), so nothing needed fixing.

- **Shopper walk-through (10 November 2026, on 1.0.17).** 45 steps a run, clicking through from the home page, at 1440 and 390, light and dark, and with a custom #e11d48: header (search and suggestions, departments, the Theme panel, account, cart), category filters (spec, colour, price, on sale; on a phone in the filter sheet), sort, brands, compare, product page (gallery, colour tiles and capacities with their prices, the deal clock against `dis_end`, guest Add and Save asking for sign-in, Compare), the quick-buy sheet, the compare page (remove, copy link), the cart drawer and cart page with a simulated signed-in buyer in the test browser only (+/−, remove, totals, the address step; Pay never pressed), the deals list loading to the end, an empty search, 404, the footer links, FAQ and Contact. Every step passes on every run except one Selldone limit, reported not fixed: "Price: low to high" is ordered by the price before the deal (763.50 before 761.90).
- **1.0.17 (10 November 2026, deploy 470, release `01M71KRWK875M1BXNSBHKY2AQQ`, pinned on domain 1239): the phone filter sheet stays open while the shopper picks.**
  - On a phone, ticking one filter closed the whole sheet, so a second filter meant opening it again and "Show results" was never reached. `DigitoShopTop` closed the sheet on any route change, and each tick writes the filter into the query (`?filter=…`). It now closes only when the page's path changes.
  - **Checked live (390):** a tick keeps the sheet open with the box ticked and the list narrowed (6 to 1); "Show results" closes it; reopening shows the tick. The saved block shows 1.0.17.
- **1.0.16 (10 November 2026, deploy 469, release `01M71DQWADPBB0Y4YJK682X9X6`, pinned on domain 1239): the deals list stops asking for more when there is no more.**
  - Selldone counts 61 deals but the page after 60 brings nothing new. "Show 1 more" stayed in view and its v-intersect asked again on every frame, answered from the SDK's cache, so the list re-rendered continually (63 `list()` calls in 4 seconds here; on Besti the page froze).
  - `SProductsListing` now ends the list when a "more" page brings nothing that was not already shown when it was asked for. It is in Selldone's synced `modules/components`, kept in `patches/modules-components.kalio.patch` (regenerated).
  - **Checked live:** the saved block shows 1.0.16; on the deals page after scrolling to the end, 0 `list()` calls in 4 seconds and no button.
- **1.0.15 (10 November 2026, deploy 462, release `01M718N28QR6BFGRNNYDB8734S`, pinned on domain 1239): found by a shopper's walk-through of the live site (390 and 1440, light, dark and a custom colour).**
  - **The quick-buy sheet's price follows the capacity.** In "Choose capacity", picking 4TB still showed the 1TB price ($439.44); the cart got the right one ($769.44). Selldone's price section reads the chosen variant from an injected `$variant`. The product page provides it; the sheet did not. `KalioProductOverview` now provides its own choice.
  - **A guest's Save on a card asks for sign-in.** The heart called `this.NeedLogin()`, which the card does not have (no AuthMixin), so it threw and nothing happened. It now sends the app's `need-login` event, which opens the sign-in sheet.
  - **A guest's Track order page offers Sign in, not an error.** It said "Your orders did not load. Try again" (Selldone refuses the read when the shop takes no guest orders). It now says "No orders on this device yet" with Sign in, as Besti does since 1.0.6.
  - **The cart badge counts units.** It counted lines: one camera plus two of another showed 2 while the cart said "3 items". The badge and its label now count units.
- **1.0.14 (9 November 2026, deploy 446, release `01M70W18VF29X18G0CN5BZVX5A`, pinned on domain 1239): a shared-package fix, the same as Besti 1.0.13.**
  - Found by Besti's live cart audit: with a custom #ffff00 in dark, the address sheet's red "[Invalid]" note read 2.72:1. Kalio fades the cart's total to half while the bill is recalculated (`.k-cart__receipt.-busy .k-cart__total`), and it is recalculated as the address sheet opens.
  - `components/theme-switcher/theme-switcher.scss` (copied unchanged from `new-shop-kits/theme-switcher/`):
    - the busy total keeps full strength, and the wait shows as a progress cursor;
    - Selldone's `.text-red` words take the theme's error colour (`#c4122f` light, the dark theme's readable red in dark).
  - Digito's own `.text-red` rule in `digito-pages.scss` (its sale red, `--dg-red`, 4.5:1 or more in both modes) stays.
  - **Checked live:**
    - The saved block shows 1.0.14.
    - Cart audit (drawer, cart page, address sheet; 390 and 1440): custom #ffff00 dark TOTAL 0, blue light TOTAL 0, blue dark TOTAL 0.
    - Blue dark printed 3 once: a Selldone error toast ("Your token does not have access…", a guest refusal seen in that run only) caught mid fade-in. Settled, the toast is white on #b82e24 (6:1). A re-run printed 0.
- **1.0.13 (9 November 2026, deploy 441, release `01M70G0RED79GH3C3VDP3F1W9B`, pinned on domain 1239): Custom colour, the merchant's theme settings, a showcase-only switcher, and empty states with gaps.**
  - **Custom colour** (the owner chose a free picker over a longer list of tested colours). The Theme panel has a sixth item, "Custom colour": a colour wheel that opens the browser's own colour picker.
    - The pick is applied while dragging (every 60ms at most), saved as `{palette: "custom", custom: "#rrggbb"}` and painted before the first paint. A tested palette leaves Custom.
    - The swatch shows the colour actually used, with "Adjusted for readability" when it had to change.
    - Five tested palettes plus Custom fill three full rows of two.
    - `paletteFromColor()` (`components/theme-switcher/theme-color.ts`) keeps the pick's hue and chroma (OKLCH) and moves only the lightness: white words at 6.5:1 on the header and buttons (light), 4.6:1 on dark-mode buttons that stay 3:1 against the dark card, and links at 7:1 on the dark surfaces.
    - `node components/theme-switcher/theme-color.test.mjs` checks the ten extreme picks, 2000 seeded picks and every grey: all pass.
  - **The merchant's theme settings** (the owner: a merchant should be able to tell their AI "use the yellow theme" when importing). The one file is `components/digito/digito-theme.settings.ts`:
    - `palette`, or `brandColor` (any colour);
    - `mode` (light or dark);
    - `themeSwitcher` (showcase, on or off);
    - `textOnBrand` ("auto" keeps a light brand such as yellow, with dark words on its buttons and header).

    The settings are Digito's default on any shop, painted before the first paint. For "auto", every word on the brand colour (about 100 rules, the header's pills and the wordmark among them) now comes from `--dg-on-brand`. `AGENTS.md` has a "Theme" section with the allowed values and worked examples. The README has a paragraph, and the wiki has a page, Theme and colours.
  - **The visitor switcher only on showcase shops** (the owner: a merchant who imports the Layout must not see it). `themeSwitcher: "showcase"` shows it only on Digini (15549) and Molino (15645).
    - The shop is told at boot by `window.shop.id` (written inline by Selldone's page), else by `<meta name="shop-name">`. Neither waits for `/info`.
    - Elsewhere it does nothing: no button, a stored choice is ignored, nothing follows `prefers-color-scheme`, and Vuetify and the tokens stay at the settings (at the stock default nothing at all is written).
    - Vuetify's light error red (`#c4122f`) moved out of the switcher into `storefront.ts`, so it stays when the switcher is hidden.
  - **Empty states with gaps** (the owner: "these three lines are glued together"). The FAQ's empty card now has:
    - the icon in a 56px tinted circle, 14px, the heading, 8px, the sentence (line height 1.55, at most 520px), 20px, the button;
    - 36px of padding.

    The 404's eyebrow sits 8px above its heading (was 4px). The cart, search, compare and 404 empty blocks were measured too; they already had gaps of 8px or more. The account, orders and blog empty states share `.k-board__empty`, a grid with 12px gaps; a guest cannot open them to measure.
  - **Checked on dev:**
    - **Custom picks** (`#ffff00 #00ffff #ff00ff #7fff00` in both modes, `#ffffff` light): the contrast audit and the cart audit printed 0. The rest were run live, below.
    - **Settings:**
      - Run on a stub shop that does not show the switcher: gold `#F5C400` with "auto" in light and dark, then violet in dark.
      - The contrast audit (7 pages), the cart audit, the header check and the ring sweep all printed 0.
      - The showcase header check printed 0 with each as the default.
    - **Hidden mode:** a planted dark `#ff00ff` was ignored at 390 and 1440, and the header actions kept even gaps.
    - **Empty states:** no touching pieces at 390 and 1440, in light and dark.
  - **Checked live:**
    - the saved block names 1.0.13;
    - the custom flow for `#ffff00` light and `#000000` dark at 1440 and 390: picked, saved, painted about 0.1s before the header on a reload, and left for Violet;
    - on an emulated Pixel 7, a tap lands on the native colour input as a trusted click. The picker dialog itself cannot be seen headless, and iOS was not tested;
    - for all ten extreme picks (`#ffff00 #00ffff #ffffff #000000 #808080 #ff00ff #7fff00 #ff0000 #0000ff #ffa500`) in light and dark:
      - contrast audit (6 pages, 1440 and 390): 0;
      - cart audit (drawer, cart, address sheet): 0;
      - header check (390 and 1440): PROBLEMS 0;
    - the ring sweep with `#ffff00` light and `#000000` dark: TOTAL 0;
    - the hidden mode with a stub shop: no button, a planted dark `#ff00ff` ignored;
    - the empty-state gaps: none touching.

    Runs that timed out under load were run again and passed. A first cart audit of `#7fff00` caught Selldone's error toast mid-fade; the re-run was clean.
- **1.0.12 (9 November 2026, deploy 440, release `01M70ASJSX9NTABDCDZ5EDADZV`, pinned on domain 1239): the theme switcher moves to the header.** The owner, after seeing Besti 1.0.10: "put it at the top of the header".
  - **Placement.** A "Theme" action at the top right, styled like Account (palette icon, "Theme" over Light or Dark), after Account and just before the cart. White words on the header in every palette and mode. On a phone it is the icon only, next to the account icon, and the header row neither wraps nor moves the logo.
  - **The panel.** A click opens a small panel under it: the five palettes (swatch and name; the chosen swatch has a ring inside it) and Light / Dark.
    - It has no scrim.
    - It closes on a second click, on Esc (focus back to the button), on a click outside and on a page change.
    - Tab walks into it; arrow keys move between palettes.
    - On a wide screen it lines up with the button's right edge (352px wide, never within 12px of either edge); under 600px it sits 12px from each side.
  - **The footer row is gone**, so the switcher is never shown twice.
  - **Contrast fix.** The header actions' small label is 94% white instead of 85%. On the hover tint, "Theme" and "Account" had fallen to 4.4:1.
  - **Package** (`components/theme-switcher/`, copied to `new-shop-kits/theme-switcher/`):
    - `ThemeSwitcherButton.vue` is now the default placement: the header's action class, a slot for the icon and words, the panel and its placement;
    - `ThemeModeSwitch.vue` is the Light / Dark switch shared by the panel and the footer row (kept as an option);
    - `tools/header-check.cjs` checks the button and panel;
    - `PORTING.md` says where to mount it in a Kalio header, how it behaves on a phone and how to test it.
  - **Checked:**
    - **Header check, dev:** PROBLEMS 0 for all 5 palettes × light and dark at 360, 390, 768, 1024 and 1440. It covers:
      - placement and no wrap;
      - the panel's 12px edges and no scrim;
      - the contrast of the header and the panel;
      - Esc, Tab, a second click and a click outside;
      - a pick kept after a reload.
    - **Header check, live:** PROBLEMS 0 for blue light and dark at all five widths, and for teal dark and orange light at 390 and 1440. On reload the theme lands about 0.1s before the header draws.
    - **Ring sweep:** TOTAL 0 in light and dark, on dev and live.
    - **Hover:** no underline in dark.
- **1.0.11 (9 November 2026, deploy 438, release `01M704GNV84S2K8SGK1W12DMNB`, pinned on domain 1239): the theme switcher.** This follows the owner's rule: "colour palettes and light and dark themes in the footer; a click changes the site's theme". It is the build meant as 1.0.10: that upload (deploy 437) was cut off mid-response (`UND_ERR_SOCKET` after 125s) and never extracted, so its number is used up.
  - **The footer's Theme row** sits between the link columns and the legal row. It has:
    - five palettes, each a 32px button with the colour as an inner disc and an inset ring when chosen (never an outline), with a name as tooltip and `aria-label`;
    - the chosen palette's name;
    - a Light / Dark switch.

    Every button is reachable by keyboard; Left and Right move between swatches. At 360px it wraps to two lines with no sideways scroll.
  - **One click changes everything at once**, with no reload:
    - Digito's and Kalio's tokens;
    - Vuetify's primary in both themes;
    - Vuetify's light/dark theme, so Selldone's fields, menus, dialogs and sheets follow;
    - the buy button (`--theme-btn-color` follows `--k-green`);
    - `<meta name="theme-color">`.

    The choice is kept in localStorage (`digito-theme`, behind try/catch) and painted before the app mounts, so a reload never flashes the default.
  - **The palettes**, with white text on each measured (light / dark):

    | Palette | Light | Dark |
    | --- | --- | --- |
    | Digito blue | `#0a4bd8` 6.97 | `#2563eb` 5.17 |
    | Emerald | `#05664a` 6.99 | `#047857` 5.48 |
    | Violet | `#6d28d9` 7.10 | `#7c3aed` 5.70 |
    | Ocean teal | `#0c6680` 6.51 | `#0e7490` 5.36 |
    | Sunset orange | `#a93a0b` 6.37 | `#c2410c` 5.18 |

    - Dark links and accent words on the dark card read 7.9 to 11.6:1.
    - The header, the cart drawer's head, the sign-in band, the doorbuster band and the compare share card keep the palette's light colour in both modes. Their 80–88% white words and 15% white pills need a primary of about 6.3:1. That is why emerald, teal and orange are deeper than their first picks (`#047857`, `#0e7490`, `#c2410c`, which left "Account" and the Deals pill at 4.0–4.4:1).
    - A graphite palette was dropped: it is invisible on a dark card.
  - **The switcher is a package with no Digito names**, in `components/theme-switcher/`:
    - the state and boot;
    - the footer row and its SCSS;
    - `tools/postcss-dark-tokens.mjs`;
    - `tools/contrast-audit.cjs` and `tools/cart-audit.cjs`.

    Digito's part is one config, `components/digito/digito-theme.ts`. The package, Digito's config as an example and `PORTING.md` are in `new-shop-kits/theme-switcher/`, for Tario, Walio, Dino, Valero and Molino.
  - **How dark mode works.**
    - **The build step.** `vite.config.ts` runs `postcss-dark-tokens` over the Layout's styles and Selldone's components. It rewrites every light literal colour into `var(--tsd-…, <literal>)`, with the dark values under `html.dg-dark`. Light mode computes exactly as before, and nothing is overridden from outside.
    - **Light tiles for packshots.** Product photos keep light tiles: `--k-well`/`--k-tint`, photo selectors, the doorbuster and frequently-bought-together tiles, and the variant photos.
    - **Source changes**, each one identical in light:
      - accent text goes through `--dg-link` (249 places);
      - ink fills through `--dg-ink-bg`;
      - badges with white words through `--dg-red-solid`;
      - white boxes that hold no photo through the new `--k-plain`.
    - **Other dark fixes:**
      - Selldone's inline `color="#111"` icons are lifted in dark;
      - the Apple mark is inverted.
  - **Found and fixed on the way (light mode too):**
    - The compare page's share card had white words on white: Tario's dress painted it white under Digito's blue.
    - Selldone's footer credit and GDPR link (62% opacity, 2.0–2.7:1) are now readable.
    - The phone search placeholder now reads 4.5:1.
    - Breadcrumb chevrons and empty compare stars now reach 3:1.
    - Article captions (`#ccc`) and Selldone's red "[Invalid]" notes are now readable.
    - Vuetify's light error colour is now `#c4122f`.
  - **Checked:**
    - **Contrast audit**, from computed styles, on every word and icon. On dev it covered all 5 palettes × light and dark at 1440 and 390, on home, category, deals, two products (opened in-app), compare, blog and 404, plus the cart drawer, the cart page and the address sheet (a local cart, `/buy/` blocked). Every run printed TOTAL 0, and the guest sign-in sheet was checked too.
    - **Ring sweep:** TOTAL 0 in light and dark, on dev and live.
    - **Hover:** no underline in dark.
    - **Reload:** the choice survives a reload and applies before mount.
    - **Live:** the saved block names 1.0.11. The live contrast audit printed TOTAL 0 for blue dark, orange light and teal dark (8 pages, 1440 and 390), and the cart audit printed TOTAL 0 for emerald dark and violet light.
- **1.0.9 (9 November 2026, deploy 433, release `01M6ZRW6N84JVV33912TTK22N8`, pinned on domain 1239):** the owner's ring rule. Every selection ring is drawn inside its element's own box, so no container can cut it. 1.0.6 had moved the swatch row 5px outside the card, so the first card's ring in every rail was cut by the rail's scroll edge instead. Swatches are 24px buttons with the colour as a 16px ::before disc (colour from `--sw`) and an inset 2px ring when chosen. Filter swatches are the same at 36px, chosen option tiles use an inset ring, and the compare picks have an inset edge. The product gallery is the picture at the card's width plus one row of thumbnails under it, sized so a whole number fits (7, or 5 on a phone) and the rest scroll. Before, a column of thumbnails ran far below the picture. The compare page has no yellow on differing rows (the dot and bolder values mark them) and no "/ kg" line. Checked with `ringsweep.cjs` (8 pages, 1440 and 390, live): 0 cut rings.

- **1.0.8 (9 November 2026, deploy 431, release `01M6ZQMRDY3W4R6HR5B7BEFMDB`, pinned on domain 1239):** swatches have a stronger edge (34% instead of 18%), so a white swatch reads as a white disc inside the selection ring, not an empty circle.

- **1.0.7 (9 November 2026, deploy 430, release `01M6ZQAH1F9VRJJ2C4DWSMYT19`):** the selected swatch's ring is drawn with box-shadows instead of an offset outline, which can sit a device pixel off centre at 125% and 150% screen scaling (the owner saw it on the Deal of the Day). On the product page, colour options without a photo (Selldone's picker with the name inside) are rounded tiles that share the row (76 to 112px wide, equal height, up to three lines of name). Before, they were 64px circles and "Navy Blue / Cyan / Aqua" ran out of the circle. The chosen tile no longer grows or shows a cut-off corner tick.

- **1.0.6 (9 November 2026), the owner's request ("a real timer from Selldone, 365 days; the arrow in the circle is faint; the colour circle on the left is cut off"):**
  - **Real deal timers** (`components/digito/digito-clock.ts`). Every clock counts down to the deal's own `dis_end` — the chosen variant's when it has its own pricing — by Selldone's rule (`PriceHelper.HasDiscountCountDownMode` / `GetEndOfDiscountDate`, local time); a deal without an end date shows no clock, and nothing is invented. One shared 1-second ticker drives every clock on the page. The Deal of the Day says "Ends in 364d 23:15:07" (was "Next deal in" to midnight); the deals page head says "Deals end in" (or "Next deal ends in" when deals end at different times); the product page's buy card has a yellow "Deal ends in" pill under the price; every discounted card has a quiet "Ends in …" line under "Was", reserved on every card so a row's feet stay level. Selldone's rotated countdown badge (`ProductDiscountCountdown`) is no longer mounted in the product overview or the quick-buy sheet: the line in the buy card replaces it, on the same dates. On 9 November 2026 the coordinator set every one of the 61 deals (and the 4 variants with their own discount) to run from 2026-11-09 07:00 UTC to 2027-11-09 07:00 UTC, so all 61 show, with about 364 days to go.
  - **Hero arrows:** a solid white 44px circle with a navy chevron at full weight and a shadow, both arrows always shown (the chevron had taken the slide's white text colour and the left one showed only on hover).
  - Uploaded as deploy 429 (release `01M6ZPBPJF386JPKFT83GM084K`), pinned on domain 1239; live check: the saved block names 1.0.6, the Deal of the Day reads "Ends in 364d 22:36…" and ticks, cards and the product page show the same end, at 390 and 1440. README screenshots retaken from the live shop.
  - **Swatch rings:** the swatch row keeps 5px of room on every side for the chosen swatch's ring (2px gap + 2px ring); the row's own clipping cut the first swatch's ring on its left. The capacity row matches its height, so cards with colours and cards with capacities stay level. Measured on cards, the Deal of the Day, the filter panel and the product page at 360, 390, 768, 1024 and 1440: no ring clipped, no "Ends in" line spills, every row's feet level, no sideways scroll.

- **Live check (9 November 2026, 08:22, after Selldone's outage):** https://digito.selldone.shop/ answers 200 and its `window.sdShopLayout` "saved" block names `digito-electronics` 1.0.4 (release `01M6YZGYD7CDREJTJ8HK2MANFT`); home, a category, a product (opened in-app) and the deals checked at 390 px: no sideways scroll, no errors. The live shop record has no checkout option (guests must sign in) and no payment method for the storefront (`gateways` empty), so no guest test order could be placed. README screenshots retaken from the live shop (the filled cart is the drawer with a stand-in cart put in the app's store; nothing was sent).

- **1.0.5 (9 November 2026, deploy 426, release `01M6ZKAKBDGMPV6RXV8FRZ54N6`, pinned on domain 1239):** the Deal of the Day's "Next deal in" pill drops under its title when the column is too narrow for both; at 1440 it stuck 4 px out of the card (24 px past its padding).

- **1.0.4 (9 November 2026, deploy 425, release `01M6YZGYD7CDREJTJ8HK2MANFT`, pinned on domain 1239):** the product page fills its column from the first paint (Selldone's product wrapper is a flex row that sized itself to the gallery's pictures while they loaded, so a product opened from another page could show at two thirds of the width) and uses the same 1440px column as every other page. README screenshots from the development server (the live shop answered 500 at the time); `docs/screenshots` no longer holds Tario's.

- **1.0.3 (9 November 2026, deploy 424, release `01M6YZ77YEX5JMZ7BYRAQTCS44`):** the cents are written at full size in Selldone's own prices too (its rule is scoped and `!important`, so 1.0.1's selector lost: the cart and drawer still showed "$714.50" with small cents); the footer's five service links stand on one row on a tablet (three and two left a hole).

- **1.0.2 (9 November 2026):** the account's "Pay" button is blue like every other button (it was the sale red); the compare page says "from 3 categories"; buttons inside an article's text area carry no line on hover (Terms' "Contact the shop"); a product's capacity variant is called "Capacity" (Selldone's "Size"; a shop's own variant names still win); the header search box's `rounded` prop is a boolean (a Vue warning on the order page). Uploaded as deploy 422 (release `01M6YWW1B702T9N6HSDDY72MFM`), pinned on domain 1239.

- **1.0.1 (9 November 2026):** one blue for every button at rest and one deeper blue on hover, in Kalio's own sheets too (the address sheet's Save and Continue were the deeper blue); cents at full size in every price; "Often added" draws from the whole catalogue (it read the marketplace's sellers, so a single-seller shop showed none) and adds a colour product in its first colour; Buy again maps past orders onto the full catalogue; rails always open at their first card (a browser kept a snapped card in view when a rail's list was replaced, and Top deals opened scrolled to its end); the heart stays on narrow cards; the phone footer's service row is a list; doorbuster prices and "Shop now" wrap on narrow tiles; blog titles turn blue on hover instead of underlined. Pinned on domain 1239.
- **1.0.0 (9 November 2026):** the first Digito: Home A, the header and mega menu, the footer, Digito's card in every listing, the filter panel, the three-column product page, the cart drawer (design C), About, Contact and 404 of its own, no seller interface. Layout 30 (created by this upload). Pinned on domain 1239 (`api.shops.domains.layout.set`, mode private) with the domain's own Home set to the shop page (`selldone_shop_home_domain_set`); the shop default and besti.selldone.shop untouched. Built and checked on the dev server while Selldone's storefront API answered 500 "Update in progress" for every shop (the shop's `/info` was served from a stand-in built from the dashboard's shop record).
