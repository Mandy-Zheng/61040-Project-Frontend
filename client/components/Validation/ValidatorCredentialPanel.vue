<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["postId", "isApprovalMode"]);
const validations = ref<Map<string, Array<any>>>();

async function getValidatorCredentials() {
  try {
    console.log("hey");
    const rawValidationData = props.isApprovalMode
      ? await fetchy(`/api/validation/approval/exclusivepost/${props.postId}`, "GET")
      : await fetchy(`/api/validation/disapproval/exclusivepost/${props.postId}`, "GET");
    const validationToField = new Map();
    for (const data of rawValidationData) {
      const { field, approvers } = data;
      for (const userRatings of approvers) {
        const { user, rating } = userRatings;
        console.log(user);
        const allRating = validationToField.get(user) ?? [];
        allRating.push({ field, rating });
        validationToField.set(user, allRating);
      }
    }
    console.log(validationToField);
    validations.value = validationToField;
  } catch (error) {
    return;
  }
}
onBeforeMount(async () => {
  try {
    await getValidatorCredentials();
  } catch (error) {
    // User is not logged in
  }
});
</script>

<template>
  <div class="validation-info">
    <div class="validation-list">
      <div class="note-header" v-for="[key, val] in validations" :key="key">
        <h4>User: {{ key }}</h4>
        <div v-for="topic in val" :key="topic">{{ topic.field }}: {{ topic.rating }}</div>
      </div>
      <!-- {{ props.note.comment }}
  </div>
    </div>
    <button class="annotate-btn" @click="toggleEditMode">Annotate</button>  -->
    </div>
  </div>
</template>

<style scoped>
textarea::selection {
  background-color: cadetblue;
  color: red;
}
.post-menu {
  border: 2px solid #eeeeee;
}
.annotations {
  display: flex;
  height: 500px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #eeeeee;
  flex: 1;
  padding-top: 1em;
}

.validation-info {
  display: flex;
  flex-direction: column;
  flex: 3;
  font-size: 12px;
}

.annotation-panel,
.annotation-list {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.annotation-list {
  height: 320px;
  overflow-x: clip;
  overflow-y: scroll;
  margin-bottom: 1em;
}

.menu-btn {
  border: 0px;
  padding: 0.5em;
  margin-bottom: 0;
  background-color: white;
  border: 2px solid #eeeeee;
}

.active {
  border: 0px;
  padding: 0.5em;
  margin-bottom: 0;
  background-color: #eeeeee;
  border: 2px solid #eeeeee;
}
.menu-btn:hover {
  background-color: #eeeeee;
}

textarea {
  height: 100%;
  resize: none;
  cursor: text;
}

.annotate-btn {
  display: flex;
  margin: 1em;
}
</style>
