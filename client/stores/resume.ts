import { defineStore } from "pinia";
import { ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useResumeStore = defineStore(
  "resume",
  () => {
    const currentUserResumes = ref<Array<Record<string, any>>>([]);

    const getResumes = async () => {
      try {
        const { username } = await fetchy("api/session", "GET", { alert: false });
        currentUserResumes.value = await fetchy(`/api/resume/${username}`, "GET");
      } catch (error) {
        return;
      }
    };

    const createResume = async (update: BodyT) => {
      try {
        await fetchy(`api/resume`, "POST", { body: update });
      } catch (_) {
        return;
      }
    };

    const editResume = async (field: string, patch: BodyT) => {
      console.log("hi");
      const resumes = currentUserResumes.value.filter((resume) => resume.resume.field === field);
      console.log(currentUserResumes.value, field);
      if (resumes.length === 0) {
        return;
      }
      const body = { update: patch, id: resumes[0].resume._id };
      console.log(body);
      await fetchy("api/resume", "PATCH", {
        body: body,
      });
    };

    return {
      currentUserResumes,
      getResumes,
      createResume,
      editResume,
    };
  },
  { persist: true },
);
