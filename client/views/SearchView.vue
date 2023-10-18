<script setup lang="ts">
import ResumeSearch from "@/components/Search/ResumeSearch.vue";

const props = defineProps(["category"]);
</script>

<template>
  <main>
    <h1>Search for {{ props.category }}</h1>
    <div class="header">
      <ResumeSearch v-if="props.category === 'Resumes'" />
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

.header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}
.title {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 50%;
}

.fields {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
}

.field-pill {
  border: 1px solid black;
  padding: 4px;
  border-radius: 32px;
  margin: 8px 8px 4px 0px;
  cursor: pointer;
}
.field-pill:hover {
  background-color: #3b8ee2;
}
.add-btn {
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 16px;
}
</style>
