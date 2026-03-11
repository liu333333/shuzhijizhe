import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/quick-write',
    name: 'QuickWrite',
    component: () => import('../views/QuickWriteView.vue')
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
  history: createWebHistory(),
  routes
})

export default router
