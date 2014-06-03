(function () {
    "use strict";

    angular.module('MenuModule', [])

//        .config(function ($stateProvider, $urlRouterProvider) {
//            $stateProvider
//                .state('dtsi', {
//                    url: "/dtsi",
//                    abstract: true,
//                    templateUrl: "./src/menu/menu.html"
//                })
//                .state('dtsi.employee', {
//                    url: "/employee",
//                    views: {
//                        'menuContent': {
//                            templateUrl: "./src/grid/grid.html"
//                        }
//                    }
//                })
//                .state('dtsi.tag', {
//                    url: "/tag",
//                    views: {
//                        'menuContent': {
//                            templateUrl: "./src/tag/tag.html"
//                        }
//                    }
//                });
//
//            $urlRouterProvider.otherwise("/dtsi/employee");
//        })

        .controller('MenuCtrl', function ($scope, $ionicSideMenuDelegate, DataContext) {
            console.log('MenuCtrl');




        });

})();

