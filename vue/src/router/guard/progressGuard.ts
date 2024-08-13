import type { Router, } from 'vue-router';
import MultiNProgress from '@/router/helper/MultiNProgress';

/**
 * Routing with progress
 * @param router
 */
export default function createProgressGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    console.log('Vue router.beforeEach');
    if (to.meta?.loaded) {
      return true;
    }
    MultiNProgress.start();
    next();
  });

  router.afterEach(async () => {
    console.log('Vue router.afterEach');
    MultiNProgress.done();
  });
}
