<script setup lang="ts">
import ResumeComponent from "@/components/Resume/ResumeComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import Multiselect from "@vueform/multiselect";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { capitalizePhrase } from "../../../server/framework/utils";

const { allUsers } = storeToRefs(useUserStore());
const props = defineProps(["user"]);
const username = ref<string>(props.user);
const field = ref<string>("");
const rating = ref<number>(0);
const resumeResults = ref<Array<any>>([]);
const validationResults = ref<Array<any>>([]);
const allFields = ref<Array<string>>([]);
const allUsernames = computed(() =>
  allUsers.value.map((user: any) => {
    return { label: user.username, value: user.username };
  }),
);
const loaded = ref<boolean>(false);

async function searchResume() {
  loaded.value = false;
  try {
    const query: Record<string, any> = { username: username.value ?? "", field: capitalizePhrase(field.value ?? ""), minimumRating: rating.value };
    resumeResults.value = await fetchy(`/api/resume/filter`, "GET", { query });
    validationResults.value = await Promise.all(resumeResults.value.map((resume) => fetchy(`/api/validation/resume/${resume.resume._id}`, "GET")));
  } catch (_) {
    loaded.value = true;
  }
  loaded.value = true;
}

async function getAllFields() {
  try {
    const fields = await fetchy(`/api/resume/allTags`, "GET");
    allFields.value = fields.map((field: any) => {
      return { label: capitalizePhrase(field), value: field };
    });
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  await searchResume();

  await getAllFields();
});
</script>

<template>
  <div class="search">
    <div class="filters">
      <label>Username:</label>
      <Multiselect class="multiselect" v-model="username" :options="allUsernames" :searchable="true" required />
    </div>
    <div class="filters">
      <label>Field:</label>
      <Multiselect class="multiselect" v-model="field" :options="allFields" :searchable="true" :create-option="true" />
    </div>
    <div class="filters">
      <label>Minimum Rating:</label>
      <input class="number-inp" type="number" v-model="rating" min="0" placeholder="3.2" />
    </div>
    <button type="submit" class="search-btn" @click="searchResume">Search Resumes</button>
  </div>

  <div class="userresumes">
    <div v-if="!loaded" class="empty">
      <i>Loading...</i>
    </div>
    <div class="empty" v-else-if="resumeResults.length === 0">
      <i>No Results</i>
    </div>
    <div v-else class="resumes" v-for="(resume, index) in resumeResults" :key="resume">
      <ResumeComponent
        :id="resume.resume.field"
        :resume="resume.resume"
        :rating="validationResults[index].rating"
        :canEdit="false"
        :author="resume.author"
        :approvals="validationResults[index].approvals"
        :disapprovals="validationResults[index].disapprovals"
      />
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}
i {
  font-size: 48px;
  color: #9c9a99;
}
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

.multiselect {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 16px;
}

.search {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  align-items: end;
}

.filters {
  display: flex;
  flex-direction: column;
  width: 20%;
}

.fields {
  display: flex;
  flex-direction: column;
  width: 20%;
}

.search-btn {
  border: 2px solid #021c41;
  background-color: white;
  border-radius: 4px;
  padding: 0.7em 1em;
  height: fit-content;
  align-self: flex-end;
}
.search-btn:hover {
  background-color: #557373;
  color: #f2efea;
  border: 1px solid #557373;
}

.userresumes {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 2em;
}
.number-inp {
  padding: 0.7em;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  width: 50%;
}
</style>
