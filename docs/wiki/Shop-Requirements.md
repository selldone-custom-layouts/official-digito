# Shop Requirements

The Layout reads everything from your shop. Nothing about molino is hard-coded. Here is what your shop's data needs so that each part looks as it does on [tario.selldone.shop](https://tario.selldone.shop).

## Shop settings

| Setting | What to set | Where it shows |
| --- | --- | --- |
| **Home** | The **Shop** page, not a Page Builder landing page | `/` shows the Layout's home. With a landing page as Home, `/` shows that page and the Layout's home is only at `/shop`. |
| **Business model** | Marketplace (vendors), or a normal shop | Seller names, seller cards and seller pages appear only when there are vendors. Otherwise they fold away. |
| **Payment methods** | At least one, for your currency | Without one, the basket says the shop is not taking payments yet, and Pay does not open an empty window. |
| **Shipping methods / pickup points** | What you offer | "Delivery method" in the basket appears only when there is a choice. |
| **Login modes, OAuth** | Your choice. Your custom domain gets Selldone's OAuth callback automatically. | Sign-in window |
| **Currency, country, language** | Your market | Prices, address form, texts |

## Categories (aisles)

- Each **top-level category is an aisle**. It gets a ring in the aisle row, a row of best sellers on the home, a tile in the mosaic, and its own page.
- Give each category:
  - an **icon or picture**: square, on a plain or transparent background (shown round);
  - a short **description**, shown under the aisle title;
  - a clear **title**.
- Order matters. Fresh, everyday aisles (produce, dairy, bakery…) lead the home; the rest follow in your order.

## Products

- **Photos:** a clean packshot on a plain or transparent background. Every product sits on the same pale "well", so busy photos look out of place.
- **Title:** two lines show on cards, then an ellipsis.
- **Unit:** fill Selldone's *unit* field (pack, bottle, lb…). Cards show "per pack".
- **Sizes:** use **variants**, so the card says "Choose options" and the product page shows the sizes. Don't use separate products for each size.
- **Stock:** quantity 0 shows "Out of stock".
- **Description:** what a shopper needs. No notes from whoever generated the data.

## Sellers and deals (marketplace)

- Give each vendor a **logo** and a **name**: they appear on every card and on the seller page.
- A product can have **several sellers**, each with its own offer. The product page lists them, and the price follows the chosen one.
- **Deals must be on each seller's offer.** A discount set only on the product row is not what the basket charges.
- ⚠️ Creating or deleting a vendor offer makes Selldone **recompute the product's and its variants' prices** (lowest offer) and **clear the product discount**. Save your prices before bulk vendor changes and check them after.

## Ratings and reviews

- **What shows:** a product's average and its number of ratings appear on its cards and under its title. They show only once someone has rated it.
- **Rating criteria:** set them in your shop's dashboard, e.g. Freshness, Taste, Packaging, Value. The Reviews block lists them with their averages under "How it rates".
- **Who can rate:** only shoppers who bought the product. Any signed-in shopper can write one review per product. Buyers get a "Verified Buyer" badge and their own stars on their review.
- **Replying:** answer reviews from the dashboard; your reply shows under the review.
- **What Selldone doesn't offer:** a 5-to-1 star breakdown, "helpful" votes, review photos, and sorting the catalogue by rating. The Layout doesn't fake them.

## Filters (specs)

The aisle page's filters come from **product specs** and the category's **filter list**.

- Store specs **flat**: `{"At a Glance": "group", "Type": ["Whole milk"], "Size range": ["Over 32 fl oz"]}` plus a `spec_order` with every key. A nested spec (`{"Group": {"Key": "value"}}`) is silently ignored.
- Selldone already has SIZE, WEIGHT and PACK filters for variants. Call your own key **"Size range"**, not "Size".
- A category's filter values are collected **when its filter list is saved**. After editing specs, save the list again.
- Use only what the data really says. Don't add an "Organic" filter if no product says organic.

## Content pages

- **About, Terms, Privacy:** write them in your shop's profile. Until then, the Layout shows general sample text under a clear "Sample text" note.
- **Blog:** your posts appear in the journal. Selldone's demo posts are shown with the same note.

## Quick checklist

- [ ] Home = Shop page
- [ ] Every top-level category has an icon and a description
- [ ] Every product has a clean photo, a unit and a stock quantity
- [ ] Sizes are variants
- [ ] Vendors have logos, and discounts are on their offers
- [ ] Specs are flat, and category filter lists are saved
- [ ] At least one payment method and one shipping method
- [ ] About, Terms and Privacy written
