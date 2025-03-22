import type { AppRouteRecordRaw } from '../types'
import { DEFAULT_LAYOUT } from '../base'

const DORMITORY: AppRouteRecordRaw = {
  path: '/dormitory',
  name: 'dormitory',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '宿舍中心',
    icon: 'icon-home',
    requiresAuth: true,
    order: 2,
  },
  children: [
    {
      path: 'notification',
      name: 'notification',
      component: () => import('@/views/dormitory/notification/index.vue'),
      meta: {
        locale: '通知管理',
        requiresAuth: true,
        roles: ['dorm_staff', 'student'],
      },
    },
    {
      path: 'building',
      name: 'Building',
      component: () => import('@/views/dormitory/building/index.vue'),
      meta: {
        locale: '楼栋管理',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'dorms',
      name: 'Dorms',
      component: () => import('@/views/dormitory/dorms/index.vue'),
      meta: {
        locale: '宿舍管理',
        requiresAuth: true,
        roles: ['admin', 'dorm_staff'],
      },
    },
    {
      path: 'student-dorm',
      name: 'StudentDorm',
      component: () => import('@/views/dormitory/student-dorm/index.vue'),
      meta: {
        locale: '住宿管理',
        requiresAuth: true,
        roles: ['admin', 'dorm_staff'],
      },
    },
    {
      path: 'inspection-dorm',
      name: 'InspectionDorm',
      component: () => import('@/views/dormitory/inspection-dorm/index.vue'),
      meta: {
        locale: '宿舍检查',
        requiresAuth: true,
        roles: ['admin', 'dorm_staff'],
      },
    },
    {
      path: 'late-return',
      name: 'LateReturn',
      component: () => import('@/views/dormitory/late-return/index.vue'),
      meta: {
        locale: '晚归管理',
        requiresAuth: true,
        roles: ['admin', 'dorm_staff', 'student'],
      },
    },
    {
      path: 'repair-dorm',
      name: 'RepairDorm',
      component: () => import('@/views/dormitory/repair-dorm/index.vue'),
      meta: {
        locale: '宿舍维修',
        requiresAuth: true,
        roles: ['admin', 'dorm_staff', 'maintenance', 'student'],
      },
    },
  ],
}

export default DORMITORY
