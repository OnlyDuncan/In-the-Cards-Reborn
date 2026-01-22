import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LibraryView from "@/views/LibraryView.vue";
import AboutView from "@/views/AboutView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/library", name: "library", component: LibraryView },
    { path: "/about", name: "about", component: AboutView },
  ],
});