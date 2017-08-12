/** 
 * A test view for running manual test using timezone widget.
 *
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'jquery',
    'backbone',
    'widgets/timeZone/timeZoneWidget'
], function($, Backbone, TimeZoneWidget){
  var TimeZoneView = Backbone.View.extend({

    el: $('#timezone-widget'),

    initialize: function () {
      this.timeZoneWidget = new TimeZoneWidget({'container': '#timezone-widget'});
      this.render();

      return this;
    },

    render: function () {
      this.timeZoneWidget.build();

      return this;
    }
  });

  return TimeZoneView;
});