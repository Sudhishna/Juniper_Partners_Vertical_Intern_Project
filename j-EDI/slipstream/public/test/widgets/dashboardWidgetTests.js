define([
	'widgets/dashboard/dashboard',
	'backbone',
	'marionette'
], function(
	Dashboard,
	Backbone,
	Marionette
) {
	describe('Dashboard - Unit tests:', function() {

		describe('Dashboard', function() {

			var dashboardWidgets = [];

			var BBView = Backbone.View.extend({
				initialize: function(options) {
					_.extend(this, options);
				},
				render: function() {
					this.$el.html(this.template);
					return this;
				}
			});

			var BBViewClass = Backbone.View.extend({
				initialize: function(options) {
					_.extend(this, options);
				},
				render: function() {
					this.$el.html(this.template);
					return this;
				},
				template: '<div>Some thumbnail content</div>'
			});

			var GenericView = function() {
				this.$el = null;
				var self = this;
				this.render = function() {
					self.$el = '<div>Some content</div>';
					return self;
				}
			};

			var MarionetteView = Marionette.ItemView.extend({
				initialize: function(options) {
					_.extend(this, options);
				},
				render: function() {
					this.$el.html(this.template);
					return this;
				},
				template: '<div>Some thumbnail content</div>'
			});

			var activityContext = new Slipstream.SDK.ActivityContext('', '');

			beforeEach(function() {
				var dashboardWidgets = [{
					title: "Some title 1",
					size: "double",
					details: "Some details",
					image: new BBView({
						template: '<div>Some thumbnail content</div>'
					}),
					view: BBViewClass,
					context: activityContext
				}, {
					title: "Some title 2",
					size: "double",
					details: "Some details",
					image: new BBView({
						template: '<div>Some thumbnail content</div>'
					}),
					view: GenericView,
					context: activityContext
				}, {
					title: "Some title 3",
					size: "double",
					details: "Some details",
					image: new BBView({
						template: '<div>Some thumbnail content</div>'
					}),
					view: MarionetteView,
					context: activityContext
				}];

				this.myDashboard = new Dashboard();

				for (var i = 0; i < dashboardWidgets.length; i++) {
					this.myDashboard.addDashboardWidget(dashboardWidgets[i]);
				}

				this.myDashboard.build({
					dashboard_title: 'NGSRX',
                	onDone: _.bind(function() {
                    	console.log('called onDone back');
                	}, this)
                });
			});

			after(function() {
				this.myDashboard.destroy();
				this.myDashboard = null;
			});

			it('After initialization, Dashboard should exist', function() {
				this.myDashboard.should.exist;
			});

			it('build must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.build, 'The dashboard must have a function named build');
			});

			it('addDashboardWidget must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.addDashboardWidget, 'The dashboard must have a function named addDashboardWidget');
			});

			it('build must be a function on the Dashboard', function() {
				assert.isFunction(this.myDashboard.destroy, 'The dashboard must have a function named destroy');
			});
		});
	});
});