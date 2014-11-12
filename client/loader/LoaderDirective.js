(function () {
    "use strict";
    angular
        .module('AppModule')
        .directive('axiLoader', axiLoader);

    function axiLoader() {

        var directive = {
            templateUrl: 'loader/loader.html',
            restrict: 'E',
            replace: true
        };
        return directive;

    }

}());
