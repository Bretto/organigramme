(function () {
    "use strict";

    angular
        .module('AppModule')
        .config(config)
        .run(run)



    function config($stateProvider, $urlRouterProvider) {

        //puts on hold the route navigation until the data is loaded
        function appInit(AppStart){
            return AppStart.start();
        }

        function AppStartCtrl($rootScope, dataPromise){
           console.log("Application initialised with: ", dataPromise.data);
           $rootScope.isLoading = false;
        }

        //puts on hold the route navigation until the user is authenticated
        function authenticateUser(LoginService){
            return LoginService.isAuthenticated();
        }

        function AuthenticateCtrl(authenticatePromise, $state, $urlRouter){

            if(authenticatePromise.isAuthenticated){
                console.log('user is Authenticated');
            }else{
                $state.go('api.login');
            }
        }


        $stateProvider
            .state('api', {
                abstract: true,
                url: "/api",
                template: '<ui-view></ui-view>',
                controller: AppStartCtrl,
                resolve: {dataPromise: appInit}
            })
            .state('api.login', {
                url: "/login",
                templateUrl: 'login/login.html'
            })
            .state('api.main', {
                abstract: true,
                url: "/main",
                templateUrl: 'app/app.html'
            })
            .state('api.main.employee', {
                url: "/employee",
                views: {
                    'mainContent': {
                        templateUrl: "employee/employees.html"
                    }
                }
            })
            .state('api.main.employeeNew', {
                url: "/employee/new",
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-new.html"
                    }
                }
            })
            .state('api.main.employeeId', {
                url: '/employee/:employeeId',
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-view.html"
                    }
                }
            })
            .state('api.main.employeeEdit', {
                url: '/employee/:employeeId/edit',
                views: {
                    'mainContent': {
                        templateUrl: "employee/employee-edit.html"
                    }
                }
            })
            .state('api.main.tag', {
                url: "/tag",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tags.html"
                    }
                }
            })
            .state('api.main.tagNew', {
                url: "/tag/new",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-new.html"
                    }
                }
            })
            .state('api.main.tagEdit', {
                url: "/tag/:tagId/edit",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-edit.html"
                    }
                }
            })
            .state('api.main.tagAdd', {
                url: "/tag/:employeeId/add",
                views: {
                    'mainContent': {
                        templateUrl: "tag/tag-add.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/api/login");

    }

    function run($rootScope, $urlRouter, LoginService, $state){
        $rootScope.$on('$locationChangeSuccess', function(evt) {
            // Halt state change from even starting
            evt.preventDefault();
            // Perform custom logic
            var isAuthenticated = false;//LoginService.isAuthenticated()
            // Continue with the update and state transition if logic allows
            if (isAuthenticated){
                $urlRouter.sync();
            }else{
                $state.go('api.login');
            }


        });
    }


})();