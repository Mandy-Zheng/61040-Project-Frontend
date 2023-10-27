<script setup lang="ts">
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
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

const approvals = ref<Array<any>>([]);
const disapprovals = ref<Array<any>>([]);
const likeStatus = ref<STATUS>(STATUS.NEUTRAL);
const showDeleteModal = ref<boolean>(false);
const audience = ref<Array<string>>(props.post.audience.includes("") ? ["Public to everyone"] : props.post.audience);

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
        <span class="header">
          <h3>
            By:&nbsp; <RouterLink class="user-link" :to="{ path: `/searchProfiles`, query: { username: props.author } }"> {{ props.author }}</RouterLink>
          </h3>
          <p class="rating-pill">Rating: {{ props.rating }}</p>
          <div class="tooltip">
            <img class="tooltip audience" src="../../assets/images/people.svg" />
            <span class="tooltiptext">
              <div v-for="member in audience" :key="member">{{ member }}</div>
            </span>
          </div>
        </span>
        <span v-if="props.author === currentUsername" class="edit-btn" @click="showDeleteModal = true"><img src="../../../client/assets/images/trash-can.svg" /></span>
        <teleport to="body">
          <DeletePostModal :show="showDeleteModal" :title="props.post.title" @close="showDeleteModal = false" @delete="confirmDeletePost" />
        </teleport>
      </span>
      <div class="post-frame">
        <div class="post-title">
          <h2>{{ props.post.title }}</h2>
          <span class="tags"
            ><span v-for="tag in props.post.tags" :key="tag" class="pill">{{ tag }}</span></span
          >
        </div>

        <p>{{ props.post.content }}</p>
      </div>
      <div class="footer">
        <div class="validation">
          <div class="approvals">
            <span @click="approve">
              <img v-if="likeStatus !== STATUS.LIKED" class="like" src="../../assets/images/unactivelike.svg" /> <img v-else class="like" src="../../assets/images/activelike.svg" />
            </span>
            <p class="information-scent tooltip">
              ({{ approvals.length }})
              <span class="tooltiptext">
                <div v-for="user in approvals.length ? approvals : ['No Likes']" :key="user">{{ user }}</div>
              </span>
            </p>
          </div>
          <div class="disapprovals">
            <span @click="disapprove"
              ><img v-if="likeStatus !== STATUS.DISLIKED" class="dislike" src="../../assets/images/unactivelike.svg" /> <img v-else class="dislike" src="../../assets/images/activelike.svg"
            /></span>
            <p class="information-scent tooltip">
              ({{ disapprovals.length }})
              <span class="tooltiptext">
                <div v-for="user in disapprovals.length ? disapprovals : ['No Dislikes']" :key="user">{{ user }}</div>
              </span>
            </p>
          </div>
        </div>
        <p class="date">Created: {{ new Date(props.post.dateCreated).toDateString() }}</p>
      </div>
    </div>
    <PostInformationPanel :post="post" :rating="rating" :author="author" :notes="notes" :status="likeStatus" />
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}

.user-link {
  color: #5b6e74;
}
.date {
  justify-self: end;
}
.header {
  display: flex;
  align-items: center;
}
.validation {
  display: flex;
  position: relative;
}
.footer {
  display: flex;
  justify-content: space-between;
}
.tags {
  display: flex;
}
.audience {
  transform: scale(1.1);
}
.like,
.dislike {
  margin-top: 0.5em;
  height: 30px;
  width: 30px;
  cursor: pointer;
}

.like:hover,
.dislike:hover {
  background-color: #eeeeee;
}
h3 {
  margin: 0;
  font-size: 22px;
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
  width: fit-content;
}
.edit-btn {
  margin: 0.5em 0.5em 0 0;
}
img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 2px;
}
img:hover {
  padding: 2px;
}
section,
.post-card {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.rating-pill {
  padding: 6px;
  border-radius: 32px;
  font-size: 14px;
  font-weight: lighter;
  margin: 8px 8px 0.5em 16px;
  cursor: pointer;
  color: white;
  background-color: #142f40;
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
  margin-bottom: 0.5em;
}

.post {
  display: flex;
  flex: 4;
  flex-direction: column;
  border-right: 2px solid #eeeeee;
  padding: 0.5em 2em 1em 2em;
  border: 2px solid #eeeeee;
  background-color: #d8c6ba;
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
  background-color: #f2efea;
}
.pill {
  display: flex;
  border: 1px solid black;
  border-radius: 36px;
  padding: 4px;
  font-weight: 50;
  width: fit-content;
  margin: 0.5em 0.5em 0em 0em;
  background-color: white;
  border: 1px solid white;
  color: black;
}

h2 {
  margin: 0;
  text-decoration: underline;
}

.tooltip {
  position: relative;
  display: inline-block;
  height: fit-content;
}
.tooltiptext {
  width: 150px;
  padding: 15px 0px;
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
