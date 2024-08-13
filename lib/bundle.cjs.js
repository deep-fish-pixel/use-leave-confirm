'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function serializeCall (handles) {
    var index = -1;
    function next() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        index++;
        if (handles[index]) {
            var result = (_a = handles[index]).call.apply(_a, __spread([window], args));
            if (!result) {
                return next.apply(void 0, __spread(args));
            }
            if (result && result.then) {
                return result.then(function (res) {
                    if (!res) {
                        return next.apply(void 0, __spread(args));
                    }
                    return true;
                });
            }
        }
        return false;
    }
    return next;
}

var listeners = {};
var addEventListenerOriginal = window.addEventListener;
var removeEventListenerOriginal = window.removeEventListener;
window.addEventListener = function extendAddEventListener() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var eventName = params[0];
    var handle = params[1];
    if (!handle) {
        return;
    }
    var listener = listeners[eventName];
    if (listener) {
        listener.handles.push(handle);
    }
    else {
        addEventListenerOriginal.apply(window, params);
    }
};
window.removeEventListener = function extendRemoveEventListener() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var eventName = params[0];
    var handle = params[1];
    if (!handle) {
        return;
    }
    var listener = listeners[eventName];
    if (listener) {
        listener.handles.some(function (fn, index) {
            if (fn === handle) {
                listener.handles.splice(index, 1);
                return true;
            }
        });
    }
    else {
        removeEventListenerOriginal.apply(window, params);
    }
};
function extendListeners() {
    var extendEventNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        extendEventNames[_i] = arguments[_i];
    }
    extendEventNames.forEach(function (eventName) {
        addEventListenerOriginal.call(window, eventName, extendHandle);
        listeners[eventName] = {
            rootHandle: extendHandle,
            handles: [],
        };
        function extendHandle(event) {
            var listener = listeners[eventName];
            var next = serializeCall(listener.handles);
            next(event);
        }
    });
}

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = "\n.lc-dialog {\n  position: relative;\n  z-index: 9999;\n  display: none;\n}\n.lc-dialog__mask {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba( 0, 0, 0 , .7 );\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n.lc-dialog-show .lc-dialog__mask{\n  opacity: 1;\n}\n.lc-dialog__container {\n  position: fixed;\n  right: 0;\n  left: 0;\n  display: flex;\n  max-width: 92%;\n  max-height: 84%;\n  margin: 0 auto;\n  padding: 24px;\n  background: rgb( 255, 255, 255 );\n  border-radius: 4px;\n  box-shadow: 0 3px 6px -4px rgba( 0, 0, 0 , 10%), 0 6px 16px 0 rgba( 0, 0, 0 , 6%), 0 9px 28px 8px rgba( 0, 0, 0 , 3%);\n  width: 420px;\n  max-height: 50%;\n  top: 50%;\n  opacity: 0.5;\n  transform: translateY(-50%) scale(0.5);\n  transition: all 0.3s;\n  overflow: hidden;\n}\n.lc-dialog-show .lc-dialog__container{\n  transform: translateY(-50%) scale(1);\n  opacity: 1;\n}\n.lc-dialog__inner {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n}\n.lc-dialog__icon-box {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 22px;\n  margin-right: 12px;\n}\n.lc-dialog__main {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n}\n.lc-dialog__body {\n  flex: 1;\n  margin-inline: calc(0px - 24px);\n  padding-inline: 24px;\n  overflow: auto;\n}\n.lc-dialog__footer {\n  flex: none;\n  margin-top: 24px;\n}\n.lc-dialog__default-footer {\n  text-align: right;\n}\n.lc-dialog__default-footer .lc-button{\n  margin-left: 16px;\n}\n.lc-dialog__default-footer .lc-button:first-child{\n  margin-left: 0;\n}\n.lc-button {\n  display: inline-flex;\n  grid-column-gap: 4px;\n  align-items: center;\n  justify-content: center;\n  height: 32px;\n  padding: 0 16px;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: nowrap;\n  vertical-align: middle;\n  border: 1px solid rgba(0,0,0,0);\n  border-radius: 4px;\n  cursor: pointer;\n  transition: all .3s;\n  color: #fff;\n  background: #02b3be;\n  border-color: rgba(0,0,0,0);\n  outline: none;\n}\n.lc-button.lc-button--primary {\n  border-color: #02b3be;\n  outline: none;\n}\n.lc-button.lc-button--primary:active {\n  background: #087d85;\n  border-color: #087d85;\n}\n.lc-button--plain.lc-button--normal:not(.is-ghost) {\n  color: rgb( 4, 11, 41 );\n  background: #fff;\n  border-color: rgb( 206, 208, 216 );\n  outline: none;\n}\n.lc-button--plain.lc-button--normal:not(.is-ghost):active {\n  background: #ddd;\n}\n";
function confirm (options) {
    var confirmEl = document.createElement('div');
    confirmEl.setAttribute('class', 'lc-dialog');
    confirmEl.setAttribute('style', 'z-index: 9999;');
    confirmEl.innerHTML = "\n    <div class=\"lc-dialog__mask\"></div>\n    <div class=\"lc-dialog__container\">\n      <div class=\"lc-dialog__inner\">\n        <div class=\"lc-dialog__icon-box\">\n          <i class=\"lc-icon lc-icon_warning_filled lc-dialog__icon\"\n                                           style=\"font-size: 22px; color: rgb(253, 167, 28);\"></i>\n        </div>\n        <div class=\"lc-dialog__main\">\n          <div class=\"lc-dialog__body\">" + options.contentText + "</div>\n          <div class=\"lc-dialog__footer\">\n            <div class=\"lc-dialog__default-footer\">\n              <button class=\"lc-button lc-button--normal lc-button--plain\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.cancelText + "</div>\n              </button>\n              <button class=\"lc-button lc-button--primary\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.confirmText + "</div>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n   ";
    document.body.append(confirmEl);
    if (!style.parentElement) {
        document.head.append(style);
    }
    var normalButton = confirmEl.querySelector('.lc-button--normal');
    var primaryButton = confirmEl.querySelector('.lc-button--primary');
    function close() {
        document.body.removeChild(confirmEl);
        if (normalButton) {
            normalButton.removeEventListener('click', cancelHandle);
        }
        if (primaryButton) {
            primaryButton.removeEventListener('click', confirmHandle);
        }
    }
    var cancelHandle = function () {
        if (options.cancel) {
            options.cancel();
        }
        close();
    };
    var confirmHandle = function () {
        if (options.confirm) {
            options.confirm();
        }
        close();
    };
    return {
        show: function () {
            confirmEl.style.display = 'block';
            if (normalButton) {
                normalButton.addEventListener('click', cancelHandle);
            }
            if (primaryButton) {
                primaryButton.addEventListener('click', confirmHandle);
            }
            setTimeout(function () {
                confirmEl.setAttribute('class', confirmEl.getAttribute('class') + ' lc-dialog-show');
            }, 10);
        },
        close: function () {
            close();
        },
        cancel: function () {
            close();
        },
        confirm: function () {
            confirmHandle();
        }
    };
}

