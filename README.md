# use-leave-confirm

检测页面数据的变化，在跳转、前景/返回、刷新等操作进行拦截并显示确认框，等待用户反馈
支持vue3、react18+

![效果](https://github.com/deep-fish-pixel/use-leave-confirm/blob/main/static/preview.jpeg)
![操作效果](https://github.com/deep-fish-pixel/use-leave-confirm/blob/main/static/preview.gif)

## 使用

```bash
npm install use-leave-confirm
```

```ts
// vue使用
// 第一步 先在main.ts的首行引入
import { extendVueRouter, } from "use-leave-confirm";

extendVueRouter(router);

// 第二步 数据监控的页面
import { useLeaveConfirm } from "use-leave-confirm";

const { snapshot, } = useLeaveConfirm(store.data);

```

```ts
// react使用
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


```ts
// 快照更新demo
const { snapshot, } = useLeaveConfirm(store);

// 5秒后快照更新，根据新的数据快照进行监控
setTimeout(() => {
  snapshot();
}, 5000);
```

```ts
// 子组件中获取snapshot，空参即可获取到同一个snapshot
const { snapshot, } = useLeaveConfirm();

// ...
snapshot();
// ...
```

```ts
// vue配置文本
import "use-leave-confirm";

import { useLeaveConfirm } from "use-leave-confirm";

const { snapshot, } = useLeaveConfirm(store.data, {
  contentText: 'After leaving, the edited content will be cleared',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
});

```
