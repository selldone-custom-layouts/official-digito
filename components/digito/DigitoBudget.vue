<!--
  Digito — "Shop by budget": price bands cut where the shop's own prices
  fall (priceBands in digito-home.ts), each a link to every product in that
  band. Five blue pills on a computer; a phone swipes them.
-->
<template>
  <section v-if="bands.length" aria-labelledby="dg-bud-h" class="dg-sec">
    <header class="dg-head"><h2 id="dg-bud-h">{{ title || t("digito.home.shopByBudget", "Shop by budget") }}</h2></header>
    <div :style="{ '--cols': bands.length }" class="dg-bud">
      <router-link v-for="(b, i) in bands" :key="i" :to="route(b)" class="dg-bud__c">
        <b>{{ label(b) }}</b>
      </router-link>
    </div>
  </section>
</template>

<script>
import { catalogueRoute } from "../kalio/kalio-catalog";
import { allProducts, money, priceBands } from "./digito-home";
import { baseCurrency } from "../region-switcher/region";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "DigitoBudget",
  inject: ["$shop"],
  /** title: the heading; "Shop by budget" when not given. */
  props: { title: { type: String, default: null } },
  data: () => ({ bands: [] }),
  computed: {
    currency() {
      return baseCurrency();
    },
  },
  mounted() {
    allProducts().then((list) => (this.bands = priceBands(list)));
  },
  methods: {
    m(n) {
      return money(n, this.currency, true);
    },
    label(b) {
      if (b.min == null) return t("digito.budget.under", "Under {amount}", { amount: this.m(b.max) });
      if (b.max == null) return t("digito.budget.andUp", "{amount} and up", { amount: this.m(b.min) });
      return t("digito.budget.range", "{min}–{max}", { min: this.m(b.min), max: this.m(b.max) });
    },
    route(b) {
      return catalogueRoute({
        filter: JSON.stringify({ prices: { [this.currency]: [b.min ?? 0, b.max ?? 1e9] } }),
        sort: "cheapest",
      });
    },
  },
};
</script>
