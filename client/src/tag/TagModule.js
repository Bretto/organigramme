(function () {
    "use strict";

    angular.module('TagModule', [])

        .config(function ($stateProvider, $urlRouterProvider) {

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
        })
        .controller('TagsCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagsCtrl');
        })
        .controller('TagViewCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagViewCtrl');
        })
        .controller('TagEditCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagEditCtrl');
        })
        .controller('TagNewCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagNewCtrl');
        });


})();

