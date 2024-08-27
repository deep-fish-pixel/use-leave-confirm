import { extendListeners } from 'extend-window-listener';

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function confirm (options) {
    var confirmEl = document.createElement('div');
    confirmEl.setAttribute('class', 'lc-dialog');
    confirmEl.setAttribute('style', 'z-index: 9999;');
    confirmEl.innerHTML = "\n    <div class=\"lc-dialog__mask\"></div>\n    <div class=\"lc-dialog__container\">\n      <div class=\"lc-dialog__inner\">\n        <div class=\"lc-dialog__icon-box\">\n          <i class=\"lc-icon lc-icon_warning\"></i>\n        </div>\n        <div class=\"lc-dialog__main\">\n          <div class=\"lc-dialog__body\">" + options.contentText + "</div>\n          <div class=\"lc-dialog__footer\">\n            <div class=\"lc-dialog__default-footer\">\n              <button class=\"lc-button lc-button--normal lc-button--plain\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.cancelText + "</div>\n              </button>\n              <button class=\"lc-button lc-button--primary\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.confirmText + "</div>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n   ";
    document.body.append(confirmEl);
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

var objectClass = Object;
var config = objectClass.__leave_confirm__ || {
    option: {},
    href: '',
    state: ({
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
    lastResolver: {
        time: -1,
        value: false,
        isValid: function (timer) {
            if (timer === void 0) { timer = 30; }
            return Date.now() - this.time < timer;
        },
        update: function (value) {
            this.value = value;
            this.time = Date.now();
        },
    },
    isReact: false,
};
objectClass.__leave_confirm__ = config;
function handleBeforeUnload(event) {
    if (hasEdited()) {
        event.preventDefault();
        event.returnValue = config.contentText;
    }
}
function addBeforeUnload() {
    window.addEventListener('beforeunload', handleBeforeUnload);
}
extendListeners('popstate');
function addRouter() {
    extendListeners('hashchange');
    window.addEventListener('popstate', function (event) {
        var state = event.state || {};
        if (event.singleSpaTrigger && config.lastResolver.isValid(500)) {
            return Promise.resolve(false);
        }
        return resolveConfirm(state);
    });
    window.addEventListener('hashchange', function (event) { return new Promise(function () { }); });
}
function resetInnerState() {
    Object.assign(config, {
        href: '',
        state: __assign({ position: -1, idx: -1 }, history.state),
        data: {},
        snapshot: '{}',
    });
}
function getData() {
    if (typeof config.data === 'function') {
        return config.data();
    }
    return config.data;
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
        var valid = config.lastResolver.isValid();
        if (valid) {
            resolve(config.lastResolver.value);
        }
        else if (config.href && hasEdited() && (statePositionSub(state) || command)) {
            confirm({
                confirm: function () {
                    resetInnerState();
                    resolve(false);
                    config.lastResolver.update(false);
                },
                cancel: function () {
                    if (state.position >= 0 && config.state.position >= 0 && state.position != config.state.position && hrefDiff()) {
                        window.history.go(config.state.position - state.position);
                        resolve(true);
                        config.lastResolver.update(true);
                    }
                    else if (state.idx >= 0 && config.state.idx >= 0 && state.idx != config.state.idx && hrefDiff()) {
                        window.history.go(config.state.idx - state.idx);
                        resolve(true);
                        config.lastResolver.update(true);
                    }
                    else if (command) {
                        resolve(true);
                        config.lastResolver.update(true);
                    }
                    else {
                        resolve(true);
                        config.lastResolver.update(true);
                    }
                },
                contentText: config.contentText,
                confirmText: config.confirmText,
                cancelText: config.cancelText,
            }).show();
        }
        else {
            resolve(false);
            config.lastResolver.update(false);
        }
    });
}
function extendVueRouter(router) {
    router.push = extendRouterMethod('push');
    router.replace = extendRouterMethod('replace');
    router.go = extendRouterMethod('go');
    router.back = extendRouterMethod('back');
    router.forward = extendRouterMethod('forward');
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
                    if (name === 'push' || name === 'replace') {
                        config.lastResolver.update(false);
                    }
                    return method.apply(router, params);
                }
            });
        };
    }
}
var install = {
    install: function (app) {
        if (!app.config.globalProperties.$router) {
            console.error('use-leave-confirm should install after vue-router! Otherwise, it may cause partial failure.');
            return;
        }
        extendVueRouter(app.config.globalProperties.$router);
    }
};
function extendReactHistory() {
    config.isReact = true;
    window.history.pushState = extendHistoryMethod('pushState');
    window.history.replaceState = extendHistoryMethod('replaceState');
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
}
function useLeaveConfirm(value, option) {
    if (option === void 0) { option = {}; }
    if (value && (!config.isReact || config.isReact && config.href !== window.location.href)) {
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
addRouter();
addBeforeUnload();

export { extendReactHistory, extendVueRouter, install, useLeaveConfirm };
//# sourceMappingURL=bundle.esm.js.map
