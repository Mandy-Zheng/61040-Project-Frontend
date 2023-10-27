<script setup lang="ts">
const props = defineProps(["show", "title"]);

const emit = defineEmits(["close", "delete"]);
</script>

<template>
  <transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          Are you sure you want to delete your post with the following title?
          <br /><br />
          <span class="title">{{ props.title }}</span>
          <br /><br />
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="emit('close')">No</button>
          <button class="delete-btn" @click="emit('delete')">Yes</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
* {
  font-family: "open sans";
}
img {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
}
.title {
  width: 100%;
  font-weight: bolder;
  text-align: center;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  margin-top: 0;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-default-button {
  float: right;
}

span {
  color: black;
  font-size: larger;
}

.cancel-btn {
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
}
</style>
