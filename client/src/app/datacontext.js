(function () {
    "use strict";

    var services = angular.module('DataContext', []);

    services.factory('jsonResultsAdapter', function (ngBreeze) {

        return new ngBreeze.JsonResultsAdapter({

            name: "context",

            extractResults: function (data) {
                var results = data.results;
                if (!results) throw new Error("Unable to resolve 'results' property");
                return results;
            },

            visitNode: function (node, parseContext, nodeContext) {

                var entityType;

                switch (parseContext.query.resourceName) {
                    case "/assets/json/employees.json":
                        entityType = { entityType: "Employee"  }
                        if (nodeContext.propertyName === "data")return entityType;
                    case "/assets/json/employee-tag-map.json":
                        entityType = { entityType: "EmployeeTagMap"  }
                        if (nodeContext.propertyName === "data")return entityType;
                    case "/assets/json/tags.json":
                        entityType = { entityType: "Tag"  }
                        if (nodeContext.propertyName === "data")return entityType;
                }

            }

        });
    });

    services.factory('DataContext', function (EntityModel, jsonResultsAdapter, $rootScope, ngBreeze, ngQ, $location, $timeout) {

        ngBreeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);

        var serviceName = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

        var ds = new ngBreeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            useJsonp: false,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new ngBreeze.EntityManager({dataService: ds});
        var EntityQuery = breeze.EntityQuery;

        EntityModel.initialize(manager.metadataStore);

        function newEmployee() {
            var newEntity = manager.createEntity('Employee', {name: 'name'});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }

        function deleteEmployee(entity) {

            if (entity.tagMaps[0]) {

                var done = false;
                while (!done) {
                    entity.tagMaps[0].entityAspect.setDeleted();
                    if (entity.tagMaps.length === 0)done = true;
                }

                entity.entityAspect.setDeleted();
            }

            return entity;
        }

        function deleteTag(entity) {

            if (entity.employeeMaps[0]) {
                var done = false;
                while (!done) {

                    entity.employeeMaps[0].entityAspect.setDeleted();
                    if (entity.employeeMaps.length === 0)done = true;
                }

                entity.entityAspect.setDeleted();
            }

            return entity;
        }


        function getAllEmployee() {

//            var deferred = gQ.defer();

//            var query = ngBreeze.EntityQuery
//                .from("init");

//            manager.executeQuery(query)
//                .catch(function (err) {
//                    $log.error('Error getAllEntity', err);
//                    deferred.reject(new Error(err));
//                })
//                .done(function (res) {
//                    if (res)deferred.resolve(res.results);
//                })

//            return deferred.promise;

            var query = ngBreeze.EntityQuery
                .from("/assets/json/employees.json");
            return manager.executeQuery(query)

        }

        function getEmployeeById(employeeId){
            var query = EntityQuery.from('Employee').where('id', '==', employeeId);
            return manager.executeQueryLocally(query);
        }

        function getAllEmployeeTagMap() {

            var query = ngBreeze.EntityQuery
                .from("/assets/json/employee-tag-map.json");
            return manager.executeQuery(query);

        }

        function getAllTag() {

            var query = ngBreeze.EntityQuery
                .from("/assets/json/tags.json");
            return manager.executeQuery(query);

        }

        function newTag() {
            var newEntity = manager.createEntity('Tag', {name: 'name'});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }

        function newEmployeeTagMap(employeeId, tagId) {
            var newEntity = manager.createEntity('EmployeeTagMap', { employee_id: employeeId, tag_id: tagId});
            manager.addEntity(newEntity);
            newEntity.entityAspect.acceptChanges();

            return newEntity;
        }

        function initialize(){
            return getAllEmployeeTagMap()
                .then(function(res){
                    console.log(res.results[0].data);
                    return getAllTag();
                })
                .then(function(res){
                    console.log(res.results[0].data);
                    $rootScope.tags = res.results[0].data;
                    return getAllEmployee();
                })
                .then(function(res){
                    console.log(res.results[0].data);
                    $rootScope.employees = res.results[0].data;
                    $rootScope.isLoading = false;
                });

        }


        return {
            initialize: initialize,
            getAllEmployee: getAllEmployee,
            getEmployeeById: getEmployeeById,
            newEmployee: newEmployee,
            deleteEmployee: deleteEmployee,
            getAllTag: getAllTag,
            newTag: newTag,
            deleteTag: deleteTag,
            getAllEmployeeTagMap: getAllEmployeeTagMap,
            newEmployeeTagMap: newEmployeeTagMap,
            manager: manager
        };

    });

})();


