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
        self.hash = Sha256.hash;
        self.createNewUser = createNewUser;
        self.isUsernameAvailable = isUsernameAvailable;
        self.insertAppData = insertAppData;
        self.updateAppData = updateAppData;
        self.selectAppData = selectAppData;
        self.selectPictures = selectPictures;
        self.getUser = getUser;

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

        function createNewUser(username, password){

            //TODO this is fuckedup security... #4:2...
            var createUser = "insert into OUser set name = '" + username + "', status = 'ACTIVE', " +
                "password = '" + password + "' , roles = [#4:2]";

            return createUser;
        }

        function isUsernameAvailable(username){
            return "select from OUser where name = '" + username + "'";
        }

        function updateAppData(exportData){
            //var command = "update AppData MERGE " + JSON.stringify(data) + " where @rid=" + appInfo.dataId;
            //var command = "update AppData set data='" + exportData + "' return after @this where @rid=" + appInfo.dataId;
            return "update AppData set data=" + JSON.stringify(exportData);
        }

        function insertAppData(exportData){
            //var command = "insert into AppData content " + JSON.stringify(data);
            //insert into toto SET data = 'data test', user = (select from OUser where name='chris')
            return "insert into AppData (data) values (" + JSON.stringify(exportData) + ")";
        }

        function selectPictures(){
            return "select from Picture";
        }

        function selectAppData(){
            return "select from AppData";
        }

        function getUser(username, password){
            var sha256Psw = "{SHA-256}" + self.hash(password).toUpperCase();
            return "select from OUser where name='" + username + "' AND password ='"+ sha256Psw +"'";
        }



        return self;
    }



    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
    /*                                                                                                */
    /*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
    /*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    /* jshint node:true *//* global define, escape, unescape */



    /**
     * SHA-256 hash function reference implementation.
     *
     * @namespace
     */
    var Sha256 = {};


    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - String to be hashed
     * @returns {string} Hash of msg as hex character string
     */
    Sha256.hash = function(msg) {
        // convert string to UTF-8, as SHA only deals with byte-streams
        msg = msg.utf8Encode();

        // constants [§4.2.2]
        var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];
        // initial hash value [§5.3.1]
        var H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

        // PREPROCESSING

        msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
        var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
        var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
        var M = new Array(N);

        for (var i=0; i<N; i++) {
            M[i] = new Array(16);
            for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
                M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
        M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


        // HASH COMPUTATION [§6.1.2]

        var W = new Array(64); var a, b, c, d, e, f, g, h;
        for (var i=0; i<N; i++) {

            // 1 - prepare message schedule 'W'
            for (var t=0;  t<16; t++) W[t] = M[i][t];
            for (var t=16; t<64; t++) W[t] = (Sha256.σ1(W[t-2]) + W[t-7] + Sha256.σ0(W[t-15]) + W[t-16]) & 0xffffffff;

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

            // 3 - main loop (note 'addition modulo 2^32')
            for (var t=0; t<64; t++) {
                var T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
                var T2 =     Sha256.Σ0(a) + Sha256.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }
            // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
            H[0] = (H[0]+a) & 0xffffffff;
            H[1] = (H[1]+b) & 0xffffffff;
            H[2] = (H[2]+c) & 0xffffffff;
            H[3] = (H[3]+d) & 0xffffffff;
            H[4] = (H[4]+e) & 0xffffffff;
            H[5] = (H[5]+f) & 0xffffffff;
            H[6] = (H[6]+g) & 0xffffffff;
            H[7] = (H[7]+h) & 0xffffffff;
        }

        return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) +
            Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
    };


    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    Sha256.ROTR = function(n, x) {
        return (x >>> n) | (x << (32-n));
    };

    /**
     * Logical functions [§4.1.2].
     * @private
     */
    Sha256.Σ0  = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); };
    Sha256.Σ1  = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); };
    Sha256.σ0  = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  };
    Sha256.σ1  = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); };
    Sha256.Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
    Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };


    /**
     * Hexadecimal representation of a number.
     * @private
     */
    Sha256.toHexStr = function(n) {
        // note can't use toString(16) as it is implementation-dependant,
        // and in IE returns signed numbers when used on full words
        var s="", v;
        for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
        return s;
    };


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


    /** Extend String object with method to encode multi-byte string to utf8
     *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
    if (typeof String.prototype.utf8Encode == 'undefined') {
        String.prototype.utf8Encode = function() {
            return unescape( encodeURIComponent( this ) );
        };
    }

    /** Extend String object with method to decode utf8 string to multi-byte */
    if (typeof String.prototype.utf8Decode == 'undefined') {
        String.prototype.utf8Decode = function() {
            try {
                return decodeURIComponent( escape( this ) );
            } catch (e) {
                return this; // invalid UTF-8? return as-is
            }
        };
    }





}());





