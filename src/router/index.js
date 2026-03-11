import { createRouter, createWebHashHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/dialog'
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: () => import('../views/dialog/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/quick-write',
    name: 'QuickWrite',
    component: () => import('../views/QuickWriteView.vue')
  },
  {
    path: '/write',
    name: 'Write',
    component: () => import('../views/write/index.vue')
  },
  {
    path: '/draft-write',
    name: 'DraftWrite',
    component: () => import('../views/DraftWriteView.vue')
  },
  {
    path: '/step-write',
    name: 'StepWrite',
    component: () => import('../views/StepWriteView.vue')
  },
  {
    path: '/ai-check',
    name: 'AiCheck',
    component: () => import('../views/AiCheckView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
