/** 
 * A module for managing persistence of the dashboard
 *
 * @module DashboardPersistenceModule
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
	'widgets/dashboard/models/dashboardPersistenceModel',
	'widgets/dashboard/models/dashboardDashletModel',
	'widgets/dashboard/models/dashboardDashletCollection'], /** @lends DashboardPersistenceModule */
function(
	DashboardPersistenceModel,
	DashboardDashletModel,
	DashboardDashletCollection) {
	/**
     * DashboardPersistenceModule constructor
     *
     * @constructor
     * @class DashboardPersistenceModule 
     */
	var DashboardPersistenceModule = function(options) {
		var dashlets_loaded = false;

		var vent = options.vent,
			reqres = options.reqres,
			dashlets = options.dashlets,
			dashboardPersistenceModel = new DashboardPersistenceModel(),
			globalDashboardPrefs = {};
		var defaultGlobalPrefs = dashboardPersistenceModel.get('dashboard').globalPrefs;
		updateDashboardGlobalPrefsCache(defaultGlobalPrefs);

		/**
		 * Wrapper function for callback that dashlets call on success/error of getCustomInitCallback
		 * @param {string} id - The dashlet id that was passed when the dashlet's
		 *						getCustomInitData function was called.
		 */
		var NotificationWrapper = function(id) {
			var deferred = $.Deferred();
			var promise = deferred.promise();

			/**
			 * Callback function for dashlets to call on success/error of getCustomInitData
			 * @param {Object} err - Optional error object for the dashlet to pass
			 *						 in case there was an error in getCustomInitData.
			 */
			var done = function(data, err) {
					deferred.resolve(id, data, err);
			};

			return {
				done: done,
				promise: promise
			};
		};

		this.bindEvents = function() {
			var self = this;
			vent.on('dashlet:added', function(dashletModel) {
				var innerView = dashletModel.get('innerView');
				var dashletId = dashletModel.get('dashletId');
				var customInitData = null;

				if (innerView.getCustomInitData && typeof innerView.getCustomInitData == 'function') {
					// if there is a callback defined, take that value

					var notificationObject = new NotificationWrapper(dashletId);
					var done = notificationObject.done;
					var promise = notificationObject.promise;

					innerView.getCustomInitData(done);

					$.when(promise)
					.done(function(id, data, err) {
						// received callback
						if (err) {
							console.log('Dashlet id', dashlet, 'returned with error on getCustomInitData', err.toString());
						}
						if (data) {
							customInitData = data;
						}
						dashletModel.set('customInitData', customInitData);
						self.saveDashlets();
					});
				} else {
					self.saveDashlets();
				}
			});

			vent.on('dashlet:updated', function(dashletModel) {
				var innerView = dashletModel.get('innerView');
				var dashletId = dashletModel.get('dashletId');
				var customInitData = null;

				if (innerView.getCustomInitData && typeof innerView.getCustomInitData == 'function') {
					// if there is a callback defined, take that value

					var notificationObject = new NotificationWrapper(dashletId);
					var done = notificationObject.done;
					var promise = notificationObject.promise;

					innerView.getCustomInitData(done);

					$.when(promise)
					.done(function(id, data, err) {
						// received callback
						if (err) {
							console.log('Dashlet id', dashlet, 'returned with error on getCustomInitData', err.toString());
						}
						if (data) {
							customInitData = data;
						}
						dashletModel.set('customInitData', customInitData);
						self.saveDashlets();
					});
				} else {
					self.saveDashlets();
				}
			});

		};


		/**
		 * Retrieve dashboard global prefs from cache
		 */
		this.fetchDashboardGlobalPrefs = function() {
			return globalDashboardPrefs;
		};

		/**
		 * Save dashboard global prefs in cache and DB
		 * @param {Object} prefs - JSON of key-value pair to be stored as dashboard global preference
		 */
		this.saveDashboardGlobalPrefs = function(prefs) {
			updateDashboardGlobalPrefsCache(prefs);
			this.saveDashlets();
		};

		function updateDashboardGlobalPrefsCache(prefs) {
			if (prefs && prefs != {} ) {
				for (var key in prefs) {
					// update the global prefs cache.
					globalDashboardPrefs[key] = prefs[key];
				}
			}
		};

		/**
		 * Save the dashlet models in the database
		 */
		this.saveDashlets = function() {
			var dashletsCollection = new DashboardDashletCollection();
			dashlets.children.each(function(view) {
				dashletsCollection.add(new DashboardDashletModel({
					// When a new dashlet is first added, view.$el.index() is set to -1, so use the model index to find the dropped position index
					// Otherwise when dashlets are rearranged, use view.$el.index() to find the dropped position index
					index: ((view.$el.index() == -1) ? view.model.get('index') : view.$el.index()),
					size: view.model.get('size'),
					colspan: view.model.get('colspan'),
					style: view.model.get('style'),
                    title: view.model.get('title'),
                    details: view.model.get('details'),
                    context: view.model.get('context'),
                    thumbnailId: view.model.get('thumbnailId'),
                    dashletId: view.model.get('dashletId'),
                    customInitData: view.model.get('customInitData'),
                    filters: view.model.get('filters')
				}),
				{
					at: view.$el.index()
				});
			});

			var dashboardModel = {
				'id': dashboardPersistenceModel.get('dashboard').id,
				'dashletModels': dashletsCollection.models,
				'globalPrefs': this.fetchDashboardGlobalPrefs()
			};

			if (dashlets_loaded) {
				dashboardPersistenceModel.set('dashboard', dashboardModel);
				Slipstream.vent.trigger("ui:preferences:change", "ui:dashboard", dashboardPersistenceModel.toJSON().dashboard);
			}
		};

		/**
		 * Retrieve the dashlet models from the database
		 */
		this.fetchDashletsCollection = function() {
			var data = Slipstream.reqres.request("ui:preferences:get");

			if (data && data['dashboard']) {
				var dashboard = data['dashboard'];
				updateDashboardGlobalPrefsCache(dashboard['globalPrefs']);
				if (dashboard['dashletModels']) {
					vent.trigger('dashlets:fetch:success', dashboard['dashletModels']);	
				} 
				else {
					// no preferences found.  Set default state of thumbnail container.
					vent.trigger('thumbnails:hide');
					this.setDashletsLoaded(true);		// this might seem factor-out'able but it is not.  Timing is important here.
				}
			}else {
				this.setDashletsLoaded(true);
			}
		};

		/**
		 * Reset the dashlets_loaded flag
		 */
		this.resetState = function() {
			dashlets_loaded = false;
		};
		this.setDashletsLoaded = function(state) {
			dashlets_loaded = state;
		};

		this.bindEvents();
	};

	return DashboardPersistenceModule;

});
