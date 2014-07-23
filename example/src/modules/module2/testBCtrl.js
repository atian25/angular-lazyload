/**
 * 无需外部传入的app, 则直接执行即可
 */
define(function (require, exports, module) {
  'use strict';
  var app = require('app');

  //注册controller
  app.register.controller('testBCtrl', ['$scope', '$stateParams', '$location', '$http',
    function($scope, $stateParams, $location, $http){
      //获取页面的入参
      var id = $stateParams.id;
      $scope.id = id;
    }]
  );

});