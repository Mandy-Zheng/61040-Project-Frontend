<script setup lang="ts">
import router from "@/router";
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import Multiselect from "@vueform/multiselect";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { capitalizePhrase } from "../../../server/framework/utils";

const { currentUsername, allUsers } = storeToRefs(useUserStore());
const title = ref<string>("");
const content = ref<string>("");
const usernames = computed(() =>
  allUsers.value
    .filter((user: any) => user.username !== currentUsername.value)
    .map((user: any) => {
      return { label: user.username, value: user.username };
    }),
);
const selectedUsers = ref<Array<string>>([]);
const postStore = usePostStore();
const { getPosts, createPost } = postStore;
const { viewablePosts } = storeToRefs(postStore);
const allTags = computed(() => [...new Set(viewablePosts.value.map((post) => post.post.tags).reduce((acc, curr) => acc.concat(curr), []))]);
const selectedField = ref<string>("");
const minimumRating = ref<number>(0);
const selectedTags = ref<Array<string>>([]);
const isPublic = ref<boolean>(true);
const topAnnotators = ref<number>(1);
const allFields = ref<Array<string>>([]);

async function newPost() {
  if (isPublic.value) {
    selectedUsers.value.push("");
  }
  const body = { title: title.value, content: content.value, audience: selectedUsers.value, tags: selectedTags.value.map((tag) => capitalizePhrase(tag)) };
  try {
    await createPost(body);
  } catch (error) {
    return;
  }
  await router.push("/feed");
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

async function addExpertsToAudience() {
  try {
    const query: Record<string, any> = { field: capitalizePhrase(selectedField.value), minimumRating: minimumRating.value };
    const qualifiedResumes = await fetchy(`/api/resume/filter`, "GET", { query });
    const qualifiedUsernames = qualifiedResumes.map((resume: any) => resume.author).filter((author: any) => author !== currentUsername);
    selectedUsers.value = [...new Set([...qualifiedUsernames, ...selectedUsers.value])];
    const successMsg = document.getElementById("success");
    if (successMsg) {
      successMsg.classList.remove("hide");

      setTimeout(function dissappear() {
        successMsg.classList.add("hide");
      }, 500);
    }
  } catch (_) {
    return;
  }
}

async function addAnnotatorsToAudience() {
  try {
    const qualifiedUsers = await fetchy(`/api/annotation/topReviewers/${topAnnotators.value}`, "GET");
    const usernames = qualifiedUsers.map((user: any) => user.user);
    selectedUsers.value = [...new Set([...usernames, ...selectedUsers.value])];
    const successMsg = document.getElementById("success");
    if (successMsg) {
      successMsg.classList.remove("hide");

      setTimeout(function dissappear() {
        successMsg.classList.add("hide");
      }, 500);
    }
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  try {
    await getPosts();
    await getAllFields();
  } catch {
    // User is not logged in
  }
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<template>
  <div class="form" @submit.prevent="newPost">
    <h1 for="content">Create a Post</h1>
    <form class="">
      <fieldset>
        <div class="post-title">
          <label class="form-label" for="title">Title<span class="required">*</span></label>
          <input type="text" v-model="title" placeholder="How to Make A Post" required />
          <div class="post-audience public-audience">
            <input type="checkbox" class="checkbox" id="checkbox-radio-option-one" v-model="isPublic" />
            <label for="checkbox-radio-option-one" class="checkbox-label">Make Post Public </label>
          </div>
        </div>

        <div class="selections">
          <div class="post-audience" v-if="!isPublic">
            <div class="selected-audience">
              <label class="form-label" for="audience">Audience<span class="required">*</span></label>

              <Multiselect class="multiselect" v-model="selectedUsers" :options="usernames" :mode="'tags'" :searchable="true" :close-on-select="false" required />
              <p id="success" class="hide">Successfully Added</p>
            </div>

            <div class="add-expert"><label class="" for="">Add Experts</label> <button class="add-btn pure-button pure-button-primary" @click.prevent="addExpertsToAudience">Add</button></div>
            <div class="experts">
              <div class="expert-field">
                <label class="" for="">Resume</label>
                <Multiselect v-model="selectedField" :options="allFields" :searchable="true" />
                <label class="" for="">Minimum Rating</label>
                <input class="number-inp" type="number" v-model="minimumRating" min="0" placeholder="3.2" />
              </div>
            </div>
          </div>

          <div class="add-annotator" v-if="!isPublic">
            <div class="annotators"><label class="" for="">Add Top Annotators</label> <input class="number-inp" type="number" v-model="topAnnotators" min="0" step="1" /></div>
            <button class="add-btn pure-button pure-button-primary" @click.prevent="addAnnotatorsToAudience">Add</button>
          </div>

          <div class="post-tags">
            <label class="form-label" for="tags">Tags</label>
            <Multiselect class="multiselect" v-model="selectedTags" :options="allTags" :mode="'tags'" :searchable="true" :close-on-select="false" :create-option="true" />
          </div>
          <div class="form-caption"><p>(Make your own tags or use existing tags!)</p></div>
        </div>
        <div class="pure-control-group post-content">
          <label class="form-label" for="content">Content<span class="required">*</span></label>
          <textarea v-model="content" placeholder="content..." required></textarea>
        </div>
        <div class="submit">
          <button type="submit" class="submit-btn">Submit</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}
h1 {
  font-size: 36px;
  text-align: center;
}
p {
  font-size: smaller;
  margin-left: 2em;
  margin-top: 0;
  color: #9c9a99;
}
#success {
  margin: 0;
}

#success {
  transition: opacity 200ms ease-in-out;
}

