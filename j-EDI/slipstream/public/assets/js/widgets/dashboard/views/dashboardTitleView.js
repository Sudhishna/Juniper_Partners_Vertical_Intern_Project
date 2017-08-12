/**
 * A view representing the area of the dashboard containing the dasboard title.
 *
 * @module DashboardTitleView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/dashboard/templates/dashboardTitle.html',
    "text!../templates/dashboardHelpTooltip.html",
    'widgets/tooltip/tooltipWidget',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], /** @lends DashboardTitleView */
    function(Marionette,
	        dashboardTitleTpl,
            HelpTemplate,
            TooltipWidget,
            TemplateRenderer,
            i18n) {
	/**
	 * Construct a DashboardTitleView
	 * @constructor
	 * @class DashboardTitleView
	 */
	var DashboardTitleView = Marionette.ItemView.extend({
        template: dashboardTitleTpl,
        modelEvents: {
            'change': function() {
                this.render();
            }
        },
        events: {
        	'click .dashboardAddButton': 'processAddButton',
        	'click .dashboardRefreshButton': 'processRefreshButton',
        },

        ui: {
        },

        /**
         * Initialize the view with passed in options.
         * Render the title in "opened" state
         * @inner
         */
        initialize: function(options) {
        	_.extend(this, options);
            this.bindEvents();
        },

        /**
         * Bind to events that we want to listen and act on
         * @inner
         */
        bindEvents: function() {
            var self = this;
            self.vent.on('dashlets:refresh:done', function() {
                self.setDashboardRefreshState('refreshed');
            });
        },

        /**
         * Set the refresh state of the dashboard for spinning icon on refresh button
         * @inner
         * @param {String} state - One of the following:
         *      "refreshing" - to start rotating the icon
         *      "refreshed"  - to stop rotating the icon
         */
        setDashboardRefreshState: function(state) {
            this.model.set('dashboardRefreshState', state);
        },

        /**
         * Process clicking of Refresh button
         * @inner
         */
        processRefreshButton: function() {
            this.setDashboardRefreshState('refreshing');
            this.refreshDashlets();
        },
        /**
         * Trigger refreshing of thumbnails
         * @inner
         */
        refreshThumbnails: function() {
            this.vent.trigger('thumbnails:refresh');
        },

        /**
         * Trigger refreshing of dashlets
         * @inner
         */
        refreshDashlets: function() {
            this.vent.trigger('dashlets:refresh');
        },

        /**
         * Process clicking of Add button
         * @inner
         */
        processAddButton: function() {
        	this.toggleThumbnailContainerState();
        },
        /**
         * Toggle state when Add button is clicked - to update the icon on Add Widget button
         * @inner
         */
        toggleThumbnailContainerState: function() {
        	if (this.model.get('thumbnailContainerState') == 'closed') {
        		this.model.set('thumbnailContainerState', 'opened');
        		this.vent.trigger('thumbnails:show');
        	} else {
        		this.model.set('thumbnailContainerState', 'closed');
        		$('.dashboardAddButton', this.$el).addClass('thumbnailContainerClosed');
        		this.vent.trigger('thumbnails:hide');
        	}
        },
        serializeData: function() {
        	return {
        		dashboard_title: this.model.get('dashboard_title'),
        		add_widget_button_label: i18n.getMessage('add_widget_button_label'),
                dashboard_help_message: i18n.getMessage('dashboard_help_message'),
        		thumbnailContainerState: this.model.get('thumbnailContainerState'),
                dashboardRefreshState: this.model.get('dashboardRefreshState')
        	}
        },
        getTooltipView: function(help) {
            var tooltipView  = TemplateRenderer(HelpTemplate,{
                'help-content':help['content'],
                'ua-help-text':help['ua-help-text'],
                'ua-help-identifier': 'dashboard.DASHBOARD_OVERVIEW'
            });
            return $(tooltipView);
        },
        addTooltipHelp: function(help) {
            new TooltipWidget({
                "elements": {
                    "interactive": true,
                    "maxWidth": 300,
                    "minWidth": 300,
                    "position": "right"
                },
                "container": this.$el.find('.dashboard-overview-help'),
                "view": this.getTooltipView(help)
            }).build();
        },
        onRender: function() {
            var heading = {
                "title": i18n.getMessage('dashboard_help_message'),
                "title-help":{
                    "content" : i18n.getMessage('dashboard_help_message'),
                    "ua-help-text": i18n.getMessage('more_link')
                }
            };

            this.addTooltipHelp(heading['title-help']);
        }
    });

    return DashboardTitleView;
});