(function () {
    "use strict";

    angular.module('AppModule')
        .controller('TagEditCtrl', TagEditCtrl);


    function TagEditCtrl($scope, ViewBaseMixin, TagBaseMixin) {
        console.log('TagEditCtrl');

        ViewBaseMixin.call(this, {name:'TagEditCtrl'});
        TagBaseMixin.call(this, {name: 'TagEditCtrl', scope:$scope});

        var vm = this;
        vm.onBack = onBack;
        vm.onDelete = onDelete;


        function onBack(state){
            if(vm.isModified(vm.currentTag)){
                vm.currentTag.entityAspect.rejectChanges();
            }

            vm._onGoto(state, {isBack:true});
        }

        function onDelete() {
            vm.dataContext.deleteTag(vm.currentTag);
            vm._onGoto('api.main.tag');
        }

    }

}());