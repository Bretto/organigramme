(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeeEditCtrl', EmployeeEditCtrl);


    function EmployeeEditCtrl($scope, ViewBaseMixin, EmployeeBaseMixin) {
        console.log('EmployeeEditCtrl');

        ViewBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope: $scope});
        EmployeeBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope: $scope});

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

            vm.dataContext.appInfo.isSynchronized = false;

            if ($scope.currentPictureSelected) {

                var picture = {
                    id: vm.dataContext.appInfo.username + '_' + $scope.currentPictureSelected.id,
                    data: $scope.currentPictureSelected.data
                };

                vm.dataContext.localSaveImageData(picture.id, 0, picture.data)
                    .then(function () {
                        vm.remoteSaveImageData(picture);
                        vm.currentEmployee.picture = picture.id;
                        vm._onSave(state, params, options);
                    });

            } else {
                vm._onSave(state, params, options);
            }


        }

        function onBack() {
            if (vm.isModified(vm.currentEmployee)) {
                vm.currentEmployee.entityAspect.rejectChanges();
            }

            vm._onGoto('api.main.employeeId', {employeeId: vm.currentEmployee.id, isBack: true});
        }





    }

})
();