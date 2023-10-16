<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { capitalize, capitalizePhrase } from "../../../server/framework/utils";

const props = defineProps(["rating", "resume", "canEdit"]);
const { currentUserId } = storeToRefs(useUserStore());
</script>

<template>
  <div class="resume">
    <div class="header">
      <div class="field">
        <h3>{{ capitalize(props.resume.field) }}</h3>
        <div class="pill">Rating: {{ props.rating }}</div>
      </div>
      <div>
        <menu v-if="props.resume.author === currentUserId">
          <button class="edit-btn">Edit</button>
          <button class="edit-btn">Delete</button>
        </menu>
      </div>
    </div>
    <div class="content">
      <!-- TODO -->
      <div v-if="props.resume.work.length > 0 || props.resume.school.length > 0">
        <div v-if="props.resume.work.length > 0">
          <div class="section"><b>Work</b></div>
          <div v-for="work in props.resume.work" :key="work">
            <p>{{ capitalize(work) }}</p>
          </div>
        </div>
        <div v-if="props.resume.school.length > 0">
          <div class="section"><b>School</b></div>
          <div v-for="school in props.resume.school" :key="school">
            <p>{{ capitalizePhrase(school) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div><i>No Relevant Experience </i></div>
      </div>
    </div>
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

.header {
  background-color: burlywood;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.field {
  padding-left: 8px;
  display: flex;
  flex-wrap: wrap;
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
