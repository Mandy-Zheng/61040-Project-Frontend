import { defineStore } from "pinia";
import { ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useResumeStore = defineStore(
  "resume",
  () => {
    const currentUserResumes = ref<Array<Record<string, any>>>([]);
    const editingResume = ref<string>("");

    const selectResumeToEdit = (field: string) => {
      editingResume.value = field;
    };
    const resetStore = async () => {
      await getResumes();
    };

    const getResumes = async () => {
      try {
        const { username } = await fetchy("api/session", "GET", { alert: false });
        currentUserResumes.value = await fetchy(`/api/resume/${username}`, "GET");
      } catch (error) {
        return;
      }
    };

    const createResume = async (update: BodyT) => {
      await fetchy(`/api/resume`, "POST", { body: update });
    };

    const editResume = async (field: string, patch: BodyT) => {
      const resumes = currentUserResumes.value.filter((resume) => resume.resume.field === field);
      if (resumes.length === 0) {
        return;
      }
      const body = { update: patch, id: resumes[0].resume._id };
      await fetchy("/api/resume", "PATCH", {
        body: body,
      });
    };

    const deleteResume = async (id: string) => {
      await fetchy(`/api/resume/${id}`, "DELETE");
      await resetStore();
    };

    return {
      currentUserResumes,
      editingResume,
      getResumes,
      createResume,
      editResume,
      selectResumeToEdit,
      deleteResume,
    };
  },
  { persist: true },
);
