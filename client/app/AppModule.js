(function () {
    "use strict";

//    . ~/setProxyDTSI
// http://192.168.106.48/organigramme/


/*

    TODO Bugs

    TODO Mobile
    AppCache
    Error Alert Popup
    Pre-loader
    App icon
    Swipe lef/right through profiles subsets
    Delete images from db based from a 2 on the saved local db

    find how to give a name to the instance of orientdb to stop and start it withou the id...

    TODO Desktop
    Create a Graph representation of the tags with D&D

*/



    var modules = [
        'LoggerModule',
        'OrientdbModule',
        'ui.router',
        'ngMessages',
        'ngTouch',
        'ngAnimate'
    ];


    angular
        .module('AppModule', modules)
        .provider('AppConfig', AppConfigProvider)
        .directive('axBgColor', axBgColor)
        .run(Run);


    function AppConfigProvider() {

        this.config = {
            initType: null
        };

        this.$get = function AppConfigFactory() {
            return {config: this.config};
        };
    }


    function Run($rootScope, OdbService) {
        $rootScope.isLoading = true;
        OdbService.connect('Organigramme', 'http://localhost:2480');
        OdbService.auth('visitor', 'visitor');
    }

    function axBgColor($parse, AppConfig) {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var entity = $parse(attrs.axBgColor)(scope);
             var colors = AppConfig.config.colors;

            if (entity){

                if(!entity.bgIdx) {
                    var idx = _.random(0, colors.length -1);
                    entity.bgIdx = idx;
                }
                element.addClass(colors[entity.bgIdx]);
            }




        }
    }



})();

