(function () {
    "use strict";

    var module = angular.module('AppModule');

    module.provider('DataContextConfig', function DataContextConfigProvider() {

        this.config = {
            breeze: null,
            adapter: null,
            entityModel: null
        };

        this.$get = function DataContextConfigFactory() {
            return {config: this.config};
        };
    });

    module.provider('EntityModelConfig', function EntityModelConfigProvider() {

        this.config = {
            entityModel: null
        };

        this.$get = function EntityModelConfigFactory() {
            return {config: this.config};
        };
    });

    module.provider('JsonResultsAdapterConfig', function JsonResultsAdapterConfigProvider() {

        this.config = {
            adapter: null
        };

        this.$get = function JsonResultsAdapterFactory() {
            return {config: this.config};
        };

    });


    module.factory('DataContextBase', function ($rootScope, $location, $q, $window, DataContextConfig) {

        var Breeze = DataContextConfig.config.breeze;
        var config = DataContextConfig.config;
        Breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);

        var serviceName = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

        var ds = new Breeze.DataService({
            serviceName: DataContextConfig.config.serviceName || serviceName,
            hasServerMetadata: DataContextConfig.config.hasServerMetadata,
            useJsonp: DataContextConfig.config.useJsonp,
            jsonResultsAdapter: DataContextConfig.config.adapter
        });

        var manager = new Breeze.EntityManager({dataService: ds});
        var EntityQuery = Breeze.EntityQuery;

        DataContextConfig.config.entityModel.initialize(manager.metadataStore);

        function loadJson(url) {
            var query = Breeze.EntityQuery
                .from(url);
            return manager.executeQuery(query, function(res){
                console.log('res', res);
            }, function(err){
                console.log('err', err);
            });
        }

        function getAllEntities(entityType, whereClause) {
            var query = EntityQuery.from(entityType).where(whereClause);
            return manager.executeQueryLocally(query);
        }

        function getEntityById(entityType, id) {
            var query = EntityQuery.from(entityType).where('id', '==', id);
            return manager.executeQueryLocally(query);
        }

        function newEntity(entityType, data) {
            data.id = getNegId(entityType);
            var entity = manager.createEntity(entityType, data);
            manager.addEntity(entity);
            exportEntities();

            return entity;
        }

        function exportEntities() {
//            console.log('exportEntities');
//            console.log(manager.getEntities());

            manager.acceptChanges();
            var exportData = manager.exportEntities();
//            console.log(exportData);
            $window.localStorage.setItem("entityGraph", exportData);

        }

        function importEntities() {
//            console.log('importEntities');
            manager.clear();
            var importData = $window.localStorage.getItem("entityGraph");
            if (importData){
                manager.importEntities(importData);
//                console.log(manager.getEntities());
            }

            return manager.getEntities();
        }

        function getNegId(entityType) {

            var queryNews = breeze.EntityQuery.from(entityType);
            var lists = manager.executeQueryLocally(queryNews);
            var id = lists.reduce(
                function (res, entity) {
                    if (parseInt(entity.id) < parseInt(res)) {
                        res = entity.id;
                    }
                    return res;
                }, 0);

            id -= 1;
            return id;
        }


        var dataContextBase = {
            Breeze: Breeze,
            EntityQuery: EntityQuery,
            config: config,
            loadJson: loadJson,

            getAllEntities: getAllEntities,
            getEntityById: getEntityById,
            newEntity: newEntity,

            exportEntities: exportEntities,
            importEntities: importEntities,

            manager: manager
        };

        return dataContextBase;
    });

})();