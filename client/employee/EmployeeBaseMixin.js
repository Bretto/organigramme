(function () {
    "use strict";

    angular.module('AppModule')
        .service('EmployeeBaseMixin', EmployeeBaseMixin);


    function EmployeeBaseMixin() {
        console.log('EmployeeBaseMixin');


        function EmployeeBase(option) {

            var vm = this;
            vm.name = option.name;// name is a helper prop to determine whose instance is running;
            var scope = option.scope;


            vm.isSaveDisabled = isSaveDisabled;
            vm.isProcessingImage = isProcessingImage;

            function isProcessingImage(entity) {
                return entity.isProcessingImage;
            }

            function isSaveDisabled(entity) {

                var isDisabled = (vm.isProcessingImage(entity) || !vm.isModified(entity) || !scope.entityForm.$valid);
                return isDisabled;
            }

        }


        return EmployeeBase;

    }

}());



