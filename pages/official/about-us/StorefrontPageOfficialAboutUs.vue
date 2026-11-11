<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<!--
  Digito — About us (design A of the page mockups, digini-design/about-a.html).

  A wide photo with the story on a white card, four values with icons, a
  blue band of service promises (no counts: the shop is the point, not its
  size), the categories as circles, and how to reach the shop. The text is
  the shop's own About profile (Selldone dashboard › Shop › Profile) when it
  has one; until then a general sample under a clear "Sample text" note.
-->
<template>
  <div class="dg-about dg-page">
    <section class="dg-about__hero">
      <digito-photo :products="packs" :src="hero" class="dg-about__photo" eager shape="wide" />
      <div class="dg-about__card">
        <span class="dg-eyebrow">{{ t("about.title", "About {shop}", { shop: shopTitle }) }}</span>
        <h1>{{ missing || busy ? sample.title : t("about.title", "About {shop}", { shop: shopTitle }) }}</h1>
        <p v-if="missing || busy">{{ sample.lead }}</p>
      </div>
    </section>

    <section class="dg-sec dg-about__story">
      <div v-if="busy" aria-hidden="true" class="k-legal__loading"><span></span><span></span><span></span></div>
      <template v-else-if="missing">
        <kalio-sample-note>{{ t("digito.about.sampleNote", "This is general copy written to show the page; {shop} writes its own story here.", { shop: shopTitle }) }}</kalio-sample-note>
        <p class="dg-about__text">{{ sample.text[0] }}</p>
        <div class="dg-about__vals">
          <div v-for="(value, i) in sample.values" :key="value.title" class="dg-about__val">
            <span class="dg-about__ic"><digito-icon :name="ICONS[i] || 'check'" size="24" /></span>
            <b>{{ value.title }}</b>
            <p>{{ value.text }}</p>
          </div>
        </div>
      </template>
      <div v-else class="k-story__real k-prose dg-about__real" v-html="profile.body"></div>
    </section>

    <section :aria-label="t('digito.about.promises', 'Our promises')" class="dg-about__band">
      <div v-for="p in promises" :key="p.t"><digito-icon :name="p.i" size="28" /><span><b>{{ p.t }}</b><small>{{ p.s }}</small></span></div>
    </section>

    <digito-categories />

    <section id="contact" class="dg-sec dg-about__contact">
      <div>
        <span class="dg-eyebrow">{{ t("contact.pageTitle", "Contact us") }}</span>
        <h2>{{ t("digito.about.contact.title", "We’re here to help") }}</h2>
        <p>{{ t("digito.about.contact.text", "For an order, the fastest way is the message thread on the order page: it reaches the people who packed it. For anything else, write to us.") }}</p>
      </div>
      <div class="dg-about__acts">
        <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="dg-btn">{{ t("digito.about.contact.write", "Write to us") }}</router-link>
        <router-link :to="catalogueRoute" class="dg-btn -line">{{ t("pages.startShopping", "Start shopping") }}</router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import KalioSampleNote from "@app-storefront/components/kalio/pages/KalioSampleNote.vue";
import { aboutSample, plainText } from "@app-storefront/components/kalio/pages/kalio-sample-pages";
import { aisles, catalogueRoute } from "@app-storefront/components/kalio/kalio-catalog";
import { allProducts, photoOf, waysOf } from "@app-storefront/components/digito/digito-home";
import DigitoPhoto from "@app-storefront/components/digito/DigitoPhoto.vue";
import DigitoIcon from "@app-storefront/components/digito/DigitoIcon.vue";
import DigitoCategories from "@app-storefront/components/digito/DigitoCategories.vue";
import { t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

export default {
  name: "StorefrontPageOfficialAboutUs",
  components: { KalioSampleNote, DigitoPhoto, DigitoIcon, DigitoCategories },
  inject: ["$shop"],

  data: () => ({
    window,
    profile: null,
    missing: false,
    busy: true,
    packs: [],
    hero: null,
    ICONS: ["sell", "local_shipping", "assignment_return", "support_agent"],
  }),

  computed: {
    shopTitle() {
      return this.$shop?.title || t("sample.thisShop", "This shop");
    },
    sample() {
      return aboutSample(this.shopTitle);
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    /* What the shop really offers, from its own settings. */
    promises() {
      const ways = waysOf(this.$shop);
      const out = [];
      if (ways.some((w) => w.key !== "Pickup")) out.push({
          i: "local_shipping",
          t: t("digito.about.promise.delivery.title", "Delivered to your door"),
          s: t("digito.about.promise.delivery.text", "Cost and day shown before you pay"),
        });
      if (ways.some((w) => w.key === "Pickup")) out.push({
          i: "storefront",
          t: t("digito.about.promise.pickup.title", "Pickup at the shop"),
          s: t("digito.about.promise.pickup.text", "Order online, collect in person"),
        });
      out.push({ i: "lock", t: t("digito.about.promise.secure.title", "Secure checkout"), s: t("digito.about.promise.secure.text", "Your details stay private") });
      out.push({ i: "support_agent", t: t("digito.about.promise.help.title", "Real help"), s: t("digito.about.promise.help.text", "Message us from any order") });
      return out.slice(0, 4);
    },
  },

  created() {
    this.setPageTitle?.(t("about.pageTitle", "About us"));
    window.axios
      .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "about-us"))
      .then(({ data }) => {
        this.profile = data?.error ? null : data?.profile || null;
        this.missing = !plainText(this.profile?.body);
      })
      .catch(() => (this.missing = true))
      .finally(() => (this.busy = false));
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      const withWide = cats.find((c) => photoOf("wide", c));
      this.hero = withWide ? photoOf("wide", withWide) : null;
      this.packs = [...list].sort((a, b) => (b.sells || 0) - (a.sells || 0)).filter((p) => p.icon).slice(0, 4);
    });
  },
};
</script>
