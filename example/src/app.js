define(function (require, exports, module) {
  "use strict";
  console.log('init app...' + (new Date().getTime()));

  //步骤二: 引入`angular-sea`作为主项目的依赖
  var app = angular.module('app', ['angular-sea', 'ngRoute']);

  //配置期
  app.config(['$routeProvider', 'seaProvider', function ($routeProvider, seaProvider) {
    //步骤三: 配置事件名 (可选), 支持ui-route, 修改事件名为`$stateChangeStart`即可
    seaProvider.init('$routeChangeStart');
    
    //步骤四: 保留provider的注册引用
    app.register = seaProvider.register;
    
    //路由映射
    //步骤五: 参见对应的controller文件示例
    $routeProvider
      .when('/test/a', {
        controller: 'testACtrl',
        controllerUrl: 'modules/module1/testACtrl.js',
        templateUrl: 'modules/module1/testA.tpl.html'
      })
      .when('/test/b/:id', {
        controller: 'testBCtrl',
        controllerUrl: 'modules/module2/testBCtrl.js',
        templateUrl: 'modules/module2/testB.tpl.html'
      })
      .when('/main', {
        controller: function($scope, $routeParams, $location){
          $scope.str = new Date()
          //console.log($routeParams,$location)
        },
        template: '<div>{{str}}</div>'
      })
      .otherwise({
        redirectTo: '/main'
      });
    }
  ]);

  module.exports = app;
});