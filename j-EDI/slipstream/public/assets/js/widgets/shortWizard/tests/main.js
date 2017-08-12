/**
 * The ShortWizard test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Dennis Park <dpark@juniper.net>
 */

require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        jqueryui: 'vendor/jquery/jquery-ui',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        modernizr: 'vendor/modernizr/modernizr',
        foundation: 'vendor/foundation/foundation',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        "backbone.modal": "vendor/backbone/backbone.modal",
        marionette: 'vendor/backbone/backbone.marionette',
        "backbone.marionette.modals": "vendor/backbone/backbone.marionette.modals",
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        'foundation.core': 'vendor/foundation/js/foundation',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
        tagit: 'widgets/search/lib/tag-it',
        infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        progressbar: 'vendor/progressbar/progressbar.min',
        'select2': 'vendor/jquery/select2/select2.full'        
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
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone.modal': {
            deps: [ 'backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: [ 'backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        jqGrid: {
            deps: ['jquery','jqueryui','gridLocale'],
            exports: 'jqGrid'
        },
        'jquery.contextMenu': {
            deps: ['jquery'],
            exports: '$.contextMenu'
        },
        'jquery.tooltipster': {
            deps: ['jquery'],
            exports: 'tooltipster'
        },
        tagit: {
            deps: ['jquery','jqueryui'],
            exports: 'tagit'
        },
        'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
        },
        'jqueryVerticalTabs': {
            deps: ['jqueryTabs']
        },
        'isInViewport': {
            deps: ['jquery']
        },
        'infiniteScroll': {
          deps: ['jquery'],
          exports: 'infiniteScroll'
        },
        'select2': {
            deps: ['jquery'],
            exports: 'select2'
        }
    }
});
    

require([
    'marionette',
    'lib/template_renderer/template_renderer',
    'widgets/shortWizard/shortWizard',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/shortWizard/tests/conf/customSummarySample',
    'backbone'
], function(Marionette, template_renderer, ShortWizard, Overlay, FormWidget, GridWidget, customSummarySample, Backbone) {
    Marionette.Renderer.render = template_renderer;

    MyIntroPageView = Backbone.View.extend({
        getTitle : function() {
            return 'My Intro Page Title';
        },
        getDescription: function(){
            return 'My Intro Page description.';
        },
        render: function(){
            this.$el.html('<h3>This is is the intro page content</h3><p>This wizard will succeed on every other attempt.</p>');
            return this;
        }
    });

    MyObjView = Backbone.View.extend({
        render: function(){
            this.$el.html(this.options.name);
            return this;
        },
        getTitle: function(){
            return this.options.name;
        },
        getDescription: function(){
            return this.options.name + ' should completely fill out form.';
        },
        beforePageChange: function(currentStep, requestedStep) {
            console.log('beforePageChange called, current step is ' + currentStep + ', requested step is ' + requestedStep);
            return true;
        }
    });

    MyCustomView = Backbone.View.extend({
        initialize: function(pages){
            console.log(pages);
        },
        render: function(){
            this.formWidget = new FormWidget({
                "elements": customSummarySample.elements,
                "container": this.$el
            });
            this.formWidget.build();

            this.grid = new GridWidget({
                container: this.$el,
                elements: customSummarySample.smallGrid
            });
            this.grid.build();
            return this;
        }
    });

    CustomDoneStatusFooter = Backbone.View.extend({
        render: function(){
            this.grid = new GridWidget({
                container: this.$el,
                elements: customSummarySample.smallGrid
            });
            this.grid.build();
            return this;
        }
    });

    myIntroPage = {title: "Intro", view: new MyIntroPageView(), intro: true};
    myPage1 = {title: "Page 1", view: new MyObjView({name: "myWizardPage1"})};
    myPage2 = {title: "Page 2", view: new MyObjView({name: "myWizardPage2"})};
    myPage3 = {title: "Page 3", view: new MyObjView({name: "myWizardPage3"})};
    myPage4 = {title: "Page 4", view: new MyObjView({name: "myWizardPage4"})};

    var attempts = 0;

    OverlayView = Backbone.View.extend({
        render: function() {

            myPage1.view.beforePageChange = function(currentPage, requestedPage){
                console.log('Stay in the current page for 2 sec');
                console.log('beforePageChange called, current step is ' + currentPage + ', requested step is ' + requestedPage);
                setTimeout(function(){
                    console.log('trigger nextPage API');    
                    wizard.nextPage(true);
                }, 2000);

                return false;
            };

            var wizard = new ShortWizard({
                title: "Quickstart Setup Wizard",
                showSummary: MyCustomView,  // Optional, defaults to true
                titleHelp: {
                    "content": "Tooltip for the title of ShortWizard",
                    "ua-help-identifier": "alias_for_title_ua_event_binding",
                    "ua-help-text" : "More..."
                },
                pages: [myIntroPage, myPage1, myPage2, myPage3, myPage4],
                container: this.$el,
                summaryTitle: "My Custom Summary Title",
                summaryEncode: true,
                save: function(options) {
                    attempts++;

                    // Simulate network activity
                    setTimeout(function() {
                        if (attempts % 2 === 0) {
                            options.success('The setup wizard was successful');
                            return;
                        }

                        options.error('The setup wizard failed');
                    }, 2000);
                },
                onDone: function() {
                    console.log('Wizard completed normally');
                },
                onCancel: function() {
                    console.log('Wizard was cancelled');
                },
                onClickRelatedLinks: function(){
                    console.log('onClickRelatedLinks');
                },
                relatedActivities: [
                {
                  "label": "Activity 1",
                  "data": "/firewall-policies",
                  "dataType": ""      
                },
                {
                  "label": "Activity 2",
                  "data": "/firewall-policies",
                  "dataType": ""      
                },
                {
                  "label": "Activity 3",
                  "data": "/firewall-policies",
                  "dataType": ""      
                }], 
                customSuccessStatusFooter: new CustomDoneStatusFooter(),
                customErrorStatusFooter: new CustomDoneStatusFooter()

            });
            wizard.build();

            return this;
        }
    });

    var overlay = new Overlay({
        view: new OverlayView(),
        xIconEl: false,
        cancelButton: false,
        okButton: false,
        showScrollbar: false,
        type: 'large'
    });
    overlay.build();
});