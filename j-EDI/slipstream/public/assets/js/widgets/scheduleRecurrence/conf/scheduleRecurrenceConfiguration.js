/**
 * A configuration file used by the scheduleRecurrence widget
 * 
 * @module scheduleRecurrence
 * @author Vignesh K
 * @copyright Juniper Networks, Inc. 2015
 */

define([
      'lib/i18n/i18n'
    ], function(i18n) {

      var scheduleRecurrenceConfiguration = function() {
        this.initialize = function(conf, internalObj) {
            internalObj.SEPARATOR = "_";
            internalObj.disabledValidationKey = "disabled";
            internalObj.invalidTimeLabel = "schedulerecurrence_widget_invalidTime";
            internalObj.dom = {};
            
            if(!conf.disableScheduleSection) {
               internalObj.schedule = {};
               internalObj.schedule.type={};
               internalObj.schedule.type.name="schedule_type";
               internalObj.schedule.type.types ={
                  "runnow" : "runnow",
                  "later" : "later"
               };
               internalObj.schedule.validationLabel = "schedulerecurrence_widget_schedule_date_custom_error";
               internalObj.schedule.validationKey = {
                   "date": "schedule_date",
                   "time": "schedule_time"
               };
            }
            
            if(!conf.disableRecurrenceSection) {
               internalObj.recurrence = {};
               internalObj.recurrence.repeatUnitName = "recurrence_unit";
               internalObj.recurrence.repeatValueName = "recurrence_value";
               
               internalObj.recurrence.repeatUnits = {
                  "minutes": "Minutes",
                  "hourly": "Hours",
                  "daily": "Days",
                  "weekly": "Weeks",
                  "monthly": "Months",
                  "yearly": "Years"
               };
               internalObj.recurrence.repeatUnits1LabelPrefix = "schedulerecurrence_widget_recurrence_unit1";
               internalObj.recurrence.repeatUnits2LabelPrefix = "schedulerecurrence_widget_recurrence_unit2";
               internalObj.recurrence.repeatUnits3LabelPrefix = "schedulerecurrence_widget_recurrence_unit3";
               
               internalObj.recurrence.repeatDays = {};
               internalObj.recurrence.repeatDays.name = "recurrence_days";
               internalObj.recurrence.repeatDays.days = {
                  "mon" : "2",
                  "tues" : "3",
                  "wed" : "4",
                  "thur" : "5",
                  "fri" : "6",
                  "sat" : "7",
                  "sun" : "1"
                                                         
               };
               
               internalObj.recurrence.repeatDays.daysUnit1LabelPrefix = "schedulerecurrence_widget_recurrence_days_units1";
               internalObj.recurrence.repeatDays.daysUnit2LabelPrefix = "schedulerecurrence_widget_recurrence_days_units2";
               
               
               internalObj.recurrence.end = {};
               internalObj.recurrence.end.name = "recurrence_end_type";
               internalObj.recurrence.end.type = {
                  "never" : "never",
                  "on" : "on"
               };
               
               internalObj.recurrence.summaryLabelKey1 = "schedulerecurrence_widget_recurrence_summary_text1";
               internalObj.recurrence.summaryLabelKey2 = "schedulerecurrence_widget_recurrence_summary_text2";
               
               internalObj.recurrence.validationLabel1 = "schedulerecurrence_widget_recurrence_date_custom_error1";
               internalObj.recurrence.validationLabel2 = "schedulerecurrence_widget_recurrence_date_custom_error2";
               internalObj.recurrence.validationKey = {
                   "date": "recurrence_date",
                   "time": "recurrence_time"
               };
            }
            
            return internalObj;
        }
      };

      return scheduleRecurrenceConfiguration;
      
    }
);