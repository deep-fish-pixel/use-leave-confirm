import { extendListeners, } from "extend-window-listener";
import confirm from './confirm';

interface PopState {
  // vue
  position: number;
  // react
  idx: number;
  replaced?: boolean;
}

const config = {
  option: {
  },
  href: '',
  state: Object.assign(
    {
      // vue
      position: -1,
      // react
      idx: -1,
      replaced: false,
    },
  ) as PopState,
  data: {} as any,
  snapshot: '{}',
  navigator: {
    doing: false,
    navigate: (name: string) => {},
  },
  contentText: '离开后，已编辑的内容将被清除',
  confirmText: '确认离开',
  cancelText: '取消',
};

const lastResolver = {
  time: -1,
  value: false,
  isValid(){
    return Date.now() - this.time < 30;
  },
  update(value: boolean){
    this.value = value;
    this.time = Date.now();
  }
};

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (hasEdited()) {
    event.preventDefault();
    event.returnValue = config.contentText;
  }
}

function addBeforeUnload() {
  window.addEventListener("beforeunload", handleBeforeUnload);
}

function removeBeforeUnload() {
  window.removeEventListener("beforeunload", handleBeforeUnload);
}

extendListeners("popstate");


function addRouter() {
  extendListeners("hashchange");
  window.addEventListener("popstate", function confirmPopState(event: PopStateEvent) {
    console.log(event.state);
    const state = event.state || {};

    return resolveConfirm(state);
  });
  // @ts-ignore
  window.addEventListener("hashchange", function confirmPendingHashchange(event: PopStateEvent) {
    return new Promise(() => {});
  });
}

function extendReactHistoryApi() {
  function extendHistoryMethod(name: string) {
    // @ts-ignore
    const method = window.history[name];

    return (...params: any[]) => {
      params[2] = params[2].replace(/^#.+#/, '#');

      if(config.navigator.doing || !config.href){
        return method.apply(window.history, params as any);
      }

      return resolveConfirm(params[0], true).then((result) => {
        if(!result){
          if(window.location.href !== params[2]) {
            resetInnerState();
          } else {
            resetInnerState();
          }

          config.navigator.doing = true;
          try {
            config.navigator.navigate(params[2]);
          } finally {
            config.navigator.doing = false;
          }
        }
      });
    };
  }

  // @ts-ignore
  window.history.pushState = extendHistoryMethod("pushState");
  // @ts-ignore
  window.history.replaceState = extendHistoryMethod("replaceState");
}

function resetInnerState() {
  Object.assign(config, {
    href: '',
    state: Object.assign(
      {
        // vue
        position: -1,
        // react
        idx: -1
      },
      history.state
    ),
    data: {} as any,
    snapshot: '{}',
  });
}

function getData() {
  if(typeof config.data === 'function'){
    return config.data();
  } else {
    return config.data;
  }
}

function setData(value?: any) {
  if(arguments.length){
    config.href = window.location.href;
    config.data = value
  }

  config.snapshot = JSON.stringify(getData());
}

function hasEdited() {
  return config.snapshot !== JSON.stringify(getData());
}

function hrefDiff() {
  return config.href !== window.location.href;
}

function statePositionSub(state: PopState) {
  if (state.position >= 0 && config.state.position >= 0 && state.position !== config.state.position){
    return config.state.position - state.position;
  }
  if(state.idx >= 0 && config.state.idx >= 0 && state.idx !== config.state.idx){
    return config.state.idx - state.idx;
  }
}

function resolveConfirm(state: PopState, command: boolean = false) {
  if(config.navigator.doing){
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    if(lastResolver.isValid()){
      resolve(lastResolver.value);
    }
    else if(config.href && hasEdited() && (statePositionSub(state) || command)){
      confirm({
        confirm(){
          resetInnerState();
          resolve(false);
          lastResolver.update(false);
        },
        cancel(){
          if (state.position >= 0 && config.state.position >= 0 && state.position != config.state.position && hrefDiff()) {
            window.history.go(config.state.position - state.position);
            resolve(true);
            lastResolver.update(true);
          } else if (state.idx >= 0 && config.state.idx >= 0 && state.idx != config.state.idx && hrefDiff()) {
            window.history.go(config.state.idx - state.idx);
            resolve(true);
            lastResolver.update(true);
          } else if(command){
            resolve(true);
            lastResolver.update(true);
          } else {
            resolve(true);
            lastResolver.update(true);
            // reject(new Error('没有检测到前进后退的位置'));
          }
        },
        contentText: config.contentText,
        confirmText: config.confirmText,
        cancelText: config.cancelText,
      }).show();
    } else {
      // 返回不能清空
      // resetInnerState();
      resolve(false);
      lastResolver.update(false);
    }
  });
}


export function extendVueRouterApi(router: any) {
  console.log(router);
  router.push = extendRouterMethod("push");
  router.replace = extendRouterMethod("replace");
  router.go = extendRouterMethod("go");
  router.back = extendRouterMethod("back");
  router.forward = extendRouterMethod("forward");

  function extendRouterMethod(name: string) {
    // @ts-ignore
    const method = router[name];

    return (...params: any[]) => {
      return resolveConfirm({
        position: config.state.position,
        idx: 0,
      }, true).then((result) => {
        if(!result){
          return method.apply(router, params as any);
        }
      });

    };
  }

}

/**
 * 数据改变离开确认
 * @param value 数据源
 * @param option
 * @example useLeaveConfirm(data) or useLeaveConfirm(() => data);
 */
export function useLeaveConfirm(value?: any, option: {
  navigate?: any,
  contentText?: string,
  confirmText?: string
  cancelText?: string
} = {}) {
  if(arguments.length && config.href !== window.location.href){
    Object.assign(
      config.state,
      history.state
    );
    setData(value);
  }

  Object.assign(config, option);

  if(option.navigate) {
    config.navigator.navigate = option.navigate;
    delete option.navigate;
  }

  return {
    snapshot(value?: any){
      if(arguments.length){
        setData(value);
      } else {
        setData();
      }
    },
  };
}

function polyfill() {
  setTimeout(() => {
    // @ts-ignore
    const app = window.app;
    const __vue_app__ = app &&app.__vue_app__;
    const _context = __vue_app__ && __vue_app__._context;
    const config = _context && _context.config;
    const globalProperties = config && config.globalProperties;
    const $router = globalProperties && globalProperties.$router;

    if($router) {
      extendVueRouterApi($router);
    } else {
      extendReactHistoryApi();
    }
  }, 10);
}

addRouter();
addBeforeUnload();
polyfill();
