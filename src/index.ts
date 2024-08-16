import { extendListeners, } from 'extend-window-listener';
import confirm from './confirm';

const objectClass = Object;

interface PopState {
  // vue
  position: number;
  // react
  idx: number;
  replaced?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const config = objectClass.__leave_confirm__ || {
  option: {
  },
  href: '',
  state: ({
    // vue
    position: -1,
    // react
    idx: -1,
    replaced: false,
  }) as PopState,
  data: {} as any,
  snapshot: '{}',
  navigator: {
    doing: false,
    navigate: (name: string) => {},
  },
  contentText: '离开后，已编辑的内容将被清除',
  confirmText: '确认离开',
  cancelText: '取消',
  lastResolver: {
    time: -1,
    value: false,
    isValid() {
      return Date.now() - this.time < 30;
    },
    update(value: boolean) {
      this.value = value;
      this.time = Date.now();
    },
  },
};

// 解决fms通讯问题
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
objectClass.__leave_confirm__ = config;

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (hasEdited()) {
    event.preventDefault();
    event.returnValue = config.contentText;
  }
}

function addBeforeUnload() {
  window.addEventListener('beforeunload', handleBeforeUnload);
}

function removeBeforeUnload() {
  window.removeEventListener('beforeunload', handleBeforeUnload);
}

extendListeners('popstate');


function addRouter() {
  extendListeners('hashchange');
  window.addEventListener('popstate', (event: PopStateEvent) => {
    console.log(event.state);
    const state = event.state || {};

    return resolveConfirm(state);
  });
  // @ts-ignore
  window.addEventListener('hashchange', (event: PopStateEvent) => new Promise(() => {}));
}

function extendReactHistoryApi() {
  function extendHistoryMethod(name: string) {
    // @ts-ignore
    const method = window.history[name];

    return (...params: any[]) => {
      params[2] = params[2].replace(/^#.+#/, '#');

      if (config.navigator.doing || !config.href) {
        return method.apply(window.history, params as any);
      }

      return resolveConfirm(params[0], true).then((result) => {
        if (!result) {
          if (window.location.href !== params[2]) {
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
  window.history.pushState = extendHistoryMethod('pushState');
  // @ts-ignore
  window.history.replaceState = extendHistoryMethod('replaceState');
}

function resetInnerState() {
  Object.assign(config, {
    href: '',
    state: {
      // vue
      position: -1,
      // react
      idx: -1,
      ...history.state,
    },
    data: {} as any,
    snapshot: '{}',
  });
}

function getData() {
  if (typeof config.data === 'function') {
    return config.data();
  }
  return config.data;

}

function setData(value?: any) {
  if (arguments.length) {
    config.href = window.location.href;
    config.data = value;
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
  if (state.position >= 0 && config.state.position >= 0 && state.position !== config.state.position) {
    return config.state.position - state.position;
  }
  if (state.idx >= 0 && config.state.idx >= 0 && state.idx !== config.state.idx) {
    return config.state.idx - state.idx;
  }
}

function resolveConfirm(state: PopState, command = false) {
  if (config.navigator.doing) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    const isValid = config.lastResolver.isValid();

    console.log('isValid=====', isValid);

    if (isValid) {
      resolve(config.lastResolver.value);
    } else if (config.href && hasEdited() && (statePositionSub(state) || command)) {
      confirm({
        confirm() {
          resetInnerState();
          resolve(false);
          config.lastResolver.update(false);
        },
        cancel() {
          if (state.position >= 0 && config.state.position >= 0 && state.position != config.state.position && hrefDiff()) {
            debugger;
            window.history.go(config.state.position - state.position);
            resolve(true);
            config.lastResolver.update(true);
          } else if (state.idx >= 0 && config.state.idx >= 0 && state.idx != config.state.idx && hrefDiff()) {
            window.history.go(config.state.idx - state.idx);
            resolve(true);
            config.lastResolver.update(true);
          } else if (command) {
            resolve(true);
            config.lastResolver.update(true);
          } else {
            resolve(true);
            config.lastResolver.update(true);
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
      config.lastResolver.update(false);
    }
  });
}


export function extendVueRouter(router: any) {
  console.log(router);
  router.push = extendRouterMethod('push');
  router.replace = extendRouterMethod('replace');
  router.go = extendRouterMethod('go');
  router.back = extendRouterMethod('back');
  router.forward = extendRouterMethod('forward');

  function extendRouterMethod(name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const method = router[name];

    return (...params: any[]) => resolveConfirm({
      position: config.state.position,
      idx: 0,
    }, true).then((result) => {
      if (!result) {
        return method.apply(router, params as any);
      }
    });
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
  if (value) {
    Object.assign(
      config.state,
      history.state
    );
    setData(value);
  }

  Object.assign(config, option);

  if (option.navigate) {
    config.navigator.navigate = option.navigate;
    delete option.navigate;
  }

  return {
    snapshot(value?: any) {
      if (arguments.length) {
        setData(value);
      } else {
        setData();
      }
    },
  };
}

addRouter();
addBeforeUnload();
