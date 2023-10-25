<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const postAnnotations = ref<Array<any>>([]);
const deletedPostAnnotations = ref<Array<any>>([]);
async function getAnnotatedPosts() {
  try {
    const annotations = await fetchy("/api/annotation/myAnnotations", "GET", { alert: false });
    deletedPostAnnotations.value = annotations.pop().annotations;
    postAnnotations.value = annotations;
    console.log(deletedPostAnnotations.value, postAnnotations.value);
    console.log(deletedPostAnnotations.value);
  } catch (error) {
    return;
  }
}

onBeforeMount(async () => {
  try {
    await getAnnotatedPosts();
    console.log(deletedPostAnnotations.value);
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <main>
    <h1>My Annotations</h1>
    <div class="post-list" v-for="post in postAnnotations" :key="post">
      <PostComponent :post="post.post" :rating="post.post.rating" :author="post.post.author" :annotations="post.annotations" />
    </div>
    <br /><br />
    <div v-if="deletedPostAnnotations.length > 0">
      <div v-for="annotation in deletedPostAnnotations" :key="annotation">
        {{ annotation.quote }}
        {{ annotation.comment }}
      </div>
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
}

main {
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
}
</style>
