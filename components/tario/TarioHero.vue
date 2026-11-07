<!--
  Tario — the hero (design A): a split banner that turns.

  A big-box home opens on a wide banner: a photo on one side, a coloured
  panel with the offer on the other, arrows and dots to turn it. Tario's
  three slides are all live:

   1. The deals: "Fresh picks, up to N% off", N being the best saving among
      the shop's discounted best sellers by Selldone's own rule, and the
      aisles those deals come from. A shop with no discount gets its best
      sellers and a headline that promises no saving.
   2. What is new: the newest products.
   3. The fresh aisle (produce when the shop has one, else its first
      featured aisle), with the aisle's own description.

  Each photo is the bundled one when the Layout carries it (tario-home.ts),
  otherwise a still life of that slide's own products. A slide with no
  products is left out. It turns by itself every seven seconds, stops while
  the pointer or the keyboard is on it, and never moves for a shopper who
  asked for reduced motion. On a phone it is swiped.
-->
<template>
  <section
    :aria-busy="!slides.length"
    aria-label="This week"
    aria-roledescription="carousel"
    class="t-hero k-wrap"
    @focusin="hold = true"
    @focusout="hold = false"
    @mouseenter="hold = true"
    @mouseleave="hold = false"
  >
    <div v-if="!slides.length" aria-hidden="true" class="t-hero__frame -busy">
      <div class="t-hero__slide -red">
        <div class="t-photo -wide -still"></div>
        <div class="t-hero__panel"></div>
      </div>
    </div>

    <div v-else class="t-hero__frame" @pointerdown="swipeFrom" @pointerup="swipeTo">
      <div :style="{ transform: `translateX(${(rtl ? 1 : -1) * at * 100}%)` }" class="t-hero__track">
        <div
          v-for="(slide, i) in slides"
          :key="slide.key"
          :aria-hidden="i !== at"
          :aria-label="`${i + 1} of ${slides.length}`"
          :class="'-' + slide.tone"
          :inert="i !== at"
          aria-roledescription="slide"
          class="t-hero__slide"
          role="group"
        >
          <router-link :to="slide.to" class="t-hero__pic" tabindex="-1">
            <tario-photo
              :alt="slide.alt"
              :ground="slide.ground"
              :products="slide.products"
              :src="slide.photo"
              shape="wide"
            />
          </router-link>
          <div class="t-hero__panel">
            <p class="t-hero__eyebrow">{{ slide.eyebrow }}</p>
            <h2 class="t-hero__title">{{ slide.title }}</h2>
            <p v-if="slide.lede" class="t-hero__lede">{{ slide.lede }}</p>
            <div class="t-hero__ctas">
              <router-link :to="slide.to" class="t-btn -main">
                {{ slide.cta }}<v-icon class="k-flip" size="20">chevron_right</v-icon>
              </router-link>
              <button v-if="i === 0" class="t-btn -line" type="button" @click="toAisles">Browse aisles</button>
            </div>
          </div>
        </div>
      </div>

      <template v-if="slides.length > 1">
        <button aria-label="Previous slide" class="t-arrow -hero -back" type="button" @click="go(at - 1)">
          <v-icon class="k-flip" size="24">chevron_left</v-icon>
        </button>
        <button aria-label="Next slide" class="t-arrow -hero -next" type="button" @click="go(at + 1)">
          <v-icon class="k-flip" size="24">chevron_right</v-icon>
        </button>
        <div class="t-hero__dots">
          <button
            v-for="(slide, i) in slides"
            :key="slide.key"
            :aria-current="i === at"
            :aria-label="`Slide ${i + 1}: ${slide.title}`"
            :class="{ '-on': i === at }"
            type="button"
            @click="go(i)"
          ></button>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import TarioPhoto from "./TarioPhoto.vue";
import { aisleIndex, aisleRoute, aisles, catalogueRoute, dealsRoute, featured, percentOff, tintFor } from "../kalio/kalio-catalog";
import { DEALS_FILTER, findAisle, headline, listProducts, photo } from "./tario-home";

const TURN_MS = 7000;
const FRESH = /produce|fruit|veg/i;

function spread(products) {
  const queues = new Map();
  for (const product of products) {
    if (!queues.has(product.category_id)) queues.set(product.category_id, []);
    queues.get(product.category_id).push(product);
  }
  const out = [];
  while (out.length < products.length) for (const queue of queues.values()) if (queue.length) out.push(queue.shift());
  return out;
}

