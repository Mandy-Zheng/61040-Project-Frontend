<!-- <script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";

import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { currentUsername } = storeToRefs(useUserStore());
const posts = ref<Array<any>>([]);

async function getPosts() {
  try {
    try {
      posts.value = (await fetchy(`/api/exclusivepost/author/${currentUsername.value}`, "GET", { alert: false })).posts;
    } catch (error) {
      return;
    }
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  try {
    await getPosts();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <main>
    <span class="post-header">
      <h1>My Posts</h1>
      <router-link to="/createPost" custom v-slot="{ navigate }">
        <button @click="navigate" role="link" class="add-btn pure-button">New Post</button>
      </router-link>
    </span>
    <div class="post-list" v-for="post in posts" :key="post">
      <PostComponent :post="post.post" :rating="post.post.rating" :author="currentUsername" :annotations="post.annotations" />
    </div>
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}

h2 {
  margin-bottom: 0;
  margin-top: 0;
}

.post-header {
  display: flex;
}
.button {
  justify-self: end;
}

.post-list {
  display: flex;
  width: 90%;
  margin: auto;
}

main {
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
}
</style> -->
