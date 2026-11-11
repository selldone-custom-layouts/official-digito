<!--
  Digito — "Frequently bought together" on the product page: this product
  and two partners, a "+" between them, the price for all three and "Add
  all three". Selldone gives a storefront no bought-together data, so the
  partners are the best sellers of the neighbouring categories (in the
  shop's own category order), each one that a single tap can add (it comes
  in colours, not capacities). A box per item takes it out of the bundle.
-->
<template>
  <section v-if="items.length > 1" aria-labelledby="dg-fbt-h" class="dg-sec dg-fbt">
    <header class="dg-head"><h2 id="dg-fbt-h">{{ t("digito.fbt.title", "Frequently bought together") }}</h2></header>
    <div class="dg-fbt__row">
      <template v-for="(it, i) in items" :key="it.p.id">
        <span v-if="i" aria-hidden="true" class="dg-fbt__plus"><digito-icon name="add" size="20" /></span>
        <div :class="{ '-off': !it.on }" class="dg-fbt__item">
          <router-link :to="route(it.p)" class="dg-fbt__img"><img :src="image(it.p)" alt="" loading="lazy" /></router-link>
          <div class="dg-fbt__txt">
            <small>{{ i === 0 ? t("digito.fbt.thisItem", "This item") : catName(it.p) }}</small>
            <router-link :to="route(it.p)" class="dg-fbt__t">{{ it.p.title }}</router-link>
            <span class="dg-fbt__p"><b>{{ fmt(finalOf(it.p)) }}</b><em v-if="savingOf(it.p) > 0" class="dg-save">{{ t("digito.card.save", "Save {amount}", { amount: fmt(savingOf(it.p), true) }) }}</em></span>
            <label class="dg-check">
              <input v-model="it.on" type="checkbox" />
              <i><digito-icon name="check" size="15" /></i>
              <span>{{ t("digito.fbt.include", "Include") }}</span>
            </label>
          </div>
        </div>
      </template>
      <div class="dg-fbt__sum">
        <small>{{ priceFor }}</small>
        <b>{{ fmt(total) }}</b>
        <span v-if="saved > 0" class="dg-save">{{ t("digito.card.save", "Save {amount}", { amount: fmt(saved, true) }) }}</span>
        <button :disabled="!picked.length || busy" class="dg-btn -block" type="button" @click="addAll">
          <digito-icon name="add_shopping_cart" size="19" />{{ addLabel }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import { aisleIndex, aisles, productImage } from "../kalio/kalio-catalog";
import { addColour, quickAdd } from "../kalio/kalio-basket";
import { allProducts, finalOf, money, savingOf } from "./digito-home";
import { openQuickBuy } from "./digito-quick";
import { t } from "../kalio/i18n/kalio-i18n";

const hasCapacity = (p) => (p.variants || p.product_variants || []).some((v) => v.volume);
const firstColour = (p) => (p.variants || p.product_variants || []).find((v) => v.color)?.color || null;

export default {
  name: "DigitoFbt",
  components: { DigitoIcon },
  inject: { $shop: { default: null } },
  props: { product: { type: Object, required: true } },
  data: () => ({ items: [], cats: new Map(), busy: false, done: false }),
  computed: {
    picked() {
      return this.items.filter((it) => it.on);
    },
    total() {
      return this.picked.reduce((s, it) => s + finalOf(it.p), 0);
    },
    saved() {
      return this.picked.reduce((s, it) => s + savingOf(it.p), 0);
    },
    /** "Price for all three" (or two), else "Price for 1 selected". */
    priceFor() {
      if (this.picked.length === this.items.length) {
        return this.items.length === 3
          ? t("digito.fbt.priceForAllThree", "Price for all three")
          : t("digito.fbt.priceForAllTwo", "Price for all two");
      }
      const n = this.picked.length;
      return t("digito.fbt.priceForSelected", { one: "Price for {n} selected", other: "Price for {n} selected" }, { n });
    },
    addLabel() {
      if (this.done) return t("digito.fbt.added", "Added — see your cart");
      if (this.picked.length === this.items.length) {
        return this.items.length === 3 ? t("digito.fbt.addAllThree", "Add all three") : t("digito.fbt.addAllTwo", "Add all two");
      }
      return t("digito.fbt.addSelected", "Add selected");
    },
  },
  watch: {
    "product.id": { handler: "build", immediate: true },
  },
  methods: {
    finalOf,
    savingOf,
    fmt(n, short = false) {
      return money(n, null, short ? "auto" : false);
    },
    image: (p) => productImage(p, true),
    route: (p) => ({ name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } }),
    catName(p) {
      const c = this.cats.get(p.category_id);
      return c ? c.title || c.name : "";
    },
    build() {
      this.done = false;
      Promise.all([aisles(), allProducts(), aisleIndex()]).then(([cats, list, index]) => {
        this.cats = index;
        const me = list.find((p) => p.id === this.product.id) || this.product;
        const at = cats.findIndex((c) => c.id === me.category_id);
        const order = [];
        for (let d = 1; d < cats.length; d++) {
          if (cats[at + d]) order.push(cats[at + d]);
          if (cats[at - d]) order.push(cats[at - d]);
        }
        const partners = [];
        for (const c of order) {
          if (partners.length >= 2) break;
          const best = list
            .filter((p) => p.category_id === c.id && Number(p.quantity) > 0 && !hasCapacity(p))
            .sort((a, b) => (b.sells || 0) - (a.sells || 0) || savingOf(b) - savingOf(a))[0];
          if (best) partners.push(best);
        }
        this.items = [me, ...partners].map((p) => ({ p, on: true }));
      });
    },
    async addAll() {
      this.busy = true;
      try {
        for (const it of this.picked) {
          const colour = firstColour(it.p);
          if (hasCapacity(it.p)) openQuickBuy(it.p);
          else if (colour) await addColour(this, it.p, colour);
          else await quickAdd(this, it.p, openQuickBuy);
        }
        this.done = true;
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
