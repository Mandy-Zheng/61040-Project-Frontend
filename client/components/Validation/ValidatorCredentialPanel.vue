<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["postId", "isApprovalMode", "userList"]);
const validations = ref<Map<string, Array<any>>>(new Map());
const loaded = ref<boolean>(false);
async function getValidatorCredentials() {
  loaded.value = false;
  try {
    const rawValidationData = props.isApprovalMode
      ? await fetchy(`/api/validation/approval/exclusivepost/${props.postId}`, "GET")
      : await fetchy(`/api/validation/disapproval/exclusivepost/${props.postId}`, "GET");
    const validationToField = new Map();
    for (const user of props.userList) {
      validationToField.set(user, []);
    }
    for (const data of rawValidationData) {
      const { field } = data;
      const validators = props.isApprovalMode ? data.approvers : data.disapprovers;
      for (const userRatings of validators) {
        const { user, rating } = userRatings;
        const allRating = validationToField.get(user) ?? [];
        allRating.push({ field, rating });
        validationToField.set(user, allRating);
      }
    }
    validations.value = validationToField;
  } catch (error) {
    return;
  }
  loaded.value = true;
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
      <i v-if="!loaded">Loading...</i>
      <span v-else-if="validations.size > 0">
        <div class="validator" v-for="[key, val] in validations" :key="key">
          <h4>
            User: <RouterLink :to="{ path: `/searchProfiles`, query: { username: key } }"> {{ key }}</RouterLink>
          </h4>
          <span class="tags">
            <div class="tag-pill" v-for="topic in val" :key="topic">{{ topic.field }}: {{ topic.rating }}</div>
          </span>
        </div>
      </span>
      <i v-else>No {{ isApprovalMode ? "Approvers" : "Disapprovers" }}</i>
    </div>
  </div>
</template>

<style scoped>
h4 {
  font-size: 16px;
  margin: 0;
}
i {
  justify-self: center;
  font-size: 24px;
  margin-top: 2em;
}
span {
  width: 100%;
}
.validator {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 4px;
  width: 85%;
  margin: 0px 16px 16px 16px;
  text-align: center;
  padding: 1em;
  position: relative;
}
.tags {
  display: flex;
}

.tag-pill {
  display: flex;
  border: 1px solid black;
  border-radius: 36px;
  padding: 4px;
  font-weight: 50;
  width: fit-content;
  margin: 0.5em 0.5em 0em 0em;
  background-color: #bde8f1;
  border: 1px solid #bde8f1;
  color: black;
}
.validation-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 3;
  font-size: 12px;
}

.validation-list {
  padding-top: 1em;
  justify-content: center;
  width: 100%;
  display: flex;
}
</style>
