/**
 * A view of a dashlet in the dashlet container.  
 * 
 * @module DashletView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/dashboard/templates/dashboardDashlet.html',
    'lib/i18n/i18n',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'widgets/dashboard/views/dashletEditView',
    'widgets/dashboard/dashboardUtil',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/spinnerWidget',
    'modules/view_adapter'
], /** @lends DashletView */
function(Marionette,
            dashletTpl,
            i18n,
            ConfirmationDialogWidget,
            DashletEditView,
            DashboardUtil,
            Overlay,
            Spinner,
            ViewAdapter) {

    /**
     * Construct a DashletView
     * @constructor
     * @class DashletView
     */
    var DashletView = Marionette.ItemView.extend({
        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function(options) {
            _.extend(this, options);
            this.bindEvents();
            this.status='';
            this.context = options.context;
        },

        /**
         * Set refreshing/error message for this dashlet
         * @inner
         */
        setStatusMessage: function() {
            switch(this.status) {
                case 'refreshing': 
                    this.refreshStatusMessage.text(i18n.getMessage('dashlet_refreshing_message'));
                    break;
                case 'success': 
                    return ''
                    break;
                case 'error':
                    this.refreshStatusMessage.text(i18n.getMessage('dashlet_refresh_failed_message'));
                    break;
                default: 
                    return ''
                    break;
            }
        },

        showSpinner: function(){
            var status = this.refreshStatusMessage.text();
            var dashlet_id = this.model.get('dashletId');
            var node = $('#' + dashlet_id);
            var targetNode = node.find('.dashletRefreshing');
            targetNode.show();
            this.refreshingLayer = new Spinner({
                    "container": targetNode,
                    "hasPercentRate": false,
                    "statusText": status
                });
            this.refreshingLayer.build();
        },

        hideSpinner: function() {
            if(this.refreshingLayer){
                this.refreshingLayer.destroy();
                this.refreshingLayer = null;
                var dashlet_id = this.model.get('dashletId');
                var node = $('#' + dashlet_id);
                var targetNode = node.find('.dashletRefreshing');
                targetNode.hide();
            }
        },


        /**
        * Bind to events for showing refresh icon, fading out, etc.
        * @inner
        */
        bindEvents: function() {
            var self = this;

            self.vent.on('dashlet:refresh', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.status = 'refreshing';
                    self.setStatusMessage();
                    // visual treatments
                    self.overlayLayer.show();
                    // self.refreshingLayer.show();
                    self.showSpinner();
                    self.refreshErrorLayer.hide();
                }
            });

            self.vent.on('dashlet:refresh:success', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.status = 'success';
                    self.setStatusMessage();
                    self.model.set('footer', Slipstream.SDK.DateFormatter.format(new Date(), "ll LTS"));
                    self.onRefresh();
                    // visual treatments
                    self.overlayLayer.hide();
                    // self.refreshingLayer.hide();
                    self.hideSpinner();
                    self.refreshErrorLayer.hide();
                }
            });

            self.vent.on('dashlet:refresh:error', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.status = 'error';
                    self.setStatusMessage();
                    // visual treatments
                    self.overlayLayer.show();
                    // self.refreshingLayer.hide();
                    self.hideSpinner();
                    self.refreshErrorLayer.show();
                }
            });

            self.vent.on('dashlet:refresh:nonexistant', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.status = 'success';
                    self.setStatusMessage();
                    // visual treatments
                    self.overlayLayer.hide();
                    // self.refreshingLayer.hide();
                    self.hideSpinner();
                    self.refreshErrorLayer.hide();
                }
            });

            self.vent.on('dashlet:edit:canceled', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.editDialog.destroy();
                }
            });

            self.vent.on('dashlet:edit:updated', function(dashletId) {
                var dashlet_id = self.model.get('dashletId');
                if (dashlet_id == dashletId) {
                    self.editDialog.destroy();
                }
            });
        },

        template: dashletTpl,
        tagName: 'li',
        className: 'dashlet',

        events: {
            'click'                  : 'selectDashlet',
            'click .edit'            : 'processEdit',
            'click .refresh'         : 'processRefresh',
            'click .close'           : 'processClose',
            //'click .dashletTitle'    : 'editTitle',
            'click .moreDetailsLink' : 'processMoreDetails',
            'change .dashletFilter'  : 'processFilterChange'
        },
        /**
         * Select a dashlet
         * @inner
         */
        selectDashlet: function() {

        },
        /**
         * Edit the dashlet title
         * @inner
         */
        editTitle: function(evt) {
            var self = this,
                title = $('.dashletTitle', this.$el),
                titleText = $('.dashletTitleText', this.$el),
                isTitleEditable = title.hasClass('editable'),
                isTitleTarget = $(evt.target).is(titleText),
                dashlet_id = this.model.get('dashletId');

            // User clicked within the title area
            if (isTitleTarget && !isTitleEditable) {
                $(titleText).attr('contentEditable', true)
                            .addClass('editableText')
                            .focus();
                $(title).addClass('editable');

                // Attach keypress event handler, pass dashlet_id as namespace
                $(titleText).on('keypress.' + dashlet_id, function(e) {
                    // Do not allow carriage return
                    return e.which != 13;
                })

                // Attach click event handler, pass dashlet_id as namespace
                $('body').on('click.' + dashlet_id, function(e) {
                    var title = $('.dashletTitle', self.$el),
                        titleText = $('.dashletTitleText', self.$el),
                        isTitleEditable = title.hasClass('editable'),
                        isTitleTarget = $(e.target).is(titleText),
                        dashlet_id = self.model.get('dashletId');
                    
                    // User clicked somewhere else on the dashboard, outside the title area
                    if (!isTitleTarget && isTitleEditable) {
                        $(titleText).removeAttr('contentEditable')
                                .removeClass('editableText');
                        $(title).removeClass('editable');
                        self.model.set('title', $.trim($(titleText).text()));
                        // Remove click, keypress events
                        $('body').off('click.' + dashlet_id);  
                        $(titleText).off('keypress.' + dashlet_id);

                        // Note: We aren't making a refresh callback here into app view,
                        // so app does not know of any changes in title
                        self.vent.trigger('dashlet:updated', self.model);
                    }
                });
            }
        },

        processMoreDetails: function (evt) {
            if (this.viewAdapter.view.moreDetails) {
                this.viewAdapter.view.moreDetails();
            }
        },

        /**
         * method for Refresh button on dashlet top bar.
         * @inner
         */
        processRefresh: function(evt){
            this.vent.trigger('dashlets:refresh:individual', this.model);
        },

        /**
         * method for Edit button on dashlet top bar.
         * @inner
         */
        processEdit: function(evt){
            var dashletEditView = new DashletEditView({model:this.model, vent:this.vent});

            var config = {
                view: dashletEditView,
                xIconEl: true,
                type: 'medium',
                context: this.context
            };

            this.editDialog = new Overlay(config);
            this.editDialog.build();

            //this.vent.trigger('dashlet:edit', this.model);
        },

        /**
         * method for Close button on dashlet top bar.
         * @inner
         */
        processClose: function(evt){

            var self = this;
            var confirmationDialog;
            
            var confirmYesCallback = function(doNotShowAgain) {

                // Trigger status of doNotShowAgain checkbox for persistence module to save
                if (doNotShowAgain) {
                    self.vent.trigger('dashlets:close:confirmationNotRequired', true);
                }

                // Try closing innerView
                self.viewAdapter.close(true);
                // Close this view
                self.close();
                self.vent.trigger('dashlet:removed', self.model);

                if (confirmationDialog) {
                    confirmationDialog.destroy();
                }
            }

            var confirmNoCallback = function() {
                confirmationDialog.destroy();
            }

            if (self.reqres.request('dashlets:close:confirmationNotRequired')) {
                confirmYesCallback();
            } else {
                var confirmConfig = {
                    title: i18n.getMessage('remove_dashlet_title'),
                    question: i18n.getMessage('remove_dashlet_question_1') + ' "' + this.model.get('title') + '" ' + i18n.getMessage('remove_dashlet_question_2') + '<br />' + i18n.getMessage('remove_dashlet_question_3'),
                    yesButtonLabel: i18n.getMessage('remove_dashlet_yes_button_label'),
                    noButtonLabel: i18n.getMessage('remove_dashlet_no_button_label'),
                    yesButtonCallback: confirmYesCallback,
                    noButtonCallback: confirmNoCallback,
                    doNotShowAgainMessage: i18n.getMessage('do_not_show_again_message')
                };

                confirmationDialog = new ConfirmationDialogWidget(confirmConfig);

                confirmationDialog.build();
            }
        },

        /**
         * Exposed method for closing this view. Used by dashboard.js
         * on dashboard destroy method
         */
        closeView: function() {
            // Try closing innerView
            this.viewAdapter.close();
            // Close this view
            this.close();

            // turn off event handlers
            this.vent.off('dashlet:edit:canceled');
            this.vent.off('dashlet:edit:updated');
            this.vent.off('dashlet:refresh');
            this.vent.off('dashlet:refresh:success');
            this.vent.off('dashlet:refresh:error');
            this.vent.off('dashlet:refresh:nonexistant');
        },

        /**
         * Marionette callback to serialize the data required for this view
         * @inner
         */
        serializeData: function() {
            var self = this;
            return _.extend(this.model.toJSON(), 
                { 
                    index: this.model.get('index'),
                    size: this.model.get('size'),
                    colspan: this.model.get('colspan'),
                    style: this.model.get('style'),
                    title: this.model.get('title'),
                    details: this.model.get('details'),
                    innerView: this.model.get('innerView'),
                    context: this.model.get('context'),
                    footer: this.model.get('footer'),
                    thumbnailId: this.model.get('thumbnailId'),
                    dashletId: this.model.get('dashletId'),
                    lastUpdated_label: i18n.getMessage('dashlet_last_updated_message'),
                    detailsHref: this.viewAdapter.view.moreDetails ? true : false,
                    moreDetails_label: i18n.getMessage('dashlet_more_details_messsage'),
                    editExists: function() {
                        var resolver = new Slipstream.SDK.RBACResolver();
                        var capabilities = ["editDashBoard"];
                        var canEditDashboard = resolver.verifyAccess(capabilities);
                        if (canEditDashboard) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    refreshExists: function() {
                        if (self.model.get('innerView').refresh && typeof self.model.get('innerView').refresh == 'function') {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    customInitData: this.model.get('customInitData'),
                    filters: this.model.get('filters')
                });
        },

        /**
         * Marionette callback before the view is rendered.
         * @inner
         */
        onBeforeRender: function() {
            var view = this.model.get('view');
            if (!this.model.get('innerView')) {
                this.model.set('innerView', new view({ 
                    context: this.model.get('context'),
                    customInitData: this.model.get('customInitData'),
                    filters: this.model.get('filters'),
                    requestDataCallback: function(done) {
                        this.getData(done);
                    }
                }));
                this.viewAdapter = new ViewAdapter({
                    view: this.model.get('innerView')
                });
            }
        },
        /**
         * Marionette callback when the view is rendered.
         * @inner
         */
        onRender: function() {
            var pluginName = this.model.get('context')? this.model.get('context').ctx_name : "";
            var dashboardUtil =  new DashboardUtil({});
            var dashletContentHeight = dashboardUtil.getContentHeight(this.model.get('size'));
            var self = this;

            // cache jQuery handles for easy access
            this.overlayLayer = $('.dashletOverlay' , this.$el);
            // this.refreshingLayer = $('.dashletRefreshing' , this.$el);


            this.refreshErrorLayer = $('.dashletRefreshError', this.$el);
            this.refreshStatusMessage = $('.dashletRefreshStatusMessage', this.$el);

            // TODO: Make this work. Needs a region?
            // this.innerView.beforeRender = function(){
            //     console.log('rendering');
            //     self.status = 'refreshing';
            //     self.setStatusMessage();
            //     // visual treatments
            //     self.overlayLayer.show();
            //     self.refreshingLayer.show();
            //     self.refreshErrorLayer.hide();
            // };

            // this.innerView.afterRender = function(){
            //     console.log('rendered');
            //     self.status = 'success';
            //     // self.setStatusMessage();
            //     self.model.set('footer', new Date());
            //     // visual treatments
            //     self.overlayLayer.hide();
            //     self.refreshingLayer.hide();
            //     self.refreshErrorLayer.hide();
            // };

            $('.dashboardDashletContent' , this.$el)
                .empty()
                .addClass(pluginName)
                .attr('style', 'max-height: ' + dashletContentHeight + '')
                .html(this.viewAdapter.render().$el);

            this.$el.addClass(this.model.get('style'))
                    .attr('data-ss-colspan', this.model.get('colspan'));

            // trigger that an instance was added, so thumbnail badge can update itself
            this.vent.trigger('dashlet:added', this.model);

            this.status = 'success';

            // visual treatments
            this.overlayLayer.hide();
            // this.refreshingLayer.hide();
            this.hideSpinner();

            this.refreshErrorLayer.hide();
        },

        processFilterChange: function(evt) {
            var filters = this.model.get('filters');
            var selected = evt.target.value;
            for (var ii = 0; ii < filters.length && ii < 3; ii++) {
                if (evt.target.name === filters[ii].name) {
                    var filterValues = filters[ii].values;
                    for (var jj = 0; jj < filterValues.length; jj++) {
                        if (filterValues[jj].value == selected) {
                            filterValues[jj].selected = true;
                        } else if (filterValues[jj].hasOwnProperty('selected')) {
                            delete filterValues[jj].selected;
                        }
                    }
                }
            }
            this.model.set('filters', filters);
            this.vent.trigger('dashlet:updated', this.model);
            this.vent.trigger('dashlets:refresh:individual:updated', this.model);
        },

        /**
         * Function used to update dashletContent area on refresh
         *
         */
        onRefresh: function() {
            var pluginName = this.model.get('context')? this.model.get('context').ctx_name : "";
            var dashboardUtil =  new DashboardUtil({});
            var dashletContentHeight = dashboardUtil.getContentHeight(this.model.get('size'));

            $('.dashletTitleText' , this.$el)
                .text(this.model.get('title'));
            
            $('.dashboardDashletContent' , this.$el)
                .empty()
                .addClass(pluginName)
                .attr('style', 'max-height: ' + dashletContentHeight + '')
                .html(this.viewAdapter.$el);

            var dashletPrevStyle = this.model.get('style');
            var dashletStyle = dashboardUtil.getStyle(this.model.get('size'));
            var dashletColspan = dashboardUtil.getColspan(this.model.get('size'));

            // Resize the dashlet
            if (dashletPrevStyle != dashletStyle) {
                this.model.set('style', dashletStyle);
                this.model.set('colspan', dashletColspan);
                this.$el.removeClass(dashletPrevStyle)
                        .addClass(dashletStyle)
                        .attr('data-ss-colspan', dashletColspan);
                $('.dashboardDashletContainer').trigger("ss-rearrange");
            }

            $('.updated', this.$el)
                .text(i18n.getMessage('dashlet_last_updated_message') + ' ' + this.model.get('footer'));

            this.vent.trigger('dashlet:updated', this.model);
        }
    });
    return DashletView;
});
