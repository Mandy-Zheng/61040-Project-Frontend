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
          <h3>
            {{ capitalize(props.resume.field) }}
            <p class="author">
              User:&nbsp; <RouterLink :to="{ path: `/searchProfiles`, query: { username: props.author } }"> {{ props.author }}</RouterLink>
            </p>
          </h3>

          <div class="pill">Rating: {{ props.rating }}</div>
        </div>

        <div class="validation">
          <div class="approvals">
            <span @click="approve"
              ><img v-if="likeStatus !== STATUS.LIKED" class="like" src="@/assets/images/unactiveLike.svg" /> <img v-else class="like" src="@/assets/images/activeLike.svg"
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
              ><img v-if="likeStatus !== STATUS.DISLIKED" class="dislike" src="@/assets/images/unactiveLike.svg" /> <img v-else class="dislike" src="@/assets/images/activeLike.svg"
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
    <div class="content">
      <!-- TODO -->
      <div class="experience" v-if="props.resume.work.length > 0 || props.resume.school.length > 0">
        <div class="resume-content work" v-if="props.resume.work.length > 0">
          <div class="section"><b>Work</b></div>
          <div v-for="work in props.resume.work" :key="work">
            <p>{{ work }}</p>
          </div>
        </div>
        <div class="resume-content" v-if="props.resume.school.length > 0">
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
        <button class="edit-btn btn" @click="editResume" role="link">Edit</button>
        <button class="delete-btn btn" @click="showDeleteModal = true">Delete</button>
        <teleport to="body">
          <DeleteResumeModal :show="showDeleteModal" :field="props.resume.field" @close="showDeleteModal = false" @delete="confirmDeleteResume" />
        </teleport>
      </menu>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}
p {
  margin: 0;
  margin-top: 1em;
}

.information-scent {
  margin: 0;
  color: rgb(45, 49, 169);
  cursor: pointer;
}

.footer {
  background-color: #eeeeee;
  display: flex;
  justify-content: space-between;
}
.resume {
  width: 90%;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
}

.resume-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5em;
}
.experience {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.approvals,
.disapprovals {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.approvals {
  margin-right: 1em;
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
  margin-right: 2em;
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
  background-color: #819fa7;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.field,
.author {
  padding-left: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 16px;
}
.author {
  padding-left: 0;
  margin: 0;
  font-weight: lighter;
}

.content {
  display: flex;
  padding: 20px 24px 4px 24px;
  background-color: #f2f2f0;
}
.edit-btn {
  text-align: center;
  margin-right: 2em;
}
.pill {
  border-radius: 12px;
  padding: 4px;
  font-weight: 50;
  margin: 0 8px;
  text-align: center;
  background-color: #0f1b27;
  color: #f2f2f0;
  font-size: smaller;
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

.tooltiptext {
  width: 100px;
  padding: 4px 0px;
}
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0%;
  margin-left: -40px;
  font-size: smaller;
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

.edit-btn {
  border: 2px solid #142f40;
  background-color: #142f40;
  color: #f2efea;
  border-radius: 4px;
  padding: 0.7em 1em;
  height: fit-content;
  align-self: flex-end;
}

.delete-btn {
  border: 2px solid #a7382d;
  background-color: #a7382d;
  color: #f2efea;
  border-radius: 4px;
  padding: 0.7em 1em;
  height: fit-content;
  align-self: flex-end;
  margin-right: 2em;
}
</style>
