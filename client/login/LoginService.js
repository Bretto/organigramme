(function () {
    "use strict";

    angular.module('AppModule')
        .service('LoginService', LoginService);


    function LoginService($q, $state, $location, DataContext, OdbService) {
        console.log('LoginService');

        var self = this;
        self.doLogin = doLogin;
        self.getRemotePictures = getRemotePictures;
        self.getRemoteAppData = getRemoteAppData;
        self.getRemoteData = getRemoteData;


        function doLogin(loginUser, deferred) {
            console.log('doLogin');

            DataContext.doLocalLoad(loginUser.username);
            var appInfo = DataContext.getAllEntities('AppInfo')[0];

            if (appInfo) {
                DataContext.appInfo = appInfo;
            }

            OdbService.auth(loginUser.username, loginUser.password);

            var getUser = OdbService.getUser(loginUser.username, loginUser.password);

            OdbService.query(getUser)
                .then(function (res) {

                    var data = res.data.result[0];
                    var user = {username: data.name, getUser: getUser};

                    DataContext.isAuthenticated = true;
                    DataContext.isOnline = true;

                    if (appInfo) {
                        completeLogin();
                        deferred.resolve();
                    } else {
                        self.getRemoteData(user)
                            .then(function () {
                                completeLogin();
                                deferred.resolve();
                            });
                    }

                }, function (err) {

                    DataContext.isAuthenticated = false;
                    DataContext.isOnline = false;
                    completeLogin(deferred);
                });
        }

        function getRemotePictures() {
            return OdbService.query(OdbService.selectPictures())
                .then(function (res) {
                    console.log('getRemotePictures', res);

                    _.forEach(res.data.result, function (picture) {
                        DataContext.localSaveImageData(picture.id, picture.data);
                    });

                }, function (err) {
                    console.log(err);
                });
        }

        function getRemoteAppData() {
            return OdbService.query(OdbService.selectAppData());
        }


        function getRemoteData(user) {
            console.log('getRemoteData');

            return self.getRemotePictures()
                .then(function () {
                    return self.getRemoteAppData();
                })
                .then(function (res) {
                    console.log('getRemoteAppData', res);
                    if (res.data.result.length === 0) {
                        return createAppInfo(user);
                    } else {
                        console.log('getAppdata from local storage');
                        DataContext.manager.importEntities(res.data.result[0].data);
                        DataContext.appInfo = DataContext.getAllEntities('AppInfo')[0];
                        DataContext.appInfo.isSynchronized = true;
                        DataContext.doLocalSave();
                    }
                }, function (err) {
                    console.log(err);
                });

        }


        function createAppInfo(user, deferred) {
            console.log('createAppInfo');
            var appInfo = DataContext.newEntity('AppInfo', {
                isSynchronized: true,
                username: user.username
            });
            DataContext.appInfo = appInfo;
            var exportData = DataContext.doLocalSave();

            return OdbService.query(OdbService.insertAppData(exportData));
        }


        function completeLogin() {
            console.log('completeLogin');
            $state.go('api.main.employee');
        }


        return self;
    }

}());