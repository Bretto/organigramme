(function () {
    "use strict";

    angular.module('AppModule')
        .service('TagBaseMixin', TagBaseMixin);


    function TagBaseMixin() {
        console.log('TagBaseMixin');


        function TagBase(option) {

            var vm = this;
            var scope = option.scope;
            vm.name = option.name;// name is a helper prop to determine whose instance is running;
            vm.isSaveDisabled = isSaveDisabled;


            function exist(entity) {
                var bool = false;
                if (!entity.name) { return; }
                bool = !!vm.dataContext.getTags(entity).length;

                return bool;
            }

            function isSaveDisabled(entity) {

                var isDisabled = (exist(entity) || !vm.isModified(entity) || !scope.entityForm.$valid);
                return isDisabled;
            }

        }


        return TagBase;

    }

}());



