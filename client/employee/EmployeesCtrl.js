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

        var appInfo = vm.dataContext.getAllEntities('AppInfo')[0];
        var command = "select from AppData where @rid=" + appInfo.dataId;
        vm._ws.query(command)
            .then(function (importData) {
                console.log('importData', importData);

                vm.manager.importEntities(importData.data.result[0].data);
                vm.dataContext.importEntities();

            }, function (err) {
                console.log(err);
            });



        function onSynchronize(){

            vm.manager.acceptChanges();

            //var dataId =
            var exportData = vm.manager.exportEntities();
            var data = {data:exportData};

            //var command = "update AppData content " + JSON.stringify(data) + " UPSERT where @rid=undefined";// + entity['@rid'];
            var command = "insert into AppData content " + JSON.stringify(data);// + entity['@rid'];
            vm._ws.query(command)
                .then(function (res) {
                    var dataId = res.data.result[0]['@rid']
                    console.log('onSynchronize', res);
                }, function (err) {
                    console.log(err);
                });
        }
    }

})();