<script setup lang="ts">
import ResumeComponent from "@/components/Resume/ResumeComponent.vue";
import { useResumeStore } from "@/stores/resume";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";

const resumeStore = useResumeStore();
const { getResumes } = useResumeStore();
const { currentUserResumes } = storeToRefs(resumeStore);
const allResumeFields = computed(() => currentUserResumes.value.map((resume) => resume.resume.field));
console.log(currentUserResumes.value);

onBeforeMount(async () => {
  try {
    await getResumes();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <main>
    <div class="header">
      <h1>My Profile</h1>
      <div class="title">
        <h2>My Resumes</h2>
        <div>
          <router-link to="/createResumeForm" custom v-slot="{ navigate }">
            <button @click="navigate" role="link" class="add-btn">Add</button>
          </router-link>
        </div>
      </div>
      <div class="fields">
        <div class="field-pill" v-for="field in allResumeFields" :key="field">
          {{ field }}
        </div>
      </div>
    </div>
    <section>
      <section>
        <article v-for="resume in currentUserResumes" :key="resume._id">
          <ResumeComponent :resume="resume.resume" :rating="resume.rating" :canEdit="true" :resumeFields="allResumeFields" />
          <!-- <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
          <!-- <==<EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
        </article>
      </section>
    </section>
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
}
.add-btn {
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 16px;
}
</style>
