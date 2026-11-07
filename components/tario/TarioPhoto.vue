<!--
  Tario — a lifestyle photo, or the aisle's own packshots in its place.

  The hero, the promo tiles and "Fresh finds" each have a photo slot. When
  the Layout carries the photo (assets/tario/, see tario-home.ts), it fills
  the slot, cropped to it. Until then — or for an aisle no photo was made
  for — the slot shows a still life of real products from that aisle on its
  own pale ground: up to four packshots, one large, the others around it.
  The slot never shows an empty box or a stock picture of something the
  shop does not sell.
-->
<template>
  <div :class="['t-photo', '-' + shape, { '-still': !src }]" :style="{ '--t-ground': ground }">
    <img v-if="src" :alt="alt" :src="src" class="t-photo__img" loading="lazy" />
    <template v-else>
      <img
        v-for="(product, i) in shown"
        :key="product.id"
        :class="'-p' + (i + 1)"
        :src="picture(product)"
        :srcset="srcset(product)"
        alt=""
        class="t-photo__pack"
        loading="lazy"
        sizes="(max-width: 760px) 40vw, 220px"
        @error="dropSrcset"
      />
    </template>
  </div>
</template>

<script>
import { productImage, productSrcset, dropSrcset } from "../kalio/kalio-catalog";

export default {
  name: "TarioPhoto",

  props: {
    /** The bundled photo's address, or null for the still life. */
    src: { type: String, default: null },
    alt: { type: String, default: "" },
    /** Products for the still life (the first is the large one). */
    products: { type: Array, default: () => [] },
    /** The still life's ground. */
    ground: { type: String, default: "#f3f3f3" },
    /** wide (the hero), square, tall or tile: where the packshots sit. */
    shape: { type: String, default: "tile" },
  },

  computed: {
    shown() {
      return this.products.filter((product) => product?.icon).slice(0, this.shape === "wide" ? 4 : 3);
    },
  },

  methods: {
    srcset(product) {
      return productSrcset(product);
    },
    dropSrcset,
    picture(product) {
      return productImage(product);
    },
  },
};
</script>
