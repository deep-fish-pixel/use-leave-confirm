# use-leave-confirm

检测页面数据的变化，在跳转、前景/返回、刷新等操作进行拦截并显示确认框，等待用户反馈
支持vue3、react18+

![效果](https://github.com/deep-fish-pixel/use-leave-confirm/blob/main/static/preview.jpeg)
![操作效果](https://github.com/deep-fish-pixel/use-leave-confirm/blob/main/static/preview.gif)

## 使用

```bash
npm install use-leave-confirm
```

### vue使用
```ts
// 第一步 先在main.ts的首行引入
import { extendVueRouter, } from "use-leave-confirm";

extendVueRouter(router);

// 第二步 数据监控的页面
import { useLeaveConfirm } from "use-leave-confirm";

const { snapshot, } = useLeaveConfirm(store.data);

```

### react使用
```ts
// 第一步 先在main.ts的首行引入
import { extendReactHistory, } from "use-leave-confirm";

extendReactHistory();

// 第二步 数据监控的页面
import { useLeaveConfirm } from "use-leave-confirm";

const navigate = useNavigate();

const { snapshot } = useLeaveConfirm(() => form.getFieldsValue(), {
  navigate,
});

```

### 快照更新
```ts
const { snapshot, } = useLeaveConfirm(store);

// 5秒后快照更新，根据新的数据快照进行监控
setTimeout(() => {
  snapshot();
}, 5000);
```

### 子组件中获取snapshot
```ts
// 空参即可获取到上一个snapshot
const { snapshot, } = useLeaveConfirm();

// ...
snapshot();
// ...
```

### 配置确认框的文本
```ts
import { useLeaveConfirm } from "use-leave-confirm";

const { snapshot, } = useLeaveConfirm(store.data, {
  contentText: 'After leaving, the edited content will be cleared',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
});

```

### 微前端处理
```ts
// 需要在基座中额外导入如下
import "use-leave-confirm";

```
