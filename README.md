# use-leave-confirm

检测页面数据的变化，在跳转、前景/返回、刷新等操作进行拦截并显示确认框，等待用户反馈
支持vue3、react18+

![效果](https://github.com/deep-fish-pixel/use-leave-confirm/static/preview.jpeg)
![操作效果](https://github.com/deep-fish-pixel/use-leave-confirm/static/preview.gif)

## 使用

```bash
npm install use-leave-confirm
```

```ts
// vue使用
import { useLeaveConfirm } from "use-leave-confirm";

const { snapshot, } = useLeaveConfirm(store);

```

```ts
// react使用
// 第一步 先在main.ts的首行引入
import "use-leave-confirm";

// 第二步
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