/** 
 * The main container for dashboard widgets.
 * It manages thumbnails in the 'thumbnail container' and
 * dashlets in the 'dashlet container'.
 * @module Dashboard
 * @author Sujatha <sujatha@juniper.net>
 * @author Kiran <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014-2016
 */
define([
    'jquery',
    'jquery.shapeshift',
    'jcarousel',
    'widgets/dashboard/models/dashboardTitleModel',
    'widgets/dashboard/models/dashboardThumbnailModel',
    'widgets/dashboard/models/dashboardDashletModel',
    'widgets/dashboard/models/dashboardThumbnailCollection',
    'widgets/dashboard/models/dashboardDashletCollection',
    'widgets/dashboard/views/dashboardLayout',
    'widgets/dashboard/views/dashboardTitleView',
    'widgets/dashboard/views/dashboardThumbnailsView',
    'widgets/dashboard/views/dashboardDashletsView',
    'widgets/dashboard/views/dashboardWidgetView',
    'widgets/dashboard/views/dashletView',
    'widgets/dashboard/dashboardRefreshModule',
    'widgets/dashboard/dashboardPersistenceModule',
    'widgets/dashboard/dashboardUtil',
    'foundation.core',
    'modernizr',
    'lib/utils',
    'MutationObserver'
], /** @lends Dashboard */ function(
    $,
    shapeshift,
    jcarousel,
    DashboardTitleModel,
    DashboardThumbnailModel,
    DashboardDashletModel,
    DashboardThumbnailCollection,
    DashboardDashletCollection,
    DashboardLayout,
    DashboardTitleView,
    DashboardThumbnailsView,
    DashboardDashletsView,
    DashboardWidgetView,
    DashboardDashletView,
    DashboardRefreshModule,
    DashboardPersistenceModule,
    DashboardUtil,
    foundation,
    Modernizr,
    Utils,
    MO) {
    /**
     * Dashboard constructor
     *
     * @constructor
     * @class Dashboard
     */
    var Dashboard = function(config) {
        var vent = new Backbone.Wreqr.EventAggregator(),
            reqres = new Backbone.Wreqr.RequestResponse(),
            self = this,
            minContainerHeight = 120,
            minColWidth = 400,
            maxColWidth = 1200,
            doOnce = false,
            dashboardWidgets = {},
            unfetchedDashlets = [],
            nAwaitingLoadNextTriggers = 0;

        // create an observer instance
        var observer = new MutationObserver(function(mutations) {
            setupDashboardInteractions();
            dashboardPersistenceModule.fetchDashletsCollection();
        });
         
        // configuration of the observer:
        var observerConfig = { attributes: true, childList: true, characterData: true };


        var dashboardThumbnailCollection = new DashboardThumbnailCollection();

        var dashboardThumbnailsView = new DashboardThumbnailsView({
            collection: dashboardThumbnailCollection,
            vent: vent
        });

        var dashboardDashletCollection = new DashboardDashletCollection();

        var dashboardDashletsView = new DashboardDashletsView({
            collection: dashboardDashletCollection,
            vent: vent,
            reqres: reqres
        });

        var dashboardLayout = new DashboardLayout({});

        var dashboardRefreshModule = new DashboardRefreshModule({
            dashlets: dashboardDashletsView,
            vent: vent
        });

        var dashboardPersistenceModule = new DashboardPersistenceModule({
            dashlets: dashboardDashletsView,
            vent: vent,
            reqres: reqres
        });

        var dashboardUtil =  new DashboardUtil({});
        
        bindEvents();

        this.el = dashboardLayout.$el;

        var dashboardTitleModel = new DashboardTitleModel({});
        var maxConcurrentRequests = 2;  // default to 2 concurrent connections.

        var dashboardTitleView = new DashboardTitleView({
            model: dashboardTitleModel,
            vent: vent
        });

        if (config) {
            if (config.container) {
                this.container = config.container;
                this.target = document.querySelector(config.container);
            } else {
                this.target = dashboardLayout.el;
            }
        } else {
            this.target = dashboardLayout.el;
        }

        

        this.addDashboardWidget = function(dashboardWidget) {
            var thumbnailId = 'thumbnail_' + Utils.hash_code(dashboardWidget.context.ctx_root + dashboardWidget.context.ctx_name + dashboardWidget.title);
            dashboardWidgets[thumbnailId] = dashboardWidget;
        };

        /**
         * Build the dashboard
         *
         * @return {Object} this Dashboard object
         */
        this.build = function(conf) {
            if (conf.maxConcurrentRequests && _.isNumber(conf.maxConcurrentRequests) && conf.maxConcurrentRequests > 0) {        // defaults to 2.
                maxConcurrentRequests = conf.maxConcurrentRequests;
            }
            this.onDone = conf.onDone;
            dashboardTitleModel.set('dashboard_title', conf.dashboard_title);
            dashboardTitleModel.set('dashboardRefreshState', 'refreshed');

            dashboardLayout.render();

            dashboardTitleView.setElement($('.dashboardTitleContainer', dashboardLayout.$el)).render();
            dashboardThumbnailsView.setElement($('.dashboardThumbnailContainer', dashboardLayout.$el)).render();
            dashboardDashletsView.setElement($('.dashboardDashletContainer', dashboardLayout.$el)).render();

            for (thumbnailId in dashboardWidgets) {
                var dashboardWidgetView = new DashboardWidgetView(dashboardWidgets[thumbnailId]);
                dashboardWidgetView.setThumbnailId(thumbnailId);
                addThumbnail(dashboardWidgetView);
                doOnce = true;
            };

            // Start observing DOM node for changes, to detect when the dashboardLayout has
            // been attached to the DOM to trigger setting up dashboard interactions
            // This is required by shapeshift because it has an implementation
            // where it does a search for items(':visible') to detect children and fails
            // if it finds nothing
            observer.observe(this.target, observerConfig);

            // in case a container was passed in, append the rendered html to that
            if (this.container) {
                $(this.container).append(this.el);
            }
            
            return this;
        };


        /**
         * Close the dashboard
         */
        this.destroy = function() {
            unfetchedDashlets = [];
            dashboardDashletsView.children.each(function(childView) {
                childView.closeView();
            });

            dashboardDashletCollection.reset();
            dashboardThumbnailCollection.reset();

            dashboardLayout.close();

            /* Note: This is only required if we use Foundation tooltips instead of the 
               tooltip widget

            // Remove tooltips that we added to the DOM as we're responsible for those
            $(".tooltip", $("body")).remove();
            */

            if (this.onDone) {
                this.onDone();
            }
            dashboardPersistenceModule.resetState();
        };

        /**
         * Add a thumbnail to the thumbnail container
         *
         * @param {Object} dashboardWidgetView - A single dashboard widget with
         *                         all information required to render
         *                         it in the thumbnail container
         */
        function addThumbnail(dashboardWidgetView) {
            dashboardThumbnailCollection.add(new DashboardThumbnailModel({
                thumbnailId: dashboardWidgetView.getThumbnailId(),
                title: dashboardWidgetView.getTitle(),
                details: dashboardWidgetView.getDetails(),
                view: dashboardWidgetView.getImage(),
                context: dashboardWidgetView.getContext()
            }));
        };

        function addDashlet(dashletModel) {
            var mdl = new DashboardDashletModel({
                dashletId: dashletModel.dashletId,
                size: dashletModel.size,
                colspan: dashboardUtil.getColspan(dashletModel.size),
                style: dashboardUtil.getStyle(dashletModel.size),
                title: dashletModel.title,
                context: dashletModel.context,
                details: dashletModel.details,
                view: dashboardWidgets[dashletModel.thumbnailId].view,
                customEditView: dashboardWidgets[dashletModel.thumbnailId].customEditView,
                footer: Slipstream.SDK.DateFormatter.format(new Date(), "ll LTS"),
                thumbnailId: dashletModel.thumbnailId,
                index: dashletModel.index,
                customInitData: dashletModel.customInitData,
                filters: dashletModel.filters
            });
            dashboardDashletCollection.add(mdl, {at: dashletModel.index});
        };
        
        /**
         * Set up event handlers for coordinating updates with
         * the various dashboard sub-views.
         */
        function bindEvents() {
            var self = this;
            vent.bind("dashlet:loadNext", function(){
                nAwaitingLoadNextTriggers--;
                var next = unfetchedDashlets.shift();
                if(next) {
                    var index = next['index'];
                    var dashlet = dashboardDashletCollection.at(index);
                    if(dashlet && dashlet.get('innerView')) {
                        var view = dashlet.get('innerView');
                        view.options.requestDataCallback.call(view, function(){
                            vent.trigger('dashlet:loadNext');
                        });
                    }
                } else {
                    // This needs to happen precisely here.  After the dashlets were added to the dashboard (to prevent needless write backs)
                    if( nAwaitingLoadNextTriggers <= 0) {
                        nAwaitingLoadNextTriggers = 0;
                        dashboardPersistenceModule.setDashletsLoaded(true);
                    }
                }
            });
            // Bind to events sent by buttons in Title View
            vent.bind("thumbnails:show", function() {
                $('.jcarousel-wrapper', dashboardLayout.$el).show();
                $('.jcarousel', dashboardLayout.$el).jcarousel('reload');
                dashboardTitleModel.set('thumbnailContainerState', 'opened');
                dashboardPersistenceModule.saveDashboardGlobalPrefs(dashboardTitleModel.attributes);
            });
            vent.bind("thumbnails:hide", function() {
                $('.jcarousel-wrapper', dashboardLayout.$el).hide();
                dashboardTitleModel.set('thumbnailContainerState', 'closed');
                dashboardPersistenceModule.saveDashboardGlobalPrefs(dashboardTitleModel.attributes);
            });
            vent.bind("thumbnails:refresh", function() {
                $('.jcarousel', dashboardLayout.$el).jcarousel('reload');
            });
            vent.bind("dashlet:removed", function(model) {
                dashboardDashletCollection.remove(model);
                $('.dashboardDashletContainer', dashboardLayout.$el).trigger("ss-rearrange");
                dashboardPersistenceModule.saveDashlets();
            });
            vent.bind("dashlets:fetch:success", function(dashletModels){
                var globalPrefs = dashboardPersistenceModule.fetchDashboardGlobalPrefs();
                dashboardTitleModel.set('thumbnailContainerState', globalPrefs['thumbnailContainerState']);
                var paletteState =  dashboardTitleModel.get('thumbnailContainerState');
                if (paletteState === 'opened'){
                    this.trigger('thumbnails:show');
                } else {
                    this.trigger('thumbnails:hide');
                }

                for(var idx in dashletModels) {
                    addDashlet(dashletModels[idx]);
                }

                unfetchedDashlets = dashletModels.slice(0);
                var nDashlets = dashletModels.length;
                nAwaitingLoadNextTriggers = nDashlets;
                console.log('nDashlets to load from prefs:  ' + nDashlets);
                nAwaitingLoadNextTriggers += maxConcurrentRequests;  // because the last n responses will have no next but should still blindly trigger to decrement the count.
                for( var i = 0; i < maxConcurrentRequests; i++) {
                    vent.trigger('dashlet:loadNext');
                }

                if (nDashlets === 0) {
                    shapeshiftDashlets(minColWidth);
                } else {
                    shapeshiftDashlets(null);
                }
            });
            vent.bind("dashlets:fetch:error", function(){
                console.log('Could not retrieve dashlets from the database');
            });
            vent.bind("dashlets:close:confirmationNotRequired", function(arg) {
                dashboardPersistenceModule.saveDashboardGlobalPrefs({
                    'doNotShowConfirmClose': true
                });
            });
            reqres.setHandler("dashlets:close:confirmationNotRequired", function() {
                return dashboardPersistenceModule.fetchDashboardGlobalPrefs()['doNotShowConfirmClose'];
            });
        };

        /**
         * Unbind all events
         */
        function unbindEvents() {
            vent.unbind();
        };

        /**
         * Sets up shapeshift and jCarousel helpers
         *
         */
        function setupDashboardInteractions() {
            var thumbnails = $('.dashboardThumbnailContainer', dashboardLayout.$el);
            var dashlets = $('.dashboardDashletContainer', dashboardLayout.$el);
            var carousel = $('.jcarousel', dashboardLayout.$el);
            var carouselCtrlPrev = $('.jcarousel-control-prev', dashboardLayout.$el);
            var carouselCtrlNext = $('.jcarousel-control-next', dashboardLayout.$el);

            dashlets.on("ss-added", function(e, selected) {                
                var $selected = $(selected);
                var current = $selected.attr('id');
                var droppedPosition = $selected.index();

                // Manually render a new view and add to the dashboardContainer
                var id = _.uniqueId();
                var dashletMdl = {
                    dashletId: "dashlet_" + id,
                    size: dashboardWidgets[current].size,
                    title: dashboardWidgets[current].title,
                    context: dashboardWidgets[current].context,
                    details: dashboardWidgets[current].details,
                    customEditView: dashboardWidgets[current].customEditView,
                    thumbnailId: current,
                    index: droppedPosition,
                    customInitData: Utils.clone(dashboardWidgets[current].customInitData),
                    filters: dashboardWidgets[current].filters
                };

                addDashlet(dashletMdl);
                // add to queue, trigger for fetch
                unfetchedDashlets.push(dashletMdl);
                nAwaitingLoadNextTriggers++;
                vent.trigger('dashlet:loadNext');
            });

            dashlets.on("ss-drop-complete", function(e) {
                shapeshiftDashlets(null);
                dashlets.trigger("ss-rearrange");
                carousel.jcarousel('reload');
            });

            dashlets.on("ss-rearranged", function(e, selected) {
                var $selected = $(selected);
                var droppedPosition = $selected.index();
                dashboardPersistenceModule.saveDashlets();
            });
    
            shapeshiftThumbnails();

            carousel.jcarousel({
                // Turn off wrapping
                wrap: '',
                // Use CSS3 transitions if available
                transitions: Modernizr.csstransitions ? {
                    transforms:   Modernizr.csstransforms,
                    transforms3d: Modernizr.csstransforms3d,
                    easing:       'ease'
                } : false
            });
            
            // Find the number of thumbnails that are fully visible on the screen
            var numVisibleThumbnails = carousel.jcarousel('fullyvisible').length;

            // Set default number of thumbnails to move on previous button
            carouselCtrlPrev.jcarouselControl({
                target: '-='+numVisibleThumbnails
            });

            // Set default number of thumbnails to move on next button
            carouselCtrlNext.jcarouselControl({
                target: '+='+numVisibleThumbnails
            });

            carousel.jcarousel('reload');

            shapeshiftDashlets(maxColWidth);

            // stop observing for DOM changes
            observer.disconnect();

            /* Note: This is necessary only if you use Foundation tooltips instead of tooltip widget
            // reinitialize foundation for tooltips
            $(document).foundation();
            */
        };

        function setContainer(container) {
            this.el = $(container);
        };

        function getContainer(){
            return this.el;
        };

        function shapeshiftDashlets(columnWidth) {
            var dashlets = $('.dashboardDashletContainer', dashboardLayout.$el);
            var dashletsShapeshiftConfig = {
                    // If "autoHeight" is turned on, minHeight will never allow the container height to go below this number.
                    minHeight: minContainerHeight,

                    // Align / justify the grid.
                    align: 'left',

                    // Allow dragging only when mousedown occurs on the specified element
                    handle: '.dashboardDashletHeader',

                    // The number of pixels horizontally between each column
                    gutterX: 20,

                    // The number of pixels vertically between each element.
                    gutterY: 20,

                    // Must be set to the highest colspan child element
                    minColumns: 3,

                    // The speed at which the children will animate into place.
                    animationSpeed: 100,

                    // If there are too many elements on a page then it can get very laggy during animation. If the number of children exceed this threshold then they will not animate when changing positions.
                    animationThreshold: 25
            };

            if (columnWidth) {
                dashletsShapeshiftConfig.colWidth = columnWidth;
            } 

            dashlets.shapeshift(dashletsShapeshiftConfig);            
        }

        function shapeshiftThumbnails() {
            var thumbnails = $('.dashboardThumbnailContainer', dashboardLayout.$el);
            thumbnails.shapeshift({
                // Set minimum height
                minHeight: minContainerHeight,

                // The number of pixels horizontally between each column
                gutterX: 20,

                // The number of pixels vertically between each element.
                gutterY: 20,

                // Do not allow dashlets to be dropped into the thumbnail container
                enableCrossDrop: false,

                // Create a clone whrn a thumbnail is dragged into the dashlet container
                dragClone: true
            });
        }
    }

    return Dashboard;
});



