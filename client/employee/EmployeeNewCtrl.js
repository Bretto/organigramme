(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeeNewCtrl', EmployeeNewCtrl);


    function EmployeeNewCtrl($scope, ViewBaseMixin, EmployeeBaseMixin) {
        console.log('EmployeeNewCtrl');

        ViewBaseMixin.call(this, {name: 'EmployeeNewCtrl'});
        EmployeeBaseMixin.call(this, {name: 'EmployeeNewCtrl', scope:$scope});

        var vm = this;

        vm.tempEmployee = {};
        vm.onSave = onSave;
        vm.takePicture = takePicture;

        function onSave(state) {

            vm.dataContext.appInfo.isSynchronized = false;

            if ($scope.currentPictureSelected) {

                var picture = {
                    id: vm.dataContext.appInfo.username + '_' + $scope.currentPictureSelected.id,
                    data: $scope.currentPictureSelected.data
                };

                vm.dataContext.localSaveImageData(picture.id, 0, picture.data)
                    .then(function () {
                        vm.remoteSaveImageData(picture);
                        vm.tempEmployee.picture = picture.id;
                        saveComplete(state);
                    });

            } else {
                saveComplete(state);
            }
        }

        function saveComplete(state){
            vm.dataContext.newEntity('Employee', vm.tempEmployee);
            vm.dataContext.appInfo.isSynchronized = false;
            vm.dataContext.doLocalSave();
            vm._onGoto(state);
        }

        function takePicture() {
            angular.element('#cameraInput').trigger('click');
        }

    }

})();