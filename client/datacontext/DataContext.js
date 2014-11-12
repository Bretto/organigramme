(function () {
    "use strict";

    var module = angular.module('AppModule');

    module.factory('DataContext', function ($rootScope, $location, $q, DataContextBase) {

        var dataContext = {
            deleteEmployee: deleteEmployee,
            deleteTag: deleteTag
        };

        dataContext = angular.extend(dataContext, DataContextBase);

        function deleteEmployee(entity) {

            if (entity.tagMaps[0]) {

                var done = false;
                while (!done) {
                    entity.tagMaps[0].entityAspect.setDeleted();
                    if (entity.tagMaps.length === 0)done = true;
                }
            }
            entity.entityAspect.setDeleted();
            dataContext.exportEntities();
        }

        function deleteTag(entity) {

            if (entity.employeeMaps[0]) {
                var done = false;
                while (!done) {

                    entity.employeeMaps[0].entityAspect.setDeleted();
                    if (entity.employeeMaps.length === 0) done = true;
                }
            }
            entity.entityAspect.setDeleted();
            dataContext.exportEntities();
        }



        return dataContext;
    });

})();


