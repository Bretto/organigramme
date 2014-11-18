(function () {
    "use strict";

    angular.module('AppModule')
        .service('LoginService', LoginService);


    function LoginService($q, $state, $location) {
        console.log('LoginService');

        var self = this;
        self.isAuthenticated = isAuthenticated;

        function isAuthenticated(){
            var deferred = $q.defer();
            deferred.resolve({isAuthenticated:false});

            return deferred.promise;
        }

        return self;
    }

}());