<!--
  Digito — doorbuster tiles: one per category, its deepest saving, under a
  blue band ("Doorbuster · Save $500 · 35% off TVs"). Every row is full:
  as many columns as tiles, up to four (a phone swipes them).
-->
<template>
  <section v-if="tiles.length" :style="{ '--cols': tiles.length }" aria-label="Doorbusters" class="dg-door">
    <router-link v-for="t in tiles" :key="t.p.id" :to="to(t.p)" class="dg-door__t">
      <div class="dg-door__band">
        <small>Doorbuster</small>
        <strong>Save {{ money(t.save) }}</strong>
        <em>{{ t.pct }}% off {{ t.cat }}</em>
      </div>
      <div class="dg-door__body">
        <div class="dg-door__img">
          <img :src="image(t.p)" :srcset="srcset(t.p)" alt="" loading="lazy" sizes="(max-width: 760px) 70vw, 300px" @error="dropSrcset" />
        </div>
        <span class="dg-door__name">{{ t.p.title }}</span>
        <div class="dg-door__row">
          <b>{{ money(t.now, false) }}</b><s>{{ money(t.p.price, false) }}</s>
          <span class="dg-btn -sm">Shop now</span>
        </div>
      </div>
    </router-link>
  </section>
</template>

<script>
import { aisleIndex, dropSrcset, productImage, productSrcset } from "../kalio/kalio-catalog";
import { finalOf, money, pctOf, savingOf } from "./digito-home";

export default {
  name: "DigitoDoorbusters",
  inject: ["$shop"],
  props: {
    /** Deals not shown higher up, deepest first. */
    deals: { type: Array, default: () => [] },
  },
  emits: ["used"],
  data: () => ({ cats: new Map() }),
  computed: {
    tiles() {
      const seen = new Set();
      const out = [];
      for (const p of this.deals) {
        if (out.length >= 4) break;
        if (seen.has(p.category_id)) continue;
        seen.add(p.category_id);
        const c = this.cats.get(p.category_id);
        out.push({ p, save: savingOf(p), pct: pctOf(p), now: finalOf(p), cat: c?.title || c?.name || "" });
      }
      return out;
    },
  },
  watch: {
    tiles(list) {
      this.$emit("used", list.map((t) => t.p.id));
    },
  },
  mounted() {
    aisleIndex().then((m) => (this.cats = m));
  },
  methods: {
    dropSrcset,
    image: (p) => productImage(p),
    srcset: (p) => productSrcset(p),
    money(n, short = true) {
      return money(n, null, short ? "auto" : false);
    },
    to(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
  },
};
</script>
