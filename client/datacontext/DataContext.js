(function () {
    "use strict";

    var module = angular.module('AppModule');

    module.factory('DataContext', function ($rootScope, $location, $q, DataContextBase, AppDB, OdbService, LoginService) {

        //appInfo : {
        // isSynchronized:Boolean,
        // username:String,
        // userId:String,
        // dataId:String
        // };

        var dataContext = {
            deleteEmployee: deleteEmployee,
            deleteTag: deleteTag,
            getEmployees: getEmployees,
            getTags: getTags,
            doLocalSave: doLocalSave,
            appInfo: null,
            currentEmployee: null,
            currentTag: null,
            getNonSavedImages: getNonSavedImages,
            remoteSaveAppData: remoteSaveAppData,
            localSaveImageData: localSaveImageData
        };

        dataContext = angular.extend(dataContext, DataContextBase);

        function doLocalSave() {
            return dataContext._doLocalSave(dataContext.appInfo.username);
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
            dataContext.doLocalSave();
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
            dataContext.doLocalSave();
        }


        function remoteSaveAppData() {

            var deferred = $q.defer();
            var exportData = dataContext.doLocalSave();
            var data = {data: exportData};

            //var command = "update AppData MERGE " + JSON.stringify(data) + " where @rid=" + dataContext.appInfo.dataId;
            var command = "update AppData set data='" + exportData + "' return after @this where @rid=" + dataContext.appInfo.dataId;
            OdbService.query(command)
                .then(function (res) {
                    console.log('remoteSaveAppData', res);
                    dataContext.appInfo.isSynchronized = true;
                    dataContext.doLocalSave();
                    deferred.resolve();

                }, function (err) {
                    console.log(err);
                    LoginService.isAuthenticated = false;
                    LoginService.isOnline = false;
                    deferred.reject();
                });

            return deferred.promise;
        }


        function getNonSavedImages() {
            var deferred = $q.defer();

            AppDB.transaction(
                function (tx) {
                    tx.executeSql(
                        "SELECT * FROM Picture WHERE saved= ? AND id != 'tempPic'",
                        [0],
                        function (tx, results) {
                            var rows = [];
                            for (var i = 0; i < results.rows.length; i++) {
                                var row = results.rows.item(i);
                                rows.push(row);
                            }
                            deferred.resolve(rows);
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
                            deferred.reject();
                        }
                    );
                },
                function (error) {
                    console.log("Transaction Error: " + error.message);
                },
                function () {
                    console.log("Transaction Success");
                }
            );

            return deferred.promise;
        }

        function localSaveImageData(id, data) {
            var deferred = $q.defer();

            AppDB.transaction(
                function (tx) {
                    tx.executeSql(
                        "INSERT OR REPLACE INTO Picture (id, saved, data) VALUES (?, ?, ?)",
                        [id, 0, data],
                        function (tx, result) {
                            console.log("Query Success");
                            deferred.resolve();
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
                            deferred.reject();
                        }
                    );
                },
                function (error) {
                    console.log("Transaction Error: " + error.message);
                },
                function () {
                    console.log("Transaction Success");
                }
            );

            return deferred.promise;
        }


        return dataContext;
    });



})();


