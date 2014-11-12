(function () {
    'use strict';

    angular
        .module('AppModule')
        .constant('ngQ', ngQ())
        .constant('AppDB', AppDB())
        .config(config);


    var initTypes = {
        //this is the name of a function in AppStart
        initWithLocalExport: 'initWithLocalExport'
    };

    var colors = [
        'block-blueberry',
        'block-slate',
        'block-grape',
        'block-raspberry',
        'block-mango',
        'block-orange',
        'block-kiwi'
    ];


    function ngQ() {
        if ("Q" in window) {
            return Q;
        } else {
            throw new Error("The Globals Q is missing");
        }
    }

    function config(AppConfigProvider) {
        AppConfigProvider.config = {
            initType: initTypes.initWithLocalExport,
            colors: colors
        };
    }

    function AppDB() {

        var db = initDB();
        createTable(db);

        function initDB() {

            var shortName = 'pictureDB';
            var version = '1.0';
            var displayName = 'Picture Database';
            var maxSize = (1024 * 1024) * 50; // 50MB in bytes
            db = openDatabase(shortName, version, displayName, maxSize);
            return db;
        }

        function createTable(db) {
            // creates the product table to store the product details
            db.transaction(
                function (transaction) {
                    transaction.executeSql(
                            'CREATE TABLE IF NOT EXISTS Picture2' +
                            '(' +
                            'id VARCHAR,' +
                            'data BLOB' +
                            ');'
                    );
                });
        }

        return db;
    }





})();
