(function () {
    'use strict';

    var module = angular.module('AppModule');

    module.config(function (JsonResultsAdapterConfigProvider, ngBreeze) {

        JsonResultsAdapterConfigProvider.config.adapter = new ngBreeze.JsonResultsAdapter({

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


})();