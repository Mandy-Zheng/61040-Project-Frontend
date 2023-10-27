<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const postAnnotations = ref<Array<any>>([]);
const deletedPostAnnotations = ref<Array<any>>([]);
const loaded = ref<boolean>(false);
async function getAnnotatedPosts() {
  loaded.value = false;
  try {
    const annotations = await fetchy("/api/annotation/myAnnotations", "GET", { alert: false });
    deletedPostAnnotations.value = annotations.pop().annotations;
    postAnnotations.value = annotations;
  } catch (error) {
    return;
  }
  loaded.value = true;
}

onBeforeMount(async () => {
  try {
    await getAnnotatedPosts();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <main>
    <h1>My Annotations</h1>
    <h5>Note that if the post you annotated is deleted, your annotations will be deleted too</h5>
    <br />
    <span class="empty" v-if="!loaded"> <i>Loading...</i></span>
    <span v-else-if="postAnnotations.length > 0">
      <div class="post-list" v-for="post in postAnnotations" :key="post">
        <PostComponent :post="post.post" :rating="post.post.rating" :author="post.post.author" :annotations="post.annotations" /></div
    ></span>
    <span class="empty" v-else> <i>You have No Annotations</i></span>
    <br /><br />
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
h5 {
  margin: 0;
  font-weight: 100;
}
i {
  margin-top: 4em;
  font-size: 32px;
  color: #9c9a99;
  padding: 1em;
}
span {
  display: flex;
  flex-direction: column;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
h2 {
  margin-bottom: 0;
  margin-top: 0;
}
span {
  display: flex;
  width: 90%;
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