/*

 {"tempKeys":[],"entityGroupMap":{
 "AppInfo:#Context":{"entities":[{"id":-1,"isSynchronized":false,"dataId":"#12:27","username":"1111","userId":"#5:33","entityAspect":{"entityState":"Unchanged"}}]},
 "Tag:#Context":{"entities":[]},
 "Employee:#Context":{"entities":[
 {"id":-1,"name":"REMOTE","picture":"1111_f8e84688-5bf0-4346-9f00-c34e91522e10","entityAspect":{"entityState":"Unchanged"}},
 {"id":-2,"name":"1q","picture":"1111_ec18d464-2219-4c86-8b75-deb3657eae5e","entityAspect":{"entityState":"Unchanged"}},
 {"id":-3,"name":"qqqq","picture":"1111_4ea49500-7e0c-4c21-be1a-8dd5fd182b2d","entityAspect":{"entityState":"Unchanged"}}]}},"dataService":{"serviceName":"http://localhost:3000/","hasServerMetadata":false,"jsonResultsAdapter":"context","useJsonp":false},"saveOptions":{"allowConcurrentSaves":false},"queryOptions":{"fetchStrategy":"FromServer","mergeStrategy":"PreserveChanges"},"validationOptions":{"validateOnAttach":true,"validateOnSave":true,"validateOnQuery":false,"validateOnPropertyChange":true},"metadataStore":"{\"metadataVersion\":\"1.0.5\",\"namingConvention\":\"noChange\",\"localQueryComparisonOptions\":\"caseInsensitiveSQL\",\"dataServices\":[],\"structuralTypes\":[{\"shortName\":\"AppInfo\",\"namespace\":\"Context\",\"autoGeneratedKeyType\":\"Identity\",\"defaultResourceName\":\"AppInfo\",\"dataProperties\":[{\"name\":\"id\",\"dataType\":\"Int64\",\"isPartOfKey\":true},{\"name\":\"isSynchronized\",\"dataType\":\"Boolean\"},{\"name\":\"dataId\",\"dataType\":\"String\"},{\"name\":\"username\",\"dataType\":\"String\"},{\"name\":\"userId\",\"dataType\":\"String\"}]},{\"shortName\":\"Employee\",\"namespace\":\"Context\",\"autoGeneratedKeyType\":\"Identity\",\"defaultResourceName\":\"Employee\",\"dataProperties\":[{\"name\":\"id\",\"dataType\":\"Int64\",\"isPartOfKey\":true},{\"name\":\"name\",\"dataType\":\"String\"},{\"name\":\"picture\",\"dataType\":\"String\"}],\"navigationProperties\":[{\"name\":\"tagMaps\",\"entityTypeName\":\"EmployeeTagMap:#Context\",\"isScalar\":false,\"associationName\":\"Employee_EmployeeTagMap\"}]},{\"shortName\":\"EmployeeTagMap\",\"namespace\":\"Context\",\"autoGeneratedKeyType\":\"Identity\",\"defaultResourceName\":\"EmployeeTagMap\",\"dataProperties\":[{\"name\":\"id\",\"dataType\":\"Int64\",\"isPartOfKey\":true},{\"name\":\"employee_id\",\"dataType\":\"String\"},{\"name\":\"tag_id\",\"dataType\":\"String\"}],\"navigationProperties\":[{\"name\":\"employee\",\"entityTypeName\":\"Employee:#Context\",\"isScalar\":true,\"associationName\":\"Employee_EmployeeTagMap\",\"foreignKeyNames\":[\"employee_id\"]},{\"name\":\"tag\",\"entityTypeName\":\"Tag:#Context\",\"isScalar\":true,\"associationName\":\"Tag_EmployeeTagMap\",\"foreignKeyNames\":[\"tag_id\"]}]},{\"shortName\":\"Tag\",\"namespace\":\"Context\",\"autoGeneratedKeyType\":\"Identity\",\"defaultResourceName\":\"Tag\",\"dataProperties\":[{\"name\":\"id\",\"dataType\":\"Int64\",\"isPartOfKey\":true},{\"name\":\"name\",\"dataType\":\"String\"}],\"navigationProperties\":[{\"name\":\"employeeMaps\",\"entityTypeName\":\"EmployeeTagMap:#Context\",\"isScalar\":false,\"associationName\":\"Tag_EmployeeTagMap\"}]}],\"resourceEntityTypeMap\":{\"AppInfo\":\"AppInfo:#Context\",\"Employee\":\"Employee:#Context\",\"EmployeeTagMap\":\"EmployeeTagMap:#Context\",\"Tag\":\"Tag:#Context\"}}"}
 */