export default {
  name: "TarioHero",
  components: { TarioPhoto },

  data() {
    return {
      slides: [],
      at: 0,
      hold: false,
      hidden: false,
      start_x: null,
    };
  },

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    shopTitle() {
      return this.shop?.title || "Tario";
    },
    rtl() {
      return this.$vuetify.locale.isRtl;
    },
  },

  mounted() {
    this.build();
    this.still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    this.onVisibility = () => (this.hidden = document.hidden);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.timer = setInterval(() => {
      if (!this.still && !this.hold && !this.hidden && this.slides.length > 1) this.go(this.at + 1);
    }, TURN_MS);
  },

  beforeUnmount() {
    clearInterval(this.timer);
    document.removeEventListener("visibilitychange", this.onVisibility);
  },

  methods: {
    async build() {
      const shop = this.shopTitle;
      const [deals, fresh, list, index] = await Promise.all([
        listProducts(null, 12, { filter: DEALS_FILTER, sort: "bestselling" }),
        listProducts(null, 8, { sort: "newest" }),
        aisles(),
        aisleIndex(),
      ]);
      const ordered = featured(list);
      const slides = [];

      if (deals.length) {
        const best = Math.max(0, ...deals.map((product) => percentOff(this.shop, product)));
        const withDeals = new Set(deals.map((product) => product.category_id));
        const names = ordered
          .filter((aisle) => withDeals.has(aisle.id))
          .slice(0, 3)
          .map((aisle) => (aisle.title || aisle.name).toLowerCase());
        slides.push({
          key: "deals",
          tone: "red",
          eyebrow: `This week at ${shop}`,
          title: best ? `Fresh picks, up to ${best}% off` : "Fresh picks on offer",
          lede: names.length
            ? `Real savings from ${shop}’s sellers on ${names.join(", ")} and more.`
            : `Real savings from ${shop}’s sellers.`,
          cta: "Shop deals",
          to: dealsRoute(),
          photo: photo("tario-hero-1-weekly"),
          alt: "A kitchen counter with a bag of fresh groceries",
          products: spread(deals),
          ground: "#f6efe6",
        });
      } else {
        const popular = await listProducts(null, 8, { sort: "bestselling" });
        if (popular.length)
          slides.push({
            key: "popular",
            tone: "red",
            eyebrow: `This week at ${shop}`,
            title: "Fresh picks from every aisle",
            lede: `${shop}’s best sellers, ready for your cart.`,
            cta: "Shop best sellers",
            to: catalogueRoute({ sort: "bestselling" }),
            photo: photo("tario-hero-1-weekly"),
            alt: "A kitchen counter with a bag of fresh groceries",
            products: spread(popular),
            ground: "#f6efe6",
          });
      }

      if (fresh.length)
        slides.push({
          key: "new",
          tone: "soft",
          eyebrow: "Just in",
          title: "New on the shelves",
          lede: `The latest from ${shop}’s sellers, ready to add to your cart.`,
          cta: "See what’s new",
          to: catalogueRoute({ sort: "newest" }),
          photo: photo("tario-hero-2-new"),
          alt: "Groceries being unpacked on a kitchen island",
          products: fresh,
          ground: "#eef1f4",
        });

      const aisle = findAisle(ordered, FRESH) || ordered[0];
      if (aisle) {
        const pics = await listProducts(aisle.name, 6, { sort: "bestselling" });
        const title = aisle.title || aisle.name;
        if (pics.length)
          slides.push({
            key: "aisle-" + aisle.id,
            tone: "deep",
            eyebrow: title,
            title: headline(aisle),
            lede: aisle.description || `Everything in ${title.toLowerCase()}, from ${shop}’s sellers.`,
            cta: `Shop ${title.toLowerCase()}`,
            to: aisleRoute(aisle),
            photo: FRESH.test(`${aisle.title} ${aisle.name}`) ? photo("tario-hero-3-fresh") : null,
            alt: `${title} on display`,
            products: pics,
            ground: tintFor(index.get(aisle.id) || aisle),
          });
      }

      this.slides = slides;
    },

    go(i) {
      const n = this.slides.length;
      if (!n) return;
      this.at = (i + n) % n;
    },

    toAisles() {
      document.getElementById("t-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    /* A swipe of more than 40px turns the banner on a touch screen. */
    swipeFrom(e) {
      this.start_x = e.pointerType === "mouse" ? null : e.clientX;
    },
    swipeTo(e) {
      if (this.start_x == null) return;
      const dx = e.clientX - this.start_x;
      this.start_x = null;
      if (Math.abs(dx) < 40) return;
      this.go(this.at + ((dx < 0) !== this.rtl ? 1 : -1));
    },
  },
};
</script>
