import type { Router } from 'vue-router'
import setupPermissionGuard from './permission'
import setupUserLoginInfoGuard from './userLoginInfo'
import { setRouteEmitter } from '@/utils/route-listener'

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to)
  })
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router)
  setupUserLoginInfoGuard(router)
  setupPermissionGuard(router)
}
