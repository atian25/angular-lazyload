define(function (require, exports, module) {
  "use strict";
  console.log('init app...' + (new Date().getTime()));

  //步骤二: 把`angular-sea`注册为主项目的依赖
  var app = angular.module('app', ['angular-seajs', 'ngRoute']);

  //配置期
  app.config(['$routeProvider', function($routeProvider) {    
    //路由映射
    //步骤四: 提供controllerUrl, 参见对应的controller文件示例
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

  //运行期
  app.run(['$sea', function($sea){
    //步骤三: 初始化
    $sea.init(app);
  }]);

  module.exports = app;
});