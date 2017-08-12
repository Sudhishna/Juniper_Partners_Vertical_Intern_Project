/**
 * A view for edit dashlet.  
 * 
 * @module DashletEditView
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'marionette',
    'widgets/form/formWidget',
    'widgets/dashboard/conf/dashletEditConfig'
], /** @lends DashletEditView */
function(Marionette, FormWidget, dashletEditConf) {

    /**
     * Construct a DashletEditView
     * @constructor
     * @class DashletEditView
     */
    var DashletEditView = Marionette.ItemView.extend({
        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function(options) {
            _.extend(this, options);
            this.context = options.model.get('context');
            if (this.model.get('customEditView') !== null) {
                var CustomEditView = this.model.get('customEditView');
                this.customEditView = new CustomEditView({
                    size: this.model.get('size'),
                    customInitData: this.model.get('customInitData'),
                    context: this.context
                });
            }
        },

        events: {
            'click #cancel_link': 'processCancel',
            'click #update':      'processUpdate'
        },

        /**
         * method for Cancel button on dashlet edit view.
         * @inner
         */
        processCancel: function(evt){
            this.vent.trigger('dashlet:edit:canceled', this.model.get('dashletId'));
            evt.preventDefault();
            evt.stopPropagation();
        },

        /**
         * method for Update button on dashlet edit view.
         * @inner
         */
        processUpdate: function(evt){

            // perform validation.
            if (!this.dashletEditSettings.isValidInput(this.$el.find('form'))) {
                return;
            }

            // grab changes user made
            var newTitle = $('#dashlet_title');
            var self = this;

            this.model.set('title', newTitle.val());

            // store values set by plugin
            if (this.customEditView !== undefined) {
                var customEditValues = this.customEditView.serialize();
                if (customEditValues.hasOwnProperty('size')) {
                    this.model.set('size', customEditValues.size);
                }
                if (customEditValues.hasOwnProperty('customInitData')) {
                    var customInitData = this.model.get('customInitData');
                    customInitData = $.extend(true, customInitData, customEditValues.customInitData);
                    this.model.set('customInitData', customInitData);
                }
            }

            // trigger events to process changes user made
            this.vent.trigger('dashlets:refresh:individual:updated', this.model);
            this.vent.trigger('dashlet:edit:updated', this.model.get('dashletId'));
            evt.preventDefault();
            evt.stopPropagation();
        },


        /**
         * Marionette callback when the view is rendered.
         * @inner
         */
        render: function() {
            var dashletEditConfValues = {
                "title": this.model.get('title'),
                "details": this.model.get('details')
            };

            var formConfElements = dashletEditConf.elements;
            this.dashletEditSettings = new FormWidget({
                "elements": formConfElements,
                "values": dashletEditConfValues,
                "container": this.el
            });

            this.dashletEditSettings.build();
            // append custom edit view if available
            if (this.customEditView !== undefined) {
                // set class to get rid of top padding in custom form
                var customView = this.customEditView.render().$el;
                customView.addClass('customEditView');
                this.$el.find('#default_settings').after(customView);
            }
            return this;
        },

        destroy: function() {
            if (this.dashletEditSettings) {
                this.dashletEditSettings.destroy();
                this.dashletEditSettings = null;
            }
        }

    });
    return DashletEditView;
});
