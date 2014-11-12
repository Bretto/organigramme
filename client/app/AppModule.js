(function () {
    "use strict";

//    . ~/setProxyDTSI
// http://192.168.106.48/organigramme/

    var modules = [
        'LoggerModule',
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


    function Run($rootScope) {
        $rootScope.isLoading = true;
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

