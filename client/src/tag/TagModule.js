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
        .controller('TagsCtrl', function ($scope, $ionicSideMenuDelegate, DataContext, ngBreeze, $state) {
            console.log('TagsCtrl');

            var manager = DataContext.manager;
            var EntityQuery = ngBreeze.EntityQuery;

            var query = EntityQuery.from('Tag');
            $scope.tags = manager.executeQueryLocally(query);

            $scope.onTagDelete = function(tag){
                DataContext.deleteTag(tag);
                $scope.tags = manager.executeQueryLocally(query);
            };

            $scope.onTagNew = function(tag){
                var state = 'dtsi.tagNew';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('TagViewCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagViewCtrl');
        })
        .controller('TagEditCtrl', function ($scope, $ionicSideMenuDelegate) {
            console.log('TagEditCtrl');
        })
        .controller('TagAddCtrl', function ($scope, $ionicSideMenuDelegate, DataContext, $state, ngBreeze) {
            console.log('TagAddCtrl');

            var currentEmployeeId = $state.params.employeeId;


            var manager = DataContext.manager;
            var EntityQuery = ngBreeze.EntityQuery;

            var query = EntityQuery.from('Tag');
            $scope.tags = manager.executeQueryLocally(query);


            $scope.isTagSelectable = function(tag){
                var res = $scope.currentEmployee.tagMaps.filter(function(empTagMap){
                    return empTagMap.tag === tag;
                });
                return !!res.length;
            }

            $scope.onTagSelect = function (tag) {
                DataContext.newEntity('EmployeeTagMap', { employee_id: currentEmployeeId, tag_id: tag.id});

                var state = 'dtsi.employeeId';
                var params = {employeeId: currentEmployeeId};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onCancel = function (tag) {
                var state = 'dtsi.employeeId';
                var params = {employeeId: currentEmployeeId};
                var options = {};

                $state.go(state, params, options);
            };
        })
        .controller('TagNewCtrl', function ($scope, $ionicSideMenuDelegate, DataContext, $state, ngBreeze) {
            console.log('TagNewCtrl');

            var manager = DataContext.manager;
            var EntityQuery = ngBreeze.EntityQuery;

            var query = EntityQuery.from('Tag');
            $scope.tags = manager.executeQueryLocally(query);

            $scope.tempTag = {};

            $scope.isDisabled = function(name){
                if(!name) return;
                var query = EntityQuery.from('Tag').where('name', '==', name);
                var res = manager.executeQueryLocally(query);
                return !!res.length;
            }


            $scope.onTagSelect = function (tag) {
                $scope.tempTag.name = tag.name;
            };

            $scope.onBack = function(){
                var state = 'dtsi.tag';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };

            $scope.onSave = function(){

                var newEmployee = DataContext.newEntity('Tag', $scope.tempTag);

                var state = 'dtsi.tag';
                var params = {};
                var options = {};

                $state.go(state, params, options);
            };
        });


})();

