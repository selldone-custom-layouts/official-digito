<!--
  Kalio — the account's Overview (design B, 4 November 2026).

  The latest order as a card (its five steps with the times Selldone
  records, its lines, total, how it is paid and what to do next), beside
  four numbers (orders, saved with deals, wallet, gift cards) and a
  reminder when an order waits for payment; then the last few orders,
  "Buy again" and the delivery addresses.
-->
<template>
  <div class="k-ahome">
    <div class="k-ahome__grid">
      <!-- The latest order -->
      <section v-if="latest" class="k-ahome__latest">
        <p class="k-eyebrow">Latest order</p>
        <div class="k-ahome__head">
          <router-link :to="orderRoute(latest)" class="k-ahome__code">{{ code(latest) }}</router-link>
          <span class="k-ahome__when">{{ when(latest.reserved_at) }}</span>
          <span :class="`-${tone.tone}`" class="k-tag">
            <span v-if="tone.tone === 'go'" class="k-tag__beat"></span>
            <v-icon v-else-if="tone.icon" size="15">{{ tone.icon }}</v-icon>
            {{ tone.word }}
          </span>
        </div>

        <ol v-if="!['pay', 'off'].includes(tone.tone)" aria-label="Order progress" class="k-ahome__steps">
          <li v-for="(state, i) in states" :key="state.code" :class="stepClass(i)">
            <i aria-hidden="true"><v-icon v-if="stepClass(i) === '-done'" size="15">check</v-icon></i>
            <b>{{ $t(state.name) }}</b>
            <small v-if="stepTime(i)">{{ stepTime(i) }}</small>
          </li>
        </ol>

        <!-- The lines: from the list at once (picture, name, how many), with
             prices and sellers once the full order is read. -->
        <ul v-if="lines.length" class="k-ahome__lines">
          <li v-for="line in lines" :key="line.key">
            <span class="k-ahome__pic"><img v-if="line.src" :src="line.src" alt="" loading="lazy" /></span>
            <span class="k-ahome__name">
              <b v-if="line.title">{{ line.title }}</b>
              <span v-else aria-hidden="true" class="k-ahome__nameghost"></span>
              <small v-if="line.price != null">{{ line.count }} × <u-price :amount="line.price" :currency="line.currency" /><template v-if="line.seller"> · {{ line.seller }}</template></small>
              <small v-else>Quantity {{ line.count }}</small>
            </span>
            <u-price v-if="line.total != null" :amount="line.total" :currency="line.currency" class="k-ahome__amount" />
          </li>
          <li v-if="moreLines" class="k-ahome__morelines">and {{ moreLines }} more</li>
        </ul>

        <footer class="k-ahome__foot">
          <div class="k-ahome__sum">
            <u-price :amount="latest.price" :currency="latest.currency" />
            <small>{{ footWords }}</small>
          </div>
          <router-link :to="orderRoute(latest)" class="k-btn -line">
            <v-icon size="17">chat_bubble_outline</v-icon>{{ latest.chat?.length ? "Messages" : "Ask the shop" }}
            <span v-if="latest.chat?.length" class="k-dot">{{ latest.chat.length }}</span>
          </router-link>
          <button v-if="['ok', 'off'].includes(tone.tone)" :disabled="busy_again" class="k-btn -line" type="button" @click="buyAgain">
            <v-progress-circular v-if="busy_again" indeterminate size="16" width="2" />
            <v-icon v-else size="17">{{ again_done ? "check" : "replay" }}</v-icon>{{ again_done ? "In your cart" : "Buy again" }}
          </button>
          <router-link v-if="tone.tone === 'pay'" :to="orderRoute(latest)" class="k-btn -pay"><v-icon size="17">lock</v-icon>Pay now</router-link>
          <router-link v-else :to="orderRoute(latest)" class="k-btn -main">View order</router-link>
        </footer>
      </section>

      <section v-else-if="account.loaded" class="k-ahome__latest -empty">
        <v-icon size="34">shopping_basket</v-icon>
        <h2>No orders yet</h2>
        <p>Fill a basket from the aisles; your orders and where they are show up here.</p>
        <router-link :to="{ path: '/' }" class="k-btn -main">Start shopping</router-link>
      </section>
      <section v-else aria-busy="true" class="k-ahome__latest -wait"><span class="k-board__ghost"></span><span class="k-board__ghost"></span></section>

      <!-- The numbers -->
      <aside class="k-ahome__tiles">
        <router-link :to="ordersRoute" class="k-tile">
          <span class="k-tile__ico"><v-icon size="20">receipt_long</v-icon></span>
          <b>{{ account.loaded ? account.total : "–" }}</b>
          <span>{{ account.total === 1 ? "order" : "orders" }}{{ moving ? ` · ${moving} on the way` : "" }}</span>
        </router-link>
        <div class="k-tile -save">
          <span class="k-tile__ico"><v-icon size="20">sell</v-icon></span>
          <b><u-price :amount="saved" :currency="currency" /></b>
          <span>{{ savedWords }}</span>
        </div>
        <router-link :to="sectionRoute('USER_WALLETS_PAGE')" class="k-tile">
          <span class="k-tile__ico"><v-icon size="20">account_balance_wallet</v-icon></span>
          <b><u-price :amount="wallet.amount" :currency="wallet.currency" /></b>
          <span>in your wallet</span>
        </router-link>
        <router-link :to="sectionRoute('USER_GIFTCARDS_PAGE')" class="k-tile">
          <span class="k-tile__ico"><v-icon size="20">card_giftcard</v-icon></span>
          <b>{{ account.giftcards ?? "–" }}</b>
          <span>{{ account.giftcards === 1 ? "gift card" : "gift cards" }}</span>
        </router-link>
        <router-link v-if="waiting" :to="orderRoute(waiting)" class="k-tile -wide -pay">
          <span class="k-tile__ico"><v-icon size="20">lock_clock</v-icon></span>
          <span class="k-tile__words">
            <b>{{ code(waiting) }} is waiting for payment</b>
            <span><u-price :amount="waiting.price" :currency="waiting.currency" /> · pay to keep it</span>
          </span>
          <span class="k-btn -pay -sm">Pay</span>
        </router-link>
      </aside>
    </div>

    <!-- The last orders -->
    <section v-if="account.total > 1" class="k-sec">
      <header class="k-sec__head">
        <h2>Order history</h2>
        <router-link :to="ordersRoute" class="k-sec__link">All orders<v-icon size="18">chevron_right</v-icon></router-link>
      </header>
      <kalio-orders-board :limit="5" compact mode="table" />
    </section>

    <kalio-buy-again class="k-sec" />

    <!-- Addresses -->
    <section v-if="account.addresses" class="k-sec">
      <header class="k-sec__head">
        <h2>Delivery addresses</h2>
        <router-link v-if="account.addresses.length" :to="sectionRoute('USER_ADDRESSES_PAGE')" class="k-sec__link">
          All {{ account.addresses.length }}<v-icon size="18">chevron_right</v-icon>
        </router-link>
      </header>
      <div class="k-ahome__addrs">
        <router-link v-for="address in account.addresses.slice(0, 3)" :key="address.id" :to="sectionRoute('USER_ADDRESSES_PAGE')" class="k-addrcard">
          <b><v-icon size="18">place</v-icon>{{ address.title || "Address" }}</b>
          <span>{{ addressLine(address) }}</span>
          <small v-if="address.name || address.phone">{{ [address.name, address.phone].filter(Boolean).join(" · ") }}</small>
        </router-link>
        <router-link :to="sectionRoute('USER_ADDRESSES_PAGE')" class="k-addrcard -add"><v-icon size="20">add</v-icon>Add an address</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import { reorder } from "../kalio-basket";
