/**
 * The List Builder test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        'foundation.tooltip': 'vendor/foundation/js/foundation/foundation.tooltip',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        template: {
            exports: 'template'
        },
        hogan: {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        backbone: {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ]
        },
        'foundation.tooltip': {
            deps: ['foundation.core']
        },
        'jqueryDatepicker': {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        }
    }
});

define([
    'jquery',
    'foundation.core',
    'foundation.tooltip'
], function ($, foundation) {
    $(document).foundation();

    //Renders a form from the elements configuration file using the Form Widget and the automatic integration to the IP CIDR widget
    require(['widgets/ipCidr/tests/appIpCidrFormWidgetsBuilder'], function(IpCidrFormWidgetView){
        new IpCidrFormWidgetView({
            el: '#main_content'
        });
    });

    //Renders a declarative form and incorporates the elements of the IP CIDR widget
//    require(['widgets/ipCidr/tests/appIpCidrBuilder'], function(IpCidrView){
//        new IpCidrView({
//            el: '#main_content'
//        });
//    });
});
