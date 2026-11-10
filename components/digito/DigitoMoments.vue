<!--
  Digito — "Gear for every moment": tall photo cards, one per category that
  has a portrait photo (assets/digito/portrait-<name>), with its live line
  ("Up to $200 off" or "From $42") and "Shop now". Without photos, the five
  categories with the most products get a collage of their own products.
  Every row is full: as many columns as cards, up to five.
-->
<template>
  <section v-if="cards.length" aria-labelledby="dg-moments-h" class="dg-sec">
    <header class="dg-head"><h2 id="dg-moments-h">{{ title }}</h2></header>
    <div :style="{ '--cols': cards.length }" class="dg-tall">
      <router-link v-for="c in cards" :key="c.id" :to="c.to" class="dg-tall__c">
        <digito-photo :products="c.products" :src="c.photo" eager shape="portrait" />
        <span class="dg-tall__txt">
          <small>{{ lineOf(c) }}</small>
          <b>{{ c.title }}</b>
          <em>Shop now<digito-icon name="arrow_forward" size="17" /></em>
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import DigitoPhoto from "./DigitoPhoto.vue";
import { aisleRoute, aisles } from "../kalio/kalio-catalog";
import { allProducts, categoryLine, money, photoOf } from "./digito-home";
import { baseCurrency } from "../region-switcher/region";

export default {
  name: "DigitoMoments",
  components: { DigitoIcon, DigitoPhoto },
  inject: ["$shop"],
  props: { title: { type: String, default: "Gear for every moment" } },
  data: () => ({ cards: [], list: [] }),
  mounted() {
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      const make = (c) => ({
        id: c.id,
        title: c.title || c.name,
        photo: photoOf("portrait", c),
        products: list.filter((p) => p.category_id === c.id),
        cat: c,
        to: aisleRoute(c),
      });
      let cards = cats.filter((c) => photoOf("portrait", c)).map(make).filter((c) => c.products.length);
      if (!cards.length) cards = cats.map(make).filter((c) => c.products.length >= 3).sort((a, b) => b.products.length - a.products.length);
      this.list = Object.freeze(list); // read-only: no deep reactivity over the whole catalogue
      this.cards = cards.slice(0, 5);
    });
  },
  methods: {
    /* At render, so a currency pick redraws it at once (it was a string
       made at mount, which waited for Selldone's own redraw). */
    lineOf(c) {
      return categoryLine(c.cat, this.list, (n) => money(n, baseCurrency(), true));
    },
  },
};
</script>
