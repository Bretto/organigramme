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
        .controller('EmployeesCtrl', function ($scope, $ionicSideMenuDelegate, $state, DataContext, ngBreeze) {
            console.log('EmployeesCtrl');

            DataContext.getAllEntities('EmployeeTagMap');
            $scope.employees = DataContext.getAllEntities('Employee');
            $scope.tags = DataContext.getAllEntities('Tag');

            $scope.search = [];

            $scope.$watchCollection(function () {
                return $scope.search;
            }, function (val) {

                var listofTags = val;
                var preds = listofTags.map(function (sp) {
                    return ngBreeze.Predicate.create("tagMaps", "any", "tag.id", "==", sp);
                });

                var whereClause = ngBreeze.Predicate.and(preds);
                var query = ngBreeze.EntityQuery.from('Employee').where(whereClause)

                var employees = DataContext.manager.executeQueryLocally(query);
                $scope.employees = employees;
                console.log($scope.employees.length);
            })
            
            

            $scope.onEmployeeAdd = function(employee){
                var state = 'dtsi.employeeNew';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSelect = function(employee){
                var state = 'dtsi.employeeId';
                var params = {employeeId: employee.id};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('EmployeeViewCtrl', function ($scope, $ionicSideMenuDelegate, $state, DataContext) {
            console.log('EmployeeViewCtrl');

            $scope.showDelete = false;

            $scope.onEdit = function(){

                var state = 'dtsi.employeeEdit';
                var params = {employeeId: $scope.currentEmployeeId};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onTagRemove = function(employeeTagMap){
                var entity = DataContext.getEntityById('EmployeeTagMap', employeeTagMap.id)[0];
                entity.entityAspect.setDeleted();
                DataContext.manager.acceptChanges();
            };

            $scope.onTagAdd = function(){
                var state = 'dtsi.tagAdd';
                var params = {employeeId: $scope.currentEmployeeId};
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
        .controller('EmployeeNewCtrl', function ($scope, $ionicSideMenuDelegate, $state, DataContext) {
            console.log('EmployeeNewCtrl');

            $scope.tempEmployee = {};

            $scope.onBack = function(){
                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSave = function(){

                var newEmployee = DataContext.newEntity('Employee', $scope.tempEmployee);

                var state = 'dtsi.employeeId';
                var params = {employeeId: newEmployee.id};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('EmployeeEditCtrl', function ($scope, $ionicSideMenuDelegate, $state, DataContext) {
            console.log('EmployeeEditCtrl');

            $scope.editEmployee = {name: $scope.currentEmployee.name};

            $scope.onBack = function(){
                var state = 'dtsi.employeeId';
                var params = {employeeId: $scope.employeeId};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSave = function(){
               $scope.currentEmployee.name = $scope.editEmployee.name;

                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onDelete = function(){
                DataContext.deleteEmployee($scope.currentEmployee);
                var state = 'dtsi.employee';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };
        });

})();

