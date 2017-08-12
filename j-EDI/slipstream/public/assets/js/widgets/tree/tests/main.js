/**
 * Sample Tree Widget Page.
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        text: 'vendor/require/text',
        validator: 'vendor/validator/validator',
        'mockjax': 'vendor/jquery/jquery.mockjax',
        'jstree': 'vendor/jquery/jstree/jstree'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'template': {
            exports: 'template'
        },
        'hogan': {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        'backbone': {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'mockjax': {
            deps: ['jquery'],
            exports: 'mockjax'
        }
    }
});

define([
    'jquery',
    'underscore'
], function ($, _) {

    require(['widgets/tree/tests/treeView'], function(TreeView) {

        var view = new TreeView({
            el: '#main_content'
        });
        view.render();
    });
});
