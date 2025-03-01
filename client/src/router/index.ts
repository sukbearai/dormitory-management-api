import NProgress from 'nprogress'; // progress bar
import { createRouter, createWebHistory } from 'vue-router';
import createRouteGuard from './guard';

import { appRoutes } from './routes';
import { NOT_FOUND_ROUTE, REDIRECT_MAIN } from './routes/base';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        roles: ['*'],
        requiresAuth: false,
      },
     
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: {
        roles: ['*'],
        requiresAuth: false,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
