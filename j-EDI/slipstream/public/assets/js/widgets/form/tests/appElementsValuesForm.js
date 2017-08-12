/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Application Elements Values Form View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/conf/configurationSample',
    'widgets/form/formWidget',
    'widgets/form/tests/view/formOverlayView',
    'widgets/form/tests/models/zonePoliciesModel',
    'widgets/form/conf/dynamicConfigurationSample',
    'widgets/grid/gridWidget',
    'widgets/form/tests/conf/gridConfiguration',
    'mockjax'
], function(Backbone, formConf, FormWidget, FormOverlayView, ZonePoliciesModel, dynamicElementsConfiguration, GridWidget, GridConfiguration, mockjax){
    var FormView = Backbone.View.extend({

        events: {
            "click #get_values": "getValues",
            "click #get_isvalid": "getIsValid",
            "click #show_overlay": "showOverlay",
            "click #add_section": "addSection",
            "click #add_elements": "addElements",
            "click #remove_elements": "removeElements",
            "click #show_inline_error": "showInlineError",
            "click #hide_inline_error": "hideInlineError"
        },

        initialize: function () {
            this.mockApiResponse();
            this.render();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.elements,
                "values": formConf.values,
                "container": this.el
            });
            this.form.build();
            this.getIntegratedWidget(); // gets integrated widgets
            this.buildGridWidget();
            this.addPostValidationEvents();
            return this;
        },

        // Build a external widget in form by swapping the element
        buildGridWidget: function(){
            var $gridContainer = this.$el.find("#gridWidgetInForm");

            this.grid = new GridWidget({
                container: $gridContainer,
                actionEvents : {createEvent: "addEvent", updateEvent: "editEvent",deleteEvent: "deleteAction"},
                elements: GridConfiguration.simpleSample
            });
            this.grid.build();
        },

        // Example to show inline error corresponding to externally integrated widget
        showInlineError: function(){
            // Provide the id of the element
            this.form.showFormInlineError("gridWidgetInForm"); // This will show a inline error beneath the integrated widget
        },

        // Hide inline error corresponding to externally integrated widget
        hideInlineError: function(){
            this.form.showFormInlineError("gridWidgetInForm",false);
        },

        // Gets integrated widgets
        getIntegratedWidget: function(){
            var integratedWidgets = this.form.getInstantiatedWidgets();
            // get the date set in the 'datepicker time widget'
            var dateTimeWidgetDate = integratedWidgets["datePicker_text_dateTime_date_Widget"]["instance"].getDate();
            console.log(dateTimeWidgetDate);
        },

        getValues: function (){
            var form = this.$el.find('form');
            var values = null;
            if (this.form.isValidInput()){
                values = this.form.getValues();
            }
            console.log(values);
        },

        getIsValid: function (){
            var form = this.$el.find('form');
            var isValid = this.form.isValidInput();
            console.log("form validation: " + isValid);
        },

        showOverlay: function (){
            var self = this;
            var view = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        addSection: function () {
            this.form.addSection(dynamicElementsConfiguration.section1, '#section_id', true);
            this.form.addSection(dynamicElementsConfiguration.section2, '#section_id2');
            this.form.addSection(dynamicElementsConfiguration.section3);
        },

        addElements: function () {
            this.form.addElements(dynamicElementsConfiguration.elements1, '.text_string_class', true);
            this.form.addElements(dynamicElementsConfiguration.elements2, '.text_alphanumeric_class');
        },

        removeElements: function () {
            this.form.removeElements('.element_delete');
            this.form.removeElements('#section_id3');
        },

        save:  function(data) {
            console.log(data);
        },

        addPostValidationEvents: function (){
            this.$el.find('#text_area').bind("validTextarea", function(e, isValid){
                console.log("the validation was completed and the result is: " + isValid);
            });
        },

        /* mocks REST API implementation for remote validation of an input value */
        mockApiResponse: function(){
            $.mockjax({
                url: /^\/api\/data-sample\/name\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["Andrew","Vidushi","Dennis","Brian","Kyle","Miriam","Aslam","Kiran","Sujatha","Eva"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 100
            });
        }

    });

    return FormView;
});