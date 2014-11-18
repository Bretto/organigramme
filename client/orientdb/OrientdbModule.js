(function () {
    'use strict';

    angular
        .module('OrientdbModule', [])
        .service('OdbService', OdbService)
        .run(run);

    function run() {

    }

    function OdbService($http) {
        console.log('OdbService');

        var self = this;

        self.query = query;
        self.auth = auth;
        self.connect = connect;

        function connect(dbName, uri) {
            self.dbName = dbName;
            self.uri = uri;
        }

        function auth(usr, psw) {
            $http.defaults.headers.common.Authorization = 'BASIC ' + btoa(usr + ':' + psw);
        }

        function query(str, lim) {

            if (!self.uri || !self.dbName) {
                throw new Error("Please setup the connection de the db");
            }

            var limit = lim || -1;
            var url = self.uri + '/command/' + self.dbName + "/sql/-/" + limit;
            var q = str;
            return $http.post(url, q);
        }

        return self;
    }


}());





/*

 connect remote:localhost/Organigramme brett brett

 alter class V superclass orestricted
 alter class E superclass orestricted

 create visitor role
 insert into orole set name = 'visitor', mode = 0
 update orole put rules = "database", 2 where name = "visitor"
 update orole put rules = "database.schema", 2 where name = "visitor"
 update orole put rules = "database.command", 2 where name = "visitor"
 update orole put rules = "database.cluster.*", 3 where name = "visitor"
 update orole put rules = "database.class.*", 2 where name = "visitor"

 create visitor
 select from orole
 insert into ouser set name = 'Visitor', status = 'ACTIVE', password = 'visitor', roles = [#4:3]


 connect remote:localhost/Organigramme Visitor visitor







*/