<!-- Digito — the site's one quick-buy sheet (digito-quick.ts). -->
<template>
  <kalio-quick-buy v-model="sheet.open" :product="sheet.product" />
</template>

<script>
import KalioQuickBuy from "../kalio/KalioQuickBuy.vue";
import { quickSheet } from "./digito-quick";

export default {
  name: "DigitoQuickHost",
  components: { KalioQuickBuy },
  data: () => ({ sheet: quickSheet }),
  watch: {
    $route() {
      this.sheet.open = false;
    },
  },
};
</script>
