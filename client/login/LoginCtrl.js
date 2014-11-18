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


    function axiLoginValidator($q, $timeout, OdbService, $state) {

        var directive = {
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {

            ngModel.$asyncValidators.loginValidation = isLoggedIn;

           function isLoggedIn(loginUser){
               var deferred = $q.defer();

               console.log('isLoggedIn');

               if(loginUser){

                   // call the remote service
                   //$timeout(function(){
                   //    console.log(loginUser);
                   //    deferred.reject();
                   //},1000);

                   OdbService.auth(loginUser.username, loginUser.password);

                   OdbService.query("select from ouser")
                       .then(function (res) {
                           console.log('onLogin', res);
                           deferred.resolve();
                           $state.go('api.main.employee');
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

    function axiUsernameAvailableValidator($q, $timeout) {

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

                    // call the remote service
                    $timeout(function(){
                        console.log(username);
                        //deferred.reject();
                        deferred.resolve();
                    },1000);
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