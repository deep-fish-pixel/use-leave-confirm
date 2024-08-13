import { type App, } from 'vue';
import permission from './permission';

function setupDirectives(app: App) {
  app.directive('permission', permission);
}

export default setupDirectives;

export {
  setupDirectives,
};
