(function () {
    "use strict";

    var module = angular.module('AppModule');

    module.factory('DataContext', function ($rootScope, $location, $q, DataContextBase) {

        //appInfo : {dataId:String , isSynchronized:Boolean, user: Object};

        var dataContext = {
            deleteEmployee: deleteEmployee,
            deleteTag: deleteTag,
            getEmployees: getEmployees,
            getTags: getTags,
            exportEntities: exportEntities,
            appInfo: null,
            currentEmployee: null,
            currentTag: null
        };

        dataContext = angular.extend(dataContext, DataContextBase);

        function exportEntities() {
            console.log("exportEntities appInfo.isSynchronized = false");
            dataContext.appInfo.isSynchronized = false;
            dataContext._exportEntities();
        }


        function getEmployees(searchIds) {
            var whereClause = null;
            if (searchIds) {
                var preds = searchIds.map(function (sp) {
                    return dataContext.predicate.create("tagMaps", "any", "tag.id", "==", sp);
                });
                whereClause = dataContext.predicate.and(preds);
            }

            return dataContext.getAllEntities('Employee', whereClause);
        }

        function getTags(tag) {
            var whereClause = null;

            if (tag) {
                var pred1 = dataContext.predicate.create('name', '==', tag.name);
                var pred2 = (tag.id) ? dataContext.predicate.create('id', '!=', tag.id) : null;
                whereClause = dataContext.predicate.and(pred1, pred2);
            }

            return dataContext.getAllEntities('Tag', whereClause);
        }


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


