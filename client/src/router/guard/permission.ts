import type { RouteRecordNormalized, Router } from 'vue-router'

import NProgress from 'nprogress' // progress bar
import { NOT_FOUND, WHITE_LIST } from '../constants'
import { appRoutes } from '../routes'
import { useAppStore, useUserStore } from '@/store'
import usePermission from '@/hooks/permission'

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const Permission = usePermission()
    const permissionsAllow = Permission.accessRouter(to)
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server

      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the permission logic from the server's menu configuration as needed
      if (
        !appStore.appAsyncMenus.length
        && !WHITE_LIST.find(el => el.name === to.name)
      ) {
        await appStore.fetchServerMenuConfig()
      }
      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST]

      let exist = false
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift()
        if (element?.name === to.name)
          exist = true

        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[]),
          )
        }
      }
      if (exist && permissionsAllow) {
        next()
      }
      else {
        next(NOT_FOUND)
      }
    }
    else {
      if (permissionsAllow) {
        next()
      }
      else {
        const destination
          = Permission.findFirstPermissionRoute(appRoutes, userStore.role)
            || NOT_FOUND
        next(destination)
      }
    }
    NProgress.done()
  })
}
