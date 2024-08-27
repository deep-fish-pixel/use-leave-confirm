import { createApp, } from 'vue';
import { install as leaveConfirmInstall, } from "@/utils";
import { setupStore, } from '@/store';
import { setupRouter, router } from '@/router';
import { setupDirectives, } from '@/directives';
import Lego from '@nio-fe/lego';
import App from './App.vue';
import 'use-leave-confirm/index.css';
import '@/assets/styles/common.scss';
import '@nio-fe/lego/lib/index.css';


window.addEventListener('history',function(){
  console.log('窗口的history改变了')
  console.log('当前页面链接是：',window.location.href);
})


const app = createApp(App);

// 配置store
setupStore(app);

// 配置路由
setupRouter(app);

// 配置use-leave-confirm
app.use(leaveConfirmInstall);

// 配置指令
setupDirectives(app);

// 配置Logo组件
app.use(Lego, {
  locale: {},
});

app.mount('#app');
