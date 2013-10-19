/**
 * 无需外部传入的app, 则直接执行即可
 */
define(function (require, exports, module) {
  'use strict';
  var app = require('app');

  //注册controller
  app.register.controller('testBCtrl', ['$scope', '$routeParams', '$location', '$http',
    function($scope, $routeParams, $location, $http){
      //获取页面的入参
      var id = $routeParams.id;
      $scope.id = id;
    }]
  );

});