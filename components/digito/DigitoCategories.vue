<!--
  Digito — "Shop by category": every category as a big circle with its
  picture, in two even rows. The owner's rule (9 November 2026): both rows
  hold the same number of tiles and no slot is left empty — an "All
  categories" tile (a blue circle) makes an odd count even, and past 16 the
  first 15 show with it (categoryTiles in digito-home.ts). On a phone the
  two rows swipe sideways.
-->
<template>
  <section v-if="tiles.shown.length" aria-labelledby="dg-cats-h" class="dg-sec">
    <header class="dg-head">
      <h2 id="dg-cats-h">{{ title }}</h2>
      <router-link v-if="!tiles.all" :to="allRoute" class="dg-more">All products<digito-icon name="chevron_right" size="20" /></router-link>
    </header>
    <div :style="{ '--cols': tiles.cols }" class="dg-cats">
      <router-link v-for="c in tiles.shown" :key="c.id" :to="route(c)" class="dg-cat">
        <span class="dg-cat__ring"><img v-if="c.icon" :src="image(c)" alt="" loading="lazy" /></span>
        <b>{{ c.title || c.name }}</b>
      </router-link>
      <router-link v-if="tiles.all" :to="allRoute" class="dg-cat -all">
        <span class="dg-cat__ring"><digito-icon name="apps" size="40" /></span>
        <b>All categories</b>
      </router-link>
    </div>
  </section>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import { aisleImage, aisleRoute, aisles, catalogueRoute } from "../kalio/kalio-catalog";
import { categoryTiles } from "./digito-home";

export default {
  name: "DigitoCategories",
  components: { DigitoIcon },
  props: {
    title: { type: String, default: "Shop by category" },
    /** Categories to show; when null, the shop's own. */
    list: { type: Array, default: null },
  },
  data: () => ({ cats: [] }),
  computed: {
    tiles() {
      return categoryTiles(this.list || this.cats);
    },
    allRoute() {
      return catalogueRoute();
    },
  },
  mounted() {
    if (!this.list) aisles().then((list) => (this.cats = list));
  },
  methods: {
    route: aisleRoute,
    image: (c) => aisleImage(c, 256),
  },
};
</script>
