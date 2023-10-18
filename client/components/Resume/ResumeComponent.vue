<script setup lang="ts">
import router from "@/router";
import { useResumeStore } from "@/stores/resume";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { capitalize } from "../../../server/framework/utils";

const props = defineProps(["rating", "resume", "canEdit", "author"]);
const { currentUserId } = storeToRefs(useUserStore());
const resumeStore = useResumeStore();
const { deleteResume, selectResumeToEdit } = resumeStore;
async function editResume() {
  selectResumeToEdit(props.resume.field);
  await router.push({ name: "editResume" });
}
</script>

<template>
  <div class="resume">
    <div class="header">
      <div class="resumeheader">
        <div class="field">
          <h3>{{ capitalize(props.resume.field) }}</h3>
          <div class="pill">Rating: {{ props.rating }}</div>
        </div>
        <div>
          <menu v-if="props.resume.author === currentUserId">
            <button class="edit-btn" @click="editResume" role="link">Edit</button>

            <button class="edit-btn" @click="deleteResume(props.resume._id)">Delete</button>
          </menu>
        </div>
      </div>
      <p class="author">Author: {{ props.author }}</p>
    </div>
    <div class="content">
      <!-- TODO -->
      <div v-if="props.resume.work.length > 0 || props.resume.school.length > 0">
        <div v-if="props.resume.work.length > 0">
          <div class="section"><b>Work</b></div>
          <div v-for="work in props.resume.work" :key="work">
            <p>{{ work }}</p>
          </div>
        </div>
        <div v-if="props.resume.school.length > 0">
          <div class="section"><b>School</b></div>
          <div v-for="school in props.resume.school" :key="school">
            <p>{{ school }}</p>
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

.resumeheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header {
  flex-direction: column;
  background-color: burlywood;
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
