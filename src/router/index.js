import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import EvolveText from "../views/EvolveText.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/text",
    name: "Text",
    component: EvolveText,
  },
]

const router = new VueRouter({
  routes,
})

export default router
