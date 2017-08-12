/**
 * The main Slipstream lite application module
 *
 * @module slipstream
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
(function() {
    /**
     * Get the base URL to be used to load slipstream
     * modules via requirejs.
     * 
     * @return The base URL to be used for loading slipstream
     * modules.
     */
    function getBaseURL() {
        var scripts = document.scripts,
            baseUrl = "";

        for (var i = 0; i < scripts.length; i++) {
            /**
             * Get the src property of the slipstream.js <script> element and
             * return it's base URL.
             */
            var match = scripts[i].src.match(/(.*)\/slipstream.js$/);

            if (match) {
                baseUrl = match[1];
                break;
            }
        }

        return baseUrl;
    }

    window.slipstream = {
        initialize: function(options) {
            var baseUrl = getBaseURL();

            if (!baseUrl) {
                throw new Error("Can't determine slipstream base URL.  Slipstream must be included using a <script> tag.");
            }

            require.config({
                baseUrl: baseUrl,
                paths: {
                    'jquery': 'vendor/jquery/jquery',
                    'jqueryui': 'vendor/jquery/jquery-ui',
                    'marionette': 'vendor/backbone/backbone.marionette',
                    'jqueryDatepicker': 'vendor/jquery/jquery-ui-datepicker',
                    'jquery-i18n': 'lib/jquery-i18n-properties/jquery.i18n.properties',
                    'jquery.shapeshift': 'vendor/jquery/jquery.shapeshift',
                    'jquery.toastmessage': 'vendor/jquery/jquery.toastmessage',
                    'toastr': 'vendor/jquery/toastr/toastr',
                    'jcarousel': 'vendor/jquery/jcarousel/jquery.jcarousel',
                    'modernizr': 'vendor/modernizr/modernizr',
                    'foundation': 'vendor/foundation/foundation',
                    'underscore': 'vendor/underscore/underscore',
                    'hogan': 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
                    'backbone': 'vendor/backbone/backbone',
                    'backbone.picky': 'vendor/backbone/backbone.picky',
                    'backbone.modal': 'vendor/backbone/backbone.modal',
                    'backbone.syphon': 'vendor/backbone/backbone.syphon',
                    'backbone.marionette.modals': 'vendor/backbone/backbone.marionette.modals',
                    'validator': 'vendor/validator/validator',
                    'text': 'vendor/require/text',
                    'd3': 'vendor/d3/d3',
                    'highcharts': 'vendor/highcharts/highcharts',
                    'highchartsmore': 'vendor/highcharts/highcharts-more',
                    'gridLocale': 'vendor/jquery/jqGrid/i18n/grid.locale-en',
                    'jqGrid': 'vendor/jquery/jqGrid/jquery.jqGrid',
                    'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
                    'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
                    'template': 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
                    'URI': 'vendor/uri/URI',
                    'jqueryTabs': 'vendor/jquery/tabs/jquery-ui-tabs',
                    'jqueryVerticalTabs': 'vendor/jquery/tabs/vertical-tabs',
                    'tagit': 'widgets/search/lib/tag-it',
                    'isInViewport': 'vendor/jquery/isInViewport/isInViewport',
                    'infiniteScroll': 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
                     progressbar: 'vendor/progressbar/progressbar.min',
                    /* Foundation */
                    'foundation.core': 'vendor/foundation/js/foundation',
                    'foundation.abide': 'vendor/foundation/js/foundation/foundation.abide',
                    'foundation.accordion': 'vendor/foundation/js/foundation/foundation.accordion',
                    'foundation.alert': 'vendor/foundation/js/foundation/foundation.alert',
                    'foundation.clearing': 'vendor/foundation/js/foundation/foundation.clearing',
                    'foundation.dropdown': 'vendor/foundation/js/foundation/foundation.dropdown',
                    'foundation.interchange': 'vendor/foundation/js/foundation/foundation.interchange',
                    'foundation.joyride': 'vendor/foundation/js/foundation/foundation.joyride',
                    'foundation.magellan': 'vendor/foundation/js/foundation/foundation.magellan',
                    'foundation.offcanvas': 'vendor/foundation/js/foundation/foundation.offcanvas',
                    'foundation.orbit': 'vendor/foundation/js/foundation/foundation.orbit',
                    'foundation.reveal': 'vendor/foundation/js/foundation/foundation.reveal',
                    'foundation.tab': 'vendor/foundation/js/foundation/foundation.tab',
                    'foundation.tooltip': 'vendor/foundation/js/foundation/foundation.tooltip',
                    'foundation.topbar': 'vendor/foundation/js/foundation/foundation.topbar'
                },
                shim: {
                    'underscore': {
                        exports: '_'
                    },
                    'URI': {
                        exports: 'URI'
                    },
                    'template': {
                        exports: 'template'        
                    },
                    'hogan': {
                        deps: [ 'template' ],
                        exports: 'Hogan'
                    },
                    'jquery.shapeshift': {
                        deps: ['jqueryui'],
                        exports: 'shapeshift'
                    },      
                    'jcarousel': {
                        deps: ['jquery'],
                        exports: 'jcarousel'
                    },
                    'toastr': {
                        deps: ['jquery'],
                        exports: 'toastr'
                    },
                    'backbone': {
                        deps: [ 'underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    'backbone.localStorage': {
                        deps: [ 'backbone'],
                        exports: 'Backbone.LocalStorage'
                    },
                    'backbone.picky': ['backbone'],
                    'backbone.syphon': {
                        deps: [ 'backbone'],
                        exports: 'Backbone.Syphon'
                    },
                    'marionette': {
                        deps: ['backbone'],
                        exports: 'Marionette'
                    },
                    'backbone.modal': {
                        deps: [ 'backbone'],
                        exports: 'Backbone.Modal'
                    },
                    'backbone.marionette.modals': {
                        deps: [ 'backbone','marionette'],
                        exports: 'Backbone.Marionette.Modals'
                    },
                    'modernizr': {
                        exports: 'Modernizr'
                    },
                    'jquery-i18n': {
                        deps: ['jquery'],
                        exports: 'jQuery.i18n'
                    },
                    'jqueryDatepicker':{
                        deps: ['jquery'],
                        exports: 'jqueryDatepicker'
                    },
                    'highcharts': {
                        deps: ['jquery'],
                        exports: 'highcharts'
                    },
                    'highchartsmore': {
                        deps: ['highcharts', 'jquery'],
                        exports: 'highchartsmore'
                    },
                    'jqGrid': {
                        deps: ['jquery','gridLocale'],
                        exports: 'jqGrid'
                    },
                    'jquery.contextMenu': {
                        deps: ['jquery'],
                        exports: '$.contextMenu'
                    },
                    'jquery.tooltipster': {
                        deps: [
                            'jquery'
                        ],
                        exports: 'tooltipster'
                    },
                    'jqueryTabs': {
                        deps: ['jquery'],
                        exports: 'tabs'
                    },
                    'jqueryVerticalTabs': {
                        deps: ['jqueryTabs']
                    },
                    'tagit': {
                        deps: ['jquery','jqueryui'],
                        exports: 'tagit'
                    },
                    'isInViewport': {
                        deps: ['jquery']
                    },
                    infiniteScroll: {
                        deps: ['jquery'],
                        exports: 'infiniteScroll'
                    },

                    /* Foundation */
                    'foundation.core': {
                        deps: [
                            'jquery',
                            'modernizr'
                        ],
                        exports: 'Foundation'
                    },
                    'foundation.abide': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.accordion': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.alert': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.clearing': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.dropdown': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.interchange': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.joyride': {
                        deps: [
                            'foundation.core',
                            'foundation.cookie'
                        ]
                    },
                    'foundation.magellan': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.offcanvas': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.orbit': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.reveal': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.tab': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.tooltip': {
                        deps: [
                            'foundation.core'
                        ]
                    },
                    'foundation.topbar': {
                        deps: [
                            'foundation.core'
                        ]
                    }
                }
            });

            require(["marionette"], function() {
                var Slipstream = new Marionette.Application();

                Slipstream.on("start", function() {
                    console.log("Slipstream started");
                    // call provided callback when initialization is complete.
                    if (options.onInit && (typeof options.onInit == "function")) {
                        options.onInit();
                    }
                });

                window.Slipstream = Slipstream;

                require(["modules/i18n", "modules/template_renderer", "sdk/preferences", "modules/view_adapter"], function() {
                    Slipstream.start({
                        baseUrl: baseUrl + "/.."
                    });
                });
            });
        }
    }
})();