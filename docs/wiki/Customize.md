# Customize

The design lives in Digito's own components and style sheets, over the components it shares with Molino and Tario. Selldone's commerce logic underneath stays untouched.

## The name, the logo, the photos

- **Name:** `BRAND.name` in `components/kalio/kalio-brand.ts` (one line). The wordmark (`DigitoWordmark.vue`) writes it in lower case with a yellow square over every "i"; the tab title and every line that names the shop follow. `null` shows the shop's own title.
- **Mark:** `assets/brand/digito-mark.svg` (64 × 64): the tab icon, the chat avatar on the order page, the compare page's badge. Selldone accepts only plain SVG attributes (no `style`).
- **Photos:** `assets/digito/<shape>-<category name>.webp` (see [Shop Requirements](Shop-Requirements)). The file name is the map; nothing else to edit.

## Colours, type and spacing

- **Tokens:** `style/kalio-tokens.scss` — the action blue (`--k-green`, `--k-green-deep`: Kalio's names are kept so every shared component follows), the sale red (`--k-coral`), the grey floor (`--k-paper`), ink, lines, radii. Vuetify's primary colour is the same blue (`--v-theme-primary`), so Selldone's own parts don't show the theme's purple.
- **Digito's palette:** the `--dg-*` variables at the top of `style/digito-skin.scss` (blue, yellow accent, red, navy, the floor, radii, the font).
- **Typefaces:** Plus Jakarta Sans and Material Symbols Rounded, loaded in `components/kalio/kalio-fonts.ts` (from the app, not `index.html`). Only the icons in its `ICONS` list are loaded: add a new icon there, or it shows as its name.

## Where each part is

| Part | Files |
| --- | --- |
| Home sections | `components/digito/DigitoHome.vue` (the order), `DigitoHero.vue`, `DigitoCategories.vue`, `DigitoRail.vue`, `DigitoDoorbusters.vue`, `DigitoBento.vue`, `DigitoTagSplit.vue`, `DigitoSignInNudge.vue`, `DigitoMoments.vue`, `DigitoBudget.vue`, `DigitoBrands.vue`, `DigitoBlog.vue`; shared reads in `digito-home.ts` |
| The product card (home and every listing) | `components/digito/DigitoCard.vue`; `digito-card.ts` puts it in place of Selldone's card |
| The quick-buy sheet (capacities) | `digito-quick.ts`, `DigitoQuickHost.vue`, `components/kalio/KalioQuickBuy.vue` |
| Header, mega menu, footer, drawers, sign-in | `components/kalio/shell/`, `components/digito/DigitoMegaMenu.vue` |
| Category, catalogue, search, deals | `pages/products/StorefrontPageProducts.vue`, `components/digito/DigitoShopTop.vue`, `DigitoFilterPanel.vue` |
| Product page | `components/digito/DigitoProductOverview.vue`, `DigitoFbt.vue`, `pages/product/StorefrontPageProduct.vue` |
| Cart, address sheet, delivery, payment window | `pages/basket/cart/`, `components/kalio/checkout/`, `components/kalio/shell/KalioBasketDrawer.vue` |
| Order page | `pages/basket/order/`, `components/kalio/order/` |
| Buyer account | `components/kalio/account/`, `pages/user/` |
| About, Contact, 404, blog | `pages/official/`, `pages/errors/404/`, `pages/blog/` |
| Compare | `components/kalio/compare/` (words in `compare-skin.ts`) |
| Styles | `style/digito-skin.scss` (home, header, footer, cards, listings), `style/digito-pages.scss` (every other page), both loaded last |

[`DIGITO.md`](https://github.com/selldone-custom-layouts/official-digito/blob/main/DIGITO.md) explains what Digito changed and why; [`KALIO.md`](https://github.com/selldone-custom-layouts/official-digito/blob/main/KALIO.md) explains every shared behaviour and each workaround.

## Rules that keep it working

- **Re-skin, don't replace.** Keep Selldone's scripts for the cart, bill, checkout, variants and orders; change templates and styles.
- **Prefix every class** (`dg-…`). Short names collide with Selldone's.
- **Live data only.** Never hard-code product names, prices, categories or URLs.
- **No line under any word or icon** (only links inside an article's text). Put `text-decoration: none` on the clickable element itself: a card is a link and its hover line reaches every word inside.
- **Flat buttons, hover = colour only.** No lift, no shadow.
- **Two-row grids stay even.** Use `categoryTiles()` for category grids; for any other grid, set the columns so every row is full.
- **Vuetify draws icons as `<i>`; Digito's icons are `<span class="dg-ms">`.** A rule that hides `span` hides the icon too: write `span:not(.dg-ms)`.
- **Sticky needs `overflow: clip`.** `.v-application` has `overflow: hidden`.
- **Fixed panels:** teleport them to `body`; inside a Vuetify overlay they land off-screen on a phone.
- **Never commit inside `modules/*`.** Keep a fix there as a patch in `patches/`.

## Test before you release

- Check the phone first: 360 and 390 px wide. Then tablet (768, 1024), laptop (1366, 1440) and desktop (1920).
- Walk through as a shopper: add products from cards (a colour, a capacity), open the drawer, the cart, add an address on the map, fill the checkout up to Pay.
- Hover every link and button: no underline anywhere.
- Look for overlapping or clipped text, off-centre icons, empty boxes, half-empty rows, anything under a fixed bar, Selldone's default look showing through.
