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
            vm.dataContext.newEntity('Employee', vm.tempEmployee);
            vm.dataContext.exportEntities();
            vm._onGoto(state);
        }

        function takePicture() {
            angular.element('#cameraInput').trigger('click');
        }

    }

})();