/*

 https://oss.sonatype.org/content/repositories/snapshots/com/orientechnologies/orientdb-community/2.0-SNAPSHOT/

 connect remote:localhost/Organigramme brett brett

 alter class V superclass orestricted
 alter class E superclass orestricted


 insert into orole set name = 'visitor', mode = 0
 update orole put rules = "database", 2 where name = "visitor"
 update orole put rules = "database.schema", 2 where name = "visitor"
 update orole put rules = "database.command", 2 where name = "visitor"
 update orole put rules = "database.cluster.*", 7 where name = "visitor"
 update orole put rules = "database.class.*", 2 where name = "visitor"

 {
 "database": 2,
 "database.schema": 2,
 "database.command": 2,
 "database.cluster.*": 7,
 "database.class.OUser": 3
 }

 update orole put rules = "database.class.OUser", 3 where name = "visitor"



 CREATE CLASS Picture extends V
 CREATE PROPERTY Picture.id STRING
 CREATE PROPERTY Picture.data STRING

 //create visitor
 select from orole

 insert into OUser set name = 'visitor', status = 'ACTIVE', password = 'visitor', roles = [#4:3]


 connect remote:localhost/Organigramme visitor visitor

 CREATE CLASS AppData extends V
 CREATE PROPERTY AppData.data STRING

 create class has extends E

 delete from ouser where @rid=#5:30
 delete from (select from OUser)
 DELETE VERTEX #12:24

 var command = "UPDATE Picture CONTENT " + JSON.stringify(picture) + " UPSERT where id='" + picture.id +"'";

 CREATE INDEX User.id UNIQUE


 //select expand(out('employee_belong_departement')) from #12:72 fetchplan *:1

 //var employees = gdb.command('sql', 'select * from Employee', []);
 //var departements = gdb.command('sql', 'select * from Departement', []);
 //
 //for (var i = 0; i < employees.length; i++) {
 //    var emp = employees[i];
 //    var departement = departements[Math.round(Math.random()*(departements.length - 1))];
 //    var e = "create edge employee_belong_dpartement from #" + emp.getIdentity() + " to " +  department.getIdentity();
 //    gdb.command('sql',e, []);
 //}
 //
 //gdb.commit();
 //
 //
 //    var employees = gdb.command('sql', 'select * from Employee', []);
 //    var departments = gdb.command('sql', 'select * from Department', []);
 //
 //    for (var i = 0; i < employees.length; i++) {
 //        var emp = employees[i];
 //        var department = departements[Math.round(Math.random()*(departements.length - 1))];
 //        var e = "create edge employee_belong_dpartement from #" + emp.getIdentity() + " to " +  department.getIdentity();
 //        gdb.command('sql',e, []);
 //    }
 //
 //    gdb.commit();

 //SELECT out('employee_belong_departement') FROM Employee WHERE


 //[
 //    {
 //        "@type": "d",
 //        "@rid": "#12:72",
 //        "@version": 8,
 //        "@class": "Employee",
 //        "nom": "Coffin",
 //        "prenom": "Brett",
 //        "out_employee_belong_departement": [
 //            "#13:11"
 //        ],
 //        "@fieldTypes": "out_employee_belong_departement=g"
 //    }
 //]

 insert into toto (contenu,user) values ('test',select @rid from OUser where name='chris')

*/



