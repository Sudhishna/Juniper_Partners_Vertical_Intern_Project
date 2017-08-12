/**
 * A view that uses the Schedule Recurrence Widget to produce a schedule recurrence component from a configuration file
 * The configuration file contains the form details.
 *
 * @module Schedule Recurrence View
 * @author Vignesh K.
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/scheduleRecurrence/scheduleRecurrenceWidget',
    'widgets/form/formWidget',
    'widgets/scheduleRecurrence/tests/conf/formConfiguration',
    ], function(Backbone, ScheduleRecurrenceWidget, FormWidget, formConf) {

  var ScheduleRecurrenceView = Backbone.View.extend({

    events: {
      'click #get_start_time_id' : "getScheduleStartTime",
      'click #get_schedule_as_query_id' : "getScheduleInfoAsURLQuery",
      'click #isvalid_id' : "isValidInput",
      'click #get_schedule_recurrence_info_id' : "getScheduleRecurrenceInfo"
    },

    initialize: function () {
      new FormWidget({
        "elements": formConf,
        "container": this.el,
        "values": {}
      }).build();
      this.render();
    },

    render: function () {
      var formSection = this.$el.find('#test_form_section');
      formSection.empty();
      this.scheduleRecurrenceWidgetObj = new ScheduleRecurrenceWidget({
        "container": formSection,
        "isFormSection": true
      });

     this.scheduleRecurrenceWidgetObjCustomLabel = new ScheduleRecurrenceWidget({
        "container": formSection,
        "isFormSection": true,
        "scheduleLabel": "Custom-Label",
        "scheduleTooltip": "Custom-Tooltip"
      });

      this.scheduleRecurrenceWidgetObj.build();
      this.scheduleRecurrenceWidgetObjCustomLabel.build();

      return this;
    },

    getScheduleStartTime: function () {
      var scheduleStartInfo = this.scheduleRecurrenceWidgetObj.getScheduleStartTime();
      console.log(scheduleStartInfo);
    },

    getScheduleInfoAsURLQuery: function () {
      var scheduleInfoAsURLQuery = this.scheduleRecurrenceWidgetObj.getScheduleInfoAsURLQuery();
      console.log(scheduleInfoAsURLQuery);
    },

    getScheduleRecurrenceInfo: function() {
      var scheduleRecurrenceInfo = this.scheduleRecurrenceWidgetObj.getScheduleRecurrenceInfo();
      console.log(scheduleRecurrenceInfo);
    },

    isValidInput: function() {
      console.log(this.scheduleRecurrenceWidgetObj.isValid());
    }
  });
	
	return ScheduleRecurrenceView;
});