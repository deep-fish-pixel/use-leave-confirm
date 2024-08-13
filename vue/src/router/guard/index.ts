import type { Router, } from 'vue-router';
import createPermissionGuard from '@/router/guard/permissionGuard';
import createStateGuard from '@/router/guard/stateGuard';
import createScrollGuard from '@/router/guard/scrollGuard';
import createProgressGuard from '@/router/guard/progressGuard';

// 配置守卫
export default function setupRouterGuard(router: Router) {
  createScrollGuard(router);
  createPermissionGuard(router);
  createStateGuard(router);
  createProgressGuard(router);
}
