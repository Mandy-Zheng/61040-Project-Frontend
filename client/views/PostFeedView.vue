<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
const postStore = usePostStore();
const { getPosts } = postStore;
const { viewablePosts } = storeToRefs(postStore);
const { currentUsername } = storeToRefs(useUserStore());
const showCurrentUserPosts = ref<boolean>(false);
console.log(viewablePosts.value);
const posts = computed(() => (showCurrentUserPosts.value ? viewablePosts.value.filter((post) => post.author === currentUsername.value) : viewablePosts.value));
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
    <h1>My Posts</h1>
    <router-link to="/createPost" custom v-slot="{ navigate }">
      <button @click="navigate" role="link" class="add-btn pure-button">New Post</button>
    </router-link>
    <label for="checkbox-radio-option-one" class="pure-checkbox">Show My Posts Only </label> <input type="checkbox" class="checkbox" id="checkbox-radio-option-one" v-model="showCurrentUserPosts" />
    <div class="post-list" v-for="post in posts" :key="post">
      <PostComponent :post="post.post" :rating="post.rating" :author="post.author" />
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

.post-list {
  display: flex;
  width: 90%;
  margin: auto;
  margin-bottom: 2em;
}

main {
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
}
</style>
