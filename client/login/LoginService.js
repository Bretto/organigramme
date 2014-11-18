(function () {
    "use strict";

    angular.module('AppModule')
        .service('LoginService', LoginService);


    function LoginService($q, $state, $location) {
        console.log('LoginService');

        var self = this;
        self.isAuthenticated = false;

        return self;
    }

}());