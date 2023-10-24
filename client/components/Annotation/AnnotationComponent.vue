<script setup lang="ts">
const props = defineProps(["postId", "note"]);

// const annotations = ref<Array<any>>([]);
const emit = defineEmits(["editAnnotations"]);
async function editAnnotations() {
  emit("editAnnotations", props.note);
}

</script>

<template>
  <div class="note">
    <div class="note-header">
      <h4>{{ props.note.quote }}</h4>
      <div class="edit-btn" @click="editAnnotations"><img src="../../../client/assets/images/pen.png" /></div>
    </div>
    {{ props.note.comment }}
  </div>
</template>

<style scoped>
.note {
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

img {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
}

.edit-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>
