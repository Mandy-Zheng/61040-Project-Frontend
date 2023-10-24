<script setup lang="ts">
import { usePostStore } from "@/stores/post";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import ValidationModal from "../Validation/ValidationModal.vue";
import PostInformationPanel from "./PostInformationPanel.vue";
const props = defineProps(["post", "rating", "author", "notes", "approvals", "disapprovals"]);
const postStore = usePostStore();
const { getPostValidations } = postStore;
const enum STATUS {
  LIKED,
  DISLIKED,
  NEUTRAL,
}
const showApprovals = ref<boolean>(true);
const showValidationModal = ref<boolean>(false);

const likeStatus = ref<STATUS>(STATUS.NEUTRAL);

function openApprovalModal() {
  showApprovals.value = true;
  showValidationModal.value = true;
}

function openDisapprovalModal() {
  showApprovals.value = false;
  showValidationModal.value = true;
}

async function approve() {
  try {
    await fetchy(`/api/validation/undoValidation/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    if (likeStatus.value !== STATUS.LIKED) {
      await fetchy(`/api/validation/approval/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    }
    await getPostValidations();
  } catch (error) {
    return;
  }
  likeStatus.value = likeStatus.value === STATUS.LIKED ? STATUS.NEUTRAL : STATUS.LIKED;
}

async function disapprove() {
  try {
    await fetchy(`/api/validation/undoValidation/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    if (likeStatus.value !== STATUS.DISLIKED) {
      await fetchy(`/api/validation/disapproval/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    }
    await getPostValidations();
  } catch (error) {
    return;
  }
  likeStatus.value = likeStatus.value === STATUS.DISLIKED ? STATUS.NEUTRAL : STATUS.DISLIKED;
}
</script>

<template>
  <div class="post-card">
    <!-- <font-awesome-icon :icon="['fas', 'github']" /> -->
    <div class="post">
      <span class="post-header">
        <h3>Created by: {{ props.author }}</h3>
        <span class="edit-btn"><img src="../../../client/assets/images/pen.png" /></span>
      </span>
      <div class="post-frame">
        <div class="post-title">
          <h2>{{ props.post.title }}</h2>
          <div v-for="tag in props.post.tags" :key="tag" class="pill">{{ tag }}</div>
        </div>

        <p>{{ props.post.content }}</p>
      </div>
      <div class="validation">
        <div class="approvals">
          <span @click="approve"
            ><img v-if="likeStatus !== STATUS.LIKED" class="like" src="../../assets/images/unactivelike.svg" /> <img v-else class="like" src="../../assets/images/activelike.svg"
          /></span>
          <p @click="openApprovalModal" class="information-scent">({{ props.approvals.length }})</p>
        </div>
        <div class="disapprovals">
          <span @click="disapprove"
            ><img v-if="likeStatus !== STATUS.DISLIKED" class="dislike" src="../../assets/images/unactivelike.svg" /> <img v-else class="dislike" src="../../assets/images/activelike.svg"
          /></span>
          <p @click="openDisapprovalModal" class="information-scent">({{ props.disapprovals.length }})</p>
          <teleport to="body">
            <ValidationModal
              :show="showValidationModal"
              :title="showApprovals ? 'Liked By:' : 'Disliked By:'"
              :userList="showApprovals ? props.approvals : props.disapprovals"
              @closeValidation="showValidationModal = false"
            />
          </teleport>
        </div>
      </div>
    </div>
    <PostInformationPanel :post="post" :rating="rating" :author="author" :notes="notes" />
  </div>
</template>

<style scoped>
.validation {
  display: flex;
  position: relative;
}
.like,
.dislike {
  margin-top: 0.5em;
  height: 30px;
  width: 30px;
  cursor: pointer;
}
.disapprovals {
  margin-left: 1em;
}
.information-scent {
  margin: 0;
  text-decoration: underline;
  color: rgb(45, 49, 169);
  cursor: pointer;
}

.approvals,
.disapprovals {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dislike {
  transform: rotate(180deg);
}
h3 {
  margin: 0;
  margin-bottom: 0.5em;
  width: fit-content;
}
.edit-btn {
  margin: 0 0 0.5em 0.5em;
}
img {
  width: 20px;
  height: 20px;
}
section,
.post-card {
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  width: 100%;
  border: 2px solid #eeeeee;
}

.post-frame {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  justify-content: center;
  align-items: start;
  border: 2px solid #eeeeee;
  height: 100%;
  box-sizing: border-box;
  padding: 1em;
}

.post-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.post {
  display: flex;
  flex: 4;
  flex-direction: column;
  border-right: 2px solid #eeeeee;
  padding: 1em 2em 1.5em 2em;
}

.post-title {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  justify-content: space-between;
  width: 100%;
}

.post-card {
  height: 420px;
}
.pill {
  display: flex;
  border: 1px solid black;
  border-radius: 12px;
  padding: 4px;
  font-weight: 50;
  width: fit-content;
  margin: 0.5em 0em;
}

h2 {
  margin: 0;
  text-decoration: underline;
}
</style>
