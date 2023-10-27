<script setup lang="ts">
import router from "@/router";
import { useResumeStore } from "@/stores/resume";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { capitalize } from "../../../server/framework/utils";
import DeleteResumeModal from "./DeleteResumeModal.vue";
const props = defineProps(["rating", "resume", "canEdit", "author", "approvals", "disapprovals"]);
const { currentUserId, currentUsername } = storeToRefs(useUserStore());
const resumeStore = useResumeStore();
const { getResumeValidation } = resumeStore;
const { deleteResume, selectResumeToEdit } = resumeStore;
const showDeleteModal = ref<boolean>(false);
const showValidationModal = ref<boolean>(false);
const showApprovals = ref<boolean>(true);
const enum STATUS {
  LIKED,
  DISLIKED,
  NEUTRAL,
}

let initialStatus = props.approvals.includes(currentUsername.value) ? STATUS.LIKED : props.disapprovals.includes(currentUsername.value) ? STATUS.DISLIKED : STATUS.NEUTRAL;

const likeStatus = ref<STATUS>(initialStatus);
async function editResume() {
  selectResumeToEdit(props.resume.field);
  await router.push({ name: "editResume" });
}

async function confirmDeleteResume() {
  showDeleteModal.value = false;
  await deleteResume(props.resume._id);
}

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
    await fetchy(`/api/validation/undoValidation/resume/${props.resume._id}`, "PATCH", { alert: false });
    if (likeStatus.value !== STATUS.LIKED) {
      await fetchy(`/api/validation/approval/resume/${props.resume._id}`, "PATCH", { alert: false });
    }
    await getResumeValidation();
  } catch (error) {
    return;
  }
  likeStatus.value = likeStatus.value === STATUS.LIKED ? STATUS.NEUTRAL : STATUS.LIKED;
}

async function disapprove() {
  try {
    await fetchy(`/api/validation/undoValidation/resume/${props.resume._id}`, "PATCH", { alert: false });
    if (likeStatus.value !== STATUS.DISLIKED) {
      await fetchy(`/api/validation/disapproval/resume/${props.resume._id}`, "PATCH", { alert: false });
    }
    await getResumeValidation();
  } catch (error) {
    return;
  }
  likeStatus.value = likeStatus.value === STATUS.DISLIKED ? STATUS.NEUTRAL : STATUS.DISLIKED;
}
</script>

<template>
  <div class="resume">
    <div class="header">
      <div class="resumeheader">
        <div class="field">
          <h3>{{ capitalize(props.resume.field) }}</h3>
          <div class="pill">Rating: {{ props.rating }}</div>
          <div class="validation">
            <div class="approvals">
              <span @click="approve"
                ><img v-if="likeStatus !== STATUS.LIKED" class="like" src="../../assets/images/unactivelike.svg" /> <img v-else class="like" src="../../assets/images/activelike.svg"
              /></span>
              <p class="information-scent tooltip">
                ({{ props.approvals.length }})
                <span class="tooltiptext">
                  <div v-for="user in props.approvals.length ? props.approvals : ['No Likes']" :key="user">{{ user }}</div>
                </span>
              </p>
            </div>
            <div class="disapprovals">
              <span @click="disapprove"
                ><img v-if="likeStatus !== STATUS.DISLIKED" class="dislike" src="../../assets/images/unactivelike.svg" /> <img v-else class="dislike" src="../../assets/images/activelike.svg"
              /></span>
              <p class="information-scent tooltip">
                ({{ props.disapprovals.length }})
                <span class="tooltiptext">
                  <div v-for="user in props.disapprovals.length ? props.disapprovals : ['No Dislikes']" :key="user">{{ user }}</div>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="author">
        Author: <RouterLink :to="{ path: `/searchProfiles`, query: { username: props.author } }"> {{ props.author }}</RouterLink>
      </p>
    </div>
    <div class="content">
      <!-- TODO -->
      <div v-if="props.resume.work.length > 0 || props.resume.school.length > 0">
        <div v-if="props.resume.work.length > 0">
          <div class="section"><b>Work</b></div>
          <div v-for="work in props.resume.work" :key="work">
            <p>{{ work }}</p>
          </div>
        </div>
        <div v-if="props.resume.school.length > 0">
          <div class="section"><b>School</b></div>
          <div v-for="school in props.resume.school" :key="school">
            <p>{{ school }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div><i>No Relevant Experience </i></div>
      </div>
    </div>
    <div class="footer">
      <menu v-if="props.resume.author === currentUserId">
        <button class="pure-button pure-button-primary edit-btn" @click="editResume" role="link">Edit</button>
        <button class="button-error pure-button edit-btn" @click="showDeleteModal = true">Delete</button>
        <teleport to="body">
          <DeleteResumeModal :show="showDeleteModal" :field="props.resume.field" @close="showDeleteModal = false" @delete="confirmDeleteResume" />
        </teleport>
      </menu>
    </div>
  </div>
</template>

<style scoped>
.information-scent {
  margin: 0;
  text-decoration: underline;
  color: rgb(45, 49, 169);
  cursor: pointer;
}

.footer {
  background-color: #eeeeee;
  display: flex;
  justify-content: space-between;
}
.resume {
  width: 50%;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
}

.approvals,
.disapprovals {
  display: flex;
  flex-direction: column;
  align-items: center;
}

menu {
  margin: 0 0 0.5em 1.5em;
  width: 100%;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
}

img {
  height: 30px;
  width: 30px;
  cursor: pointer;
}

.validation {
  display: flex;
  position: relative;
}
.dislike {
  transform: rotate(180deg);
}
.resumeheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header {
  flex-direction: column;
  background-color: burlywood;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.field,
.author {
  padding-left: 8px;
  display: flex;
  flex-wrap: wrap;
  margin: 0px;
  align-items: center;
}

.content {
  display: flex;
  padding: 20px 24px 4px 24px;
  background-color: #eeeeee;
}
.edit-btn {
  text-align: center;
  margin-right: 8px;
}
.pill {
  border: 1px solid black;
  border-radius: 12px;
  padding: 4px;
  font-weight: 50;
  margin: 0 8px;
  text-align: center;
}

h3 {
  margin: 0.5em;
}

i {
  padding-bottom: 16px;
}

.section {
  text-decoration: underline;
}

.tooltip {
  position: relative;
  display: inline-block;
  height: fit-content;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: fit-content;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
