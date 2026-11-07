# Tario — Selldone Layout

**Tario Market** (package `tario-market`) is the second Layout of the Selldone shop **molino** (shop 15645). It started on 7 November 2026 as a copy of Molino Market Hall (`kalio-market-hall`, layout 23, release 0.2.30) and was re-dressed in a red, big-box style. The owner asked for "a new one like Target's site, with the same red theme… checkout built right", named tario, on `tario.selldone.shop`.

Every behaviour of Molino is kept, because the owner asked for each of them:

- "Add to basket" turns into "− n in basket +" in place, and "See options" shows for products with sizes;
- no "Added to basket" pop-up and no phone bottom bar;
- the two-step, map-first address sheet, with suggestions while typing;
- the receipt that follows Selldone's bill, and Pay leading to whatever is missing;
- the reviews (design A), the buyer account (design A, "desk") and the content pages.

[`KALIO.md`](KALIO.md) explains every one of them and every Selldone workaround. Read it before changing anything.

## What makes it Tario

| Area | Molino | Tario |
| --- | --- | --- |
| Action colour | deep green `#155b42` | red `#cc0000` (the token is still called `--k-green`) |
| Savings | coral | the same red |
| Type | Fraunces headings, DM Sans | Inter for everything; headings 800, tight |
| Corners | 20 px cards | 12 px cards, 8 px small |
| Header | white, aisle words in grey | a **red promo strip** that scrolls away (the shop's free-shipping rule); a white bar with the wordmark and its round red dot, **Categories ▾, Deals, New arrivals, Sellers ▾**, a grey search pill with a round red button, Sign in and a cart icon with its count; no aisle strip |
| Product pictures | each aisle's pastel tint | one light-grey well (`--k-well`); aisle rings and the mosaic keep their colours |
| Footer | deep green, with a band above it | light `#fafafa` under a 4 px red rule, ink headings, no band |
| Stars | amber | near-black |
| Home page | deals counter, aisle ribbon, rails, mosaic, shelf | a big-box home (design A), see below |
| Cards | Selldone's card, pill "Add to basket" | Tario's own card on the home (price first, red on offer, "reg $x", "Sale"); a square red **"Add to cart"** on every card, "Choose options" for sizes, "− n in cart +" |
| Checkout | "Your details" eyebrow | numbered steps: **1 Review your items**, **2 Delivery & contact**, **3 Order summary** (white card, red Place button, grey when something is missing) |

- The token values are in `style/kalio-tokens.scss`.
- The structural differences are in `style/tario-skin.scss`, loaded last.
- The step headings are in `pages/basket/cart/StorefrontPageBasketCart.vue` (`.t-step`).
- Every green literal of Molino's stylesheets was mapped to a red or a grey.

## The home page (design A, 1.1.0)

The owner rejected 1.0.0's home ("like Target means the home page's sections like Target's, not Molino with the colour turned red"), asked for two mockups per page, and approved **A** (`kalio-design/tario-options/home-a.html`). It is `components/tario/`, styled by `style/tario-home.scss` (loaded after `tario-skin.scss`):

| Section | Component | Read from |
| --- | --- | --- |
| Hero that turns: deals, new, the fresh aisle | `TarioHero.vue` | discounted best sellers (best saving by Selldone's rule), newest, the produce aisle or the first featured one; turns every 7 s, stops on hover or focus, swipes on a phone, never moves with reduced motion |
| Shop by category | `TarioCircles.vue` | every aisle, its picture on its tint |
| Top deals (or Popular this week) | `TarioRow.vue` + `TarioCard.vue` | discounted best sellers, spread by aisle |
| Deals for every aisle | `TarioTiles.vue` | breakfast, snacks, bakery, household, meat when the shop has them, else the next aisles; "Up to N% off" only when the aisle has offers |
| Ways to get it | `TarioWays.vue` | `shop.transportations` that are on, with their free rule |
| New arrivals | `TarioRow.vue` | newest |
| Fresh finds | `TarioFinds.vue` | produce, drinks, dinner aisles |
| Trending in &lt;aisle&gt; | `TarioRow.vue` | every aisle, lazily |
| Shop our sellers | `TarioSellers.vue` | the marketplace's sellers and their shelves |

- **Photos:** eleven lifestyle photos in `assets/tario/` (made with Codex from `kalio-design/tario-options/image-prompts-A.md`), picked up at build time by `import.meta.glob` in `tario-home.ts`. A missing photo is not an error: its slot shows a still life of that aisle's own packshots (`TarioPhoto.vue`). Selldone's CDN converts each one to WebP on its first request, so the very first visit after a release is slow to show them.
- **Words:** shopper-facing "basket" became "cart" in the cards, the header, the drawer, the footer and the sign-in sheet.
- **Spacing:** Selldone's 20vh under every page is 24 px (`StorefrontLayout.vue`); the footer has its own margin. The sticky receipt, order summary and product pictures sit 92 px down (the bar alone; the promo strip scrolls away).
- **Still Molino's:** the category, product, cart, checkout and account pages. Each gets two mockups and the owner's choice before it is rebuilt.

## The same shop, two Layouts

- molino's **default** Layout stays Molino Market Hall (23) on `molino.selldone.shop`, `molino.myselldone.com` and every domain that inherits.
- **`tario.selldone.shop` alone** carries Tario: its domain Layout is set to `mode: private` with Tario's layout id and exact version (`api.shops.domains.layout.set`), **not inherit**.
- When releasing Tario, never pin the shop default: that would put Tario on molino's own address.
- Check both addresses after every release: each `window.sdShopLayout` "saved" block must name its own package.
- The shop's name and logo come from its data, so Tario's header says "molino". Nothing is hard-coded.
- Guest baskets and sign-ins are per domain.

## Releases

- **1.0.0 (7 November 2026):** the first Tario. It was checked on the dev server with:
  - `cardcheck.cjs` on phone, tablet and computer (everything passed except the old test's expectation that Compare is green);
  - `reviewscheck.cjs` on phone, tablet and computer;
  - `buyer2.cjs` on computer (the phone run of that older script stops at the address form, which is now behind the map step; `cardcheck.cjs` covers the two steps);
  - `qasweep.cjs`.
- **1.1.0 (7 November 2026):** the big-box home (design A), the new header and footer, square red "Add to cart" everywhere, "cart" for "basket", and the eleven photos. 374 files; the upload took 35 s. Checked on the dev server with `kalio-design/review/tariohome.cjs` (computer, tablet and phone: every section, add to cart and take it out, no errors, no sideways scroll) and `tariopages.cjs` (category, product, cart and drawer under the new header), then live with `tariolive.cjs`. Pinned on domain 1232 only; molino stays 0.2.30 and walio 1.0.0.
