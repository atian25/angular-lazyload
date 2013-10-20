/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
  'use strict';

  module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('testACtrl', ['$scope', '$routeParams', '$location', '$http',
      function($scope, $routeParams, $location, $http){
        //获取页面的入参
        var id = $routeParams.id;
        $http.get('data/testA.json').then(function(res){
          $scope.dataObj = res;
        }, function(res){
          console.log('err', res)
        });
      }]
    );

    //注册directive,简单的渲染HTML
    app.register.directive('articleContent', function(){
      return function(scope, element, attr) {
        element.addClass('ng-binding').data('$binding', attr.articleContent);
        scope.$watch(attr.articleContent, function(value) {
          element.html(value || '');
        });
      };
    })
  }
});