var config = {
    option: {},
    href: '',
    state: Object.assign({
        position: -1,
        idx: -1,
        replaced: false,
    }),
    data: {},
    snapshot: '{}',
    navigator: {
        doing: false,
        navigate: function (name) { },
    },
    contentText: '离开后，已编辑的内容将被清除',
    confirmText: '确认离开',
    cancelText: '取消',
};
var lastResolver = {
    time: -1,
    value: false,
    isValid: function () {
        return Date.now() - this.time < 30;
    },
    update: function (value) {
        this.value = value;
        this.time = Date.now();
    }
};
function handleBeforeUnload(event) {
    if (hasEdited()) {
        event.preventDefault();
        event.returnValue = config.contentText;
    }
}
function addBeforeUnload() {
    window.addEventListener("beforeunload", handleBeforeUnload);
}
extendListeners("popstate");
function addRouter() {
    window.addEventListener("popstate", function (event) {
        console.log(event.state);
        var state = event.state || {};
        return resolveConfirm(state);
    });
}
function extendReactHistoryApi() {
    function extendHistoryMethod(name) {
        var method = window.history[name];
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            params[2] = params[2].replace(/^#.+#/, '#');
            if (config.navigator.doing || !config.href) {
                return method.apply(window.history, params);
            }
            return resolveConfirm(params[0], true).then(function (result) {
                if (!result) {
                    if (window.location.href !== params[2]) {
                        resetInnerState();
                    }
                    else {
                        resetInnerState();
                    }
                    config.navigator.doing = true;
                    try {
                        config.navigator.navigate(params[2]);
                    }
                    finally {
                        config.navigator.doing = false;
                    }
                }
            });
        };
    }
    window.history.pushState = extendHistoryMethod("pushState");
    window.history.replaceState = extendHistoryMethod("replaceState");
}
function resetInnerState() {
    Object.assign(config, {
        href: '',
        state: Object.assign({
            position: -1,
            idx: -1
        }, history.state),
        data: {},
        snapshot: '{}',
    });
}
function getData() {
    if (typeof config.data === 'function') {
        return config.data();
    }
    else {
        return config.data;
    }
}
function setData(value) {
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
function statePositionSub(state) {
    if (state.position >= 0 && config.state.position >= 0 && state.position !== config.state.position) {
        return config.state.position - state.position;
    }
    if (state.idx >= 0 && config.state.idx >= 0 && state.idx !== config.state.idx) {
        return config.state.idx - state.idx;
    }
}
function resolveConfirm(state, command) {
    if (command === void 0) { command = false; }
    if (config.navigator.doing) {
        return Promise.resolve(false);
    }
    return new Promise(function (resolve, reject) {
        if (lastResolver.isValid()) {
            resolve(lastResolver.value);
        }
        else if (config.href && hasEdited() && (statePositionSub(state) || command)) {
            confirm({
                confirm: function () {
                    resetInnerState();
                    resolve(false);
                    lastResolver.update(false);
                },
                cancel: function () {
                    if (state.position >= 0 && config.state.position >= 0 && state.position != config.state.position && hrefDiff()) {
                        window.history.go(config.state.position - state.position);
                        resolve(true);
                        lastResolver.update(true);
                    }
                    else if (state.idx >= 0 && config.state.idx >= 0 && state.idx != config.state.idx && hrefDiff()) {
                        window.history.go(config.state.idx - state.idx);
                        resolve(true);
                        lastResolver.update(true);
                    }
                    else if (command) {
                        resolve(true);
                        lastResolver.update(true);
                    }
                    else {
                        reject(new Error('没有检测到前进后退的位置'));
                    }
                },
                contentText: config.contentText,
                confirmText: config.confirmText,
                cancelText: config.cancelText,
            }).show();
        }
        else {
            resolve(false);
            lastResolver.update(false);
        }
    });
}
function extendVueRouterApi(router) {
    console.log(router);
    router.push = extendRouterMethod("push");
    router.replace = extendRouterMethod("replace");
    router.go = extendRouterMethod("go");
    function extendRouterMethod(name) {
        var method = router[name];
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return resolveConfirm({
                position: config.state.position,
                idx: 0,
            }, true).then(function (result) {
                if (!result) {
                    return method.apply(router, params);
                }
            });
        };
    }
}
function useLeaveConfirm(value, option) {
    if (option === void 0) { option = {}; }
    if (arguments.length && config.href !== window.location.href) {
        Object.assign(config.state, history.state);
        setData(value);
    }
    Object.assign(config, option);
    if (option.navigate) {
        config.navigator.navigate = option.navigate;
        delete option.navigate;
    }
    return {
        snapshot: function (value) {
            if (arguments.length) {
                setData(value);
            }
            else {
                setData();
            }
        },
    };
}
function polyfill() {
    setTimeout(function () {
        var app = window.app;
        var __vue_app__ = app && app.__vue_app__;
        var _context = __vue_app__ && __vue_app__._context;
        var config = _context && _context.config;
        var globalProperties = config && config.globalProperties;
        var $router = globalProperties && globalProperties.$router;
        if ($router) {
            extendVueRouterApi($router);
        }
        else {
            extendReactHistoryApi();
        }
    }, 10);
}
addRouter();
addBeforeUnload();
polyfill();

exports.extendVueRouterApi = extendVueRouterApi;
exports.useLeaveConfirm = useLeaveConfirm;
//# sourceMappingURL=bundle.cjs.js.map
