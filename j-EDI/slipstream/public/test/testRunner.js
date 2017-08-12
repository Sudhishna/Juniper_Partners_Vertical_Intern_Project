require.config({
  baseUrl: '/assets/js/',
  paths: {
    'URI'                       : 'vendor/uri/URI',
    'jquery'                    : 'vendor/jquery/jquery',
    'jqueryui'                  : 'vendor/jquery/jquery-ui',
    'jqueryDatepicker'          : 'vendor/jquery/jquery-ui-datepicker',
    'jcarousel'                 : 'vendor/jquery/jcarousel/jquery.jcarousel',
    'jquery.idle-timer'         : 'vendor/jquery/jquery.idle-timer',
    'jquery.shapeshift'         : 'vendor/jquery/jquery.shapeshift',
    'jquery-deparam'            : 'vendor/jquery/jquery-deparam/jquery-deparam',
    'jquery-i18n'               : 'lib/jquery-i18n-properties/jquery.i18n.properties',
    'jquery.contextMenu'        : 'vendor/jquery/jqContextMenu/jquery.contextMenu',
    'underscore'                : 'vendor/underscore/underscore', 
    'template'                  : 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
    'hogan'                     : 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
    'backbone'                  : 'vendor/backbone/backbone',
    'backbone.localStorage'     : 'vendor/backbone/backbone.localStorage',
    'backbone.picky'            : 'vendor/backbone/backbone.picky',
    'backbone.syphon'           : 'vendor/backbone/backbone.syphon',
    'marionette'                : 'vendor/backbone/backbone.marionette',
    'backbone.modal'            : 'vendor/backbone/backbone.modal',
    'backbone.marionette.modals': 'vendor/backbone/backbone.marionette.modals',
    'mocha'                     : 'vendor/mocha/mocha',
    'chai'                      : 'vendor/chai/chai',
    'text'                      : 'vendor/require/text',
    'modernizr'                 : 'vendor/modernizr/modernizr',
    'd3'                        : 'vendor/d3/d3',
    'validator'                 : 'vendor/validator/validator',
    'jqGrid'                    : 'vendor/jquery/jqGrid/jquery.jqGrid',
    'highcharts'                : 'vendor/highcharts/highstock',
    'highchartsmore'            : 'vendor/highcharts/highcharts-more',
    'toastr'                    : 'vendor/jquery/toastr/toastr',
    'select2'                   : 'vendor/jquery/select2/select2.full',
    'MutationObserver'          : 'vendor/MutationObserver.js/MutationObserver',
    'jqGrid'                    : 'vendor/jquery/jqGrid/jquery.jqGrid',
    'select2'                   : 'vendor/jquery/select2/select2.full',
    'leaflet'                   : 'vendor/leaflet/leaflet-0.7.3',
    'mockjax'                   : 'vendor/jquery/jquery.mockjax',
    'moment'                    : 'vendor/moment/moment-with-locales.min',
    'progressbar'               : 'vendor/progressbar/progressbar.min',
    'jstree'                    : 'vendor/jquery/jstree/jstree',
    'leaflet_canvas_layer'      : 'vendor/leaflet/leaflet_canvas_layer',
    'jqueryTabs'                : 'vendor/jquery/tabs/jquery-ui-tabs',
    'jqueryVerticalTabs'        : 'vendor/jquery/tabs/vertical-tabs',
    'tagit'                     : 'widgets/search/lib/tag-it',
    'uuid'                      : 'vendor/uuid/uuid',
    'sidr'                      : 'vendor/jquery/sidr/jquery.sidr.min',
    'isInViewport'              : 'vendor/jquery/isInViewport/isInViewport',
    'infiniteScroll'            : 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
    'canvasv5'                  : 'vendor/polyfills/canvasv5.js/canvasv5',
     'slick'                    : 'vendor/jquery/slick/slick',

      /* Foundation */
    'foundation.core'           : 'vendor/foundation/js/foundation',
    'foundation.abide'          : 'vendor/foundation/js/foundation/foundation.abide',
    'foundation.accordion'      : 'vendor/foundation/js/foundation/foundation.accordion',
    'foundation.alert'          : 'vendor/foundation/js/foundation/foundation.alert',
    'foundation.clearing'       : 'vendor/foundation/js/foundation/foundation.clearing',
    'foundation.dropdown'       : 'vendor/foundation/js/foundation/foundation.dropdown',
    'foundation.interchange'    : 'vendor/foundation/js/foundation/foundation.interchange',
    'foundation.joyride'        : 'vendor/foundation/js/foundation/foundation.joyride',
    'foundation.magellan'       : 'vendor/foundation/js/foundation/foundation.magellan',
    'foundation.offcanvas'      : 'vendor/foundation/js/foundation/foundation.offcanvas',
    'foundation.orbit'          : 'vendor/foundation/js/foundation/foundation.orbit',
    'foundation.reveal'         : 'vendor/foundation/js/foundation/foundation.reveal',
    'foundation.tab'            : 'vendor/foundation/js/foundation/foundation.tab',
    'foundation.tooltip'        : 'vendor/foundation/js/foundation/foundation.tooltip',
    'foundation.topbar'         : 'vendor/foundation/js/foundation/foundation.topbar',
    'jquery.tooltipster'        : 'vendor/jquery/jqTooltipster/jquery.tooltipster'
  },
  shim: {
    'modernizr' : {
        exports: 'Modernizr'
    },
    'URI': {
      exports: 'URI'
    },
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'jquery-i18n': {
        deps: ['jquery'],
        exports: 'jQuery.i18n'
    },
    'toastr': {
        deps: ['jquery'],
        exports: 'toastr'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.picky': {
        deps: ['backbone'],
        exports: 'Backbone.Picky'
    },
    'marionette' : {
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
    'hogan': {
        deps: [ 'template' ],
        exports: 'Hogan'
    },
    'backbone.syphon': {
        deps: [ 'backbone'],
        exports: 'Backbone.Syphon'
    },
    'leaflet_canvas_layer': {
      deps: ['leaflet']
    },
    'jquery.shapeshift': {
        deps: ['jqueryui'],
        exports: 'shapeshift'
    },      
    'jcarousel': {
        deps: ['jquery'],
        exports: 'jcarousel'
    },
    'jquery-deparam': {
        deps: ['jquery'],
        exports: 'jquery-deparam'
    },
    'jqueryDatepicker':{
        deps: ['jquery'],
        exports: 'jqueryDatepicker'
    },
    jqGrid: {
        deps: ['jquery'],
        exports: 'jqGrid'
    },
    'jquery.contextMenu': {
        deps: ['jquery'],
        exports: '$.contextMenu'
    },
    'highcharts':{
        deps: ['jquery'],
        exports: 'highcharts'
    },
    'highchartsmore': {
          deps: ['highcharts', 'jquery'],
          exports: 'highchartsmore'
    },
    'jquery.tooltipster': {
         deps: ['jquery'],
         exports: 'tooltipster'
    },
    'select2': {
         deps: ['jquery'],
         exports: 'select2'
    },
    'jstree': {
         deps: ['jquery'],
         exports: 'jstree'
    },
    'jqueryTabs': {
        deps: ['jquery'],
        exports: 'tabs'
    },
    'jqueryVerticalTabs': {
        deps: ['jqueryTabs']
    },
    tagit: {
      deps: ['jquery','jqueryui'],
      exports: 'tagit'
    },
    infiniteScroll: {
      deps: ['jquery'],
      exports: 'infiniteScroll'
    },
    'slick': {
      deps: ['jquery'],
      exports: 'slick'
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
    },
    'MutationObserver': {
        exports: 'MutationObserver'
    },
    'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
    },
    'jqueryVerticalTabs': {
        deps: ['jqueryTabs']
    },
    tagit: {
        deps: ['jquery','jqueryui'],
        exports: 'tagit'
    },
    'isInViewport': {
      deps: ['jquery']
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});

require(['chai'], function(chai) {

  // Chai
  var should = chai.should();
  window.expect = chai.expect;
  window.assert =  chai.assert;

  /*globals mocha */
  mocha.setup('bdd');

  require([
    'Slipstream'
  ], function(Slipstream) {
    Slipstream.vent.on("framework:booted", function() {
        require([
            /*'/test/url_router/tests.js',*/
            '/test/pluginTests.js',
            '/test/i18n/tests.js',
            '/test/view_manager/tests.js',
            '/test/globalSearch/tests.js',
            '/test/widgets/timeWidgetTests.js',
            '/test/widgets/timeUtilTests.js',
            '/test/widgets/timeZoneWidgetTests.js',
            '/test/widgets/overlayWidgetTests.js',
            '/test/widgets/shortWizardWidgetTests.js',
            '/test/widgets/formWidgetTests.js',
            '/test/widgets/listBuilderWidgetTests.js',
            '/test/widgets/datepickerWidgetTests.js',
            '/test/widgets/ipCidrWidgetTests.js',
            '/test/widgets/gridWidgetTests.js',
            '/test/widgets/barChartWidgetTests.js',
            '/test/widgets/donutChartWidgetTests.js',
            '/test/widgets/timeSeriesChartWidgetTests.js',
            '/test/widgets/lineChartWidgetTests.js',
            '/test/widgets/mapWidgetTests.js',
            '/test/widgets/confirmationDialogWidgetTests.js',
            '/test/widgets/dropDownWidgetTests.js',
            '/test/widgets/scheduleRecurrenceWidgetTest.js',
            '/test/widgets/tabContainerWidgetTest.js',
            '/test/widgets/carouselWidgetTests.js',
            '/test/preferences/tests.js',
            '/test/notifications/tests.js',
            '/test/utils/tests.js',
            '/test/dateFormatter/tests.js',
            '/test/widgets/treeTests.js',
            '/test/navigateAway/tests.js',
            '/test/analytics/tests.js'            
        ], function() {
            require(['/test/widgets/dashboardWidgetTests.js'], function() {
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }    
            });
        });
    });
    Slipstream.boot();
  });
});
