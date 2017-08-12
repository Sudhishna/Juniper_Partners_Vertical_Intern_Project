/**
 * The form test page.
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
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        marionette: 'vendor/backbone/backbone.marionette',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'select2': 'vendor/jquery/select2/select2.full',
        'mockjax': 'vendor/jquery/jquery.mockjax',
        tagit: 'widgets/search/lib/tag-it',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
        progressbar: 'vendor/progressbar/progressbar.min'
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
        marionette: {
            deps: [ 'backbone'],
            exports: 'Marionette'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'foundation.core': {
            deps: ['jquery','modernizr']
        },
        'jqueryDatepicker': {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        jqGrid: {
            deps: ['jquery','jqueryui','gridLocale'],
            exports: 'jqGrid'
        },
        'jquery.tooltipster': {
            deps: [
                'jquery'
            ],
            exports: 'tooltipster'
        },
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        }
    }
});

define([
    'jquery',
    'backbone',
    'foundation.core',
    'underscore'
], function ($, Backbone, foundation) {
    $(document).foundation();

    var FormView = Backbone.View.extend({

        render: function () {
            var formExample = window.location.hash.substring(1);
            switch (formExample) {
                case 'copy':
                    //Renders a form that provides cloning of rows
                    this.createView('widgets/form/tests/appCopyRowsForm');
                    break;
                case 'declarative':
                    //Renders a declarative form from the declarativeFormSample.html in template folder
                    this.createView('widgets/form/tests/appDeclarativeFormValidator');
                    break;
                case 'nobinding':
                    //Renders a form from the elements configuration file without data binding
                    this.createView('widgets/form/tests/appElementsForm');
                    break;
                default:
                    //Renders a form from two configuration Objects: the elements and the values
                    this.createView('widgets/form/tests/appElementsValuesForm');
                    break;
            };
        },

        createView: function (viewPath) {
            var formContainer = this.el;
            require([ viewPath], function(FormView){
                new FormView({
                    el: formContainer
                });
            });
        }

    });

    new FormView({
        el:'#test_form_widget'
    }).render();

});

