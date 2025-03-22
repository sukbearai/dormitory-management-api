import type { AppRouteRecordRaw } from '../types'
import { DEFAULT_LAYOUT } from '../base'

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '用户中心',
    icon: 'icon-user',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/user/setting/index.vue'),
      meta: {
        locale: '个人设置',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'management',
      name: 'Management',
      component: () => import('@/views/user/management/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
}

export default USER
