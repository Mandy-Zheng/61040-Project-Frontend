<script setup lang="ts">
const props = defineProps(["show", "userList", "title"]);

const emit = defineEmits(["closeValidation"]);
</script>

<template>
  <transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          {{ props.title }}
        </div>
        <i v-if="userList.length === 0">No Users</i>
        <p v-else v-for="user in userList" :key="user">{{ user }}</p>
        <div class="modal-footer">
          <button class="modal-default-button" @click="emit('closeValidation')">Close</button>
        </div>
      </div>
    </div>
  </transition>
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
  height: 150px;
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

.edit-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
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
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

span {
  color: black;
}
</style>
