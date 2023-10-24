import { defineStore } from "pinia";
import { ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useResumeStore = defineStore(
  "resume",
  () => {
    const currentUserResumes = ref<Array<Record<string, any>>>([]);
    const userResumesValidations = ref<Array<any>>([]);
    const editingResume = ref<string>("");

    const selectResumeToEdit = (field: string) => {
      editingResume.value = field;
    };

    const getResumeValidation = async () => {
      try {
        userResumesValidations.value = await Promise.all(currentUserResumes.value.map((resume) => fetchy(`/api/validation/resume/${resume.resume._id}`, "GET")));
      } catch (error) {
        return;
      }
    };

    const resetStore = async () => {
      await getResumes();
      await getResumeValidation();
    };

    const getResumes = async () => {
      try {
        const { username } = await fetchy("/api/session", "GET", { alert: false });
        currentUserResumes.value = await fetchy(`/api/resume/${username}`, "GET");
        userResumesValidations.value = await Promise.all(currentUserResumes.value.map((resume) => fetchy(`/api/validation/resume/${resume.resume._id}`, "GET")));
        await getResumeValidation();
      } catch (error) {
        return;
      }
    };

    const createResume = async (body: BodyT) => {
      try {
        await fetchy(`/api/resume`, "POST", { body: body });
      } catch (error) {
        return;
      }
      await resetStore();
    };

    const editResume = async (field: string, patch: BodyT) => {
      const resumes = currentUserResumes.value.filter((resume) => resume.resume.field === field);
      if (resumes.length === 0) {
        return;
      }
      const body = { update: patch, id: resumes[0].resume._id };
      try {
        await fetchy("/api/resume", "PATCH", {
          body: body,
        });
      } catch (error) {
        return;
      }

      await resetStore();
    };

    const deleteResume = async (id: string) => {
      await fetchy(`/api/resume/${id}`, "DELETE");
      await resetStore();
    };

    return {
      currentUserResumes,
      userResumesValidations,
      editingResume,
      getResumes,
      getResumeValidation,
      createResume,
      editResume,
      selectResumeToEdit,
      deleteResume,
      resetStore,
    };
  },
  { persist: true },
);
