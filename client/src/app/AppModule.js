(function () {
    "use strict";

    var module = angular.module('AppModule', [
        'ionic',
        'EmployeeModule',
        'TagModule',
        'MenuModule',
        'DataContext',
        'EntityModel'
    ]);

    module.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('dtsi', {
                url: "/dtsi",
                abstract: true,
                templateUrl: "./src/menu/menu.html",
                resolve: {
                    data: function ($rootScope, DataContext) {
                        $rootScope.isLoading = true;
                        return DataContext.initialize();
                    }
                }
            })
            .state('dtsi.employee', {
                url: "/employee",
                views: {
                    'menuContent': {
                        templateUrl: "./src/employee/employees.html"
                    }
                }
            })
            .state('dtsi.employeeNew', {
                url: "/employee/new",
                views: {
                    'menuContent': {
                        templateUrl: "./src/employee/employee-new.html"
                    }
                }
            })
            .state('dtsi.employeeId', {
                url: '/employee/:employeeId',
                views: {
                    'menuContent': {
                        templateUrl: "./src/employee/employee-view.html"
                    }
                }
            })
            .state('dtsi.employeeEdit', {
                url: '/employee/:employeeId/edit',
                views: {
                    'menuContent': {
                        templateUrl: "./src/employee/employee-edit.html"
                    }
                }
            })
            .state('dtsi.tag', {
                url: "/tag",
                views: {
                    'menuContent': {
                        templateUrl: "./src/tag/tags.html"
                    }
                }
            })
            .state('dtsi.tagNew', {
                url: "/tag/new",
                views: {
                    'menuContent': {
                        templateUrl: "./src/tag/tag-new.html"
                    }
                }
            })

        $urlRouterProvider.otherwise("/dtsi/employee");
    });

    module.value('ngBreeze', (function () {

        if ("breeze" in window) {
            return breeze;
        } else {
            throw new Error("The Globals breeze is missing");
        }

    })());

    module.value('ngQ', (function () {

        if ("Q" in window) {
            return Q;
        } else {
            throw new Error("The Globals Q is missing");
        }

    })());

    module.controller('AppCtrl', function ($scope, $ionicSideMenuDelegate, DataContext, ngQ) {

        console.log('AppCtrl');


        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

//        DataContext.getAllEmployeeTagMap()
//            .then(function(res){
//                console.log(res.results[0].data);
//                return DataContext.getAllTag();
//            })
//            .then(function(res){
//                console.log(res.results[0].data);
//                $scope.tags = res.results[0].data;
//                return DataContext.getAllEmployee();
//            })
//            .then(function(res){
//                console.log(res.results[0].data);
//                $scope.employees = res.results[0].data;
//            })
//            .catch(function (error) {
//                console.log(error);
//            })
//            .done(function(){
//                $scope.isLoading = false;
//                $scope.$digest();
//            });


    });

})();

