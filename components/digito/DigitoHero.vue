<!--
  Digito — the hero: a photo carousel beside the Deal of the Day.

  One slide per category that has a wide photo (assets/digito/wide-<name>),
  the deepest saving first; the words sit on the photo's dark left third
  ("Up to $589 off TVs", the category's own description and brands, "Shop
  TVs deals"). On a phone the words go under the photo. Without any wide
  photo, the three categories with the deepest savings get a collage of
  their own products. It turns every 7 seconds, stops on hover or focus,
  swipes on a phone, and never moves with reduced motion.

  The Deal of the Day is one of the shop's deals, a different one each
  day. "Ends in" counts down to that deal's own end date in Selldone (the
  owner, 9 November 2026: "a real timer from Selldone"); a deal with no end
  date shows no clock.
-->
<template>
  <section v-if="busy || slides.length || dotd" class="dg-hero">
    <div
      v-if="busy || slides.length"
      :class="{ '-busy': busy }"
      aria-roledescription="carousel"
      class="dg-bill"
      @focusin="paused = true"
      @focusout="paused = false"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div ref="track" class="dg-bill__track" @scroll.passive="onScroll">
        <article v-for="(s, i) in slides" :key="s.category.id" :aria-label="t('digito.hero.slideOf', '{n} of {total}', { n: i + 1, total: slides.length })" aria-roledescription="slide" class="dg-bill__slide">
          <digito-photo :alt="s.title" :eager="i === 0" :products="s.products" :src="s.photo" class="dg-bill__photo" shape="wide" />
          <div class="dg-bill__txt">
            <span class="dg-eyebrow"><digito-icon fill name="bolt" size="16" />{{ s.saving ? t("digito.hero.dealsOfWeek", "Deals of the week") : t("digito.hero.topPicks", "Top picks") }}</span>
            <h2 class="dg-bill__h">
              <template v-if="s.saving"
                ><template v-for="(part, k) in t('digito.hero.upTo', 'Up to {deal} {category}', { category: s.title }).split('{deal}')" :key="k"
                  ><mark v-if="k">{{ t("digito.hero.amountOff", "{amount} off", { amount: money(s.saving) }) }}</mark>{{ part }}</template
                ></template
              >
              <template v-else
                ><template v-for="(part, k) in t('digito.hero.from', '{category} from {price}', { category: s.title }).split('{price}')" :key="k"
                  ><mark v-if="k">{{ money(s.from) }}</mark>{{ part }}</template
                ></template
              >
            </h2>
            <p>{{ lineOf(s) }}</p>
            <router-link :to="s.to" class="dg-btn -lg">{{
              s.saving ? t("digito.hero.shopDeals", "Shop {category} deals", { category: s.title }) : t("digito.hero.shop", "Shop {category}", { category: s.title })
            }}</router-link>
          </div>
        </article>
      </div>
      <template v-if="slides.length > 1">
        <div class="dg-bill__dots">
          <button
            v-for="(s, i) in slides"
            :key="s.category.id"
            :aria-current="i === at"
            :aria-label="s.title"
            :class="{ '-on': i === at }"
            type="button"
            @click="go(i)"
          ></button>
        </div>
        <button :aria-label="t('digito.hero.prev', 'Previous slide')" class="dg-bill__nav -l" type="button" @click="go(at - 1)"><digito-icon name="chevron_left" size="22" /></button>
        <button :aria-label="t('digito.hero.next', 'Next slide')" class="dg-bill__nav -r" type="button" @click="go(at + 1)"><digito-icon name="chevron_right" size="22" /></button>
      </template>
    </div>

    <article v-if="dotd" class="dg-dotd">
      <div class="dg-dotd__head">
        <h2>{{ t("digito.hero.dotd", "Deal of the Day") }}</h2>
        <span v-if="dotdEnd" class="dg-clock"
          ><digito-icon name="schedule" size="16" /><template v-for="(part, k) in t('digito.clock.endsIn', 'Ends in {time}').split('{time}')" :key="k"
            ><b v-if="k">{{ dotdLeft }}</b>{{ part }}</template
          ></span
        >
      </div>
      <digito-card :max-swatches="6" :product="dotd" big class="-dotd" no-foot no-timer />
    </article>
  </section>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import DigitoCard from "./DigitoCard.vue";
