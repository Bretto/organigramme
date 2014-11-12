(function (mobule2) {
    "use strict";

    angular
        .module('AppModule')
        .directive('cameraBtn', cameraBtn)
        .directive('axiLoadPicture', axiLoadPicture);


    function cameraBtn($parse, AppDB, $rootScope, $timeout) {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

            var entity = $parse(attrs.cameraBtn)(scope);


            function processData(data, cb) {

                var myCan = document.createElement('canvas');
                var img = new Image();

                img.src = data;
                img.onload = function () {


                    var orientation;
                    EXIF.getData(img, function () {
                        orientation = EXIF.getTag(img, 'Orientation');

                        var ow = $(img).prop('naturalWidth');
                        var oh = $(img).prop('naturalHeight');

                        var size = 480 / 2;
                        var tw = 0;
                        var th = 0;

                        if (orientation) {
                            if (orientation === 1) {
                                tw = size;
                                th = Math.round(oh * (tw / ow));
                            }
                            if (orientation === 6) {
                                th = size;
                                tw = Math.round(ow * (th / oh));
                            }
                        } else {
                            tw = 320 / 2;
                            th = 480 / 2;
                        }


                        var mpImg = new MegaPixImage(img);

                        var ctx = myCan.getContext('2d');
                        mpImg.render(myCan, { maxWidth: tw, maxHeight: th, orientation: orientation, quality: 0.1 });
                        var dataURL = myCan.toDataURL("image/jpeg");


                        cb(dataURL);


                    });

                };
            }

            function saveData(id, data) {
                AppDB.transaction(
                    function (tx) {
                        tx.executeSql(
                            "INSERT INTO Picture2 (id, data) VALUES (?, ?)",
                            [id, data],
                            function (tx, result) {
                                console.log("Query Success");
                            },
                            function (tx, error) {
                                console.log("Query Error: " + error.message);
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
            }


            function gotPic(event) {

                if (event.target.files.length === 1 &&
                    event.target.files[0].type.indexOf("image/") === 0) {

                    entity.isProcessingImage = true;
                    $rootScope.$digest();

                    var reader = new FileReader();
                    var file = event.target.files[0];
                    var id = URL.createObjectURL(file);
                    URL.revokeObjectURL(id);
                    reader.readAsDataURL(file);

                    reader.onload = function (e) {
//                        entity = $parse(attrs.cameraBtn)(scope);
                        entity.picture = id;
                        var data = e.target.result;

                        processData(data, function (data) {
                            $timeout(function () {
                                saveData(id, data);
                                entity.isProcessingImage = false;
                                $rootScope.$digest();
                            }, 2000);

                        });
                    };

                }
            }

            element.on("change", gotPic);

        }
    }

    function axiLoadPicture($parse, AppDB, $timeout, $cacheFactory) {

        console.log('axiLoadPicture');

        var picturesCache = $cacheFactory('picturesCache');

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

            attrs.$observe('axiLoadPicture', function (val) {
                var pictureId = attrs.axiLoadPicture;

                if (pictureId) {
                    loadPicture(pictureId);
                }

            });


            function loadPicture(pictureId) {

                var loadElem = angular.element('<span />', {
                    class: 'picture-loader'
                }).prependTo(element.parent());

                function fakeLoading() {
                    loadElem.addClass('active');
                }


                AppDB.transaction(
                    function (tx) {


                        if (picturesCache.get(pictureId)) {
                            console.log('from Cache');
                            element.attr("src", picturesCache.get(pictureId));

                        } else {
                            fakeLoading();
                        }

                        tx.executeSql(
                            "SELECT data FROM Picture2 WHERE id=? ",
                            [pictureId],
                            function (tx, results) {
                                var len = results.rows.length, i;
                                for (i = 0; i < len; i++) {
                                    var row = results.rows.item(i);
                                    element.attr("src", row.data);
                                    picturesCache.put(pictureId, row.data);

//                                    console.log($(element).prop('naturalWidth'), $(element).prop('naturalHeight'));
//                                    console.log('PictureID:', pictureId);
//                                    console.log('row.data:', row.data);

                                }
                            },
                            function (tx, error) {
                                console.log("Query Error: " + error.message);
                            }
                        );
                    },
                    function (error) {
                        console.log("Transaction Error: " + error.message);
                    },
                    function () {

//                        $timeout(function () {
                            loadElem.remove();
//                        }, 1000);

                    }
                );


            }


        }
    }


}());


//                var transaction = AppDB.db.transaction(["picture"], "readonly");
//                var objectStore = transaction.objectStore("picture");
//                var ob = objectStore.get(pictureId);
//                ob.onsuccess = function(e) {
//                    var result = e.target.result;
//                    element.attr("src", result);
//                    scope.$digest();
//                };

//                var currentWidth = 0;

//                function loadingCheck() {
//
//                    var speed = 5;
//                    var inc = (widthElem - currentWidth) / speed;
//                    var result = currentWidth + inc;
//                    currentWidth = result;
//
//                    loadElem.width(currentWidth + 'px');
////                    console.log(widthElem, currentWidth, inc);
//
//                    return loading;
//                }


//                function doWhile() {
//                    $timeout.cancel(promise);
//                    if (loadingCheck()) {
//                        promise = $timeout(doWhile, 0);
//                    } else {
//                        loadElem.remove();
//                    }
//                }

//                if (pictureId && picturesCache.get(pictureId)) {
//                    element.attr("src", picturesCache.get(pictureId));
//                }else{
//                    loadPicture(pictureId);
//                }
//                        var transaction = AppDB.db.transaction(["picture"],"readwrite");
//                        var store = transaction.objectStore("picture");
//
//                        var request = store.add(data,id);
//
//                        request.onerror = function(e) {
//                            console.log("Error",e.target.error.name);
//                            //some type of error handler
//                        }
//
//                        request.onsuccess = function(e) {
//                            console.log("Woot! Did it");
//                        }

