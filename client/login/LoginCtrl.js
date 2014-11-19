(function () {
    "use strict";

    angular.module('AppModule')
        .controller('LoginCtrl', LoginCtrl)
        .directive('compareToValidator', compareToValidator)
        .directive('axiLoginValidator', axiLoginValidator)
        .directive('axiUsernameAvailableValidator', axiUsernameAvailableValidator);


    function LoginCtrl($scope, $log, ViewBaseMixin) {

        $log = $log.getInstance("LoginCtrl");
        $log.info('LoginCtrl');

        ViewBaseMixin.call(this, {name: 'LoginCtrl'});
        var vm = this;
        vm.onLogin = onLogin;
        vm.onRegister = onRegister;

        function onLogin(loginUser){

            var form = $scope.submitLoginForm;
            // the copy is to associated a new promise with the loginValidation each time
            // otherwise the form thinks it's the same object and don't trigger the $asyncValidators
            form.loginValidation.$setViewValue(angular.copy(loginUser));
        }

        function onRegister(registerUser){

            vm._ws.query("insert into ouser set name = '" + registerUser.username + "', status = 'ACTIVE', password = '" + registerUser.password + "' , roles = [#4:2]")
                .then(function (res) {
                    console.log('onRegister', res);
                    $scope.flip = false;
                }, function (err) {
                    console.log(err);
                });
        }

    }


    function compareToValidator() {

        var directive = {
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            scope.$watch(attrs.compareToValidator, function () {
                ngModel.$validate();
            });

            ngModel.$validators.compareTo = function (value) {
                var other = scope.$eval(attrs.compareToValidator);
                return !value || !other || value === other;
            };
        }
    }


    function axiLoginValidator($q, OdbService, $state, LoginService, DataContext) {

        var directive = {
            link: link,
            require: 'ngModel'
        };
        return directive;

        function setDataId(deferred){

            DataContext.manager.acceptChanges();
            var exportData = DataContext.manager.exportEntities();
            var data = {data:exportData};

            var command = "insert into AppData content " + JSON.stringify(data);// + entity['@rid'];
            OdbService.query(command)
                .then(function (res) {
                    var dataId = res.data.result[0]['@rid'];
                    var appInfo = DataContext.getAllEntities('AppInfo')[0];
                    appInfo.dataId = dataId;

                    console.log('saved appInfo dataId', appInfo);

                    LoginService.isAuthenticated = true;
                    $state.go('api.main.employee');
                    deferred.resolve();

                }, function (err) {
                    console.log(err);
                });

        }


        function link(scope, element, attrs, ngModel) {

            ngModel.$asyncValidators.loginValidation = isLoggedIn;

           function isLoggedIn(loginUser){
               var deferred = $q.defer();

               console.log('isLoggedIn');

               if(loginUser){

                   OdbService.auth(loginUser.username, loginUser.password);

                   OdbService.query("select from ouser")
                       .then(function (res) {
                           console.log('onLogin', res);
                           var appInfo = DataContext.getAllEntities('AppInfo')[0];
                           if(appInfo.dataId){
                               LoginService.isAuthenticated = true;
                               $state.go('api.main.employee');
                               deferred.resolve();
                           }else{
                               setDataId(deferred);
                           }


                       }, function (err) {
                           LoginService.isAuthenticated = false;
                           deferred.reject();
                       });

               }else{
                   deferred.resolve();
               }

               return deferred.promise;
           }

        }
    }

    function axiUsernameAvailableValidator($q, $timeout, OdbService) {

        var directive = {
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {

            ngModel.$asyncValidators.usernameAvailable = isUsernameAvailable;

            function isUsernameAvailable(username){
                var deferred = $q.defer();

                if(username){

                    OdbService.query("select from OUser where name = '" + username + "'")
                        .then(function (res) {

                            if(res.data.result.length === 0){
                                deferred.resolve();
                            }else{
                                deferred.reject();
                            }

                        }, function (err) {
                            deferred.reject();
                        });

                }else{
                    deferred.resolve();
                }

                return deferred.promise;
            }
        }
    }

}());


//
//_.forEach(angular.module("AppModule")._invokeQueue, function(dep){
//    console.log(dep[2]);
//});