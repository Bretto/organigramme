(function () {
    "use strict";

    angular
        .module('AppModule')
        .controller('AppCtrl', AppCtrl);


    function AppCtrl($scope, $rootScope, $state, $log, ViewBaseMixin, $timeout) {

        $log = $log.getInstance("AppCtrl");
        $log.info('Initialize');

        ViewBaseMixin.call(this, {name: 'AppCtrl'});
        var vm = this;

        vm.tagSearch = [];
        vm.searchIds = [];

        vm.onTagSelect = onTagSelect;
        vm.onTagDelete = onTagDelete;
        vm.onOpenSearch = onOpenSearch;
        vm.onSwipe = onSwipe;
        vm.onGoto = onGoto;

        $scope.shared  = {isOpened: false};

        function onSwipe(dir) {

            if ($state.current.name === "api.main.employee") {
                if (dir === 'right') {
                    $scope.shared.isOpened = true;
                } else {
                    $scope.shared.isOpened = false;
                }
            }
        }

        function onGoto(state, params, options){
            $scope.shared.isOpened = false;
            vm._onGoto(state, params, options);
        }

        function onOpenSearch() {
            $scope.shared.isOpened = !$scope.shared.isOpened;
        }

        function onTagSelect(tag) {

            if (vm.search) {
                vm.search.name = '';
            }

            tag.isDisabled = true;
            vm.tagSearch.push(tag);
            vm.searchIds.push(tag.id);
        }

        function onTagDelete(idx) {
            var tag = vm.tagSearch[idx];
            tag.isDisabled = false;
            vm.tagSearch.splice(idx, 1);
            vm.searchIds.splice(idx, 1);
        }

        $scope.$on("$destroy", function () {
            _.forEach(vm.tagSearch, function (tag) {
                tag.isDisabled = false;
            });
        });

    }


}());
