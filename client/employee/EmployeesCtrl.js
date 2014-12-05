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




        function onSynchronize() {

            vm.dataContext.remoteSaveAppData()
                .then(function () {
                    console.log('getNonSavedImages');
                    return vm.dataContext.getNonSavedImages();
                })
                .then(function (res) {
                    console.log('batch remoteSaveImageData');

                    var promises = [];
                    _.forEach(res, function (image) {
                        promises.push(vm.remoteSaveImageData(image));
                    });

                    return $q.all(promises);
                })
                .then(function () {
                    console.log('Synchronized !');
                });

        }

        //function onSynchronize() {
        //
        //    remoteSaveAppData()
        //        .then(function () {
        //            console.log('getNonSavedImages');
        //            return getFakeNonSavedImages();
        //        })
        //        .then(function (rows) {
        //            console.log('batch remoteSaveImageData');
        //
        //            var promises = [];
        //
        //            for (var i = 1; i < 10; i++) {
        //               promises.push(closureWrap(i)());
        //            }
        //
        //            return $q.all(promises);
        //        })
        //        .then(function () {
        //           console.log('complete');
        //        });
        //
        //    console.log('Synchronized !');
        //}
        //
        //
        //function closureWrap(idx){
        //    return function traceIdx(){
        //        var deferred = $q.defer();
        //        $timeout(function(){
        //            console.log(idx);
        //            deferred.resolve();
        //        }, Math.random()*1000);
        //        return deferred.promise;
        //    };
        //}
        //
        //
        //function getFakeNonSavedImages() {
        //    var deferred = $q.defer();
        //
        //    $timeout(function(){
        //        var rows = [];
        //        for (var i = 1; i < 10; i++) {
        //            var row = {id:i, data:'data '+i};
        //            rows.push(row);
        //        }
        //        deferred.resolve(rows);
        //    },1000);
        //
        //    return deferred.promise;
        //}




    }

})();