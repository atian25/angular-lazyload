define(function (require, exports, module) {
  "use strict";
  console.log('init app...' + (new Date().getTime()));

  //Step3: add 'angular-lazyload' to your main module's list of dependencies
  var app = angular.module('app', ['angular-lazyload', 'ngRoute']);
  require('./sharedService.js')(app);

  //配置期
  app.config(['$routeProvider', function($routeProvider) {    
    //Step4: add `controllerUrl` to your route item config
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
  app.run(['$lazyload', 'sharedService', function($lazyload, sharedService){
    //Step5: init lazyload & hold refs
    $lazyload.init(app);
    app.register = $lazyload.register;
    sharedService.test()
  }]);

  module.exports = app;
});