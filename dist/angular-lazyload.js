/*! angular-lazyload - v0.4.0 - https://github.com/atian25/angular-lazyload - 2013-10-21 */
/**
 * A lazyload service for angular projects, only load-on-demand, support seajs/requirejs/custom.
 * support [Sea.js](http://seajs.org/) & [RequireJS](http://requirejs.org/‎)
 * 
 * @author TZ <atian25@qq.com>
 * @home https://github.com/atian25/angular-lazyload
 */
(function(global, undefined) {
  'use strict';

  /**
   * register `angular-lazyload` module & `$lazyload` service
   */
  angular.module('angular-lazyload', [], ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
      //register `$lazyload` service
      $provide.factory('$lazyload', ['$rootScope', '$q', function($rootScope, $q){
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
      }]);
    }
  ]);

  /**
   * $lazyload Service
   */
  function LazyLoadProvider($rootScope, $q, register){
    //patch the $rootScope, add `safeApply` function.
    patchScope($rootScope);

    /**
     * hold provide's refs, because after ng bootstrap, you can't use `app.controller` to dynamic register controller.
     */
    this.register = register;

    /**
     * @param {Object} params This will pass to the lazy load module
     * @param {String} eventName Default to `$routeChangeStart`, //TODO: support `ui-route`
     * @param {Function/String} loaderType The loader function: //FIXME: only support `seajs` current.
     *   - 'seajs' :  default value, use [Sea.js](http://seajs.org/) to async load modules
     *   - 'requirejs': use [RequireJS](http://requirejs.org/‎) to async load modules
     *   - {Function} : custom loader function:
     *       - route : current route item
     *       - callback : callback function when async load success
     */
    this.init = function(params, eventName, loaderType){
      //get loaderFn: if loaderType is function, then just use it, else use build in loader by loaderType, default to seajs
      var loaderFn = angular.isFunction(loaderType) ? loaderType : this.loaders[loaderType] || this.loaders['seajs'];

      //listen to route change event to hook
      $rootScope.$on(eventName || '$routeChangeStart', function(e, target){
        //console.debug(e, '|', target);
        var route = target && target.$$route;
        if(route){
          route.resolve = route.resolve || {};
          //keypoint: use `route.resolve`
          route.resolve.loadedModule = function(){
            var defer = $q.defer();
            loaderFn(route, function(m){
              $rootScope.safeApply(function(){
                defer.resolve(angular.isFunction(m) ? m(params) : m);
              });
            });
            return defer.promise;
          }
        }  
      });  
    }
  }

  /**
   * build-in loaders 
   */
  LazyLoadProvider.prototype.loaders = {};
  LazyLoadProvider.prototype.loaders['seajs'] = function(route, callback){
    //if exsit `controllerUrl` then trigger seajs async load.
    if(typeof route.controllerUrl == 'string'){
      seajs.use(route.controllerUrl, callback);
    }
  }

  LazyLoadProvider.prototype.loaders['requirejs'] = function(route, callback){
    //if exsit `controllerUrl` then trigger requirejs async load.
    if(typeof route.controllerUrl == 'string'){
      require(route.controllerUrl, callback);
    }
  }

  /**
   * 为$rootScope增加safeApply方法, 安全的apply
   */
  function patchScope($rootScope){
    $rootScope.safeApply = function(fn){
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }
})(this);