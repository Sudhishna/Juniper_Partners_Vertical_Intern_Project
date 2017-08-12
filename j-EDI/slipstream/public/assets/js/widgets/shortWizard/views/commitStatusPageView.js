/**
 * Module that renders the commit status view
 *
 * @module Commit Status Page View
 * @author Kiran Kashalkar <kkashalkar@junniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!widgets/shortWizard/templates/commitError.html',
    'text!widgets/shortWizard/templates/commitStatusPage.html',
    'lib/i18n/i18n'
], function($, _, Backbone, Marionette, commitErrorTemplate, commitStatusPageTemplate, i18n) {

    /**
     * Model for the commit page view.
     */
     var CommitStatusModel = Backbone.Model.extend({
        defaults: {
            'message': i18n.getMessage("committing_message"),
            'successHeading': i18n.getMessage("commit_success_heading"),
            'errorHeading': i18n.getMessage("commit_error_heading"),
            'startOverMessage': i18n.getMessage("wizard_start_over"),
            'footer': {
                link: [{
                    'message': 'Message'
                }]
            },
            'success': false,
            'committing': true
        }
    });

    /**
     * Model an error. This is sent by the commitController
     *
     */
    var CommitErrorModel = Backbone.Model.extend({
        defaults: {
            model: null,
            response: null
        }
    });

    /**
     * Collection for errors
     *
     */
    var CommitErrorsCollection = Backbone.Collection.extend({
        model: CommitErrorModel
    });

    /**
     * View for a single error
     *
     */
    var CommitErrorView = Marionette.ItemView.extend({
        template: commitErrorTemplate,
        tagName: 'li',
        className: 'commitError',

        initialize: function(options) {
            _.extend(this, options);
        },

        events: {
            'click': 'selectStep'
        },

        selectStep: function() {
            console.log('trigger appropriate step here');
        }
    });

    /**
     * Composite view for the status page
     *
     */
    var CommitStatusPageView = Marionette.CompositeView.extend({
        template: commitStatusPageTemplate,
        className: 'shortWizardCommitStatusPage',
        itemView: CommitErrorView,
        itemViewContainer: '.commitStatusErrors',

        events: {
          'click .relatedLinks' : 'handleRelatedLinks'
        },
        // we want to trigger refreshing the page only if the status changes
        modelEvents: {
            'change:committing' : 'refresh',
            'change:success': 'refresh',
            'change:footer' : 'refresh'
        },
        /* Right now, commitController will signal with a collective status when all saves have been attempted and
         * have returned with success/error status.
         *
         * Uncomment this code if we want to support showing failures as they arrive. Will need change in
         * commitController
        collectionEvents: {
            'reset': 'refresh'
        },
        */
        refresh: function(evt) {
            this.render();
        },

        handleRelatedLinks: function(evt){
          this.onClickRelatedLinks(evt);
        },

        initialize: function(options) {
            _.extend(this, options);
            var self = this;

            this.model = new CommitStatusModel({});
            this.collection = new CommitErrorsCollection([]);

            this.vent.bind('committing:changes', function() {
                self.model.set('message', i18n.getMessage("committing_message"));
                self.model.set('committing', true);
                self.model.set('footer', {});
                self.model.set('success', false);
                self.collection.reset([]);
            });

            this.vent.bind('committing:changes:success', function(message, relatedLinks) {
                self.model.set('message', message);
                self.model.set('committing', false);
                self.collection.reset([]);

                var relatedLinks = {link:[]};

                if(self.relatedActivities) {
                  self.relatedActivities.forEach(function(relatedActivity) {
                      relatedLinks.link.push({
                        "label"       : relatedActivity.label,
                        "data"        : relatedActivity.data,
                        "dataType"    : relatedActivity.dataType
                      });
                    });
                }
                self.model.set('footer', relatedLinks);
                self.model.set('success', true);

                if (self.customSuccessStatusFooter){
                    self.$el.find('.commitFooterMessage').append(self.customSuccessStatusFooter.render().$el);
                } 
                
            });

            this.vent.bind('committing:changes:error', function(errors) {
                self.model.set('message', '');
                self.model.set('footer', {});
                self.model.set('success', false);
                self.model.set('committing', false);

                if (self.customErrorStatusFooter){
                    self.$el.find('.commitFooterMessage').append(self.customErrorStatusFooter.render().$el);
                } 
                
                self.collection.reset(errors);
            });

            this.model.on('change:committing', function() {
                self.render();
            });

            return this;
        },

        /* ShortWizard and PageView interface required methods */
        getSummary: function () {
            return [];
        },

        getTitle: function () {
            return '';
        }

    });

    return CommitStatusPageView;
});
