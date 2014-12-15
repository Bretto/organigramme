(function () {
    "use strict";

    angular.module('AppModule')
        .directive('compareToValidator', compareToValidator)
        .directive('axiLoginValidator', axiLoginValidator)
        .directive('axiUsernameAvailableValidator', axiUsernameAvailableValidator);


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

        function link(scope, element, attrs, ngModel) {

            ngModel.$asyncValidators.loginValidation = isLoggedIn;

            function isLoggedIn(loginUser) {
                var deferred = $q.defer();

                if (loginUser) {
                    LoginService.doLogin(loginUser, deferred);
                } else {
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

            function isUsernameAvailable(username) {
                var deferred = $q.defer();

                if (username) {

                    OdbService.query(OdbService.isUsernameAvailable(username))
                        .then(function (res) {

                            if (res.data.result.length === 0) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }

                        }, function (err) {
                            deferred.reject();
                        });

                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            }
        }
    }


}());