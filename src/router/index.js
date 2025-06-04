import Vue, { KeepAlive } from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import game from '../views/game.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/game',
    name: 'game',
    component: game,
    meta: {
      KeepAlive: true,
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
