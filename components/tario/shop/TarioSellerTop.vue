<!--
  Tario — the top of a seller's page (seller page design A, 7 November 2026).

  A banner with a photo of what the seller sells most, their round mark,
  their name and a line built from their own aisles ("breads, dairy and
  the pantry"), and three live numbers: products, aisles, on sale. Tabs
  under it narrow the listing below (Shop, Deals, New) or jump to About.
  Then the seller's aisles as tiles with how many products each holds, and
  a row of the seller's deals. The page's listing (every product of this
  seller, with Tario's filter bar) follows under "All of Mason's products".

  Selldone's seller record has a name, a mark and a description; the
  numbers and aisles come from the seller's own product list.
-->
<template>
  <div class="t-sellerpage">
    <nav aria-label="Breadcrumb" class="t-crumbs">
      <router-link :to="{ name: window.$storefront.routes.SHOP_PAGE }">{{ $shop.title }}</router-link>
      <v-icon aria-hidden="true" size="16">chevron_right</v-icon>
      <span>Sellers</span>
      <v-icon aria-hidden="true" size="16">chevron_right</v-icon>
      <span aria-current="page">{{ vendor ? vendor.name : "Seller" }}</span>
    </nav>

    <section class="t-sban">
      <div :style="cover ? { backgroundImage: `url(${cover})` } : null" aria-hidden="true" class="t-sban__cover"></div>
      <div class="t-sban__body">
        <span class="t-sban__mark">
          <img v-if="mark" :src="mark" alt="" />
          <v-icon v-else size="40">storefront</v-icon>
        </span>
        <div class="t-sban__who">
          <h1>{{ vendor ? vendor.name : "" }}</h1>
          <p>An independent seller on {{ $shop.title }}<template v-if="sells_line"> · {{ sells_line }}</template></p>
        </div>
        <div class="t-sban__facts">
          <div v-if="total !== null"><b>{{ total.toLocaleString() }}</b><span>{{ total === 1 ? "product" : "products" }}</span></div>
          <div v-if="aisleTiles.length"><b>{{ aisleTiles.length }}</b><span>{{ aisleTiles.length === 1 ? "aisle" : "aisles" }}</span></div>
          <div v-if="on_sale !== null"><b>{{ on_sale.toLocaleString() }}</b><span>on sale</span></div>
        </div>
      </div>
    </section>

    <nav aria-label="Seller sections" class="t-stabs">
      <button :class="{ '-on': tab === 'shop' }" type="button" @click="$emit('tab', 'shop')">Shop</button>
      <button v-if="on_sale" :class="{ '-on': tab === 'deals' }" type="button" @click="$emit('tab', 'deals')">
        Deals ({{ on_sale.toLocaleString() }})
      </button>
      <button :class="{ '-on': tab === 'new' }" type="button" @click="$emit('tab', 'new')">New</button>
      <button type="button" @click="toAbout">About {{ vendor ? vendor.name : "" }}</button>
    </nav>

    <section v-if="aisleTiles.length" class="t-sec">
      <header class="t-sec__head">
        <h2 class="t-sec__title">{{ vendor ? vendor.name + "’s" : "The" }} aisles</h2>
      </header>
      <div class="t-saisles">
        <router-link v-for="a in aisleTiles" :key="a.aisle.id" :to="a.to" class="t-saisle">
          <img v-if="a.image" :src="a.image" alt="" loading="lazy" />
          {{ a.aisle.title || a.aisle.name }}
          <span>{{ a.count }} {{ a.count === 1 ? "product" : "products" }}</span>
        </router-link>
      </div>
    </section>

    <tario-row
      v-if="on_sale"
      :key="'deals-' + vendorId"
      :filter="{ only_has_discount: true }"
      :limit="12"
      :title="`Deals from ${vendor ? vendor.name : 'this seller'}`"
      :vendor="vendorId"
      sort="bestselling"
    />

    <section id="t-seller-about" class="t-sabout">
      <h2 class="t-sec__title">About {{ vendor ? vendor.name : "this seller" }}</h2>
      <p v-if="vendor && vendor.description">{{ vendor.description }}</p>
      <p v-else>
        {{ vendor ? vendor.name : "This seller" }} is one of {{ seller_count > 1 ? seller_count : "the" }} independent sellers on
        {{ $shop.title }}<template v-if="sells_line">, with {{ sells_line }}</template>. Everything they sell joins the
        same cart as the other sellers' products, with one checkout.
      </p>
    </section>

    <h2 class="t-sall">
      All of {{ vendor ? vendor.name + "’s" : "the" }} products
      <span v-if="total !== null">{{ total.toLocaleString() }}</span>
    </h2>
  </div>
</template>

<script>
import TarioRow from "../TarioRow.vue";
import { photo } from "../tario-home";
import { aisleImage, aisleRoute, aisles, countProducts, featured, offers, vendorImage, vendors } from "../../kalio/kalio-catalog";

/* The banner's photo, from the seller's first aisle. */
const COVERS = [
  [/bread|bakery/i, "tario-tile-bakery"],
  [/breakfast|cereal/i, "tario-tile-breakfast"],
  [/produce|fruit|veg/i, "tario-finds-produce"],
  [/meat|seafood|fish/i, "tario-tile-meat"],
  [/snack/i, "tario-tile-snacks"],
  [/household|clean/i, "tario-tile-household"],
  [/coffee|beverage|drink/i, "tario-finds-coffee"],
];

export default {
  name: "TarioSellerTop",
  components: { TarioRow },
  inject: ["$shop"],
  emits: ["tab"],

  props: {
    vendorId: { type: [Number, String], required: true },
    /** Which tab the listing shows: shop, deals or new. */
    tab: { type: String, default: "shop" },
  },

  data() {
    return {
      window,
      vendor: null,
      total: null,
      on_sale: null,
      aisleTiles: [],
      seller_count: 0,
    };
  },

  computed: {
    mark() {
      return vendorImage(this.vendor);
    },
    sells_line() {
      const names = this.aisleTiles.slice(0, 3).map((a) => String(a.aisle.title || a.aisle.name).toLowerCase().replace(/&amp;/g, "&"));
      if (!names.length) return "";
      if (names.length === 1) return names[0];
      return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    },
    cover() {
      const first = this.aisleTiles[0]?.aisle;
      const label = first ? `${first.title || ""} ${first.name || ""}` : "";
      const hit = COVERS.find(([re]) => re.test(label));
      return photo(hit ? hit[1] : "tario-hero-1-weekly") || photo("tario-hero-1-weekly");
    },
  },

  watch: {
    vendorId: { handler: "fetch", immediate: true },
  },

  methods: {
    fetch() {
      const id = this.vendorId;
      const mine = () => String(id) === String(this.vendorId);
      this.vendor = null;
      this.total = null;
      this.on_sale = null;
      this.aisleTiles = [];
      window.$storefront.vendor
        .getVendor(id)
        .then(({ vendor }) => mine() && (this.vendor = vendor || null))
        .catch(() => null);
      countProducts(null, { vendor_id: id }).then((n) => mine() && (this.total = n));
      countProducts(null, { vendor_id: id, filter: JSON.stringify({ only_has_discount: true }) }).then((n) => mine() && (this.on_sale = n));
      vendors().then((list) => (this.seller_count = list.length));
      Promise.all([offers(), aisles()]).then(([{ shelfOf }, list]) => {
        if (!mine()) return;
        const shelf = shelfOf.get(Number(id)) || shelfOf.get(id) || [];
        const counts = new Map();
        for (const p of shelf) counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1);
        this.aisleTiles = featured(list.filter((a) => counts.has(a.id))).map((aisle) => ({
          aisle,
          count: counts.get(aisle.id),
          image: aisle.icon ? aisleImage(aisle, 128) : null,
          to: aisleRoute(aisle),
        }));
      });
    },
    toAbout() {
      document.getElementById("t-seller-about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
};
</script>
