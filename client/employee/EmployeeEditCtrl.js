(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeeEditCtrl', EmployeeEditCtrl);


    function EmployeeEditCtrl($scope, ViewBaseMixin, EmployeeBaseMixin) {
        console.log('EmployeeEditCtrl');

        ViewBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope:$scope});
        EmployeeBaseMixin.call(this, {name: 'EmployeeEditCtrl', scope:$scope});

        var vm = this;

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

        function onBack() {
            if (vm.isModified(vm.currentEmployee)) {
                vm.currentEmployee.entityAspect.rejectChanges();
            }

            vm._onGoto('api.main.employeeId', {employeeId: vm.currentEmployee.id, isBack:true});
        }




    }

})();