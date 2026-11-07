<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<!--
  🍉 This view will be shown in the StorefrontLayout.vue ▶ <router-view> component.

  Header
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Top Shop Menu                      ┃
  ┃  + <s-storefront-primary-header>   ┃
  ┃  + <s-storefront-top-menu>         ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Primary Footer
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Show Vendor Info                   ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Products Listing
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ ⬜⬜⬜ ┃ 🟨   🟨   🟨   🟨   🟨  ┃
  ┃ ⬜⬜⬜ ┃ 🟨   ⬛   ⬛   ⬛   ⬛  ┃
  ┃ ⬜⬜⬜ ┃ ⬛   ⬛   ⬛   ⬛   ⬛  ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  -->
<template>
  <div>
    <v-card
      :flat="isMobile"
      class="s--shop-card s--shadow-no-padding -hide1720 pb-16"
    >
      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Top Shop Menu ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <div
        :class="{
          'add-marginal-side-menu-open':
            show_filter_menu && $vuetify.display.smAndUp,
        }"
        style="transition: all 400ms ease"
      >
        <slot name="header" :center="true"></slot>
      </div>

      <!--
        One page, four Kalio states. Selldone routes the shop page, every
        aisle and every seller to this same component, so the home page, the
        aisle sign and the seller storefront are chosen here by route. The
        home page stands on its own; the other three hand over to the live
        listing below, and so does the shop page once a query (search,
        filter, sort, "All products") asks for the catalogue itself.
      -->

      <!-- Full width: Kalio's filter panel sits beside the grid below, not
           beside these, so they are not pushed aside when it opens. -->
      <div>
      <!-- ▆▆▆▆▆▆▆▆ Seller: hero + shelf ▆▆▆▆▆▆▆▆ -->
      <!-- Replaces Selldone's one-line s-shop-vendor-header, which carries only
           the seller's name and avatar — no commerce state — so nothing is lost. -->
      <kalio-seller-hero v-if="vendor_id" :vendor-id="vendor_id" />
      <kalio-seller-shelf v-if="vendor_id" :key="vendor_id" :vendor-id="vendor_id" />

      <!-- ▆▆▆▆▆▆▆▆ Aisle: the sign over a category page ▆▆▆▆▆▆▆▆ -->
      <kalio-aisle-header
        v-if="category_name && !vendor_id"
        :category-name="category_name"
        :total="catalogue_total"
      />

      <!-- ▆▆▆▆▆▆▆▆ Catalogue: every product, a search, the deals ▆▆▆▆▆▆▆▆ -->
      <kalio-catalogue-header v-if="catalogue" :total="catalogue_total" />

      <!-- ▆▆▆▆▆▆▆▆ Shop page: the home ▆▆▆▆▆▆▆▆ -->
      <!-- Shown on the bare shop page only. Every narrowing action the
           listing performs travels as a query parameter, so the home page
           gets out of the way the moment a shopper searches or filters. -->
      <!-- Tario: a big-box home (design A, 7 November 2026), not Molino's. -->
      <tario-home v-if="show_home" />
      </div>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Products Listing ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <s-products-listing
        v-if="!show_home"
        :key="$route.path"
        :class="{ '-catalogue': catalogue }"
        :vendor-id="vendor_id"
        :has-breadcrumb="!category_name && !vendor_id"
        has-filter
        has-sort
        load-more
        route-mode
        update-route
        @fetch-products="updateProductsSeo"
      ></s-products-listing>
    </v-card>

    <!-- The catalogue's "+" opens Kalio's quick-buy sheet (kalio-listing-quick-buy.ts). -->
    <kalio-quick-buy v-model="quick_open" :product="quick_pick" />
  </div>
</template>

<script lang="ts">
import SProductsListing from "@selldone/components-vue/storefront/products/listing/SProductsListing.vue";
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import TarioHome from "../../components/tario/TarioHome.vue";
import KalioAisleHeader from "../../components/kalio/KalioAisleHeader.vue";
import KalioCatalogueHeader from "../../components/kalio/KalioCatalogueHeader.vue";
import KalioSellerShelf from "../../components/kalio/KalioSellerShelf.vue";
import KalioSellerHero from "../../components/kalio/KalioSellerHero.vue";
import {StorefrontSeo} from "../../helpers/StorefrontSeo";
import KalioQuickBuy from "../../components/kalio/KalioQuickBuy.vue";
import { hostQuickBuy } from "../../components/kalio/kalio-listing-quick-buy";
import { quickAdd } from "../../components/kalio/kalio-basket";
import "../../components/kalio/kalio-card-basket"; // a card in the basket shows − n +

