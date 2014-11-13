(function () {
    "use strict";

    angular
        .module('AppModule')
        .config(config);


    function config($stateProvider, $urlRouterProvider) {

        //puts on hold the route navigation until the data is loaded
        function appInit(AppStart){




            return AppStart.start();
        }

        function AppStartCtrl($rootScope, initData){
//            console.log("Application initialised with: ", initData);
           $rootScope.isLoading = false;
        }


        $stateProvider
            .state('api', {
                url: "/api",
                abstract: true,
                templateUrl: 'app/app.html',
                controller: AppStartCtrl,
                resolve: {initData: appInit}
            })
            .state('api.employee', {
                url: "/employee",
                views: {
                    'mainContent': {
                        templateUrl: "employee/employees.html"
                    }
                }
            })
            .state('api.employeeNew', {
                url: "/employee/new",
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-new.html"
                    }
                }
            })
            .state('api.employeeId', {
                url: '/employee/:employeeId',
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-view.html"
                    }
                }
            })
            .state('api.employeeEdit', {
                url: '/employee/:employeeId/edit',
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-edit.html"
                    }
                }
            })
            .state('api.tag', {
                url: "/tag",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tags.html"
                    }
                }
            })
            .state('api.tagNew', {
                url: "/tag/new",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-new.html"
                    }
                }
            })
            .state('api.tagEdit', {
                url: "/tag/:tagId/edit",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-edit.html"
                    }
                }
            })
            .state('api.tagAdd', {
                url: "/tag/:employeeId/add",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-add.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/api/employee");

    }


})();