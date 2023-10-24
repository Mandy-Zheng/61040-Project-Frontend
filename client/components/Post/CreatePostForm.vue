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
async function newPost() {
  if (isPublic.value) {
    selectedUsers.value.push("");
  }
  const body = { title: title.value, content: content.value, audience: selectedUsers.value, tags: selectedTags.value };
  try {
    await createPost(body);
  } catch (error) {
    return;
  }
  await router.push("/feed");
}

async function addUsersToAudience() {
  try {
    const query: Record<string, any> = { field: capitalizePhrase(selectedField.value), minimumRating: minimumRating.value };
    const qualifiedResumes = await fetchy(`/api/resume/filter`, "GET", { query });
    const qualifiedUsernames = qualifiedResumes.map((resume: any) => resume.author).filter((author: any) => author !== currentUsername);
    selectedUsers.value = [...new Set([...qualifiedUsernames, ...selectedUsers.value])];
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  try {
    await getPosts();
  } catch {
    // User is not logged in
  }
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<template>
  <div class="form">
    <h2 for="content">Create a Post</h2>
    <form class="pure-form pure-form-aligned">
      <fieldset>
        <div class="pure-control-group post-title">
          <label class="form-label" for="title">Title</label>
          <input type="text" v-model="title" placeholder="Title" required />
        </div>
        <div class="post-audience">
          <label for="checkbox-radio-option-one" class="pure-checkbox">Make Post Public </label> <input type="checkbox" class="checkbox" id="checkbox-radio-option-one" v-model="isPublic" />
        </div>
      </fieldset>
    </form>
    <div class="selections">
      <div class="post-audience" v-if="!isPublic">
        <div class="experts">
          <div class="expert-field">
            <label class="form-label" for="">Experts in</label>

            <Multiselect v-model="selectedField" :options="allTags" :searchable="true" />
          </div>
          <div class="rating">
            <label class="form-label" for="audience">with rating of</label>
            <input class="number-inp" type="number" v-model="minimumRating" min="0" placeholder="3.2" />
          </div>
          <button class="pure-button pure-button-primary" @click.prevent="addUsersToAudience">Add</button>
        </div>
        <label class="form-label" for="audience">Select Audience</label>
        <Multiselect class="multiselect" v-model="selectedUsers" :options="usernames" :mode="'tags'" :searchable="true" :close-on-select="false" />
      </div>

      <div class="post-tags">
        <label class="form-label" for="tags">Tags</label>
        <Multiselect class="multiselect" v-model="selectedTags" :options="allTags" :mode="'tags'" :searchable="true" :close-on-select="false" :create-option="true" />
      </div>
    </div>
    <form class="pure-form pure-form-aligned">
      <fieldset>
        <div class="pure-control-group post-content">
          <label class="form-label" for="content">Content</label>
          <textarea v-model="content" placeholder="content..." required></textarea>
        </div>
        <div class="pure-controls">
          <button type="submit" class="pure-button pure-button-primary" @click.prevent="newPost">Submit</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em;
  padding-left: 24px;
  width: 80%;
}

.checkbox {
  transform: scale(1.5);
}
.number-inp {
  width: 10%;
  transform: scale(1.2);
}
.experts {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.rating {
  display: flex;
  align-items: center;
}
.multiselect {
  margin: 0 2em;
}
.expert-field {
  display: flex;
  align-items: center;
  width: 50%;
}
.expert-field > .multiselect {
  width: 100%;
}

.post-title,
.post-audience,
.post-tags,
.post-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
input {
  display: flex;
  margin-left: 2em;
}
.form-label {
  width: fit-content;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
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
</style>
