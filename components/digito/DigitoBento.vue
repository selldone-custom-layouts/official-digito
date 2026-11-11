<!--
  Digito — Best sellers as a bento: the #1 big on the left, as tall as the
  two rows of four beside it. Built from the shop's best-seller tag
  (digito-home.ts tagIndex); no tagged product, no section. Rows are always
  full: eight small cards, or four, or (with fewer) a plain rail.
-->
<template>
  <section v-if="list.length >= 5" aria-labelledby="dg-best-h" class="dg-sec">
    <header class="dg-head">
      <h2 id="dg-best-h">{{ heading }}</h2>
    </header>
    <div :class="'-rows' + rows" class="dg-bento">
      <div class="dg-bento__big">
        <span class="dg-rank">#1</span>
        <digito-card :max-swatches="6" :product="list[0]" big no-foot />
      </div>
      <digito-card v-for="p in small" :key="p.id" :product="p" class="dg-bento__s" no-foot />
    </div>
  </section>
  <digito-rail v-else-if="list.length" :items="list" :title="heading" />
</template>

<script>
import DigitoCard from "./DigitoCard.vue";
import DigitoRail from "./DigitoRail.vue";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "DigitoBento",
  components: { DigitoCard, DigitoRail },
  props: {
    products: { type: Array, default: () => [] },
    /** The heading; "Best sellers" when not given. */
    title: { type: String, default: null },
  },
  computed: {
    heading() {
      return this.title || t("digito.home.bestSellers", "Best sellers");
    },
    list() {
      return this.products;
    },
    rows() {
      const rest = this.list.length - 1;
      return rest >= 8 ? 2 : 1;
    },
    small() {
      return this.list.slice(1, 1 + this.rows * 4);
    },
  },
};
</script>
