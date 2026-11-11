<!--
  Digito — Home A "Deals hub" (approved by the owner, 8 November 2026).

  Best Buy's sections, in Digito's own dress, top to bottom:

    the photo hero carousel and the Deal of the Day
    Shop by category — two even rows of big circles
    Top deals — one line of cards, deepest savings, spread by category
    Doorbusters — one tile per category
    <Tag> Items — the shop's own tags (any tag but best-seller / new)
    Best sellers — a bento from the best-seller tag
    Sign in (guests only)
    Gear for every moment — tall photo cards
    Trending now — Selldone's most visited
    Shop by budget — price bands from the shop's own prices
    New arrivals — the new-arrival tag, else the newest
    Shop by brand — one row and See all
    the four newest articles, last

  Everything is read live; a section with nothing to show is not drawn. A
  product shows once on the page where the shop has enough of them. The
  header and footer are the Layout's (KalioHeader, KalioFooter). It shows
  on the bare shop page only: any query shows the listing.
-->
<template>
  <div class="dg-home dg-page">
    <digito-hero @dotd="(p) => (dotd = p)" />

    <digito-categories />

    <digito-rail
      v-if="topDeals.length || !loaded"
      :items="topDeals"
      :more-label="t('digito.home.seeAllDeals', 'See all deals')"
      :more-to="dealsRoute"
      :pending="!loaded"
      :title="t('digito.home.topDeals', 'Top deals')"
    />

    <digito-doorbusters :deals="doorDeals" />

    <digito-rail v-for="row in tagSlots[0]" :key="row.tag" :items="row.products" :title="row.title" />

    <digito-bento :products="bestSellers" />

    <digito-rail v-for="row in tagSlots[1]" :key="row.tag" :items="row.products" :title="row.title" />

    <digito-sign-in-nudge />

    <digito-moments />

    <digito-rail :exclude="early" :more-to="trendingRoute" :title="t('digito.home.trending', 'Trending now')" lazy sort="most_visited" spread />

    <digito-budget />

    <digito-rail v-if="newTagged.length >= 4" :items="newTagged" :more-to="newRoute" :title="t('digito.home.newArrivals', 'New arrivals')" />
    <digito-rail v-else-if="tagsKnown" :exclude="early" :more-to="newRoute" :title="t('digito.home.newArrivals', 'New arrivals')" lazy sort="newest" />

    <digito-brands />

    <template v-for="(pair, i) in pairs" :key="'pair' + i">
      <digito-tag-split v-if="pair.length === 2" :rows="pair" />
      <digito-rail v-else :items="pair[0].products" :title="pair[0].title" />
    </template>

    <digito-blog />
  </div>
</template>

<script>
import DigitoHero from "./DigitoHero.vue";
import DigitoCategories from "./DigitoCategories.vue";
import DigitoRail from "./DigitoRail.vue";
import DigitoDoorbusters from "./DigitoDoorbusters.vue";
import DigitoBento from "./DigitoBento.vue";
import DigitoSignInNudge from "./DigitoSignInNudge.vue";
import DigitoMoments from "./DigitoMoments.vue";
import DigitoBudget from "./DigitoBudget.vue";
import DigitoBrands from "./DigitoBrands.vue";
import DigitoBlog from "./DigitoBlog.vue";
import DigitoTagSplit from "./DigitoTagSplit.vue";
import { catalogueRoute, dealsRoute } from "../kalio/kalio-catalog";
import { allProducts, dealsOf, isBestSellerTag, isNewTag, mix, tagIndex, tagTitle } from "./digito-home";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "DigitoHome",
  components: {
    DigitoHero,
    DigitoCategories,
    DigitoRail,
    DigitoDoorbusters,
    DigitoBento,
    DigitoSignInNudge,
    DigitoMoments,
    DigitoBudget,
    DigitoBrands,
    DigitoBlog,
    DigitoTagSplit,
  },

  data: () => ({ all: [], loaded: false, dotd: null, byTag: new Map(), tagsKnown: false }),

  computed: {
    deals() {
      return dealsOf(this.all).filter((p) => !this.dotd || p.id !== this.dotd.id);
    },
    topDeals() {
      return mix(this.deals, 12);
    },
    doorDeals() {
      const used = new Set(this.topDeals.map((p) => p.id));
      const rest = this.deals.filter((p) => !used.has(p.id));
      return rest.length >= 4 ? rest : this.deals;
    },
    bestSellers() {
      for (const [tag, list] of this.byTag) if (isBestSellerTag(tag)) return mix(list, 9);
      return [];
    },
    newTagged() {
      for (const [tag, list] of this.byTag) if (isNewTag(tag)) return mix(list, 12);
      return [];
    },
    /** Every other tag in use: its own "<Tag> Items" row, biggest first,
        dealt into three places so no two rows of tags stand together
        unless there are more than three. */
    tagRows() {
      return [...this.byTag.entries()]
        .filter(([tag, list]) => !isBestSellerTag(tag) && !isNewTag(tag) && list.length)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([tag, list]) => ({ tag, title: t("digito.home.tagItems", "{tag} Items", { tag: tagTitle(tag) }), products: mix(list, 12) }));
    },
    tagSlots() {
      const rows = this.tagRows;
      return [rows.slice(0, 1), rows.slice(1, 2), rows.slice(2)];
    },
    /** The tags past the second, two to a section. */
    pairs() {
      const rest = this.tagSlots[2];
      const out = [];
      for (let i = 0; i < rest.length; i += 2) out.push(rest.slice(i, i + 2));
      return out;
    },
    /** Shown in the first sections; the later rows leave them out. */
    early() {
      return [...this.topDeals, ...this.bestSellers].map((p) => p.id);
    },
    dealsRoute() {
      return dealsRoute();
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
    trendingRoute() {
      return catalogueRoute({ sort: "most_visited" });
    },
  },

  mounted() {
    allProducts().then((list) => {
      this.all = list;
      this.loaded = true;
    });
    tagIndex()
      .then(({ byTag }) => (this.byTag = byTag))
      .finally(() => (this.tagsKnown = true));
  },
};
</script>
