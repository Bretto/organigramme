(function () {
    "use strict";

    angular.module('AppModule')
        .controller('TagNewCtrl', TagNewCtrl);


    function TagNewCtrl($scope, ViewBaseMixin, TagBaseMixin) {

        console.log('TagNewCtrl');
        ViewBaseMixin.call(this, {name:'TagNewCtrl'});
        TagBaseMixin.call(this, {name: 'TagNewCtrl', scope:$scope});

        var vm = this;
        vm.tempTag = {};
        vm.onSave = onSave;

        function onSave(state) {
           vm.dataContext.newEntity('Tag', vm.tempTag);
           vm._onSave(state);
        }
    }

}());