<!--
  - Copyright (c) 2023-2024. Selldone® Business OS™
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

<template>
  <div class="px-2">
    <v-container class="c-avocado">
      <v-progress-linear
        v-if="busy_fetch || busy"
        class="loader-to-bar"
        color="success"
        indeterminate
      ></v-progress-linear>

      <img
        class="me-1 zoomIn delay_500"
        height="32"
        src="@selldone/components-vue/assets/icons/avocado.svg"
        width="32"
      />
      <img
        class="flipInX delay_300"
        height="48"
        src="@selldone/components-vue/assets/selldone-logo/logo-box.svg"
      />

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Not enabled info ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <div
        v-if="!is_enable"
        class="text-h4 font-weight-thin"
        style="min-height: 65vh"
      >
        {{ $t("avocado.not_enable") }}
      </div>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Back button ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

      <v-btn
        v-if="add_mode"
        class="absolute-top-start slideInDown"
        variant="text"
        @click="add_mode = false"
      >
        <v-icon class="me-1">{{ $t("icons.chevron_back") }}</v-icon>
        {{ $t("global.actions.back") }}
      </v-btn>

      <div v-if="is_enable && !add_mode" style="min-height: 65vh">
        <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Orders history ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

        <div class="my-14 fadeIn">
          <s-storefront-avocado-customer-order-list
            :orders="orders"
            class="mx-auto mb-4 my-3"
            style="max-width: 420px"
          ></s-storefront-avocado-customer-order-list>

          <v-pagination
            v-if="pages > 1"
            v-model="page"
            :length="pages"
            :total-visible="6"
            rounded
            @update:model-value="fetchOrders()"
          ></v-pagination>
        </div>

        <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Add button ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

        <div class="widget-buttons">
          <v-btn
            v-if="open_avocado && shop_avocado.enable"
            :loading="busy"
            class="mx-auto zoomIn"
            color="success"
            variant="elevated"
            min-height="72"
            style="max-width: 420px"
            size="x-large"
            @click="
              () => {
                add_mode = true;
                GoToTopPage();
              }
            "
          >
            <v-icon start>shopping_bag</v-icon>
            {{ $t("avocado.add_new_order") }}
          </v-btn>

          <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Login ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

          <v-btn
            v-if="!USER()"
            color="primary"
            variant="elevated"
            size="x-large"
            @click="NeedLogin()"
          >
            <v-icon start>shopping_bag</v-icon>
            {{ $t("avocado.add_new_order") }}
          </v-btn>
        </div>
      </div>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Add order (By customer) ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

      <s-storefront-avocado-customer-order-form
        v-if="add_mode && open_avocado"
        :avocado="open_avocado"
        class="mx-auto my-16 fadeIn"
        style="max-width: 420px"
        @add="
          (order) => {
            AddOrUpdateItemByID(orders, order, 'id', false);
            add_mode = false;
            getOpenAvocado();
          }
        "
      ></s-storefront-avocado-customer-order-form>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Footer ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

      <div class="-footer">
        {{ t("digito.poweredBy", "Powered by") }}
        <a href="/Applications/Storefront/public" target="_blank">
          <img
            height="10"
            src="@selldone/components-vue/assets/selldone-logo/logo-mini-dark.svg"
            width="10"
          />
          Selldone</a
        >
        | The Business OS
      </div>
    </v-container>

    <div class="min-height-20vh"></div>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SStorefrontAvocadoCustomerOrderList from "@selldone/components-vue/storefront/order/avocado/SStorefrontAvocadoCustomerOrderList.vue";
import SStorefrontAvocadoCustomerOrderForm from "@selldone/components-vue/storefront/order/avocado/SStorefrontAvocadoCustomerOrderForm.vue";
import { Avocado } from "@selldone/core-js";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import AuthMixin from "@selldone/components-vue/mixin/auth/AuthMixin.ts";
import ScrollHelper from "@selldone/core-js/utils/scroll/ScrollHelper.ts";

export default {
  name: "StorefrontPageAvocado",
  mixins: [CurrencyMixin, AuthMixin],

  components: {
    SStorefrontAvocadoCustomerOrderForm,
    SStorefrontAvocadoCustomerOrderList,
  },
  inject: ["$shop"],
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Props Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  props: {
    shop: {
      require: true,
      type: Object,
    },
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    deliveryStates: Avocado.DeliveryStates,

    open_avocado: null,
    busy: false,

    orders: [],

    add_mode: false,

    total_orders: 0,

    page: 1,
    busy_fetch: false,
  }),

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Compute Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    is_enable() {
      return this.shop_avocado.enable;
    },

    pages() {
      return Math.ceil(this.total_orders / 5);
    },
    user() {
      return this.$store.getters.getUser;
    },
    busy_user() {
      return this.$store.getters.getBusyUser;
    },
    shop_avocado() {
      return this.shop.avocado ? this.shop.avocado : {};
    },
  },
  created() {
    if (!this.busy_user) {
      // Check if user is logged in - We should wait for the user to be loaded (prevent show login form in page refresh)
      if (!this.USER()) this.NeedLogin();
      else this.getOpenAvocado();
    }
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    user(user) {
      if (user) this.getOpenAvocado();
      else this.NeedLogin();
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  mounted() {},

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Methods Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  methods: {
    getOpenAvocado() {
      this.busy = true;
      axios
        .get(window.XAPI.GET_CUSTOMER_OPEN_AVOCADO(this.$shop.name), {
          params: { currency: this.GetUserSelectedCurrency().code },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.open_avocado = data.avocado;
            this.orders = data.orders;
            this.total_orders = data.total;
            this.page = 1;
          } else {
            NotificationService.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    fetchOrders() {
      this.busy_fetch = true;
      axios
        .get(window.XAPI.GET_CUSTOMER_HISTORY_AVOCADOS(this.$shop.name), {
          params: {
            sortDesc: true,
            offset: (this.page - 1) * 5,
            limit: 5,
          },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.orders = data.orders;
            this.total_orders = data.total;
          } else {
            NotificationService.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    //―――――――――――――――――――――― Page Scroll Helper ――――――――――――――――――――
    GoToTopPage() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          ScrollHelper.scrollToTop(0, "smooth");
        });
      });
    },
  },
};
</script>
