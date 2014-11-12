(function () {
    'use strict';

    var module = angular.module('AppModule');

    module.constant('ngBreeze', (function () {
        if ("breeze" in window) {
            return breeze;
        } else {
            throw new Error("The Globals breeze is missing");
        }
    })());


    module.config(function (DataContextConfigProvider, JsonResultsAdapterConfigProvider, EntityModelConfigProvider, ngBreeze) {

        DataContextConfigProvider.config = {
            breeze: ngBreeze,
            serviceName: '',
            hasServerMetadata: false,
            useJsonp: false,
            adapter: JsonResultsAdapterConfigProvider.config.adapter,
            entityModel: EntityModelConfigProvider.config.entityModel
        };

    });


})();