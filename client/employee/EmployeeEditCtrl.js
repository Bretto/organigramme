(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeeEditCtrl', EmployeeEditCtrl);


    function EmployeeEditCtrl($scope, ViewBaseMixin, EmployeeBaseMixin, AppDB) {
        console.log('EmployeeEditCtrl');

        ViewBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope:$scope});
        EmployeeBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope:$scope});

        var vm = this;

        vm.onSave = onSave;
        vm.onBack = onBack;
        vm.onDelete = onDelete;
        vm.takePicture = takePicture;

        function onDelete(state) {
            vm.dataContext.deleteEmployee(vm.currentEmployee);
            vm._onGoto(state);
        }

        function takePicture() {
            angular.element('#cameraInput').trigger('click');
        }

        function onSave(state, params, options) {
            if($scope.currentPictureSelected){
                var id = vm.dataContext.appInfo.username +'_'+$scope.currentPictureSelected.id;
                var data = $scope.currentPictureSelected.data;
                localSaveImageData(id,data);
            }

            vm._onSave(state, params, options);
        }

        function onBack() {
            if (vm.isModified(vm.currentEmployee)) {
                vm.currentEmployee.entityAspect.rejectChanges();
            }

            vm._onGoto('api.main.employeeId', {employeeId: vm.currentEmployee.id, isBack:true});
        }

        function localSaveImageData(id, data) {
            AppDB.transaction(
                function (tx) {
                    tx.executeSql(
                        "INSERT OR REPLACE INTO Picture (id, saved, data) VALUES (?, ?, ?)",
                        [id, 0, data],
                        function (tx, result) {
                            console.log("Query Success");
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
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
        }


    }

})();