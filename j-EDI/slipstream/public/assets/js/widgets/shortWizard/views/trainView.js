/** 
 * A view representing the wizard train.  Each
 * itemView in the view is a TrainStepView.
 *
 * @module TrainView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    './trainStepView',
], function(Marionette,
	        TrainStepView) {

    var TrainView = Marionette.CollectionView.extend({
        initialize: function(options) {
            _.extend(this, options);
            var self = this;
            
            this.options.vent.bind("step:first", function(hasIntro) {
                if (hasIntro) {
                    self.hideTrain();
                } else {
                    self.showTrain();
                }
            });
            this.options.vent.bind("step:last", _.bind(this.showTrain, this));
            this.options.vent.bind("step:summary", _.bind(this.hideTrain, this));
            this.options.vent.bind("step:commitStatus", _.bind(this.hideTrain, this));
            this.options.vent.bind("step:other", _.bind(this.showTrain, this));
            this.options.vent.bind("step:selected", function(step) {
                self.children.call("selectionHandler", step);
            });
            this.options.vent.bind("step:changeBlocked", function(step) {
                self.children.call("fixFocus", step);
            });
        },
        hideTrain: function() {
            this.$el.hide();
        },
        showTrain: function() {
            this.$el.show().css("display", "inline-block");
        },
        buildItemView: function(item, ItemView) {
            var view = new ItemView({
                model: item,
                vent: this.options.vent
            });
            return view;
        },
        itemView: TrainStepView
    });

    return TrainView;
});