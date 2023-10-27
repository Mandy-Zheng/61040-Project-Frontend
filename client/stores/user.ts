import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currentUserId = ref("");
    const allUsers = ref<Array<any>>([]);
    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currentUserId.value = "";
    };

    const getAllUsers = async () => {
      allUsers.value = await fetchy("/api/users", "GET");
    };
    const createUser = async (username: string, password: string) => {
      await fetchy("/api/users", "POST", {
        body: { username, password },
      });
      await getAllUsers();
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
      await getAllUsers();
    };

    const updateSession = async () => {
      try {
        const { username } = await fetchy("api/session", "GET", { alert: false });
        const { _id } = await fetchy(`/api/users/${username}`, "GET");
        currentUsername.value = username;
        currentUserId.value = _id.toString();
      } catch {
        currentUsername.value = "";
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("/api/users", "PATCH", { body: { update: patch } });
      await getAllUsers();
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      allUsers,
      currentUserId,
      currentUsername,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUser,
      deleteUser,
    };
  },
  { persist: true },
);
