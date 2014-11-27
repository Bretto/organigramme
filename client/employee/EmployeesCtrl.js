(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeesCtrl', EmployeesCtrl);


    function EmployeesCtrl($scope, $log, ViewBaseMixin, EmployeeBaseMixin, AppDB, $q, $timeout) {

        $log = $log.getInstance("EmployeesCtrl");
        $log.info('Initialize');

        ViewBaseMixin.call(this, {name: 'EmployeesCtrl'});
        EmployeeBaseMixin.call(this, {name: 'EmployeesCtrl', scope: $scope});
        var vm = this;
        vm.onSynchronize = onSynchronize;
        vm.onGoto = onGoto;

        function onGoto(state, params, options) {
            $scope.shared.isOpened = false;
            vm._onGoto(state, params, options);
        }

        function remoteSaveAppData() {

            var deferred = $q.defer();
            var exportData = vm.dataContext.doLocalSave();
            var data = {data: exportData};

            var command = "update AppData MERGE " + JSON.stringify(data) + " where @rid=" + vm.dataContext.appInfo.dataId;
            vm._ws.query(command)
                .then(function (res) {
                    vm.dataContext.appInfo.isSynchronized = true;
                    vm.dataContext.doLocalSave();
                    deferred.resolve();

                }, function (err) {
                    console.log(err);
                    vm.loginService.isAuthenticated = false;
                    vm.loginService.isOnline = false;
                    deferred.reject();
                });

            return deferred.promise;
        }


        function getNonSavedImages() {
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


        //function onSynchronize() {
        //
        //    remoteSaveAppData()
        //        .then(function () {
        //            console.log('getNonSavedImages');
        //            return getNonSavedImages();
        //        })
        //        .then(function (res) {
        //            console.log('batch remoteSaveImageData');
        //
        //            //return $q.all(res)
        //            //_.forEach(res, function (image) {
        //            //    vm.remoteSaveImageData(image);
        //            //});
        //        });
        //
        //    console.log('Synchronized !');
        //}

        function onSynchronize() {

            remoteSaveAppData()
                .then(function () {
                    console.log('getNonSavedImages');
                    return getFakeNonSavedImages();
                })
                .then(function (rows) {
                    console.log('batch remoteSaveImageData');

                    var promises = [];

                    for (var i = 1; i < 10; i++) {
                       promises.push(closureWrap(i)());
                    }

                    return $q.all(promises);
                })
                .then(function () {
                   console.log('complete');
                });

            console.log('Synchronized !');
        }


        function closureWrap(idx){
            return function traceIdx(){
                var deferred = $q.defer();
                $timeout(function(){
                    console.log(idx);
                    deferred.resolve();
                }, Math.random()*1000);
                return deferred.promise;
            };
        }


        function getFakeNonSavedImages() {
            var deferred = $q.defer();

            $timeout(function(){
                var rows = [];
                for (var i = 1; i < 10; i++) {
                    var row = {id:i, data:'data '+i};
                    rows.push(row);
                }
                deferred.resolve(rows);
            },1000);

            return deferred.promise;
        }




    }

})();