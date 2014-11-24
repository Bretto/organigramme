(function () {
    "use strict";

    angular.module('AppModule')
        .controller('EmployeeViewCtrl', EmployeeViewCtrl);


    function EmployeeViewCtrl($scope, ViewBaseMixin, EmployeeBaseMixin) {
        console.log('EmployeeViewCtrl');

        ViewBaseMixin.call(this, {name: 'EmployeeViewCtrl'});
        EmployeeBaseMixin.call(this, {name: 'EmployeeViewCtrl', scope:$scope});

        var vm = this;

        vm.onTagRemove = onTagRemove;

        function onTagRemove(employeeTagMap) {
            var entity = vm.dataContext.getEntityById('EmployeeTagMap', employeeTagMap.id)[0];
            entity.entityAspect.setDeleted();
            vm.dataContext.appInfo.isSynchronized = false;
            vm.dataContext.doLocalSave();
        }
    }

})();