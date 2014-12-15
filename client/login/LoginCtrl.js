(function () {
    "use strict";

    angular.module('AppModule')
        .controller('LoginCtrl', LoginCtrl)



    function LoginCtrl($scope, $log, ViewBaseMixin) {

        $log = $log.getInstance("LoginCtrl");
        $log.info('LoginCtrl');

        ViewBaseMixin.call(this, {name: 'LoginCtrl'});
        var vm = this;
        vm.onLogin = onLogin;
        vm.onRegister = onRegister;

        function onLogin(loginUser) {

            var form = $scope.submitLoginForm;
            // the copy is to associated a new promise with the loginValidation each time
            // otherwise the form thinks it's the same object and don't trigger the $asyncValidators
            form.loginValidation.$setViewValue(angular.copy(loginUser));
        }

        function onRegister(registerUser) {

            vm._ws.query(vm._ws.createNewUser(registerUser.username, registerUser.password))
                .then(function (res) {
                    console.log('onRegister', res);
                    $scope.flip = false;
                });
        }

    }




}());


//
//_.forEach(angular.module("AppModule")._invokeQueue, function(dep){
//    console.log(dep[2]);
//});

//select expand(out('employee_belong_departement')) from #12:72 fetchplan *:1

// TODO should not be able to travers ouser...
// "traverse out_ from (select from OUser where name=" + loginUser.username + ")"


//if (LoginService.isOnline) {
//    var command = "select from AppData where @rid= " + DataContext.appInfo.dataId;
//    OdbService.query(command)
//        .then(function (importData) {
//            console.log('importData', importData);
//
//            if (importData.data.result[0].data) {
//                DataContext.manager.importEntities(importData.data.result[0].data);
//                DataContext.appInfo = DataContext.getAllEntities('AppInfo')[0];
//            }
//
//            doResolve();
//
//        }, function (err) {
//            console.log(err);
//            LoginService.isAuthenticated = false;
//            LoginService.isOnline = false;
//            doResolve();
//        });
//
//} else {
//    doResolve();
//}


//traverse out_ from #5:10

//vm._ws.query(createUser)
//    .then(function (res) {
//        user = res.data.result[0];
//        return vm._ws.query(createAppData);
//    }).then(function (res) {
//        appData = res.data.result[0];
//        var createEdge = "create edge has from "+ user['@rid'] +" to "+ appData['@rid'];
//        return vm._ws.query(createEdge);
//    }).then(function (res) {
//        console.log('onRegister', res);
//        $scope.flip = false;
//    });


//vm._ws.query(createUser)
//    .then(function (res) {
//        console.log('onRegister', res);
//
//        $scope.flip = false;
//    }, function (err) {
//        console.log(err);
//    });


//update AppData Set data='0000 1111 0000 1111' where @rid=#12:14

