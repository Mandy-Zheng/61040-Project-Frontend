<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const props = defineProps(["id"]);
const viewablePosts = ref<Array<any>>([]);
async function getPosts() {
  try {
    viewablePosts.value = await fetchy("/api/exclusivepost", "GET");
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
    <CreatePostForm />
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
