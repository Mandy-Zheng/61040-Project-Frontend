<script setup lang="ts">
import ResumeComponent from "@/components/Resume/ResumeComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { capitalizePhrase } from "../../../server/framework/utils";
const username = ref<string>("");
const field = ref<string>("");
const rating = ref<number>(0);
const resumeResults = ref<Array<any>>([]);

const searchResume = async () => {
  try {
    const query: Record<string, any> = { username: username.value, field: capitalizePhrase(field.value), minimumRating: rating.value };
    resumeResults.value = await fetchy(`/api/resume/filter`, "GET", { query });
  } catch (_) {
    return;
  }
};
</script>

<template>
  <div class="search">
    <div class="filters">
      <label>Username:</label>
      <input type="text" v-model="username" placeholder="TimTheBeaver" />
    </div>
    <div class="filters">
      <label>Field:</label>
      <input type="text" v-model="field" placeholder="Biology" />
    </div>
    <div class="filters">
      <label>Minimum Rating:</label>
      <input class="number-inp" type="number" v-model="rating" min="0" placeholder="3.2" />
    </div>
    <button type="submit" class="pure-button-primary pure-button search-btn" @click="searchResume">Search Resumes</button>
  </div>

  <!-- <div class="title">
        <h2>My Resumes</h2>
        <div>
          <router-link to="/createResumeForm" custom v-slot="{ navigate }">
            <button @click="navigate" role="link" class="add-btn">Add</button>
          </router-link>
        </div>
      </div> -->
  <div class="userresumes">
    <div class="resumes" v-for="resume in resumeResults" :key="resume">
      <ResumeComponent :id="resume.resume.field" :resume="resume.resume" :rating="resume.rating" :canEdit="false" :author="resume.author" />
    </div>
  </div>
  <!-- </div> -->
  <!-- <section>
      <section>
        <article v-for="resume in currentUserResumes" :key="resume._id">
          <ResumeComponent :id="resume.resume.field" :resume="resume.resume" :rating="resume.rating" :canEdit="true" :resumeFields="allResumeFields" />

        </article>
      </section>
    </section> -->
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
}

.search-btn {
  font-size: small;
  height: min-content;
}

.userresumes {
  width: 100%;
}
.number-inp {
  width: 60%;
}
</style>
