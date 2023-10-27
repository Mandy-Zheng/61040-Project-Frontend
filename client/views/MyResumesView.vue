<script setup lang="ts">
import ResumeComponent from "@/components/Resume/ResumeComponent.vue";
import { useResumeStore } from "@/stores/resume";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { capitalize } from "../../server/framework/utils";
const resumeStore = useResumeStore();
const { resetStore } = useResumeStore();
const { currentUserResumes, userResumesValidations } = storeToRefs(resumeStore);
const allResumeFields = computed(() => currentUserResumes.value.map((resume) => resume.resume.field));

function scrollToResume(field: string) {
  const resume = document.getElementById(field);
  resume?.scrollIntoView({ behavior: "smooth", block: "start" });
}
// onBeforeMount(async () => {
//   try {
//     await resetStore();
//   } catch {
//     // User is not logged in
//   }
// });
</script>

<template>
  <main>
    <div class="header">
      <span class="title">
        <h1>My Resumes</h1>
        <router-link to="/createResumeForm" custom v-slot="{ navigate }">
          <button @click="navigate" role="link" class="add-btn">Add</button>
        </router-link>
      </span>

      <div class="fields">
        <div class="field-pill" v-for="field in allResumeFields" :key="field" @click="scrollToResume(field)">
          {{ capitalize(field) }}
        </div>
      </div>
    </div>
    <section>
      <section v-if="currentUserResumes.length > 0">
        <article v-for="(resume, index) in currentUserResumes" :key="resume._id">
          <ResumeComponent
            :id="resume.resume.field"
            :resume="resume.resume"
            :rating="userResumesValidations[index].rating"
            :canEdit="true"
            :author="resume.author"
            :approvals="userResumesValidations[index].approvals"
            :disapprovals="userResumesValidations[index].disapprovals"
          />
        </article>
      </section>
      <section class="empty" v-else><i>You have No Resumes</i></section>
    </section>
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
  font-size: 36px;
}
i {
  margin-top: 4em;
  font-size: 32px;
  color: #9c9a99;
  padding: 1em;
  border: 1px solid #9c9a99;
  border-radius: 8px;
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

.header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}
.title {
  display: flex;
  align-items: center;
}

.fields {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
  justify-content: center;
}

.field-pill {
  background-color: #5b6e74;
  border: 1px solid #5b6e74;
  color: white;
  padding: 4px;
  border-radius: 32px;
  margin: 8px 8px 4px 0px;
  cursor: pointer;
}
.field-pill:hover {
  border: 1px solid #d9c4a9;
  background-color: #d9c4a9;
  color: black;
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
.add-btn:hover {
  background-color: #557373;
  color: #f2efea;
  border: 1px solid #557373;
}
</style>
