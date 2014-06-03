(function () {
    "use strict";

    angular.module('EmployeeModule', [])
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
        .controller('EmployeesCtrl', function ($scope, $ionicSideMenuDelegate, $state) {
            console.log('EmployeesCtrl');

            $scope.onSelect = function(employee){
                var state = 'dtsi.employeeId';
                var params = {employeeId: employee.id};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('EmployeeViewCtrl', function ($scope, $ionicSideMenuDelegate, $state, DataContext) {
            console.log('EmployeeViewCtrl');

            var currentEmployeeId = $state.params.employeeId;
            $scope.currentEmployee = DataContext.getEmployeeById(currentEmployeeId)[0];

            $scope.onEdit = function(){
                var state = 'dtsi.employeeEdit';
                var params = {employeeId: currentEmployeeId};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onBack = function(){
                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('EmployeeNewCtrl', function ($scope, $ionicSideMenuDelegate, $state) {
            console.log('EmployeeNewCtrl');

            $scope.onBack = function(){
                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSave = function(){
                var state = 'dtsi.employeeId';
                var params = {employeeId: 'newId'};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('EmployeeEditCtrl', function ($scope, $ionicSideMenuDelegate, $state) {
            console.log('EmployeeEditCtrl');

            $scope.onBack = function(){
                var state = 'dtsi.employeeId';
                var params = {employeeId: $state.params.employeeId};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSave = function(){
                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };
        });

})();

