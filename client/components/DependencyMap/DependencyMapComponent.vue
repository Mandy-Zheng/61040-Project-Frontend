<script setup lang="ts">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.mjs";
import { onMounted } from "vue";
import { fetchy } from "../../utils/fetchy";
mermaid.initialize({ startOnLoad: true, securityLevel: "loose" });
mermaid.run({ querySelector: ".mermaid" });

async function getMap() {
  try {
    const map = await fetchy(`/api/depmap`, "GET");
  } catch (_) {
    return;
  }
}

// const goToPost = async function () {
//   console.log("ran");
//   await router.push({ name: "PostFeed", query: { id: "id 123" } });
// };

// const goToPost = function () {
//   console.log("ran");
// };
const mario = "Hey";
onMounted(() => {
  mermaid.run({ querySelector: ".mermaid" });
});
</script>

<template>
  <div class="resume">
    <pre class="mermaid">
  graph LR
  A --> X[{{ mario }}]
  B-->C
  B-->D(fa:fa-spinner);
  click X "/post?id=123"
</pre
    >
  </div>
</template>

<style scoped>
.resume {
  width: 50%;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
}

.resumeheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header {
  flex-direction: column;
  background-color: grey;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.field,
.author {
  padding-left: 8px;
  display: flex;
  flex-wrap: wrap;
  margin: 0px;
}

.content {
  padding: 20px 24px 4px 24px;
  background-color: bisque;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.edit-btn {
  text-align: center;
  margin-right: 8px;
}
.pill {
  border: 1px solid black;
  border-radius: 12px;
  padding: 4px;
  font-weight: 50;
  margin: 16px;
}

i {
  padding-bottom: 16px;
}

.section {
  text-decoration: underline;
}
</style>
