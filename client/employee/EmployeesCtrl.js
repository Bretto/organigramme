(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeesCtrl', EmployeesCtrl);


    function EmployeesCtrl($scope, $log, ViewBaseMixin, EmployeeBaseMixin, AppDB, $q) {

        $log = $log.getInstance("EmployeesCtrl");
        $log.info('Initialize');

        ViewBaseMixin.call(this, {name: 'EmployeesCtrl'});
        EmployeeBaseMixin.call(this, {name: 'EmployeesCtrl', scope:$scope});
        var vm = this;
        vm.onSynchronize = onSynchronize;
        vm.onGoto = onGoto;

        function onGoto(state, params, options) {
            $scope.shared.isOpened = false;
            vm._onGoto(state, params, options);
        }

        function remoteSaveAppData() {
            var exportData = vm.dataContext.doLocalSave();
            var data = {data: exportData};

            var command = "update AppData MERGE " + JSON.stringify(data) + " where @rid=" + vm.dataContext.appInfo.dataId;
            vm._ws.query(command)
                .then(function (res) {
                    vm.dataContext.appInfo.isSynchronized = true;
                    vm.dataContext.doLocalSave();
                    console.log('Synchronized !');

                }, function (err) {
                    console.log(err);
                    vm.loginService.isAuthenticated = false;
                    vm.loginService.isOnline = false;
                });
        }


        function getNonSavedImages(id) {
            var deferred = $q.defer();

            AppDB.transaction(
                function (tx) {
                    tx.executeSql(
                        "SELECT * FROM Picture WHERE saved= ? AND id != 'tempPic'",
                        [0],
                        function (tx, results) {
                            var rows = [];
                            for (var i = 0; i < results.rows.length; i++) {
                                var row = results.rows.item(i);
                                rows.push(row);
                            }
                            deferred.resolve(rows);
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
                            deferred.reject();
                        }
                    );
                },
                function (error) {
                    console.log("Transaction Error: " + error.message);
                },
                function () {
                    console.log("Transaction Success");
                }
            );

            return deferred.promise;
        }


        function remoteSaveImages() {
            getNonSavedImages()
                .then(function (res) {
                    _.forEach(res, function (image) {
                        vm.remoteSaveImageData(image);
                    });
                });
        }


        function onSynchronize() {

            remoteSaveAppData();
            remoteSaveImages();

        }
    }

})();