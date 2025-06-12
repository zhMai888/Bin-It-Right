import Vue, { KeepAlive } from 'vue'
import VueRouter from 'vue-router'
import start from '../views/start.vue'
import game from '../views/game.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'start',
    component: start,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/game/:value?',
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
