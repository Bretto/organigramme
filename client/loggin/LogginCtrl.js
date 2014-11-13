(function () {
    "use strict";

    angular.module('AppModule')
        .controller('LogginCtrl', LogginCtrl)
        .directive('compareToValidator', compareToValidator)

    function LogginCtrl($scope, $log, ViewBaseMixin) {

        $log = $log.getInstance("LogginCtrl");
        $log.info('LogginCtrl');

        ViewBaseMixin.call(this, {name: 'LogginCtrl'});
        var vm = this;

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

}());


//
//_.forEach(angular.module("AppModule")._invokeQueue, function(dep){
//    console.log(dep[2]);
//});