#success.hide {
  opacity: 0;
}
#success.appear {
  opacity: 1;
}
.form-caption {
  margin-left: 75px;
}
.add-expert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-bottom: 0.5em;
}
.form {
  display: flex;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding-left: 2em;
  padding-right: 2em;
  padding-bottom: 2em;
  width: 90%;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0;
  height: 100%;
}
fieldset {
  padding: 2em;
  padding-left: 12em;
}
.required {
  color: red;
}
.checkbox {
  transform: scale(1.5);
  width: fit-content;
}
.checkbox-label {
  margin-left: 1em;
}
.add-annotator {
  display: flex;
  width: 80%;
  align-items: center;
  justify-content: space-between;
}
.annotators {
  display: flex;
  align-content: center;
  align-items: center;
  margin-bottom: 2em;
}

.annotators > input {
  margin-left: 1em;
}
.number-inp {
  width: 10%;
  padding: 0.7em;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
.experts {
  width: 80%;
  display: flex;
}

.rating {
  display: flex;
  align-items: center;
}
.multiselect {
  margin: 0 2em;
  width: 50%;
}

.expert-field {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1em;
}
.expert-field > .multiselect {
  width: 40%;
}

.selected-audience {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1em;
}

.post-tags > .multiselect {
  width: 45%;
}
.post-title,
.post-audience,
.post-tags,
.post-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.public-audience {
  margin-left: 1em;
}
.post-title {
  margin-bottom: 2em;
}

.add-btn {
  margin-left: 1em;
  font-size: smaller;
  border-radius: 64px;
  background-color: #c0b283;
  height: fit-content;
}
.checkbox {
  margin-left: 1em;
}
input {
  display: flex;
  margin-left: 2em;
  padding: 0.7em;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  width: 30%;
}
.form-label {
  width: 70px;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  margin-left: 2em;
  margin-right: 2em;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 50%;
  resize: none;
}
.btn {
  display: flex;
  justify-content: space-between;
}

.selections {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.submit {
  margin-right: 12em;
  display: flex;
  align-items: center;
  margin-top: 1em;
}
.submit-btn {
  border: 2px solid #021c41;
  background-color: white;
  border-radius: 4px;
  padding: 0.5em 1em;
  height: fit-content;
  text-align: center;
  margin: auto;
}
.submit-btn:hover {
  background-color: #557373;
  color: #f2efea;
  border: 1px solid #557373;
}
</style>
