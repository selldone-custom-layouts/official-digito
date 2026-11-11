<!--
  Digito — the head of every listing page (a category, the catalogue, a
  search, the deals), kept short so the products show at first sight.

  A breadcrumb, the title (the category's name, "Results for “…”",
  "Today's deals" or "All products") with one line under it, and chips:
  the category's brands, a search's categories, or the categories that have
  deals. On the deals page the head is a blue band with the "Deals end in"
  clock to the soonest deal's own end date. Under it a toolbar: the sort menu on a computer; on a phone and
  tablet a sticky "Filter | Sort" bar that opens the filter sheet. No product
  counts: the shop is the point, not its size.
-->
<template>
  <div class="dg-shoptop">
    <nav :aria-label="t('listing.breadcrumb', 'Breadcrumb')" class="dg-crumbs">
      <router-link :to="{ path: '/' }">{{ t("pages.home", "Home") }}</router-link>
      <digito-icon name="chevron_right" size="16" />
      <template v-if="mode === 'aisle' && aisle">
        <router-link :to="allRoute">{{ t("listing.allProducts", "All products") }}</router-link>
        <digito-icon name="chevron_right" size="16" />
        <span aria-current="page">{{ aisle.title || aisle.name }}</span>
      </template>
      <span v-else aria-current="page">{{ crumb }}</span>
    </nav>

    <header :class="{ '-deals': mode === 'deals' }" class="dg-shoptop__head">
      <div class="dg-shoptop__txt">
        <span v-if="mode === 'deals' && dealsEnd" class="dg-clock"
          ><digito-icon name="schedule" size="16" /><template v-for="(part, i) in dealsLeftLabel.split('{time}')" :key="i"
            ><b v-if="i">{{ dealsLeft }}</b>{{ part }}</template
          ></span
        >
        <h1 :class="{ 'dg-merch': mode === 'aisle' }">{{ title }}</h1>
        <p v-if="line" :class="{ 'dg-merch': mode === 'aisle' }">{{ line }}</p>
      </div>
      <div v-if="chips.length" class="dg-shoptop__chips">
        <component
          :is="c.to ? 'router-link' : 'button'"
          v-for="c in chips"
          :key="c.key"
          :class="{ '-on': c.on }"
          :to="c.to"
          class="dg-chip"
          type="button"
          @click="c.click && c.click()"
        >
          <img v-if="c.icon" :src="c.icon" alt="" />{{ c.label }}<small v-if="c.note">{{ c.note }}</small>
        </component>
      </div>
    </header>

    <div class="dg-toolbar">
      <button class="dg-toolbar__filter" type="button" @click="sheet = true">
        <digito-icon name="tune" size="20" />{{ t("digito.shopTop.filter", "Filter") }}<b v-if="onCount">{{ onCount }}</b>
      </button>
      <label class="dg-sort">
        <span>{{ t("digito.shopTop.sortBy", "Sort by") }}</span>
        <select :aria-label="t('digito.shopTop.sortBy', 'Sort by')" :value="sort || ''" @change="$emit('update:sort', $event.target.value || null)">
          <option value="">{{ fallbackSort }}</option>
          <option v-for="s in sorts" :key="s.val" :value="s.val">{{ s.name }}</option>
        </select>
        <digito-icon name="expand_more" size="20" />
      </label>
    </div>

    <teleport to="body">
      <transition name="dg-fade">
        <div v-if="sheet" class="dg-sheet-scrim" @click="sheet = false"></div>
      </transition>
      <transition name="dg-slide">
        <aside v-if="sheet" :aria-label="t('digito.filter.title', 'Filters')" aria-modal="true" class="dg-sheet -filter" role="dialog">
          <div class="dg-sheet__head">
            <b>{{ t("digito.shopTop.filter", "Filter") }}</b>
            <button :aria-label="t('common.close', 'Close')" class="dg-x" type="button" @click="sheet = false"><digito-icon name="close" size="22" /></button>
          </div>
          <div class="dg-sheet__body">
            <slot name="panel" />
          </div>
          <div class="dg-sheet__foot">
            <button class="dg-btn -block" type="button" @click="sheet = false">{{ t("digito.shopTop.showResults", "Show results") }}</button>
          </div>
        </aside>
      </transition>
    </teleport>
  </div>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import { SORTS, countOn } from "../tario/shop/tario-filters";
