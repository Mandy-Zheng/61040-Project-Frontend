<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import Multiselect from "@vueform/multiselect";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const postStore = usePostStore();
const { getPosts } = postStore;
const { viewablePosts } = storeToRefs(postStore);
const { isLoggedIn } = storeToRefs(useUserStore());

const { allUsers } = storeToRefs(useUserStore());
const selectedTags = ref<Array<string>>([]);
const allTags = computed(() => [...new Set(viewablePosts.value.map((post) => post.post.tags).reduce((acc, curr) => acc.concat(curr), []))]);
const selectedUser = ref<string>("");
const rating = ref<number>(0);
const posts = ref<Array<any>>(viewablePosts.value.reverse());

const allUsernames = computed(() =>
  allUsers.value.map((user: any) => {
    return { label: user.username, value: user.username };
  }),
);
const refresh = () => {
  posts.value = viewablePosts.value.reverse();
  selectedTags.value = [];
  selectedUser.value = "";
  rating.value = 0;
};

const searchPost = () => {
  let filterPost = viewablePosts.value;
  if (selectedUser.value) {
    filterPost = filterPost.filter((postInfo) => postInfo.author === selectedUser.value);
  }
  if (rating.value !== 0) {
    filterPost = filterPost.filter((postInfo) => postInfo.rating >= rating.value);
  }
  if (selectedTags.value) {
    filterPost = filterPost.filter((postInfo) => {
      const postTags = new Set(postInfo.post.tags);
      return selectedTags.value.every((tag) => postTags.has(tag));
    });
  }
  posts.value = filterPost;
};

onBeforeMount(async () => {
  try {
    await getPosts();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <main v-if="isLoggedIn">
    <span class="header">
      <h1>My Posts</h1>
      <router-link to="/createPost" custom v-slot="{ navigate }">
        <button @click="navigate" role="link" class="add-btn">New Post</button>
      </router-link>
    </span>
    <div class="search">
      <div class="filters">
        <label>Username:</label>
        <Multiselect class="multiselect user" v-model="selectedUser" :options="allUsernames" :searchable="true" required />
      </div>
      <div class="filters">
        <label>Tags:</label>
        <Multiselect class="multiselect tag" v-model="selectedTags" :options="allTags" :searchable="true" :create-option="true" mode="tags" />
      </div>
      <div class="rating">
        <label>Minimum Rating:</label><br />
        <input class="number-inp" type="number" v-model="rating" min="0" placeholder="3.2" />
      </div>
      <button type="submit" class="search-btn" @click="searchPost">Search Resumes</button>
    </div>
    <div class="post-list" v-for="post in posts" :key="post">
      <PostComponent :post="post.post" :rating="post.rating" :author="post.author" @refresh="refresh" />
    </div>
  </main>
</template>

<style scoped>
* {
  font-family: "open sans";
}
h1,
h2 {
  font-size: 36px;
  text-align: center;
}

h2 {
  margin-bottom: 0;
  margin-top: 0;
}

.rating {
  width: fit-content;
}
.number-inp {
  padding: 0.7em;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  width: 75%;
}
.filters {
  width: 25%;
}
.search {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  margin-bottom: 2em;
  align-items: center;
}
.header {
  display: flex;
  align-items: center;
}

.add-btn {
  border: 2px solid #021c41;
  background-color: white;
  border-radius: 4px;
  padding: 0.5em 1em;
  height: fit-content;
  text-align: center;
  justify-self: end;
  position: absolute;
  right: 5%;
}
.add-btn:hover,
.search-btn:hover {
  background-color: #557373;
  color: #f2efea;
  border: 1px solid #557373;
}

.search-btn {
  border: 2px solid #021c41;
  background-color: white;
  border-radius: 4px;
  padding: 0.7em 1em;
  height: fit-content;
  align-self: flex-end;
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
