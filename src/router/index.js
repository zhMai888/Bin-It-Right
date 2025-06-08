import Vue, { KeepAlive } from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import game from '../views/game.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login,
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
