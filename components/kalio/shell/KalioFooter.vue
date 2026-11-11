<!--
  Digito — the footer (Home A "Deals hub", 8 November 2026): white, under
  the page. A service row first (Track your order, Shipping & delivery,
  Returns & exchanges, Help center, Contact us); then link columns — Shop
  (the shop's categories and All products), Orders, the shop (the
  merchant's own footer menu as set in Selldone, or the standard pages),
  Policies — beside a newsletter card (Selldone's own subscribe call) with
  the shop's social links; then the Theme row (colour palettes, Custom
  colour and Light / Dark; the owner, 10 November 2026: the theme setting
  lives in the footer, not the header; shown only where the switcher is on);
  then a legal row with the copyright, Terms,
  Privacy, the cookie settings and a small "made with selldone".

  Everything is read live. A shop with custom footer code keeps Selldone's
  footer (the layout decides).
-->
<template>
  <footer class="k-footer dg-footer">
    <nav :aria-label="t('digito.footer.service', 'Customer service')" class="dg-footer__svc">
      <router-link :to="ordersRoute"><digito-icon name="local_shipping" size="30" /><span>{{ t("digito.footer.trackYourOrder", "Track your order") }}</span></router-link>
      <router-link :to="termsRoute"><digito-icon name="package_2" size="30" /><span>{{ t("digito.footer.shipping", "Shipping & delivery") }}</span></router-link>
      <router-link :to="termsRoute"><digito-icon name="assignment_return" size="30" /><span>{{ t("digito.footer.returns", "Returns & exchanges") }}</span></router-link>
      <router-link :to="faqRoute"><digito-icon name="support_agent" size="30" /><span>{{ t("digito.footer.helpCenter", "Help center") }}</span></router-link>
      <router-link :to="contactRoute"><digito-icon name="mail" size="30" /><span>{{ t("footer.links.contact", "Contact us") }}</span></router-link>
    </nav>

    <div class="dg-footer__grid">
      <nav aria-labelledby="dg-f-shop" class="dg-footer__col">
        <h3 id="dg-f-shop">{{ t("digito.header.shop", "Shop") }}</h3>
        <router-link :to="dealsRoute">{{ t("header.todaysDeals", "Today’s deals") }}</router-link>
        <router-link v-for="aisle in aisleList.slice(0, 6)" :key="aisle.id" :to="aisleRoute(aisle)">{{ aisle.title || aisle.name }}</router-link>
        <router-link :to="catalogueRoute">{{ t("digito.footer.allProducts", "All products") }}</router-link>
      </nav>
      <nav aria-labelledby="dg-f-orders" class="dg-footer__col">
        <h3 id="dg-f-orders">{{ t("header.orders", "Orders") }}</h3>
        <router-link :to="ordersRoute">{{ t("digito.footer.trackAnOrder", "Track an order") }}</router-link>
        <router-link :to="cartRoute">{{ t("digito.cart.title", "Your cart") }}</router-link>
        <router-link v-if="user" :to="{ name: 'KalioAccountHome' }">{{ t("header.yourAccount", "Your account") }}</router-link>
        <button v-else class="dg-footer__textbtn" type="button" @click="signIn">{{ t("digito.header.signIn", "Sign in") }}</button>
        <router-link v-if="user" :to="{ name: window.$storefront.routes.USER_FAVORITES_PAGE }">{{ t("digito.footer.savedItems", "Saved items") }}</router-link>
      </nav>
      <nav aria-labelledby="dg-f-shopname" class="dg-footer__col">
        <h3 id="dg-f-shopname">{{ shopTitle }}</h3>
        <router-link v-for="(item, i) in shopLinks" :key="'l' + i" :to="item.to">{{ item.name }}</router-link>
      </nav>
      <nav aria-labelledby="dg-f-policies" class="dg-footer__col">
        <h3 id="dg-f-policies">{{ t("digito.footer.policies", "Policies") }}</h3>
        <router-link :to="termsRoute">{{ t("digito.footer.termsOfService", "Terms of service") }}</router-link>
        <router-link :to="privacyRoute">{{ t("signin.legal.privacy", "Privacy policy") }}</router-link>
        <router-link :to="faqRoute">{{ t("digito.footer.faq", "FAQ") }}</router-link>
      </nav>

      <div class="dg-footer__news">
        <h3>{{ t("digito.footer.news.title", "Get the latest deals") }}</h3>
        <p>{{ t("digito.footer.news.text", "New arrivals and price drops, about once a week.") }}</p>
        <form v-if="!subscribed" class="dg-footer__form" @submit.prevent="subscribe">
          <input v-model="email" :aria-label="t('digito.footer.news.email', 'Email address')" :placeholder="t('digito.footer.news.email', 'Email address')" autocomplete="email" required type="email" />
          <button :disabled="busy" class="dg-btn" type="submit">{{ t("digito.footer.news.signUp", "Sign up") }}</button>
        </form>
        <p v-else class="dg-footer__ok"><digito-icon name="check_circle" size="20" />{{ t("digito.footer.news.ok", "You’re on the list. Watch your inbox.") }}</p>
        <p v-if="error" class="dg-footer__err">{{ error }}</p>
        <s-storefront-social-buttons class="dg-footer__social"></s-storefront-social-buttons>
        <!-- Language and currency live in the header's pill (the owner's
             choice B, 10 November 2026), not here. -->
      </div>
    </div>

    <div v-if="themeOn" class="dg-footer__theme">
      <theme-switcher-row />
    </div>

    <div class="dg-footer__legal">
      <span class="dg-footer__copy">{{ t("digito.footer.copy", "© {year} {shop}. Prices and offers can change.", { year: String(year), shop: shopTitle }) }}</span>
      <router-link :to="termsRoute">{{ t("footer.terms", "Terms") }}</router-link>
      <router-link :to="privacyRoute">{{ t("footer.privacy", "Privacy") }}</router-link>
      <s-footer-section-gdpr></s-footer-section-gdpr>
      <s-footer-section-selldone class="dg-footer__made"></s-footer-section-selldone>
    </div>
  </footer>
