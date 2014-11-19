(function () {
    "use strict";

    angular
        .module('AppModule')
        .service('AppStart', AppStart);

    function AppStart($q, AppConfig, AppModelService, DataContext) {

        var initType = AppConfig.config.initType;
        var dataContext = DataContext;

        //function addFakeData() {
        //
        //    for (var j = 0; j < 40; j++) {
        //        dataContext.newEntity('Employee', {name: 'User Name ' + (j + 1)});
        //        dataContext.newEntity('Tag', {name: 'Tag Name ' + (j + 1)});
        //    }
        //
        //    dataContext.exportEntities();
        //}


        function initWithLocalExport() {

            var deferred = $q.defer();

            //if (dataContext.importEntities().length === 0) {
            //    addFakeData();
            //}
            dataContext.importEntities();
            var appState = DataContext.getAllEntities('AppState')[0];
            console.log('appState isSynchronized:', appState.isSynchronized);

            if(!appState){
                appState = {isSynchronized: true};
                DataContext.newEntity('AppState', appState);
            }
            AppModelService.isSynchronized = appState.isSynchronized;
            deferred.resolve({data:'OK'});

            return deferred.promise;

        }

        var appStart = {
            initWithLocalExport: initWithLocalExport
        };

        appStart.start = appStart[initType];

        return appStart;

    }

})();