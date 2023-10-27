<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps(["postId", "note"]);

const { allUsers } = storeToRefs(useUserStore());
const emit = defineEmits(["editAnnotations"]);
const username = ref<string>(allUsers.value.find((user) => user._id === props.note.author).username ?? "DELETED_USER");
async function editAnnotations() {
  emit("editAnnotations", props.note);
}
</script>

<template>
  <div class="note">
    <div class="note-header">
      <span>
        <RouterLink class="user-link" :to="{ path: `/searchProfiles`, query: { username: username } }"> {{ username }}</RouterLink
        >&nbsp; quoted on "{{ props.note.quote }}"
        <div class="edit-btn" @click="editAnnotations">
          <img src="../../../client/assets/images/pencil.svg" />
        </div>
      </span>
      <h4>{{ props.note.comment }}</h4>
    </div>

    {{ new Date(props.note.dateUpdated).toDateString() }}
  </div>
</template>

<style scoped>
h4 {
  justify-self: start;
  font-size: 18px;
}
.user-link {
  display: flex;
  justify-content: start;
  width: fit-content;
}
span {
  display: flex;
  padding-top: 0.5em;
  font-size: larger;
}
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
