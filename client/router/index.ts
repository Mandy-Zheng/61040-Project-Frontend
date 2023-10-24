import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import CreateResumeForm from "../components/Resume/CreateResumeForm.vue";
import CreateNewPostView from "../views/CreateNewPostView.vue";
import DependencyMapView from "../views/DependencyMapView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MyAnnotationsView from "../views/MyAnnotationsView.vue";
import MyResumesView from "../views/MyResumesView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostFeedView from "../views/PostFeedView.vue";
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
      component: MyResumesView,
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
      path: "/depmaps",
      name: "DependencyMaps",
      component: DependencyMapView,
      meta: { requiresAuth: true },
    },
    {
      path: "/feed",
      name: "PostFeed",
      component: PostFeedView,
      props: true,
      meta: { requiresAuth: true },
    },
    // {
    //   path: "/myposts",
    //   name: "MyPosts",
    //   component: MyPostsView,
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/myannotations",
      name: "MyAnnotations",
      component: MyAnnotationsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/createPost",
      name: "CreatePost",
      props: true,
      component: CreateNewPostView,
      meta: { requiresAuth: true },
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
