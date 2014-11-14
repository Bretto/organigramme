(function () {
    "use strict";

    angular.module('AppModule')
        .service('ViewBaseMixin', ViewBaseMixin);


    function ViewBaseMixin($state, AppModelService, $rootScope, $timeout) {
        console.log('ViewBaseMixin');


        function ViewBase(option) {

            var vm = this;
            vm.name = option.name;// name is a helper property to determine whose instance of ViewBase is running;

            vm.appModel = AppModelService;
            vm.dataContext = AppModelService.dataContext;
            vm.manager = AppModelService.dataContext.manager;

            vm._timeout = $timeout;
            vm._onGoto = _onGoto;
            vm._onSave = _onSave;

            vm._isEmpActive = _isEmpActive;

            vm.getTags = getTags;
            vm.getEmployees = getEmployees;

            vm.isModified = isModified;


            Object.defineProperty(vm, 'currentEmployee', {
                get: function () {
                    return AppModelService.currentEmployee;
                },
                set: function (obj) {
                    throw new Error('do not set this');
                }
            });

            Object.defineProperty(vm, 'currentTag', {
                get: function () {
                    return AppModelService.currentTag;
                },
                set: function (obj) {
                    throw new Error('do not set this');
                }
            });


            function isModified(entity) {
                var modified = true;
                if (entity.entityAspect) {
                    modified = entity.entityAspect.entityState.isModified();
                }
                return  modified;
            }

            function getTags() {
                return vm.appModel.getTags();
            }

            function getEmployees(searchIds) {
                return vm.appModel.getEmployees(searchIds);
            }

            function _isEmpActive(emp) {
                return (vm.currentEmployee && vm.currentEmployee.id === emp.id);
            }


            function _onSave(state, params, options) {

                vm.dataContext.exportEntities();
                vm._onGoto(state, params, options);
            }

            function _onGoto(state, params, options) {

                if (params && params.isBack) {
                    $rootScope.direction = 'view-animate-back';
                }else{
                    $rootScope.direction = 'view-animate-next';
                }

                $timeout(function () {
                    $state.go(state, params || {}, options || {});
                },0);
            }

        }


        return ViewBase;

    }

}());

