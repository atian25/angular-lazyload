/*! angular-lazyload - v0.4.0 - https://github.com/atian25/angular-lazyload - 2014-07-23 */
/*! angular-lazyload - v0.4.0 - https://github.com/atian25/angular-lazyload - 2014-07-23 */
/*! angular-lazyload - v0.4.0 - https://github.com/atian25/angular-lazyload - 2013-10-28 */
/**
 * A lazyload service for angular projects, only load-on-demand, support seajs/requirejs/custom.
 * support [Sea.js](http://seajs.org/) & [RequireJS](http://requirejs.org/‎)
 *
 * @author TZ <atian25@qq.com>
 * @home https://github.com/atian25/angular-lazyload
 *
 * modify by lingyu.csh@taobao.com
 * `angular-ui-router` replace `angular-route`
 * `stateChangeStart` eventType replace `routeChangeStart`
 */
(function(global, undefined) {
    'use strict';

    /**
     * register `angular-lazyload` module & `$lazyload` service
     */
    angular.module('angular-lazyload', [], ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function($controllerProvider, $compileProvider, $filterProvider, $provide) {
            //register `$lazyload` service
            $provide.factory('$lazyload', ['$rootScope', '$q',
                function($rootScope, $q) {
                    //hold provide's refs, because after ng bootstrap, you can't use `app.controller` to dynamic register controller.
                    var register = {
                        controller: $controllerProvider.register,
                        directive: $compileProvider.directive,
                        filter: $filterProvider.register,
                        factory: $provide.factory,
                        service: $provide.service,
                        decorator: $provide.decorator
                    };
                    return new LazyLoadProvider($rootScope, $q, register);
                }
            ]);
        }
    ]);

    /**
     * $lazyload Service
     */
    function LazyLoadProvider($rootScope, $q, register) {
        //patch the $rootScope, add `safeApply` function.
        patchScope($rootScope);

        /**
         * hold provide's refs, because after ng bootstrap, you can't use `app.controller` to dynamic register controller.
         */
        this.register = register;

        /**
         * @param {Object} params This will pass to the lazy load module
         * @param {String} eventName Default to `$stateChangeStart`,
         * @param {Function/String} loaderType The loader function: //FIXME: only support `seajs` current.
         *   - 'seajs' :  default value, use [Sea.js](http://seajs.org/) to async load modules
         *   - 'requirejs': use [RequireJS](http://requirejs.org/‎) to async load modules
         *   - {Object} : custom loader:
         *     - check {Function} Optional , check whether need to load by loader
         *     - load {Function}
         *       - route : current route item
         *       - register: register refs object
         *       - callback : callback function when async load success
         */
        this.init = function(params, loaderType) {
            //get loaderFn: if loaderType is function, then just use it, else use build in loader by loaderType, default to seajs
            var loader = angular.isObject(loaderType) ? loaderType : this.loaders[loaderType] || this.loaders['seajs'];

            //listen to route change event to hook
            $rootScope.$on('$stateChangeStart', function(ev, to) {

                var toState = to;
                /**
                 * add resolve
                 */
                var addResolve = function(object) {
                    object.resolve = object.resolve || {};
                    //keypoint: use `route.resolve`
                    object.resolve.loaded = function() {
                        var defer = $q.defer();
                        loader.load(object, function(m) {
                            $rootScope.safeApply(function() {
                                defer.resolve(angular.isFunction(m) ? m(params, register) : m);
                            });
                        }, function(m) {
                            $rootScope.safeApply(function() {
                                defer.reject(m);
                            });
                        });
                        return defer.promise;
                    }
                }

                if (toState) {
                    // if loader provide check(), then check it
                    if (!angular.isFunction(loader.check) || loader.check(toState)) {
                        addResolve(toState);
                    }
                }
                //state views
                for (var key in toState.views) {
                    // if loader provide check(), then check it
                    if (!angular.isFunction(loader.check) || loader.check(toState.views[key])) {
                        addResolve(toState.views[key]);
                    }
                }

            });
        }
    }

    /**
     * build-in loaders
     */
    LazyLoadProvider.prototype.loaders = {};

    LazyLoadProvider.prototype.loaders['seajs'] = {
        check: function(route) {
            //if exsit `controllerUrl` then trigger seajs async load.
            return typeof route.controllerUrl == 'string'
        },
        load: function(route, suc, fail) {
            seajs.use(route.controllerUrl, function(m) {
                if (angular.isUndefined(m)) {
                    fail(m);
                } else {
                    suc(m);
                }
            });
        }
    }

    LazyLoadProvider.prototype.loaders['requirejs'] = {
        check: function(route) {
            //if exsit `controllerUrl` then trigger requirejs async load.
            return typeof route.controllerUrl == 'string'
        },
        load: function(route, suc, fail) {
            require(route.controllerUrl, function(m) {
                if (angular.isUndefined(m)) {
                    fail(m);
                } else {
                    suc(m);
                }
            });
        }
    }

    /**
     * 为$rootScope增加safeApply方法, 安全的apply
     */
    function patchScope($rootScope) {
        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
    }

})(this);