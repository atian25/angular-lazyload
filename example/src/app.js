define(function(require, exports, module) {
    "use strict";
    console.log('init app...' + (new Date().getTime()));

    //Step3: add 'angular-lazyload' to your main module's list of dependencies
    var app = angular.module('app', ['angular-lazyload', 'ui.router']);
    require('./sharedService.js')(app);

    //配置期
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $urlRouterProvider.otherwise("/main");

            $stateProvider
                .state('testA', {
                    url: '/test/a',
                    views: {
                        "viewA": {
                            controller: 'testACtrl',
                            controllerUrl: 'modules/module1/testACtrl.js',
                            templateUrl: 'modules/module1/testA.tpl.html'
                        },
                        "viewAB": {
                            controller: 'testABCtrl',
                            templateUrl: 'modules/module1/testAB.tpl.html',
                            controllerUrl: 'modules/module1/testABCtrl.js'
                        }
                    }
                })
                .state('testB', {
                    url: '/test/b/:id',
                    controller: 'testBCtrl',
                    templateUrl: 'modules/module2/testB.tpl.html',
                    controllerUrl: 'modules/module2/testBCtrl.js',
                    resolve:{}
                })
                .state('main', {
                    url: '/main',
                    controller: function($scope) {
                        $scope.str = new Date()
                        //console.log($routeParams,$location)
                    },
                    template: '<div>{{str}}</div>'
                })
        }
    ])

    //运行期
    app.run(['$lazyload', 'sharedService',
        function($lazyload, sharedService) {
            //Step5: init lazyload & hold refs
            $lazyload.init(app);
            app.register = $lazyload.register;
            sharedService.test()
        }
    ]);

    module.exports = app;
});