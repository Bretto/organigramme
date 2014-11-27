(function () {
    "use strict";

    angular.module('AppModule')
        .service('EmployeeBaseMixin', EmployeeBaseMixin);


    function EmployeeBaseMixin(AppDB, OdbService, $q) {
        console.log('EmployeeBaseMixin');


        function EmployeeBase(option) {

            var vm = this;
            vm.name = option.name;// name is a helper prop to determine whose instance is running;
            var scope = option.scope;


            vm.isSaveDisabled = isSaveDisabled;
            vm.isProcessingImage = isProcessingImage;
            vm.remoteSaveImageData = remoteSaveImageData;
            vm.localSaveImageData = localSaveImageData;
            vm.updateLocalImageData = updateLocalImageData;


            function isProcessingImage(entity) {
                return entity.isProcessingImage;
            }

            function isSaveDisabled(entity) {

                var isDisabled = (vm.isProcessingImage(entity) || !vm.isModified(entity) || !scope.entityForm.$valid);
                return isDisabled;
            }

            function remoteSaveImageData(picture) {

                //var cmd = "UPDATE Picture CONTENT " + JSON.stringify(picture) + " UPSERT RETURN AFTER @rid where id='" + picture.id +"'";
                var cmd = "INSERT INTO Picture CONTENT " + JSON.stringify(picture);
                return OdbService.query(cmd)
                    .then(function (res) {
                        console.log('remoteSaveImageData success', res);
                        vm.updateLocalImageData(picture.id);
                    }, function () {
                        console.log('remoteSaveImageData fail');
                    });
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

            function updateLocalImageData(id) {
                var deferred = $q.defer();

                AppDB.transaction(
                    function (tx) {
                        tx.executeSql(
                            "UPDATE Picture SET saved=? WHERE id=?",
                            [1, id],
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


        }


        return EmployeeBase;

    }

}());