import { productImage, productsById, vendors } from "../kalio-catalog";
import KalioBuyAgain from "./KalioBuyAgain.vue";
import KalioOrdersBoard from "./KalioOrdersBoard.vue";
import {
  STATES,
  account,
  loadAddresses,
  loadDetail,
  loadGiftcards,
  loadOrders,
  loadWallets,
  orderCode,
  paidWords,
  standing,
  stepOf,
  userKnown,
  when,
} from "./kalio-account";

const LINES = 4;

export default {
  name: "KalioAccountHome",
  components: { KalioOrdersBoard, KalioBuyAgain },
  mixins: [CurrencyMixin],
  inject: ["$shop"],

  data() {
    return {
      account,
      states: STATES,
      sellers: new Map(),
      catalogue: new Map(),
      busy_again: false,
      again_done: false,
    };
  },

  computed: {
    currency() {
      return this.latest?.currency || this.GetUserSelectedCurrency()?.code || this.$shop.currency;
    },
    latest() {
      return account.orders[0] || null;
    },
    detail() {
      return this.latest ? account.details[this.latest.id] : null;
    },
    tone() {
      return standing(this.latest);
    },
    lines() {
      const detail = this.detail;
      if (detail) {
        return (detail.items || []).slice(0, LINES).map((item) => ({
          key: item.id,
          src: this.image(item),
          title: item.product?.title || "An item",
          count: item.count,
          price: item.price,
          total: this.lineTotal(item),
          seller: this.sellerName(item),
          currency: detail.currency,
        }));
      }
      // Before the full order (or without it): the list's products and counts.
      const missing = !!account.missing[this.latest?.id];
      return (this.latest?.items || []).slice(0, LINES).map((item, i) => {
        const product = this.catalogue.get(item.product_id);
        return {
          key: `l${i}`,
          src: (product && productImage(product, true)) || this.getProductImage(item.product_id),
          title: product?.title || (missing ? "An item" : null),
          count: item.count,
          price: null,
          total: null,
          seller: null,
          currency: this.latest.currency,
        };
      });
    },
    moreLines() {
      return Math.max(0, (this.detail?.items || this.latest?.items || []).length - LINES);
    },
    footWords() {
      const parts = [paidWords(this.latest)];
      if (this.detail?.discount > 0) parts.push(`you saved ${this.money(this.detail.discount, this.detail.currency)}`);
      return parts.filter(Boolean).join(" · ");
    },
    moving() {
      return account.orders.filter((o) => ["go", "prep"].includes(standing(o).tone)).length;
    },
    waiting() {
      return account.orders.find((o) => standing(o).tone === "pay") || null;
    },
    /** What deals took off, over the orders read in full (not cancelled). */
    saved() {
      return Object.values(account.details)
        .filter((o) => o.status !== "Canceled")
        .reduce((sum, o) => sum + (o.discount || 0), 0);
    },
    savedWords() {
      const read = Object.keys(account.details).length;
      return read < account.total ? "saved on recent orders" : "saved with deals";
    },
    wallet() {
      const list = account.wallets || [];
      const mine = list.find((w) => w.currency === this.currency) || list[0];
      return { amount: mine?.balance || 0, currency: mine?.currency || this.currency };
    },
    ordersRoute() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
  },

  watch: {
    latest: {
      handler(order) {
        if (order) loadDetail(this, order.id);
      },
      immediate: true,
    },
  },

  created() {
    this.setPageTitle?.("My account");
    vendors().then((list) => (this.sellers = new Map(list.map((v) => [v.id, v]))));
    productsById().then((map) => (this.catalogue = map));
    // After a reload the shopper is read first; a guest has only the
    // orders kept on this device.
    userKnown(this).then(() => {
      if (!this.USER()) {
        this.$router.replace(this.ordersRoute);
        return;
      }
      loadOrders(this);
      loadAddresses();
      loadWallets(this);
      loadGiftcards(this);
    });
  },

  methods: {
    when,
    code(order) {
      return orderCode(this, order);
    },
    orderRoute(order) {
      return { name: "MyPhysicalOrderInfoPage", params: { basket_id: order.id } };
    },
    sectionRoute(name) {
      return { name: window.$storefront.routes[name] };
    },
    stepClass(i) {
      const at = stepOf(this.latest);
      if (i < at || (i === at && at === this.states.length - 1)) return "-done";
      if (i === at) return "-now";
      return "";
    },
    /** The times Selldone records: placed, sent, delivered. */
    stepTime(i) {
      const t = this.detail?.transportation_order;
      const at = i === 0 ? this.latest.reserved_at : i === 3 ? t?.send_at : i === 4 ? this.detail?.delivery_at || t?.deliver_at : null;
      if (!at || this.stepClass(i) !== "-done") return null;
      return new Date(at).toLocaleTimeString(document.documentElement.lang || "en", { hour: "numeric", minute: "2-digit" });
    },
    image(item) {
      if (item.variant?.image) return window.CDN.GET_SHOP_IMAGE_PATH(item.variant.image, 128);
      return productImage(item.product, true);
    },
    sellerName(item) {
      return this.sellers.get(item.vendor_id)?.name || null;
    },
    lineTotal(item) {
      return (item.price || 0) * (item.count || 0) - (item.offer_amount || 0);
    },
    money(amount, currency) {
      try {
        return new Intl.NumberFormat(document.documentElement.lang || "en", { style: "currency", currency: currency || "USD" }).format(amount || 0);
      } catch (e) {
        return `${amount}`;
      }
    },
    addressLine(a) {
      const street = [a.address, a.no ? `No. ${a.no}` : null, a.unit ? `Unit ${a.unit}` : null].filter(Boolean).join(", ");
      return [street, [a.city, a.postal].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    },
    async buyAgain() {
      this.busy_again = true;
      try {
        const full = this.detail || (await loadDetail(this, this.latest.id));
        if (!full) throw new Error("no order");
        const { added, failed } = await reorder(this, full.items);
        if (added) {
          this.again_done = true;
          setTimeout(() => (this.again_done = false), 2400);
        }
        if (failed) NotificationService.showErrorAlert(null, `${failed} ${failed === 1 ? "item is" : "items are"} not sold any more and stayed out.`);
      } catch (e) {
        NotificationService.showErrorAlert(null, "This order could not be added again.");
      } finally {
        this.busy_again = false;
      }
    },
  },
};
</script>