import { aisleImage, aisleRoute, aisles, catalogueRoute } from "../kalio/kalio-catalog";
import { allProducts, money, savingOf } from "./digito-home";
import { baseCurrency } from "../region-switcher/region";
import { clock, dealEnd, leftText, releaseClock, soonestEnd, useClock } from "./digito-clock";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "DigitoShopTop",
  components: { DigitoIcon },
  inject: { $shop: { default: null } },

  props: {
    /** aisle | search | deals | catalogue */
    mode: { type: String, default: "catalogue" },
    aisle: { type: Object, default: null },
    search: { type: String, default: "" },
    filter: { type: Object, default: null },
    sort: { type: String, default: null },
    /** The products the listing shows now (a search's categories). */
    products: { type: Array, default: () => [] },
  },
  emits: ["update:sort", "brand"],

  data: () => ({ sheet: false, all: [], cats: [] }),

  computed: {
    sorts() {
      return SORTS;
    },
    fallbackSort() {
      return this.mode === "search" ? t("digito.shopTop.bestMatch", "Best match") : t("digito.shopTop.featured", "Featured");
    },
    onCount() {
      return countOn(this.filter);
    },
    allRoute() {
      return catalogueRoute();
    },
    crumb() {
      if (this.mode === "search") return t("common.search", "Search");
      if (this.mode === "deals") return t("listing.todaysDeals", "Today’s deals");
      return t("listing.allProducts", "All products");
    },
    title() {
      if (this.mode === "aisle") return this.aisle?.title || this.aisle?.name || "";
      if (this.mode === "search") return t("digito.shopTop.resultsFor", "Results for “{search}”", { search: this.search });
      if (this.mode === "deals") return t("listing.todaysDeals", "Today’s deals");
      return t("listing.allProducts", "All products");
    },
    line() {
      if (this.mode === "aisle") return this.aisle?.description || "";
      if (this.mode === "deals") return t("digito.shopTop.dealsLine", "Real savings on the shop’s own prices. A new Deal of the Day every midnight.");
      if (this.mode === "search") return "";
      return t("digito.shopTop.allLine", "Everything in the shop, ready to filter.");
    },
    /** The soonest end among the shop's running deals (Selldone's dates). */
    dealsEnd() {
      return this.mode === "deals" ? soonestEnd(this.all.filter((p) => savingOf(p) > 0)) : null;
    },
    /** One end for every deal reads "Deals end in"; different ends, the
        next. The words keep "{time}", where the clock is drawn. */
    dealsLeftLabel() {
      const ends = new Set(this.all.filter((p) => savingOf(p) > 0).map((p) => dealEnd(p)).filter((e) => e != null));
      return ends.size > 1 ? t("digito.shopTop.nextEndsIn", "Next deal ends in {time}") : t("digito.shopTop.dealsEndIn", "Deals end in {time}");
    },
    dealsLeft() {
      return leftText(this.dealsEnd, clock.now);
    },
    currency() {
      return baseCurrency();
    },
    chips() {
      if (this.mode === "aisle" && this.aisle) {
        const brands = [...new Set(this.all.filter((p) => p.category_id === this.aisle.id).map((p) => p.brand).filter(Boolean))];
        if (brands.length < 2) return [];
        const on = this.filter?.brands || [];
        return brands.map((b) => ({ key: b, label: b, on: on.includes(b), click: () => this.$emit("brand", b) }));
      }
      if (this.mode === "deals") {
        return this.cats
          .map((c) => {
            const best = Math.max(0, ...this.all.filter((p) => p.category_id === c.id).map(savingOf));
            return best
              ? {
                  key: c.id,
                  label: c.title || c.name,
                  note: t("digito.line.upTo", "Up to {amount} off", { amount: money(best, this.currency, true) }),
                  icon: c.icon ? aisleImage(c, 64) : null,
                  to: { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } },
                  best,
                }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.best - a.best);
      }
      if (this.mode === "search") {
        const ids = new Set(this.products.map((p) => p.category_id));
        return this.cats
          .filter((c) => ids.has(c.id))
          .map((c) => ({ key: c.id, label: c.title || c.name, icon: c.icon ? aisleImage(c, 64) : null, to: aisleRoute(c) }));
      }
      return [];
    },
  },

  watch: {
    /* Close the filter sheet when the shopper goes to another page. Each tick
       in the sheet writes the filter into the query (?filter=…), which closed
       the sheet after every tap on a phone; the path stays the same then. */
    "$route.path"() {
      this.sheet = false;
    },
    sheet(open) {
      document.documentElement.classList.toggle("dg-locked", open);
    },
  },

  mounted() {
    allProducts().then((list) => (this.all = list));
    aisles().then((list) => (this.cats = list));
    useClock();
  },

  beforeUnmount() {
    releaseClock();
    document.documentElement.classList.remove("dg-locked");
  },

};
</script>
