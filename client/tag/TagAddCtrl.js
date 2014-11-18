(function () {
    "use strict";

    angular.module('AppModule')
        .controller('TagAddCtrl', TagAddCtrl);


    function TagAddCtrl($scope, ViewBaseMixin) {
        console.log('TagAddCtrl');

        ViewBaseMixin.call(this, {name:'TagAddCtrl'});
        var vm = this;

        vm.onTagSelect = onTagSelect;

        init();

        function init(){
            _.forEach(vm.currentEmployee.tagMaps, function(tagMap){
                var foundTag = _.find(vm.getTags(),function(tag){
                    return tag.id === tagMap.tag.id;
                });

                if(foundTag){ foundTag.isDisabled = true;}
            });
        }

        function onTagSelect(tag) {
            vm.dataContext.newEntity('EmployeeTagMap', { employee_id: vm.currentEmployee.id, tag_id: tag.id});
            vm._onGoto('api.main.employeeId', {employeeId: vm.currentEmployee.id});
        }

        $scope.$on("$destroy", function () {
            _.forEach(vm.tags, function(tag){
                tag.isDisabled = false;
            });
        });


    }

}());