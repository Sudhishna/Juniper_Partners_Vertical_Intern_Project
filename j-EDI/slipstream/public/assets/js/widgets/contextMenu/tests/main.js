/**
 * The Context Menu test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        marionette: 'vendor/backbone/backbone.marionette',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'jquery.ui.position': 'vendor/jquery/jquery.ui.position'
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
        'backbone.picky': ['backbone'],
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'jquery.ui.position': {
            deps: [
                'jquery'
            ],
            exports: '$.ui.position'
        },
        'jquery.contextMenu': {
            deps: [
                'jquery'
            ],
            exports: '$.contextMenu'
        }

    }

});

define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {

    $(document).foundation();
    //Renders a Context Menu from the elements configuration file
    require(['widgets/contextMenu/tests/appContextMenu'], function(ContextMenuView){
        new ContextMenuView({
            el: $('#main_content')
        });
    });
});