</template>

<script>
import SStorefrontSocialButtons from "@selldone/components-vue/storefront/social/SStorefrontSocialButtons.vue";
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { t } from "../i18n/kalio-i18n";
import DigitoIcon from "../../digito/DigitoIcon.vue";
import ThemeSwitcherRow from "../../theme-switcher/ThemeSwitcherRow.vue";
import { themeState } from "../../theme-switcher/theme-switcher";
import { aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";

export default {
  name: "KalioFooter",
  components: { SStorefrontSocialButtons, SFooterSectionGdpr, SFooterSectionSelldone, DigitoIcon, ThemeSwitcherRow },
  inject: ["$shop"],

  data() {
    return { window, aisleList: [], year: new Date().getFullYear(), email: "", busy: false, subscribed: false, error: null };
  },

  computed: {
    /* The Theme strip exists only where the switcher is on (showcase shops). */
    themeOn() {
      return themeState.enabled;
    },
    shopTitle() {
      return this.$shop?.title || "";
    },
    user() {
      return this.$store.getters.getUser;
    },
    hasLanguages() {
      return (this.$shop?.languages || []).length > 1;
    },
    hasPickers() {
      return this.hasLanguages || (this.$shop?.currencies || []).length > 1;
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    dealsRoute() {
      return dealsRoute();
    },
    r() {
      return window.$storefront.routes;
    },
    ordersRoute() {
      return { name: this.r.HISTORY_ORDERS_PHYSICAL };
    },
    cartRoute() {
      return { name: this.r.BASKET_PAGE, params: { type: "PHYSICAL" } };
    },
    termsRoute() {
      return { name: this.r.SHOP_PROFILE_PAGE_TERMS };
    },
    privacyRoute() {
      return { name: this.r.SHOP_PROFILE_PAGE_PRIVACY };
    },
    contactRoute() {
      return { name: this.r.SHOP_CONTACT_US };
    },
    faqRoute() {
      return { name: "ShopFAQ" };
    },
    /* The merchant's footer menu (Selldone menus, type FOOTER), flattened,
       or the standard pages when the shop has none. A link to a route this
       storefront does not have is left out; a "Shop" link opens the
       catalogue (the shop page is the home here). */
    shopLinks() {
      const menu = this.$shop?.menus?.find((it) => it.type === "FOOTER" && it.enable !== false);
      const shopPage = this.r.SHOP_PAGE;
      const items = (menu?.menu || [])
        .flat()
        .filter((item) => item && item.name && item.to)
        .filter((item) => !item.to.name || this.$router.hasRoute(item.to.name))
        .map((item) => (item.to.name === shopPage && !item.to.query ? { ...item, to: this.catalogueRoute } : item));
      if (items.length) return items;
      return [
        { name: t("footer.links.about", "About us"), to: { name: this.r.SHOP_PROFILE_PAGE_ABOUT_US } },
        { name: t("digito.header.blog", "Blog"), to: { name: this.r.BLOGS_PAGE } },
        { name: t("footer.links.contact", "Contact us"), to: this.contactRoute },
        { name: t("digito.footer.faq", "FAQ"), to: this.faqRoute },
      ];
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
  },

  methods: {
    aisleRoute,
    signIn() {
      EventBus.$emit("need-login", true);
    },
    /* Selldone's own newsletter subscription for the shop. It belongs to a
       customer account, so a guest is asked to sign in first. */
    subscribe() {
      if (!this.email) return;
      if (!this.user) {
        this.signIn();
        return;
      }
      this.busy = true;
      this.error = null;
      window.axios
        .post(window.XAPI.POST_SUBSCRIBE(window.$storefront.name), { email: this.email })
        .then(({ data }) => {
          if (data?.error) this.error = data.error_msg || t("digito.footer.news.error", "That didn’t work. Try again.");
          else this.subscribed = true;
        })
        .catch(() => (this.error = t("digito.footer.news.errorLater", "That didn’t work. Try again in a minute.")))
        .finally(() => (this.busy = false));
    },
  },
};
</script>
