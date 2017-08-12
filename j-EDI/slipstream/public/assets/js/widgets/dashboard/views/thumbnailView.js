/**
 * A view of a thumbnail in the thumbnail container.  
 * 
 * @module ThumbnailView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/dashboard/templates/dashboardThumbnail.html',
    'widgets/tooltip/tooltipWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/dashboard/templates/thumbnailTooltip.html',
    'lib/i18n/i18n'
], /** @lends ThumbnailView */
function(Marionette,
	        thumbnailTpl,
            TooltipWidget,
            render_template,
            thumbnailTooltipTpl,
            i18n) {

    /**
     * Construct a ThumbnailView
     * @constructor
     * @class ThumbnailView
     */
    var ThumbnailView = Marionette.ItemView.extend({
        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function(options) {
            _.extend(this, options);
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            self.vent.on('dashlet:added', function(model) {
                var selfThumbnailId = self.model.get('thumbnailId');
                var addedThumbnailId = model.get('thumbnailId');
                if (selfThumbnailId == addedThumbnailId) {
                    var currentActiveInstances = self.model.get('activeInstances');
                    self.model.set('activeInstances', currentActiveInstances + 1);
                }
            });

            self.vent.on('dashlet:removed', function(model) {
                var selfThumbnailId = self.model.get('thumbnailId');
                var removedThumbnailId = model.get('thumbnailId');
                if (selfThumbnailId == removedThumbnailId) {
                    var currentActiveInstances = self.model.get('activeInstances');
                    self.model.set('activeInstances', currentActiveInstances - 1);
                }
            });
        },

        // Model events to bind to
        modelEvents: {
            'change:activeInstances': 'updateBadgeCount'
        },

        template: thumbnailTpl,
        tagName: 'li',
        className: 'dashboardThumbnail',

        events: {
            'click': 'selectThumbnail'
        },
        /**
         * Select a thumbnail
         * @inner
         */
        selectThumbnail: function() {

        },

        /**
         * Update the badge
         * @inner
         */
        updateBadgeCount: function() {
            $('.dashboardThumbnailBadge', $('#' + this.model.get('thumbnailId')))
                .text(this.model.get('activeInstances'));
        },

        /**
         * Marionette callback to serialize the data required for this view
         * @inner
         * @returns {Object} Serialized JSON object with information from the model
         */
        serializeData: function() {
            return _.extend(this.model.toJSON(), 
                { 
                    thumbnailId: this.model.get('thumbnailId'),
                    title: this.model.get('title'),
                    details: this.model.get('details'),
                    view: this.model.get('view'),
                    context: this.model.get('context'),
                    activeInstances: this.model.get('activeInstances')
                });
        },
        /**
         * Marionette callback when the view is rendered.
         * @inner
         */
        onRender: function() {

            // update the thumbnail image
            $('.dashboardThumbnailContent' , this.$el)
                .empty()
                .html(this.model.get('view').render().$el);

            // update the id on the thumbnail
            this.$el
                .attr('id', this.model.get('thumbnailId'));

            var tooltipConf = {};
            tooltipConf.templateContent = {
                "minWidth": 200,
                "maxWidth": 200,
                "position": 'bottom',
                "interactive": true
            };

            var thumbnail_data = this.model.toJSON();
            _.extend(thumbnail_data,
                { 
                    description_label: i18n.getMessage('thumbnail_tooltip_description_label')
                });

            var templateView  = render_template(thumbnailTooltipTpl, thumbnail_data);

            // Tooltip on the thumbnail content
            new TooltipWidget({
                "container": this.$el.find('.dashboardThumbnailContent'),
                "elements": tooltipConf.templateContent,
                "view": $(templateView)
            }).build();

            // Tooltip on the thumbnail title
            new TooltipWidget({
                "container": this.$el.find('.dashboardThumbnailTitle'),
                "elements": tooltipConf.templateContent,
                "view": $(templateView)
            }).build();
        }

        /* Note: This is a fix for JPR-176 which causes issues with the tooltip widget, 
            which in turn causes issues with the Slipstream layout.
        onRender: function() {

            var $dashboardThumbnailContent = $('.dashboardThumbnailContent', this.$el);
            var $dashboardThumbnailTitle = $('.dashboardThumbnailTitle', this.$el);

            // update the thumbnail image
            $dashboardThumbnailContent
                .empty()
                .html(this.model.get('view').render().$el);

            // update the id on the thumbnail
            this.$el
                .attr('id', this.model.get('thumbnailId'));

            var thumbnail_data = this.model.toJSON();
            _.extend(thumbnail_data,
                { 
                    description_label: i18n.getMessage('thumbnail_tooltip_description_label')
                });

            var templateView  = render_template(thumbnailTooltipTpl, thumbnail_data);

            $dashboardThumbnailContent.attr('title', templateView);
            $dashboardThumbnailTitle.attr('title', templateView);
        }
        */
    });

    return ThumbnailView;
});