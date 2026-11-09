<!--
  Digito — the 404 page (design A of the page mockups, digini-design/404-a.html).

  The route sits outside the storefront layout, so the page brings the
  Layout's own header and footer with it. A friendly heading, a search,
  the way home and to today's deals, the categories as circles (two even
  rows) and a row of deals.
-->
<template>
  <div class="dg-404-page">
    <kalio-header v-if="shop" @search="onSearch" />
    <main class="dg-page dg-404">
      <section class="dg-sec dg-404__top">
        <span aria-hidden="true" class="dg-404__mark"><digito-icon name="search" size="40" /></span>
        <p class="dg-404__code">Page not found · 404</p>
        <h1>We couldn’t find that page</h1>
        <p class="dg-404__lede">It may have moved, or the link has a typo. Try a search, or start from one of these.</p>
        <form class="dg-404__search" role="search" @submit.prevent="search">
          <input v-model.trim="q" :placeholder="`Search ${shop?.title || ''}`" aria-label="Search the shop" type="search" />
          <button aria-label="Search" class="dg-btn" type="submit"><digito-icon name="search" size="20" /></button>
        </form>
        <div class="dg-404__acts">
          <router-link :to="{ path: '/' }" class="dg-btn">Go to the home page</router-link>
          <router-link :to="deals" class="dg-btn -line">Today’s deals</router-link>
        </div>
      </section>
      <digito-categories v-if="shop" title="Shop by category" />
      <digito-rail v-if="shop" :filter="{ only_has_discount: true }" :more-to="deals" lazy more-label="See all deals" title="Top deals" />
    </main>
    <kalio-footer v-if="shop" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KalioHeader from "../../../components/kalio/shell/KalioHeader.vue";
import KalioFooter from "../../../components/kalio/shell/KalioFooter.vue";
import DigitoIcon from "../../../components/digito/DigitoIcon.vue";
import DigitoCategories from "../../../components/digito/DigitoCategories.vue";
import DigitoRail from "../../../components/digito/DigitoRail.vue";
import { dealsRoute } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { KalioHeader, KalioFooter, DigitoIcon, DigitoCategories, DigitoRail },
  data: () => ({ q: "" }),
  computed: {
    shop() {
      return this.getShop();
    },
    deals() {
      return dealsRoute();
    },
  },
  methods: {
    search() {
      if (!this.q) return;
      this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: this.q } });
    },
    onSearch(event: any) {
      const text = typeof event === "string" ? event : event?.search || "";
      if (text) this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: text } });
    },
  },
});
</script>
