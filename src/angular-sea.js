/**
 * angular seajs
 */
define(function (require, exports, module) {
  'use strict';
  var app = module.exports = angular.module('angular-sea', []);

  /**
   * 由于ng的问题, bootstrap完成后就无法通过app.controller动态注册,
   * 故需保存provider的引用, 动态注册均通过 `app.register.controller`的方式。
   * service等同理。
   */
  app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
      //hold provide's refs
      SeaProvider.prototype.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        decorator: $provide.decorator
      };
      //register seaProvider
      $provide.provider('sea', SeaProvider);
    }
  ]).run(['$rootScope', 'sea', function($rootScope, sea){
    patchScope($rootScope);
    sea.patchRoute($rootScope);
  }]);

  /**
   * SeaProvider
   */
  function SeaProvider(){
    var eventName = '$routeChangeStart';

    /**
     * 初始化事件名
     */
    this.init = function(name){
      eventName = name || '$routeChangeStart';
    };

    this.$get = ['$rootScope', function($rootScope){
      return {
        patchRoute: patchRoute(eventName)
      }
    }];
  }

  /**
   * 通过SeaJS加载外部文件,返回promise
   */
  function loadBySeajs(url){
    return ['$q', '$rootScope' , function($q, $rootScope){
      var defer = $q.defer();
      require.async(url, function(module){
        //console.debug('loaded module `'+url+'` from '+ seajs.resolve(url));
        $rootScope.safeApply(function (){
          defer.resolve(module);
        });
      });
      return defer.promise;
    }];
  }

  /**
   * 为$route打补丁: 存在参数controllerUrl,则通过seajs动态加载Controller
   */
  function patchRoute(eventName){
    return function($rootScope){
      $rootScope.$on(eventName, function(e, target){
        //console.debug(e, '|', target);
        var route = target && target.$$route;
        if(route){
          route.resolve = route.resolve || {};

          //通过seajs动态加载Controller
          if(typeof route.controllerUrl == 'string'){
            route.resolve.loadBySeajs = loadBySeajs(route.controllerUrl);
          }
        }
      });
    }
  }

  /**
   * 为$rootScope增加safeApply方法, 安全的apply
   */
  function patchScope($rootScope){
    if(!angular.isFunction($rootScope.safeApply)){
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
  }
});