<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { logoutUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <!-- <button class="pure-button pure-button-primary" @click="logout">Logout</button> -->
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
