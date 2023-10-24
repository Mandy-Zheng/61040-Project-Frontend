<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import DeleteAnnotationModal from "./DeleteAnnotationModal.vue";
const props = defineProps(["postId", "postTitle", "postContent", "noteId", "selectedText", "note", "isNewNote"]);
const emit = defineEmits(["refreshAnnotation"]);
const quote = ref<string>(props.selectedText);
const comment = ref<string>(props.note);
const showDeleteModal = ref<boolean>(false);
function exitEditingAnnotation() {
  emit("refreshAnnotation");
}

async function newAnnotation() {
  const body = { postId: props.postId, comment: comment.value, quote: quote.value };
  try {
    await fetchy(`/api/annotation/exclusivepost`, "POST", { body: body });
  } catch (_) {
    return;
  }
  exitEditingAnnotation();
}

async function editExisting() {
  const body = { id: props.noteId, update: { comment: comment.value, quote: quote.value } };
  try {
    await fetchy(`/api/annotation`, "PATCH", { body: body });
  } catch (_) {
    return;
  }
  exitEditingAnnotation();
}

async function deleteAnnotation() {
  showDeleteModal.value = false;
  try {
    await fetchy(`/api/annotation/${props.noteId}`, "DELETE");
  } catch (_) {
    return;
  }
  exitEditingAnnotation();
}

function getSelectedText() {
  const selection = window.getSelection;

  if (selection) {
    quote.value = selection()?.toString() ?? "";
  }
}
</script>

<template>
  <form class="pure-form">
    <fieldset>
      <p>Annotating: {{ props.postTitle }}</p>
      <p class="quote">Quote: <input class="pure-input" :value="quote" readonly required /></p>
      <div class="content-textbox">
        <label>Highlight the text you want to comment on!</label>
        <textarea class="pure-input" @select="getSelectedText" :value="props.postContent" readonly></textarea>
      </div>
      <div class="comment">
        <p>Comment:</p>
        <textarea class="pure-input" placeholder="Comment" v-model="comment" required></textarea>
      </div>
      <div class="btn-group">
        <button class="button-error pure-button" v-if="props.isNewNote" @click.prevent="exitEditingAnnotation">Cancel</button>
        <button class="button-error pure-button" v-else @click.prevent="showDeleteModal = true">Delete</button>

        <teleport to="body">
          <DeleteAnnotationModal :show="showDeleteModal" :quote="props.selectedText" :comment="props.note" @close="showDeleteModal = false" @delete="deleteAnnotation" />
        </teleport>
        <button class="pure-button-primary pure-button" v-if="props.isNewNote" @click.prevent="newAnnotation">Submit</button>
        <button class="pure-button-primary pure-button" v-else @click.prevent="editExisting">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
textarea {
  margin-bottom: 10px;
  width: inherit;
  height: 100%;
}

input {
  margin-left: 1em;
}

.comment {
  display: flex;
  height: 100%;
  margin: 10px 0px;
  flex-direction: column;
}

form {
  width: 100%;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
}

fieldset {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.quote {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.content-textbox {
  display: flex;
  flex-direction: column;
  align-self: center;
  height: 80%;
}

.btn-group {
  display: flex;
  justify-content: space-around;
}
</style>
