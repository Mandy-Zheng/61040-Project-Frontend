<script setup lang="ts">
import router from "@/router";
import { useResumeStore } from "@/stores/resume";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { capitalizePhrase } from "../../../server/framework/utils";

const resumeStore = useResumeStore();
const { createResume, editResume, selectResumeToEdit } = resumeStore;
const { currentUserResumes, editingResume } = storeToRefs(resumeStore);

const props = defineProps(["field"]);
if (props.field) {
  selectResumeToEdit(props.field);
}

const allResumeFields = computed(() => [...currentUserResumes.value.map((resume) => resume.resume.field), "New"]);
let selectedForm = ref<string>(editingResume.value);
let currentRes = currentUserResumes.value.filter((resume) => resume.resume.field === editingResume.value);
let curField = ref<string>(editingResume.value === "New" ? "" : editingResume.value);
let work = ref<Array<string>>(currentRes[0]?.resume.work.length > 0 ? currentRes[0]?.resume.work : [""]);
let school = ref<Array<string>>(currentRes[0]?.resume.school.length > 0 ? currentRes[0]?.resume.school : [""]);

const addWorkInput = () => {
  work.value.push("");
};

const addSchoolInput = () => {
  school.value.push("");
};

function isSelected(field: string) {
  return field === selectedForm.value ? "active" : "";
}

function changeForm(form: string) {
  selectedForm.value = form;
  selectResumeToEdit(form === "New" ? "" : form);
  work.value = [""];
  school.value = [""];

  if (form !== "New") {
    const resumes = currentUserResumes.value.filter((resume) => resume.resume.field === form);
    if (resumes.length) {
      const workList = resumes[0].resume.work;
      const schoolList = resumes[0].resume.school;
      work.value = workList.length === 0 ? [""] : workList;
      school.value = schoolList.length === 0 ? [""] : schoolList;
    }
  }
  window.scrollTo(0, 0);
}

const submitNewResume = async () => {
  const body = { field: capitalizePhrase(curField.value), work: work.value.filter((work) => work.length > 0), school: school.value.filter((school) => school.length > 0) };
  await router.push("/profile").then(async () => await createResume(body));
};

const updateResume = async () => {
  const update = { work: work.value, school: school.value };
  await router.push("/profile").then(async () => await editResume(selectedForm.value, update));
};

// onBeforeMount(async () => {
//   try {
//     await resetStore();
//   } catch {
//     // User is not logged in
//   }
// });
</script>

<template>
  <div class="form">
    <h2 for="content">Resume List Updates</h2>
    <p>Want to edit another existing resume instead?</p>
    <div class="fields">
      <div class="field-pill" :class="isSelected(fieldSelection)" v-for="fieldSelection in allResumeFields" :key="fieldSelection" @click="changeForm(fieldSelection)">
        {{ fieldSelection }}
      </div>
    </div>
    <div class="field" v-if="selectedForm === 'New'">
      <label for="field-input"><h2>Field</h2></label>
      <div><input id="field-input" v-model="curField" placeholder="Biology" required /></div>
    </div>
    <h2 for="content">Add Work Experience <button class="add-btn" @click.prevent="addWorkInput">+</button></h2>
    <div class="experience" v-for="idx in work.length" :key="idx">
      <label for="'work'+idx">Work Experience {{ idx }}</label
      ><br />
      <textarea id="'work'+idx" v-model="work[idx - 1]"> </textarea>
    </div>
    <h2 for="content">Add School Experience <button class="add-btn" @click.prevent="addSchoolInput">+</button></h2>
    <div class="experience" v-for="idx in school.length" :key="idx">
      <label for="'school'+idx">School Experience {{ idx }}</label
      ><br />
      <textarea id="'school'+idx" v-model="school[idx - 1]"> </textarea>
    </div>

    <div class="btn">
      <router-link to="/profile" custom v-slot="{ navigate }">
        <button @click="navigate" role="link" class="cancel-btn pure-button-primary pure-button">Cancel</button>
      </router-link>
      <div v-if="selectedForm === 'New'">
        <button type="submit" class="submit-btn pure-button-primary pure-button" @click="submitNewResume">Create Resume</button>
      </div>
      <div v-else>
        <button type="submit" class="submit-btn pure-button-primary pure-button" @click="updateResume">Update Resume</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}
.form {
  display: flex;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em;
  padding-left: 24px;
}
.add-btn {
  border-radius: 32px;
  padding-left: 8px;
  padding-right: 8px;
}

.add-btn:hover {
  background-color: #bfafaf;
}

.fields {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
}

.field {
  display: flex;
  align-items: center;
}

.field-pill {
  border: 1px solid #d8c6ba;
  padding: 4px;
  border-radius: 32px;
  margin: 8px 8px 4px 0px;
  background-color: #d8c6ba;
  color: black;
}

.active {
  background-color: #557373;
  color: #f2efea;
  border: 1px solid #557373;
}
.field-pill:hover {
  background-color: #557373;
  color: #f2efea;
}

#field-input {
  margin-left: 12px;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid black;
}
.experience {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  background-color: #dfe5f3;
}
.btn {
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  background-color: #557373;
}
.cancel-btn {
  background-color: #557373;
}
</style>