export default {
  name: "StorefrontPageProducts",
  components: {
    SProductsListing,
    TarioHome,
    KalioAisleHeader,
    KalioCatalogueHeader,
    KalioQuickBuy,
    KalioSellerShelf,
    KalioSellerHero,
  },
  mixins: [TemplateMixin],

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    vendor_id: null /*Show only for this vendor! */,
    seoNavigation: StorefrontSeo.captureNavigation(),
    catalogue_total: null /* The listing's total, for the aisle and catalogue headers. */,
    quick_open: false /* Kalio's quick-buy sheet, for the listing's "+". */,
    quick_pick: null,
  }),
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Compute Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    shop_theme() {
      return this.getShop()?.theme;
    },
    show_filter_menu() {
      return this.$store.getters.getShowFilterMenu;
    },

    category_name() {
      return this.$route.params?.category_name || null;
    },

    /* The shop page asked for the catalogue itself (no aisle, no seller). */
    catalogue() {
      return (
        String(this.$route.name || "").startsWith(window.$storefront.routes.SHOP_PAGE) &&
        !this.vendor_id &&
        !this.show_home
      );
    },

    show_home() {
      return (
        String(this.$route.name || "").startsWith(window.$storefront.routes.SHOP_PAGE) &&
        !this.vendor_id &&
        !Object.keys(this.$route.query || {}).length
      );
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    /* Layout default: on a grocery shelf "add to basket" belongs on the card.
       The listing shows Quick Buy only when the shop theme sets hover_actions.
       A merchant who has set it either way is respected; one who never
       touched it gets the grocery default. A watcher, not a one-shot write in
       created(): the storefront swaps in a fresh shop object when it refreshes
       the shop, and that swap silently discarded the earlier write. */
    shop_theme: {
      handler(theme) {
        if (!theme) return;
        if (theme.hover_actions === undefined) theme.hover_actions = true;
        /* Insta is a photo wall: the name and price only on hover, and no
           "+" below a laptop. As a starting view it hid a grocery card's
           name, so the shelf starts on the normal grid. A shopper who picks
           Insta from the toolbar still gets it, and keeps it: the listing
           reads their saved choice before the theme. */
        for (const device of ["mobile", "tablet", "pc"]) {
          if (theme[device] === "insta") theme[device] = "normal";
        }
      },
      immediate: true,
    },
    "$route.path"() {
      this.seoNavigation = StorefrontSeo.captureNavigation();
      /* A new aisle or seller starts without a count until its listing reads. */
      this.catalogue_total = null;
    },
    /* The router reuses this one component for the catalogue root, every
       aisle and every seller, so created() runs only for the first of them:
       a shopper who clicked a seller on the market front kept vendor_id null
       and landed on the whole catalogue under a seller URL. The id is read
       again whenever the route record changes. Within one record it stays as
       upstream intends — sticky while the listing rewrites the query. */
    "$route.name"() {
      this.vendor_id = this.vendorIdFromRoute();
    },
    /* One seller to another is the same record with a new param. */
    "$route.params.vendor_id"() {
      this.vendor_id = this.vendorIdFromRoute();
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  created() {
    this.releaseQuickBuy = hostQuickBuy((product) =>
      quickAdd(this, product, (picked) => {
        this.quick_pick = picked;
        this.quick_open = true;
      }),
    );

    // ━━━━━━━ Initialize by query ━━━━━━━

    /*First load keep vendor ID to show products for this vendor.*/
    this.vendor_id = this.vendorIdFromRoute();

    this.setPageTitle(); // Set Page Title!
  },
  beforeUnmount() {
    this.releaseQuickBuy?.();
  },

  methods: {
    vendorIdFromRoute() {
      return this.$route.params?.vendor_id
        ? this.$route.params?.vendor_id
        : this.$route.query?.vendor_id || null;
    },
    updateProductsSeo(data) {
      this.catalogue_total = typeof data?.total === "number" ? data.total : null;
      StorefrontSeo.updateProducts(data, this.getShop(), this.seoNavigation);
    },
  },
};
</script>
