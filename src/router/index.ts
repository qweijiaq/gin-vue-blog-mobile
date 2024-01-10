import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/index.vue"),
    },
    {
      path: "/article/:id",
      name: "article",
      component: () => import("../views/article.vue"),
    },
    {
      path: "/mine",
      name: "mine",
      component: () => import("../views/mine.vue"),
    },
    {
      path: "/mine_collections",
      name: "mine_collections",
      component: () => import("../views/mine_collections.vue"),
    },
  ],
});

export default router;
