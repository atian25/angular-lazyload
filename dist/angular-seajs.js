/*! angular-seajs - v0.3.0 - https://github.com/atian25/angular-seajs - 2013-10-20 */
/**
 * 通过[Sea.js](http://seajs.org/)动态按需加载[AngularJS](http://angularjs.org) 模块。 
 * 
 * @author TZ <atian25@qq.com>
 * @home https://github.com/atian25/angular-seajs
 */
define(function (require, exports, module) {
  'use strict';
  var ngSea = module.exports = angular.module('angular-seajs', []);

  /**
   * 由于ng的问题, bootstrap完成后就无法通过app.controller动态注册,
   * 故需保存provider的引用, 动态注册均通过 `app.register.controller`的方式。
   * service等同理。
   */
  ngSea.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
      //hold provide's refs
      ngSea.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        decorator: $provide.decorator
      };
    }
  ]).run(['$rootScope', function($rootScope){
    //console.log('init ngSea');
    patchScope($rootScope);
  }]);

  /**
   * register `$sea` service.
   * usage:
   *     app.run(['$sea', function($sea){
   *       $sea.init(app);
   *     }]);
   */
  ngSea.factory('$sea', ['$rootScope', function($rootScope){
    return {
        /**
         * 初始化
         * @param {Module} app 主模块, 若你的module不需要传入,则可以不赋值,参见两个示例的不同点
         * @param {String} eventName 事件名,默认为$routeChangeStart。支持ui-route, 修改事件名为`$stateChangeStart`即可
         */
        init: initProvider($rootScope),
        /**
         * 由于ng的问题, bootstrap完成后就无法通过app.controller动态注册,
         * 故需保存provider的引用, 动态注册均通过 `app.register.controller`的方式。
         */
        register: ngSea.register,
        loadBySeajs: loadBySeajs
      }
  }]);


  /**
   * 为$route打补丁: 存在参数controllerUrl,则通过seajs动态加载Controller
   */
  function initProvider($rootScope){
    return function(app, eventName){
      //hold refs to lazy register
      if(app && !app.register){
        app.register = ngSea.register;
      };

      //listen event to patch route item
      $rootScope.$on(eventName || '$routeChangeStart', function(e, target){
        //console.debug(e, '|', target);
        var route = target && target.$$route;
        if(route){
          route.resolve = route.resolve || {};

          //if exsit `controllerUrl` then trigger seajs async load.
          if(typeof route.controllerUrl == 'string'){
            //keypoint: use `route.resolve`
            route.resolve.loadBySeajs = loadBySeajs(route.controllerUrl, function(m){
              if(angular.isFunction(m)){
                m(app);
              }
            });
          }
        }  
      });
    }
  }

  /**
   * 通过SeaJS加载外部文件,返回promise
   */
  function loadBySeajs(url, success, error){
    return ['$q', '$rootScope' , function($q, $rootScope){
      var defer = $q.defer();
      require.async(url, function(m){
        //console.debug('loaded module `'+url+'` from '+ seajs.resolve(url));
        $rootScope.safeApply(function (){
          defer.resolve(m);
        });
      });
      return defer.promise.then(success, error);
    }];
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
});