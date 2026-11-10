<!--
  Digito — the "Shop" mega menu: every category on the left (its picture,
  name, and "Up to $X off" or "From $Y"); on the right the pointed
  category's top deals as four small cards and its photo tile. Opened by a
  click on "Shop" and closed by a second one (KalioHeader); no dark scrim.
-->
<template>
  <div class="dg-mega" @keydown.esc="$emit('close')">
    <nav aria-label="Categories" class="dg-mega__list">
      <router-link
        v-for="c in cats"
        :key="c.id"
        :class="{ '-on': active && active.id === c.id }"
        :to="route(c)"
        class="dg-mega__cat"
        @click="$emit('close')"
        @focus="active = c"
        @mouseenter="active = c"
      >
        <span class="dg-mega__ring"><img v-if="c.icon" :src="image(c)" alt="" loading="lazy" /></span>
        <span class="dg-mega__name"><b>{{ c.title || c.name }}</b><small>{{ line(c) }}</small></span>
        <digito-icon name="chevron_right" size="18" />
      </router-link>
      <router-link :to="allRoute" class="dg-mega__all" @click="$emit('close')">All products<digito-icon name="arrow_forward" size="18" /></router-link>
    </nav>

    <div v-if="active" class="dg-mega__side">
      <div class="dg-mega__head">
        <h3>{{ active.title || active.name }}</h3>
        <router-link :to="route(active)" class="dg-more" @click="$emit('close')">Shop all<digito-icon name="chevron_right" size="18" /></router-link>
      </div>
      <div class="dg-mega__deals">
        <router-link v-for="p in picks" :key="p.id" :to="productRoute(p)" class="dg-mega__p" @click="$emit('close')">
          <span class="dg-mega__pimg"><img :src="pimage(p)" alt="" loading="lazy" /></span>
          <span class="dg-mega__pt">{{ p.title }}</span>
          <span class="dg-mega__pp"><b>{{ m(finalOf(p), false) }}</b><em v-if="savingOf(p) > 0">Save {{ m(savingOf(p)) }}</em></span>
        </router-link>
      </div>
      <router-link :to="route(active)" class="dg-mega__photo" @click="$emit('close')">
        <digito-photo :products="inCat(active)" :src="photo(active)" shape="square" />
        <span><small>{{ line(active) }}</small><b>{{ active.title || active.name }}</b></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import DigitoPhoto from "./DigitoPhoto.vue";
import { aisleImage, aisleRoute, aisles, catalogueRoute, productImage } from "../kalio/kalio-catalog";
import { allProducts, categoryLine, finalOf, money, photoOf, savingOf } from "./digito-home";

export default {
  name: "DigitoMegaMenu",
  components: { DigitoIcon, DigitoPhoto },
  inject: { $shop: { default: null } },
  emits: ["close"],
  data: () => ({ cats: [], all: [], active: null }),
  computed: {
    allRoute() {
      return catalogueRoute();
    },
    picks() {
      if (!this.active) return [];
      return [...this.inCat(this.active)].sort((a, b) => savingOf(b) - savingOf(a)).slice(0, 4);
    },
  },
  mounted() {
    aisles().then((list) => {
      this.cats = list;
      if (!this.active) this.active = list[0] || null;
    });
    allProducts().then((list) => (this.all = list));
  },
  methods: {
    finalOf,
    savingOf,
    route: aisleRoute,
    image: (c) => aisleImage(c, 64),
    pimage: (p) => productImage(p, true),
    photo(c) {
      return photoOf("square", c) || photoOf("portrait", c) || photoOf("wide", c);
    },
    inCat(c) {
      return this.all.filter((p) => p.category_id === c.id);
    },
    m(n, short = true) {
      return money(n, null, short);
    },
    line(c) {
      return categoryLine(c, this.all, (n) => this.m(n));
    },
    productRoute(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
  },
};
</script>