import DigitoPhoto from "./DigitoPhoto.vue";
import { aisleRoute, aisles } from "../kalio/kalio-catalog";
import { allProducts, dealsOf, finalOf, money, photoOf, savingOf } from "./digito-home";
import { clock, dealEnd, leftText, releaseClock, useClock } from "./digito-clock";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "DigitoHero",
  components: { DigitoIcon, DigitoCard, DigitoPhoto },
  inject: ["$shop"],

  emits: ["dotd"],

  data: () => ({ slides: [], dotd: null, busy: true, at: 0, paused: false, reduced: false }),

  computed: {
    /** The Deal of the Day's own end, by Selldone's dates. */
    dotdEnd() {
      return this.dotd ? dealEnd(this.dotd) : null;
    },
    dotdLeft() {
      return leftText(this.dotdEnd, clock.now);
    },
  },

  mounted() {
    this.reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      this.build(cats, list);
      this.busy = false;
    });
    useClock();
    this.turnTimer = setInterval(() => {
      if (!this.paused && !this.reduced && !document.hidden && this.slides.length > 1) this.go(this.at + 1);
    }, 7000);
  },

  beforeUnmount() {
    releaseClock();
    clearInterval(this.turnTimer);
  },

  methods: {
    money(n) {
      return money(n, null, true);
    },
    /** The category's description and its brands ("From A, B and C."),
     *  read when drawn so a language pick redraws it. */
    lineOf(s) {
      const b = s.brands;
      const by = !b.length
        ? ""
        : b.length === 1
          ? t("digito.hero.byOne", "From {a}.", { a: b[0] })
          : b.length === 2
            ? t("digito.hero.byTwo", "From {a} and {b}.", { a: b[0], b: b[1] })
            : t("digito.hero.byThree", "From {a}, {b} and {c}.", { a: b[0], b: b[1], c: b[2] });
      return [s.desc && !/[.!?]$/.test(s.desc) ? s.desc + "." : s.desc, by].filter(Boolean).join(" ");
    },
    build(cats, list) {
      const brandsOf = (id) => [...new Set(list.filter((p) => p.category_id === id).map((p) => p.brand).filter(Boolean))];
      const make = (c) => {
        const ps = list.filter((p) => p.category_id === c.id);
        if (!ps.length) return null;
        const saving = Math.max(0, ...ps.map(savingOf));
        const brands = brandsOf(c.id).slice(0, 3);
        const title = c.title || c.name;
        const desc = (c.description || "").trim();
        return {
          category: c,
          title,
          saving,
          from: Math.min(...ps.map(finalOf)),
          desc,
          brands,
          photo: photoOf("wide", c),
          products: [...ps].sort((a, b) => savingOf(b) - savingOf(a)),
          to: saving ? { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } } : aisleRoute(c),
        };
      };
      let slides = cats.filter((c) => photoOf("wide", c)).map(make).filter(Boolean);
      if (!slides.length) slides = cats.map(make).filter(Boolean).sort((a, b) => b.saving - a.saving).slice(0, 3);
      this.slides = slides.sort((a, b) => b.saving - a.saving);

      /* The deal of the day: a different deal each day, from the twelve
         deepest savings by percent. */
      const deals = dealsOf(list)
        .filter((p) => Number(p.quantity) !== 0)
        .sort((a, b) => savingOf(b) / b.price - savingOf(a) / a.price)
        .slice(0, 12);
      if (deals.length) {
        const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
        this.dotd = deals[day % deals.length];
        this.$emit("dotd", this.dotd);
      }
    },
    go(i) {
      const n = this.slides.length;
      if (!n) return;
      this.at = ((i % n) + n) % n;
      const track = this.$refs.track;
      const slide = track?.children[this.at];
      if (!track || !slide) return;
      // Measured on screen, so it works left to right and right to left.
      const rtl = getComputedStyle(track).direction === "rtl";
      const a = slide.getBoundingClientRect();
      const b = track.getBoundingClientRect();
      track.scrollBy({ left: rtl ? a.right - b.right : a.left - b.left, behavior: this.reduced ? "auto" : "smooth" });
    },
    onScroll() {
      const track = this.$refs.track;
      if (!track || !track.clientWidth) return;
      this.at = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
    },
  },
};
</script>
