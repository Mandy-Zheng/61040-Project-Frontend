<script setup lang="ts">
import AnnotationComponent from "@/components/Annotation/AnnotationComponent.vue";
import CreateAnnotationForm from "@/components/Annotation/CreateAnnotationForm.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ValidatorCredentialPanel from "../Validation/ValidatorCredentialPanel.vue";

const props = defineProps(["post", "rating", "author", "notes", "status", "approvals", "disapprovals"]);
const noteId = ref<string>("");
const quote = ref<string>("");
const comment = ref<string>("");
const isNewNote = ref<boolean>(true);
const editMode = ref<boolean>(false);

const annotations = ref<Array<any>>([]);
const enum MENU_MODE {
  COMMENTS,
  APPROVALS,
  DISAPPROVALS,
}

const selectedMenu = ref<MENU_MODE>(MENU_MODE.COMMENTS);
async function getPostAnnotations() {
  isNewNote.value = true;
  quote.value = "";
  comment.value = "";
  editMode.value = false;
  if (props.notes) {
    annotations.value = props.notes;
  } else {
    try {
      annotations.value = await fetchy(`/api/annotation/exclusivepost/${props.post._id}`, "GET");
    } catch (error) {
      return;
    }
  }
}

const toggleEditMode = async () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    await getPostAnnotations();
  }
};

async function selectMenu(menuItem: MENU_MODE) {
  selectedMenu.value = menuItem;
}

async function editAnnotations(note: any) {
  noteId.value = note._id;
  quote.value = note.quote;
  comment.value = note.comment;
  isNewNote.value = false;
  await toggleEditMode();
}

onBeforeMount(async () => {
  try {
    await getPostAnnotations();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div class="post-info">
    <div class="post-menu">
      <button :class="selectedMenu === MENU_MODE.COMMENTS ? 'active' : 'menu-btn'" @click="selectMenu(MENU_MODE.COMMENTS)">Annotations</button>
      <button :class="selectedMenu === MENU_MODE.APPROVALS ? 'active' : 'menu-btn'" @click="selectMenu(MENU_MODE.APPROVALS)">Approvals</button>
      <button :class="selectedMenu === MENU_MODE.DISAPPROVALS ? 'active' : 'menu-btn'" @click="selectMenu(MENU_MODE.DISAPPROVALS)">Disapprovals</button>
    </div>
    <div v-if="selectedMenu === MENU_MODE.COMMENTS" class="annotations">
      <div v-if="!editMode" class="annotation-panel">
        <div class="annotation-list">
          <AnnotationComponent v-for="note in annotations" v-on:editAnnotations="editAnnotations" :key="note" :postId="props.post._id" :note="note" />
        </div>
        <button class="annotate-btn" @click="toggleEditMode">Annotate</button>
      </div>
      <CreateAnnotationForm
        v-else
        v-on:refreshAnnotation="getPostAnnotations"
        :postId="props.post._id"
        :postTitle="$props.post.title"
        :postContent="$props.post.content"
        :noteId="noteId"
        :selectedText="quote"
        :note="comment"
        :isNewNote="isNewNote"
      />
    </div>

    <div v-if="selectedMenu === MENU_MODE.APPROVALS" class="approvals">
      <ValidatorCredentialPanel :postId="props.post._id" :isApprovalMode="true" :key="props.status" :userList="props.approvals" />
    </div>
    <div v-if="selectedMenu === MENU_MODE.DISAPPROVALS" class="disapprovals">
      <ValidatorCredentialPanel :postId="props.post._id" :isApprovalMode="false" :key="props.status" :userList="props.disapprovals" />
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "open sans";
}
textarea::selection {
  background-color: cadetblue;
  color: red;
}
.post-menu {
  border-bottom: 2px solid #d9d9d9;
}
.annotations {
  display: flex;
  height: 500px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #f2efea;
  flex: 1;
  padding-top: 1em;
}

.post-info {
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
}

.menu-btn {
  border: 0px;
  padding: 0.5em;
  margin-bottom: 0;
  background-color: white;
  border-right: 2px solid #d9d9d9;
  border-top: 2px solid #d9d9d9;
  border-top-right-radius: 4px;
}

.active {
  border: 0px;
  padding: 0.5em;
  margin-bottom: 0;
  background-color: #f2efea;
  border-right: 2px solid #d9d9d9;
  border-top: 2px solid #d9d9d9;
  border-top-right-radius: 4px;
  border-bottom: 0px;
  font-weight: bold;
}
.menu-btn:hover {
  background-color: #f2efea;
}

textarea {
  height: 100%;
  resize: none;
  cursor: text;
}

.annotate-btn {
  display: flex;
  padding: 6px;
  font-size: 18px;
  border-radius: 4px;
}
.annotate-btn:hover {
  background-color: white;
}
</style>
