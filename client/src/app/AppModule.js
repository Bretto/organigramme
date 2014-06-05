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
                        return DataContext.initialize()
                            .then(function (res) {
                                $rootScope.isLoading = false;
                            });
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
            .state('dtsi.tagAdd', {
                url: "/tag/:employeeId/add",
                views: {
                    'menuContent': {
                        templateUrl: "./src/tag/tag-add.html"
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


    module.directive('setect2Tags', function ($parse) {

        function link(scope, elem, attrs) {
            var data = [];
            var options;

            elem.select2({
                data: function () {
                    return {results: data};
                },
                multiple: true
            });

            elem.on('select2-opening', function () {
                options = $parse(attrs['setect2Tags'])(scope);
                var tags = options.data;
                if (tags) {

                    var formatData = tags.map(function (tag) {
                        return {id: tag.id, text: tag.name};
                    });

                    data = formatData;
                }
            });

            elem.on('change', function (e) {
                options.result.length = 0;
                angular.forEach(e.val, function (elem) {
//                    options.result.push(elem);
                    scope.search.push(elem);
                });
                //hack to refresh the parent scope due to the isolated context that 'ion-content' generates
                scope.$parent.$digest();
//                scope.$digest();
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    });

    module.controller('AppCtrl', function ($scope, $ionicSideMenuDelegate, DataContext, ngQ, $rootScope, $state) {

        console.log('AppCtrl');


        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {

                if ($state.params.employeeId) {
                    $scope.currentEmployeeId = $state.params.employeeId;
                    $scope.currentEmployee = DataContext.getEntityById('Employee', $state.params.employeeId)[0];
                }

            });


    });

})();

