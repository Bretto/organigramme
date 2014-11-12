(function () {
    "use strict";

    var module = angular.module('LoggerModule', []);

    module.config(function ($provide) {


        var supplant = function (template, values, pattern) {
            pattern = pattern || /\{([^\{\}]*)\}/g;

            return template.replace(pattern, function (a, b) {
                var p = b.split('.'),
                    r = values;

                try {
                    for (var s in p) {
                        r = r[p[s]];
                    }
                    ;
                } catch (e) {
                    r = a;
                }

                return (typeof r === 'string' || typeof r === 'number') ? r : a;
            });
        };


        // supplant() method from Crockfords `Remedial Javascript`
        Function.prototype.method = function (name, func) {
            this.prototype[name] = func;
            return this;
        };

        String.method("supplant", function (values, pattern) {
            var self = this;
            return supplant(self, values, pattern);
        });


        // Publish this global function...
        String.supplant = supplant;

        //---------------

        var buildTimeString = function (date, format) {
            format = format || '%h:%m:%s:%z';

            function pad(value) {
                return (value.toString().length < 2) ? '0' + value : value;
            }

            return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
                switch (fmtCode) {
                    case 'Y' :
                        return     date.getFullYear();
                    case 'M' :
                        return pad(date.getMonth() + 1);
                    case 'd' :
                        return pad(date.getDate());
                    case 'h' :
                        return pad(date.getHours());
                    case 'm' :
                        return pad(date.getMinutes());
                    case 's' :
                        return pad(date.getSeconds());
                    case 'z':
                        return pad(date.getMilliseconds());
                    default:
                        throw new Error('Unsupported format code: ' + fmtCode);
                }
            });
        }

        // Publish API for DateTime utils
        var DateTime = {
            formattedNow: function () {
                return buildTimeString(new Date());
            }
        };


        var navigator = window.navigator;

        var BrowserDetect = {

            /**
             * Sets the browser version and OS(Operating Systems) uses {@link mindspace.utils:BrowserDetect#searchString searchString}
             * and {@link mindspace.utils:BrowserDetect#searchVersion searchVersion} internally
             */
            init: function () {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) ||
                    "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";

                return BrowserDetect;
            },

            /**
             * Checks whether the browser is IE8. Root element(html) is already set with class='ie8
             * this function uses the same class reference and provides the status.
             */
            isIE8: function () {
                if (document.documentElement.hasAttribute("class") && document.documentElement.getAttribute("class") === "ie8") {
                    return true;
                }
                return false;
            },

            /**
             * User for determining the browser and OS based on the input provided by the data param.
             * Also sets the versionSearchString parameter which would be used by
             * {@link mindspace.utils:BrowserDetect#searchVersion searchVersion}
             */
            searchString: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;

                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1) {
                            return data[i].identity;
                        }
                    }
                    else if (dataProp) {
                        return data[i].identity;
                    }
                }
            },

            /**
             * User for determining the browser version based on input string
             */
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) {
                    return;
                }
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },

            // NOTE: It's important to list PhantomJS first since it has the same browser information as Safari
            dataBrowser: [
                {
                    string: "PhantomJS",
                    subString: "PhantomJS",
                    identity: "PhantomJS",
                    versionSearch: "PhantomJS"
                },
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                { // for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS: [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ]

        };

        BrowserDetect.init();


        $provide.decorator('$log', function ($delegate) {

            var enhanceLogger = function( $log )
            {
                /**
                 * Capture the original $log functions; for use in enhancedLogFn()
                 */
                var _$log = (function( $log )
                    {
                        return {
                            log   : $log.log,
                            info  : $log.info,
                            warn  : $log.warn,
                            debug : $log.debug,
                            error : $log.error
                        };
                    })( $log );

                    var separator = "::";

                    var colorify  = function( message, colorCSS )
                    {
                        var isChrome    = ( BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "PhantomJS"),
                            canColorize = isChrome && (colorCSS !== undefined );

                        return canColorize ? [ "%c" + message, colorCSS ] : [ message ];
                    };

                    /**
                     * Partial application to pre-capture a logger function
                     */
                    var prepareLogFn = function( logFn, className, colorCSS )
                    {
                        /**
                         * Invoke the specified `logFn` with the supplant functionality...
                         */
                        var enhancedLogFn = function ( )
                        {
                            var args = Array.prototype.slice.call(arguments),
                                now  = DateTime.formattedNow();

                            // prepend a timestamp and optional classname to the original output message
                            args[0] = supplant("{0} - {1}{2}", [ now, className, args[0] ]);
                            args    = colorify( supplant.apply( null, args ), colorCSS );

                            logFn.apply( null, args );
                        };

                        return enhancedLogFn;
                    };
                    /**
                     * Support to generate class-specific logger instance with classname only
                     *
                     * @param name
                     * @returns Object wrapper facade to $log
                     */
                    var getInstance = function( className, colorCSS)
                    {
                        className = ( className !== undefined ) ? className + "::" : "";

                        return {
                            log   : prepareLogFn( _$log.log,    className, colorCSS  ),
                            info  : prepareLogFn( _$log.info,   className, colorCSS  ),
                            warn  : prepareLogFn( _$log.warn,   className, colorCSS  ),
                            debug : prepareLogFn( _$log.debug,  className, colorCSS  ),
                            error : prepareLogFn( _$log.error,  className) // NO styling of ERROR messages
                        };
                    };

//                $log.log   = prepareLogFn( $log.log );
//                $log.info  = prepareLogFn( $log.info );
//                $log.warn  = prepareLogFn( $log.warn );
//                $log.debug = prepareLogFn( $log.debug );
//                $log.error = prepareLogFn( $log.error );

                // Add special method to AngularJS $log
                $log.getInstance = getInstance;

                return $log;
            };


            enhanceLogger($delegate);

            return $delegate;
        });
    });


})();