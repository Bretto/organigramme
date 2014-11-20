(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeesCtrl', EmployeesCtrl);


    function EmployeesCtrl($scope, $log, ViewBaseMixin) {

        $log = $log.getInstance("EmployeesCtrl");
        $log.info('Initialize');

        ViewBaseMixin.call(this, {name: 'EmployeesCtrl'});
        var vm = this;
        vm.onSynchronize = onSynchronize;

        function onSynchronize(){

            var exportData = vm.dataContext.exportEntities();
            var data = {data:exportData};

            var command = "update AppData content " + JSON.stringify(data) + " where @rid=" + vm.dataContext.appInfo.dataId;
            vm._ws.query(command)
                .then(function (res) {
                    vm.dataContext.appInfo.isSynchronized = true;
                    // Attention exception calling the Base Class to set isSynchronized = true;
                    vm.dataContext._exportEntities();
                    console.log('Synchronized !');

                }, function (err) {
                    console.log(err);
                });
        }
    }

})();