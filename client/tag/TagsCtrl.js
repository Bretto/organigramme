(function () {
    "use strict";

    angular.module('AppModule')
        .controller('TagsCtrl', TagsCtrl);


    function TagsCtrl($scope, ViewBaseMixin, TagBaseMixin) {
        console.log('TagsCtrl');

        ViewBaseMixin.call(this, {name:'TagsCtrl'});
        TagBaseMixin.call(this, {name: 'TagsCtrl', scope:$scope});
        var vm = this;


    }

}());