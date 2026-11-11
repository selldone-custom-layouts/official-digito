<!-- Digito — a guest's nudge to sign in (hidden once signed in or while the
     account is still being read). -->
<template>
  <section v-if="!user && !busyUser" class="dg-signin">
    <digito-icon name="account_circle" size="34" />
    <p>
      <b>{{ t("digito.signIn.title", "Sign in for a faster checkout.") }}</b>
      {{ t("digito.signIn.text", "Track your orders, keep your addresses and pick up where you left off.") }}
    </p>
    <button class="dg-btn" type="button" @click="signIn">{{ t("common.signIn", "Sign in") }}</button>
    <button class="dg-btn -line" type="button" @click="signIn">{{ t("digito.signIn.create", "Create an account") }}</button>
  </section>
</template>

<script>
import DigitoIcon from "./DigitoIcon.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";

export default {
  name: "DigitoSignInNudge",
  components: { DigitoIcon },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
  },
  methods: {
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
