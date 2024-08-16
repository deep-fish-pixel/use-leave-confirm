'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var extendWindowListener = require('extend-window-listener');

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

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = "\n.lc-dialog {\n  position: relative;\n  z-index: 9999;\n  display: none;\n}\n.lc-dialog__mask {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba( 0, 0, 0 , .7 );\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n.lc-dialog-show .lc-dialog__mask{\n  opacity: 1;\n}\n.lc-dialog__container {\n  position: fixed;\n  right: 0;\n  left: 0;\n  display: flex;\n  max-width: 92%;\n  max-height: 84%;\n  margin: 0 auto;\n  padding: 24px;\n  background: rgb( 255, 255, 255 );\n  border-radius: 4px;\n  box-shadow: 0 3px 6px -4px rgba( 0, 0, 0 , 10%), 0 6px 16px 0 rgba( 0, 0, 0 , 6%), 0 9px 28px 8px rgba( 0, 0, 0 , 3%);\n  width: 420px;\n  max-height: 50%;\n  top: 50%;\n  opacity: 0.5;\n  transform: translateY(-50%) scale(0.5);\n  transition: all 0.3s;\n  overflow: hidden;\n}\n.lc-dialog-show .lc-dialog__container{\n  transform: translateY(-50%) scale(1);\n  opacity: 1;\n}\n.lc-dialog__inner {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n}\n.lc-dialog__icon-box {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 20px;\n  margin-right: 6px;\n}\n.lc-icon_warning {\n  display: block;\n  width: 24px;\n  height: 24px;\n  background-size: 24px;\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACgElEQVR4Xu2ZsW7bMBCGs4na/AjZ8ghZO/UROmdI5vgN2l0SXKBblwTeMiWbxyAPUHjIA7ToC6idGsSmGB4dJfGdBR9PRzsF9AMfIJgmeUceqSN1cDBo0CAVucJ8sFU2bsr82lbmp3+ubWlcwD/73+ehrDBf4L+4/l7kJqORq8znNWO5BCfNhZuYQ9xucq0MzyfEKCm7dMSV2bloxLfhZ2RZmRPcn6pUR70DV2UT3G9vQcg0pbnFnaUCFjz0ie0QCxrEnaQGBgzbIdIuwqaL3uEEiwo3yqWZnTr395ezN59IWRRFPsZ2sQTbWtircYNMggPPstNjUs4nr0XrAfZm2hiftw40P76R8hiiQymM/oaGYlhz4H5KymOJmoW+ow9oOwA5FLazU31iv0XdAb8WsJ0bFbJKUjkefQeMW3CyWJgqXFFCCgdYW+qy8jk7rigghQPLIr/B9hJZpbQhhQOwNrG9RLbUSZWTOMBZyLSSjDQOGIftJcIVpOzRgf89hBReYoBmLtTSlNkc20uUYhu1349IuQTeNlpkY1xRQnDg952zVx9JmRhOPgSva1LxncBKJUBaC1kVzkuslVY+pIpP8bGdnYLDA2kgkmZ25txDvToX+2dcHkv0zd2izL/iRmIAw1/08IeURxEz+q1WsyBfC+5f/eoAzMKG/7DwsR89+q0eq1y+pUIIwSz4MIJwIuVMet+X9g2lPkDf2B6Rdnkv2gLXmdgOsVaXuzoHHQ4wYFHXKFztIpzUwqZL4b5UKWNdo8rqR86hXUOwrS1Lc0mMEAKjniRktunFEcmM+BFfwBfLfRi+SSGL9Qb5Q8d1WPDoMys4CWXwKZadVQ4aNGirngDa/TtL9nHcJAAAAABJRU5ErkJggg==');\n}\n.lc-dialog__main {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n}\n.lc-dialog__body {\n  flex: 1;\n  margin-inline: calc(0px - 24px);\n  padding-inline: 24px;\n  overflow: auto;\n}\n.lc-dialog__footer {\n  flex: none;\n  margin-top: 24px;\n}\n.lc-dialog__default-footer {\n  text-align: right;\n}\n.lc-dialog__default-footer .lc-button{\n  margin-left: 16px;\n}\n.lc-dialog__default-footer .lc-button:first-child{\n  margin-left: 0;\n}\n.lc-button {\n  display: inline-flex;\n  grid-column-gap: 4px;\n  align-items: center;\n  justify-content: center;\n  height: 32px;\n  padding: 0 16px;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: nowrap;\n  vertical-align: middle;\n  border: 1px solid rgba(0,0,0,0);\n  border-radius: 4px;\n  cursor: pointer;\n  transition: all .3s;\n  color: #fff;\n  background: #02b3be;\n  border-color: rgba(0,0,0,0);\n  outline: none;\n}\n.lc-button.lc-button--primary {\n  border-color: #02b3be;\n  outline: none;\n}\n.lc-button.lc-button--primary:active {\n  background: #087d85;\n  border-color: #087d85;\n}\n.lc-button--plain.lc-button--normal:not(.is-ghost) {\n  color: rgb( 4, 11, 41 );\n  background: #fff;\n  border-color: rgb( 206, 208, 216 );\n  outline: none;\n}\n.lc-button--plain.lc-button--normal:not(.is-ghost):active {\n  background: #ddd;\n}\n";
function confirm (options) {
    var confirmEl = document.createElement('div');
    confirmEl.setAttribute('class', 'lc-dialog');
    confirmEl.setAttribute('style', 'z-index: 9999;');
    confirmEl.innerHTML = "\n    <div class=\"lc-dialog__mask\"></div>\n    <div class=\"lc-dialog__container\">\n      <div class=\"lc-dialog__inner\">\n        <div class=\"lc-dialog__icon-box\">\n          <i class=\"lc-icon lc-icon_warning\"></i>\n        </div>\n        <div class=\"lc-dialog__main\">\n          <div class=\"lc-dialog__body\">" + options.contentText + "</div>\n          <div class=\"lc-dialog__footer\">\n            <div class=\"lc-dialog__default-footer\">\n              <button class=\"lc-button lc-button--normal lc-button--plain\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.cancelText + "</div>\n              </button>\n              <button class=\"lc-button lc-button--primary\" type=\"button\">\n                <div class=\"lc-button__content\">" + options.confirmText + "</div>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n   ";
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
        isValid: function () {
            return Date.now() - this.time < 30;
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
extendWindowListener.extendListeners('popstate');
function addRouter() {
    extendWindowListener.extendListeners('hashchange');
    window.addEventListener('popstate', function (event) {
        console.log(event.state);
        var state = event.state || {};
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
        var isValid = config.lastResolver.isValid();
        console.log('isValid=====', isValid);
        if (isValid) {
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
    console.log(router);
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
                    return method.apply(router, params);
                }
            });
        };
    }
}
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

exports.extendReactHistory = extendReactHistory;
exports.extendVueRouter = extendVueRouter;
exports.useLeaveConfirm = useLeaveConfirm;
//# sourceMappingURL=bundle.cjs.js.map
