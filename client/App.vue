<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav v-if="!isLoggedIn">
      <div class="title">
        <RouterLink :to="{ name: 'Home' }">
          <h3 class="appname">MasterLink</h3>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <div class="content" v-if="isLoggedIn">
    <div class="sidenavbar">
      <h3 class="menu-heading">MasterLink</h3>
      <div class="sidebarlinks">
        <div class="my-menu">
          <RouterLink :to="{ name: 'PostFeed' }" class="menu-link" :class="{ underline: currentRouteName == 'PostFeed' }"> Feed </RouterLink>
          <RouterLink :to="{ name: 'Profile' }" class="menu-link" :class="{ underline: currentRouteName == 'Profile' }">My Resumes </RouterLink>
          <RouterLink :to="{ name: 'MyAnnotations' }" class="menu-link" :class="{ underline: currentRouteName == 'MyAnnotations' }">My Annotations </RouterLink>
        </div>

        <div>
          <RouterLink :to="{ name: 'profileSearch' }" class="menu-link" :class="{ underline: currentRouteName == 'User Profiles' }"> Other Resumes </RouterLink>
          <RouterLink :to="{ name: 'Settings' }" class="menu-link" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </div>
      </div>
    </div>
    <div class="middle">
      <RouterView />
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<style scoped>
@import "./assets/toast.css";
.toast {
  z-index: 100;
}
.appname {
  margin-left: 1em;
}
.my-menu {
  border-bottom: 1px solid #819fa7;
  padding-bottom: 1em;
  margin-bottom: 1em;
}
.menu-link {
  color: #ffffff;
  font-family: "open sans";
  display: block;
  font-size: 18px;
  padding: 0.5em;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  margin-right: 1em;
}
h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

.underline {
  text-decoration: underline;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.menu-heading {
  padding-top: 1em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #819fa7;
  margin: 0 0 1em 0;
}

nav {
  background-color: lightgray;
  display: flex;
  align-items: center;
}
.sidenavbar {
  flex: 0 2 200px;
  background-color: #557373;
  min-height: 100vh;
  align-content: center;
  color: #f2efea;
  font-family: "open sans";
  font-size: 22px;
}
.sidebarlinks {
  position: sticky;
  flex-direction: column;
  top: 0px;
}
.middle {
  flex: 1 1 300px;
  min-height: 100vh;
}
.content {
  display: flex;
  flex: 1;
}

.sidenavbar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page {
  width: 50%;
}
</style>
