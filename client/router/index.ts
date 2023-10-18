import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import CreateResumeForm from "../components/Resume/CreateResumeForm.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import SettingView from "../views/SettingView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/createResumeForm",
      name: "createResumeForm",
      component: CreateResumeForm,
      props: { field: "New" },
      meta: { requiresAuth: true },
    },
    {
      path: "/editResume",
      name: "editResume",
      props: true,
      component: CreateResumeForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/searchProfiles",
      name: "profileSearch",
      component: SearchView,
      props: { category: "Resumes" },
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
