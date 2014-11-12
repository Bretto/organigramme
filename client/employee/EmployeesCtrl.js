(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeesCtrl', EmployeesCtrl);


    function EmployeesCtrl($scope, $log, ViewBaseMixin) {

        $log = $log.getInstance("EmployeesCtrl");
        $log.info('Initialize');

        ViewBaseMixin.call(this, {name: 'EmployeesCtrl'});
        var vm = this;

    }

})();