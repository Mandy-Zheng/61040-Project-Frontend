<script setup lang="ts">
import router from "@/router";
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ValidationModal from "../Validation/ValidationModal.vue";
import DeletePostModal from "./DeletePostModal.vue";
import PostInformationPanel from "./PostInformationPanel.vue";
const props = defineProps(["post", "rating", "author", "notes"]);

const { currentUsername } = storeToRefs(useUserStore());
const { deletePost } = usePostStore();
const enum STATUS {
  LIKED,
  DISLIKED,
  NEUTRAL,
}
const showApprovals = ref<boolean>(true);
const showValidationModal = ref<boolean>(false);
const approvals = ref<Array<any>>([]);
const disapprovals = ref<Array<any>>([]);
const likeStatus = ref<STATUS>(STATUS.NEUTRAL);
const showDeleteModal = ref<boolean>(false);
function openApprovalModal() {
  showApprovals.value = true;
  showValidationModal.value = true;
}

function openDisapprovalModal() {
  showApprovals.value = false;
  showValidationModal.value = true;
}

async function getPostValidation() {
  try {
    const validation = await fetchy(`/api/validation/exclusivepost/${props.post._id}`, "GET");
    approvals.value = validation.approvals;
    disapprovals.value = validation.disapprovals;
    likeStatus.value = approvals.value.includes(currentUsername.value) ? STATUS.LIKED : disapprovals.value.includes(currentUsername.value) ? STATUS.DISLIKED : STATUS.NEUTRAL;
  } catch (error) {
    return;
  }
}

async function approve() {
  try {
    if (likeStatus.value !== STATUS.LIKED) {
      await fetchy(`/api/validation/approval/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    } else {
      await fetchy(`/api/validation/undoValidation/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    }
    await getPostValidation();
  } catch (error) {
    return;
  }
}

async function disapprove() {
  try {
    if (likeStatus.value !== STATUS.DISLIKED) {
      await fetchy(`/api/validation/disapproval/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    } else {
      await fetchy(`/api/validation/undoValidation/exclusivepost/${props.post._id}`, "PATCH", { alert: false });
    }
    await getPostValidation();
  } catch (error) {
    return;
  }
}

async function confirmDeletePost() {
  showDeleteModal.value = false;
  await deletePost(props.post._id);
}

const go = async () => {
  await router.push({ path: `/searchProfiles`, query: { username: props.author } });
};
onBeforeMount(async () => {
  try {
    await getPostValidation();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div class="post-card">
    <div class="post">
      <span class="post-header">
        <h3 @click="go">Created by: {{ props.author }}</h3>

        <span v-if="props.author === currentUsername" class="edit-btn" @click="showDeleteModal = true"><img src="../../../client/assets/images/trash-can.svg" /></span>
        <teleport to="body">
          <DeletePostModal :show="showDeleteModal" :title="props.post.title" @close="showDeleteModal = false" @delete="confirmDeletePost" />
        </teleport>
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
          <p @click="openApprovalModal" class="information-scent">({{ approvals.length }})</p>
        </div>
        <div class="disapprovals">
          <span @click="disapprove"
            ><img v-if="likeStatus !== STATUS.DISLIKED" class="dislike" src="../../assets/images/unactivelike.svg" /> <img v-else class="dislike" src="../../assets/images/activelike.svg"
          /></span>
          <p @click="openDisapprovalModal" class="information-scent">({{ disapprovals.length }})</p>
          <teleport to="body">
            <ValidationModal
              :show="showValidationModal"
              :title="showApprovals ? 'Liked By:' : 'Disliked By:'"
              :userList="showApprovals ? approvals : disapprovals"
              @closeValidation="showValidationModal = false"
            />
          </teleport>
        </div>
      </div>
    </div>
    <PostInformationPanel :post="post" :rating="rating" :author="author" :notes="notes" :status="likeStatus" />
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
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 2px;
}
img:hover {
  background-color: #eeeeee;
  padding: 2px;
}
section,
.post-card {
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  width: 100%;
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
  margin: 1em 0;
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
  border: 2px solid #eeeeee;
}

.post-title {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  justify-content: space-between;
  width: 100%;
}

.post-card {
  height: 400px;
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
