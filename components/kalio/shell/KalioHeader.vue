<!--
  Digito — the header (Home A "Deals hub", 8 November 2026): a blue bar, the
  wordmark on the left, a big round white search, Account, and the Cart with
  its count (a yellow badge) and total. A second row of pills: "Shop ▾"
  opens the category mega menu on a click and closes it on the second
  (DigitoMegaMenu, no dark scrim), Deals, New arrivals, Brands; then a few
  live categories (the ones with the most deals), and Track order, Blog and
  Help on the right. On a phone: the wordmark, account and cart; the search
  across the width; the pills in a sideways row (the menu button opens the
  categories drawer). Never a bottom tab bar.

  Every working part is the platform's: the search box and its events (the
  layout's onSearch/onClear), sign-in through the app's need-login event,
  the cart count and lines from the storefront mixin, the language and
  currency pickers. A shop with custom header code keeps Selldone's header
  (the layout decides), and a native app shell shows none.
-->
<template>
  <header v-if="!$store.getters.getIsNative" class="k-header dg-header">
    <div class="dg-header__top">
      <router-link :aria-label="t('header.home', '{shop} home', { shop: shopTitle })" :to="homeRoute" class="dg-header__brand"><digito-wordmark /></router-link>

      <div v-if="showSearch && !compact" class="dg-header__search">
        <s-storefront-search-box
          v-model:expand-input="globalStyle.search_mode"
          :dark="false"
          :negative-qr-margin="false"
          :placeholder="t('digito.header.search', 'Search {shop}', { shop: shopTitle })"
          :title="t('digito.header.search', 'Search {shop}', { shop: shopTitle })"
          color="#0f1729"
          flat
          no-qr
          persistent-placeholder
          rounded
          variant="solo"
          @onClear="$emit('clear')"
          @onSearch="(event) => $emit('search', event)"
        />
      </div>
      <span v-else class="dg-header__sp"></span>

      <nav :aria-label="t('header.yourAccount', 'Your account')" class="dg-header__acts">

        <router-link v-if="user" :to="profileRoute" :aria-label="t('header.yourAccount', 'Your account')" class="dg-header__act">
          <img v-if="user.id && !avatar_failed" :src="getUserAvatar(user.id)" alt="" class="dg-header__avatar" height="28" width="28" @error="avatar_failed = true" />
          <digito-icon v-else name="person" size="26" />
          <span><small>{{ t("digito.header.account", "Account") }}</small><b>{{ firstName }}</b></span>
        </router-link>
        <button v-else :disabled="busyUser" class="dg-header__act" type="button" @click="signIn">
          <digito-icon name="person" size="26" />
          <span><small>{{ t("digito.header.account", "Account") }}</small><b>{{ busyUser ? "…" : t("digito.header.signIn", "Sign in") }}</b></span>
        </button>

        <!-- The badge counts units, as the drawer's "3 items" does (it counted
             lines: 2 for one camera and two of another). -->
        <button :aria-label="t('digito.header.cartAria', { one: 'Cart, {n} item', other: 'Cart, {n} items' }, { n: basketUnits })" class="dg-header__act -cart" type="button" @click="basket = true">
          <digito-icon name="shopping_cart" size="26" />
          <i v-if="basketUnits" class="dg-header__count">{{ basketUnits }}</i>
          <span><small>{{ t("digito.header.cart", "Cart") }}</small><b><template v-if="cartTotal">{{ money(cartTotal.amount, cartTotal.currency) }}</template><template v-else>{{ t("digito.header.empty", "Empty") }}</template></b></span>
        </button>
      </nav>

      <!-- Phone: the search across the width. Selldone's search box
           autofocuses on a phone (the keyboard would open on every page),
           so it is mounted only once the pill is tapped, already open. -->
      <div v-if="showSearch && compact" class="dg-header__search -below">
        <s-storefront-search-box
          v-if="phone_search"
          :dark="false"
          :expand-input="true"
          :negative-qr-margin="false"
          :placeholder="t('digito.header.search', 'Search {shop}', { shop: shopTitle })"
          :title="t('digito.header.search', 'Search {shop}', { shop: shopTitle })"
          color="#0f1729"
          flat
          no-qr
          persistent-placeholder
          rounded
          variant="solo"
          @onClear="$emit('clear')"
          @onSearch="(event) => { phone_search = false; $emit('search', event); }"
        />
        <button v-else class="dg-header__pill-search" type="button" @click="phone_search = true">
          <span>{{ t("digito.header.search", "Search {shop}", { shop: shopTitle }) }}</span><digito-icon name="search" size="22" />
        </button>
      </div>
    </div>

    <nav :aria-label="t('digito.header.shop', 'Shop')" class="dg-header__nav">
      <v-menu
        v-if="!compact"
        v-model="mega"
        :close-on-content-click="false"
        :scrim="false"
        content-class="dg-mega-pop"
        location="bottom start"
        offset="8"
      >
        <template v-slot:activator="{ props }">
          <button :aria-expanded="mega" :class="{ '-on': mega }" class="dg-pill -shop" type="button" v-bind="props">
            <digito-icon name="menu" size="18" />{{ t("digito.header.shop", "Shop") }}<digito-icon :name="mega ? 'expand_less' : 'expand_more'" size="18" />
          </button>
        </template>
        <digito-mega-menu @close="mega = false" />
      </v-menu>
      <button v-else class="dg-pill -shop" type="button" @click="menu = true">
        <digito-icon name="menu" size="18" />{{ t("digito.header.shop", "Shop") }}<digito-icon name="expand_more" size="18" />
      </button>
      <router-link :to="dealsRoute" class="dg-pill">{{ t("header.deals", "Deals") }}</router-link>
      <router-link :to="newRoute" class="dg-pill">{{ t("digito.header.new", "New arrivals") }}</router-link>
      <v-menu v-if="brandList.length" :scrim="false" content-class="dg-brands-pop" location="bottom start" offset="8">
        <template v-slot:activator="{ props }">
          <button class="dg-pill" type="button" v-bind="props">{{ t("digito.header.brands", "Brands") }}</button>
        </template>
        <div class="dg-brandmenu">
          <router-link v-for="b in brandList" :key="b" :to="brandRoute(b)">{{ b }}</router-link>
        </div>
      </v-menu>
      <span class="dg-header__sep"></span>
      <router-link v-for="c in navCats" :key="c.id" :to="aisleRoute(c)" class="dg-header__txt -cat">{{ c.title || c.name }}</router-link>
      <span class="dg-header__grow"></span>
      <router-link :to="ordersRoute" class="dg-header__txt -end"><digito-icon name="local_shipping" size="18" />{{ t("digito.header.track", "Track order") }}</router-link>
      <router-link :to="blogRoute" class="dg-header__txt -end">{{ t("digito.header.blog", "Blog") }}</router-link>
      <router-link :to="helpRoute" class="dg-header__txt -end">{{ t("digito.header.help", "Help") }}</router-link>
      <!-- Language and currency (the owner's choice B, 10 November 2026):
           "🌐 EN · DKK", a small panel of chips. Hidden with one of each. -->
      <region-switcher-button v-if="!compact" button-class="dg-header__region" />
    </nav>

    <!-- ▆▆▆▆▆▆▆▆ Basket drawer ▆▆▆▆▆▆▆▆ -->
    <teleport to="body">
      <v-navigation-drawer
        v-model="basket"
        :location="$vuetify.locale.isRtl ? 'left' : 'right'"
        :width="windowWidth < 520 ? windowWidth : 460"
        class="k-drawer -basket"
        temporary
      >
        <div class="k-drawer__head">
          <p class="k-drawer__title">
            {{ t("digito.cart.title", "Your cart") }}<small v-if="basketUnits">{{ t("cart.units", { one: "{n} item", other: "{n} items" }, { n: basketUnits }) }}</small>
          </p>
          <button :aria-label="t('region.close', 'Close')" class="k-header__icon" type="button" @click="basket = false">
            <v-icon>close</v-icon>
          </button>
        </div>
        <!-- Empty: Selldone's line "Your cart is empty." left the shopper
             nowhere to go; Kalio's offers the way back to the shelves. -->
        <div v-if="!itemsCount" class="k-drawer__empty">
          <span aria-hidden="true" class="k-drawer__empty-mark"><v-icon size="30">shopping_bag</v-icon></span>
          <p class="k-drawer__empty-title">{{ t("digito.cart.empty.title", "Your cart is empty") }}</p>
          <p class="k-drawer__empty-text">{{ t("digito.cart.empty.text", "Pick something you like and it will wait for you here.") }}</p>
          <div class="k-drawer__empty-ctas">
            <router-link :to="dealsRoute" class="dg-btn" @click="basket = false">{{ t("cart.empty.deals", "Shop today’s deals") }}</router-link>
            <router-link :to="catalogueRoute" class="dg-btn -line" @click="basket = false">{{ t("digito.cart.continue", "Continue shopping") }}</router-link>
          </div>
          <template v-if="aisleList.length">
            <p class="k-eyebrow k-drawer__empty-label">{{ t("digito.cart.empty.categories", "Or start with a category") }}</p>
            <nav :aria-label="t('digito.menu.categories', 'Categories')" class="k-drawer__empty-aisles">
              <router-link
                v-for="aisle in aisleList.slice(0, 8)"
                :key="aisle.id"
                :to="aisleRoute(aisle)"
                class="dg-chip"
                @click="basket = false"
              >
                <img v-if="aisle.icon" :src="aisleImage(aisle, 64)" alt="" height="32" width="32" loading="lazy" />
                {{ aisle.title || aisle.name }}
              </router-link>
            </nav>
          </template>
        </div>
        <kalio-basket-drawer v-else @close="basket = false" />
      </v-navigation-drawer>

      <!-- ▆▆▆▆▆▆▆▆ Phone menu ▆▆▆▆▆▆▆▆ -->
      <v-navigation-drawer
        v-model="menu"
        :location="$vuetify.locale.isRtl ? 'right' : 'left'"
        :width="Math.min(360, windowWidth * 0.88)"
        class="k-drawer -menu"
        temporary
      >
        <div class="k-drawer__head">
          <router-link :aria-label="t('header.home', '{shop} home', { shop: shopTitle })" :to="homeRoute" class="dg-menu__brand" @click="menu = false"><digito-wordmark /></router-link>
          <button :aria-label="t('region.close', 'Close')" class="k-header__icon" type="button" @click="menu = false">
            <v-icon>close</v-icon>
          </button>
        </div>

        <div class="k-drawer__account">
          <template v-if="user">
            <router-link :to="profileRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">person_outline</v-icon>{{ t("header.myAccount", "My account") }}</router-link>
            <router-link :to="ordersRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">receipt_long</v-icon>{{ t("header.orders", "Orders") }}</router-link>
            <router-link :to="savedRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">favorite_border</v-icon>{{ t("header.saved", "Saved") }}</router-link>
          </template>
          <button v-else class="dg-btn -block" type="button" @click="menu = false; signIn()">{{ t("digito.header.signIn", "Sign in") }}</button>
          <router-link :to="ordersRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">local_shipping</v-icon>{{ t("digito.header.track", "Track order") }}</router-link>
          <router-link :to="blogRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">article</v-icon>{{ t("digito.header.blog", "Blog") }}</router-link>
          <router-link :to="helpRoute" class="k-drawer__link" @click="menu = false"><v-icon size="20">help_outline</v-icon>{{ t("digito.header.help", "Help") }}</router-link>
          <!-- "Language & currency  EN · DKK ›": a bottom sheet over the menu. -->
          <region-sheet row-class="k-drawer__link dg-menu__region" />
        </div>

        <p class="k-eyebrow k-drawer__label">{{ t("digito.menu.shopByCategory", "Shop by category") }}</p>
        <router-link :to="dealsRoute" class="k-drawer__link -deals" @click="menu = false"><span class="k-drawer__ring -icon"><digito-icon name="local_offer" size="22" /></span><span class="dg-menu__txt"><b>{{ t("header.todaysDeals", "Today’s deals") }}</b><small>{{ t("digito.menu.dealsLine", "Every saving in one place") }}</small></span></router-link>
        <router-link :to="newRoute" class="k-drawer__link" @click="menu = false"><span class="k-drawer__ring -icon"><digito-icon name="new_releases" size="22" /></span><span class="dg-menu__txt"><b>{{ t("digito.header.new", "New arrivals") }}</b><small>{{ t("digito.menu.newLine", "Just landed") }}</small></span></router-link>
        <!-- The first 6 categories in the merchant's order, then "Show N more"
             (the owner's option A, 10 November 2026). 8 or fewer: all, no
             button. The rest open inline above the button, which then reads
             "Show fewer"; every opening of the menu starts collapsed. -->
        <router-link
          v-for="aisle in menuAisles.shown"
          :key="aisle.id"
          :to="aisleRoute(aisle)"
          class="k-drawer__link"
          @click="menu = false"
        >
          <span class="k-drawer__ring">
            <img v-if="aisle.icon" :src="aisleImage(aisle, 64)" alt="" height="30" width="30" loading="lazy" />
          </span>
          <span class="dg-menu__txt"><b>{{ aisle.title || aisle.name }}</b><small v-if="catLine(aisle)">{{ catLine(aisle) }}</small></span>
        </router-link>
        <template v-if="menuAisles.more.length">
          <div id="dg-menu-more" :class="{ '-open': menuMore }" :inert="!menuMore" class="dg-menu__more">
            <div class="dg-menu__more-in">
              <router-link
                v-for="(aisle, i) in menuAisles.more"
                :key="aisle.id"
                :style="{ '--i': i }"
                :to="aisleRoute(aisle)"
                class="k-drawer__link"
                @click="menu = false"
              >
                <span class="k-drawer__ring">
                  <!-- not lazy: inside the closed block a lazy picture waits
                       for the tap, so the rows would open without photos -->
                  <img v-if="aisle.icon" :src="aisleImage(aisle, 64)" alt="" height="30" width="30" />
                </span>
                <span class="dg-menu__txt"><b>{{ aisle.title || aisle.name }}</b><small v-if="catLine(aisle)">{{ catLine(aisle) }}</small></span>
              </router-link>
            </div>
          </div>
          <button
            :aria-expanded="menuMore ? 'true' : 'false'"
            aria-controls="dg-menu-more"
            class="k-drawer__link dg-menu__toggle"
            type="button"
            @click="menuMore = !menuMore"
          >
            <span class="k-drawer__ring -icon"><digito-icon :name="menuMore ? 'expand_less' : 'expand_more'" size="24" /></span>
            <span class="dg-menu__txt"><b>{{ menuMore ? t("menu.showFewer", "Show fewer") : t("menu.showMore", "Show {n} more", { n: menuAisles.more.length }) }}</b></span>
          </button>
        </template>

      </v-navigation-drawer>
    </teleport>
  </header>
</template>

<script>
import { BRAND } from "../kalio-brand";
import SStorefrontSearchBox from "@selldone/components-vue/storefront/search/SStorefrontSearchBox.vue";
import KalioBasketDrawer from "./KalioBasketDrawer.vue";
import DigitoWordmark from "../../digito/DigitoWordmark.vue";
import DigitoIcon from "../../digito/DigitoIcon.vue";
import DigitoMegaMenu from "../../digito/DigitoMegaMenu.vue";
import RegionSwitcherButton from "../../region-switcher/RegionSwitcherButton.vue";
import RegionSheet from "../../region-switcher/RegionSheet.vue";
import { t } from "../i18n/kalio-i18n";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { aisleImage, aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";
import { allProducts, categoryLine, money, savingOf } from "../../digito/digito-home";
import { basketView } from "../kalio-basket";

export default {
  name: "KalioHeader",
  components: { SStorefrontSearchBox, KalioBasketDrawer, DigitoWordmark, DigitoIcon, DigitoMegaMenu, RegionSwitcherButton, RegionSheet },
  inject: ["$shop"],

  props: {
    /** The current route asks for the search box (route meta "search"). */
    showSearch: { type: Boolean, default: true },
  },

  emits: ["search", "clear"],

  data() {
    return {
      BRAND,
      aisleList: [],
      all: [],
      mega: false,
      basket: false,
      menu: false,
      menuMore: false,
      phone_search: false,
      windowWidth: window.innerWidth,
      avatar_failed: false,
    };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || BRAND.name || "";
    },
    user() {
      return this.$store.getters.getUser;
    },
    firstName() {
      const name = String(this.user?.name || "").trim().split(/\s+/)[0];
      return name ? t("digito.header.hi", "Hi, {name}", { name }) : t("header.yourAccount", "Your account");
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
    compact() {
      return this.$vuetify.display.smAndDown;
    },
    hasLanguages() {
      return (this.$shop?.languages || []).length > 1;
    },
    globalStyle() {
      return this.$store.getters.getGlobalStyle;
    },
    itemsCount() {
      return this.getTotalItemInBaskets() || 0;
    },
    basketUnits() {
      return this.getBaskets().reduce((sum, basket) => sum + (basket?.items || []).reduce((n, item) => n + (item.count || 0), 0), 0);
    },
    /** The physical cart's total, for "Cart $208.90". */
    cartTotal() {
      const basket = this.getBaskets().find((b) => b?.items?.length);
      if (!basket) return null;
      const bill = basket.bill || {};
      const amount = typeof bill.price === "number" ? bill.price : basket.price;
      return typeof amount === "number" ? { amount, currency: bill.currency || basket.currency } : null;
    },
    /** A few live categories beside the pills: the ones with the most deals. */
    navCats() {
      const deals = (c) => this.all.filter((p) => p.category_id === c.id && savingOf(p) > 0).length;
      return [...this.aisleList].sort((a, b) => deals(b) - deals(a)).slice(0, 4);
    },
    brandList() {
      return [...new Set(this.all.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    },
    homeRoute() {
      return { path: "/" };
    },
    dealsRoute() {
      return dealsRoute();
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
    ordersRoute() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
    savedRoute() {
      return { name: window.$storefront.routes.USER_FAVORITES_PAGE };
    },
    blogRoute() {
      return { name: window.$storefront.routes.BLOGS_PAGE };
    },
    helpRoute() {
      return { name: "ShopFAQ" };
    },
    profileRoute() {
      return { name: "KalioAccountHome" };
    },
    drawerOpen() {
      return this.basket || this.menu;
    },
    /* The phone menu's categories: 6, then the rest behind "Show N more";
       8 or fewer are all shown. */
    menuAisles() {
      const list = this.aisleList || [];
      if (list.length <= 8) return { shown: list, more: [] };
      return { shown: list.slice(0, 6), more: list.slice(6) };
    },
  },

  watch: {
    menu(open) {
      if (open) this.menuMore = false;
    },
    drawerOpen(open) {
      this.$store.commit("setForceHideNavigation", open);
    },
    basket(open) {
      basketView.drawerOpen = open;
    },
    $route() {
      this.menu = false;
      this.basket = false;
      this.mega = false;
      this.phone_search = false;
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
    allProducts().then((list) => (this.all = list));
    this.onResize = () => (this.windowWidth = window.innerWidth);
    window.addEventListener("resize", this.onResize, { passive: true });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    money,
    aisleRoute,
    aisleImage,
    catLine(aisle) {
      return categoryLine(aisle, this.all, (n) => money(n, null, true));
    },
    brandRoute(b) {
      return catalogueRoute({ search: b });
    },
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
