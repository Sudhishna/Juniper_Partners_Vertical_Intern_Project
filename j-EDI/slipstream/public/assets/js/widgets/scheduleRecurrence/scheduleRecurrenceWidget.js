/**
 * A module that builds a Schedule Recurrence widget from the configuration object.
 * The configuration object includes the container which should be used to render the widget, the title for the widget
 * and the variables stating which sections should be disabled in the widget.
 * 
 *
 * @module ScheduleRecurrenceWidget
 * @author Vignesh K.
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'lib/i18n/i18n',
    'widgets/form/formWidget',
    'widgets/scheduleRecurrence/conf/scheduleRecurrenceConfiguration',
    'widgets/scheduleRecurrence/conf/scheduleRecurrenceFormConfiguration',
    'widgets/scheduleRecurrence/lib/scheduleRecurrenceInteraction',
    'widgets/scheduleRecurrence/lib/scheduleRecurrenceUtil'
  ], /** @lends ScheduleRecurrenceWidget */
  function(i18n, FormWidget, ScheduleRecurrenceConfiguration, ScheduleRecurrenceFormConfiguration, ScheduleRecurrenceInteraction, ScheduleRecurrenceUtil) {
    
    ScheduleRecurrenceUtil = new ScheduleRecurrenceUtil();

  /**
   * ScheduleRecurrenceWidget constructor
   *
   * @constructor
   * @class ScheduleRecurrenceWidget - Builds a schedule recurrence widget from a configuration object.
   *
   * @param {Object} conf - It has the following parameters:
   *  <br>container: <define the container where the widget will be rendered>,
   *  <br>isFormSection: <define whether the "container" is a section of a form>,
   *  <br>title: <define the heading for the widget(optional)>,
   *  <br>disableScheduleSection: <define whether to disable the schedule section of widget(optional, default: false)>,
   *  <br>disableRecurrenceSection: <define whether to disable the recurrence section of widget(optional, default: false)>
   *  <br>values: define the values to set in the schedule recurrence widget(optional). It can have the following parameters<br>
         {
             scheduleStartTime: <define the Date object representing the schedule start date and time>
             recurrenceInfo: {
                 repeatUnit : <define the time unit of the value("repeatValue") of the interval between recurrences.  e.g. : "Weeks", "Months">
                 repeatValue : <define the value of the interval between recurrences in units represented by "repeatUnit">
                 selectedDays : <define the array of integer(1-sunday, 2-monday .. 7-saturday) representing days on which the recurrence should occur in a recurrent week>
                 endTime : <define the Date object representing recurrence end>
             }
         }
   *  <br>scheduleTooltip: <define the tooltip for the schedule type(optional, if not specified default tooltip will be displayed)>,
   *  <br>recurrenceRepeatUnits: <define the list of repeat options to be enabled(optional, default: all)Repeat options can be any of ScheduleRecurrenceWidget.recurrence.repeatUnits.*>
   *                
   * @returns {Object} ScheduleRecurrenceWidget's Instance
   */
  var ScheduleRecurrenceWidget = function(conf) {
    
    var internalObj = {};
    
    var defaultRecurrenceRepeatUnits = ScheduleRecurrenceUtil.toValueArray(ScheduleRecurrenceWidget.recurrence.repeatUnits);
    
    var widgetConf = {
      "$container": $(conf.container),
      "isFormSection": conf.isFormSection ? true : false,
      "disableScheduleSection": conf.disableScheduleSection ? true : false,
      "disableRecurrenceSection": conf.disableRecurrenceSection ? true : false,
      "title": conf.title,
      "values":conf.values,
      "scheduleLabel": conf.scheduleLabel,
      "scheduleTooltip":conf.scheduleTooltip,
      "recurrenceRepeatUnits": ScheduleRecurrenceUtil.getMatchedItemsList(conf.recurrenceRepeatUnits, defaultRecurrenceRepeatUnits, defaultRecurrenceRepeatUnits)
    };
    
    /**
     * Builds the Schedule Recurrence widget in the specified container
     * @returns {Object} Current instance (this) of the class
     */
    this.build = function() {
      new ScheduleRecurrenceConfiguration().initialize(widgetConf,internalObj);
      
      internalObj.widgetConf = new ScheduleRecurrenceFormConfiguration(widgetConf,internalObj);
      internalObj.$widgetContainer = $("<div>", {'class' : "schedule-recurrence-widget"});

      widgetConf.$container.append(internalObj.$widgetContainer);
      internalObj.formWidget = new FormWidget({
        "elements": internalObj.widgetConf.getValues(),
        "container": $("<div>")
      });
      internalObj.formWidget.build();
      
      handleAppendToForm(internalObj.$widgetContainer, internalObj.formWidget, widgetConf.isFormSection);
      
      internalObj.scheduleRecurrenceInteraction = new ScheduleRecurrenceInteraction(widgetConf, internalObj);
      internalObj.scheduleRecurrenceInteraction.addHandlers();
      internalObj.scheduleRecurrenceInteraction.addCustomValidations();
      
      var values = widgetConf.values;
      if(values) {
          if(values.scheduleStartTime) {
              this.setScheduleStartTime(values.scheduleStartTime);
          }
          if(values.recurrenceInfo) {
              this.setScheduleRecurrenceInfo(values.recurrenceInfo);
          }
      }
      return this;
    };
    
    /**
     * Handles the scenario where the schedule recurrence widget has to be appended
     * to a user provided form section.("isFormSection" = true)
     */
    var handleAppendToForm = function(container, formWidget, appendToForm) {
        if(appendToForm) {
            var $schedulRecurrenceSections = formWidget.formTemplateHtml.find(".form_section");
            container.append($schedulRecurrenceSections);
            formWidget.formTemplateHtml = container.closest("form").parent();
        } else {
            container.append(formWidget.formTemplateHtml);
        }
    };
    
    
    /**
     * Get the schedule start time
     * @returns {Object} Date object representing the schedule start time.
     * returns "null" if schedule type is selected as "Run now"
     */  
    this.getScheduleStartTime = function() {
      var startTime = null;
      if(internalObj.formWidget) {
          if(!widgetConf.disableScheduleSection) {
              if (internalObj.formWidget.isValidInput()) {
                var params = ScheduleRecurrenceUtil.toKeyValueObj(internalObj.formWidget.getValues());
                if(params[internalObj.schedule.type.name] == internalObj.schedule.type.types.later) {
                  var date = internalObj.formWidget.getInstantiatedWidgets().datePicker_schedule_date_id.instance.getDate();
                  var time = internalObj.formWidget.getInstantiatedWidgets().dateTime_schedule_time_id.instance.getTime();
                  startTime = ScheduleRecurrenceUtil.mergeDateTime(date, ScheduleRecurrenceUtil.appendSeconds(time));
                }
              }
          }
      } else {
          throw new Error("The schedule recurrence widget has to be built first");
      }

      return startTime;
    };

    /**
     * Get the schedule recurrence info
     * 
     * @returns {Object} The object containing the recurrence information. 
     * <br>It has
     * <br>"repeatUnit"   - The time unit of the value("repeatValue") of the interval between recurrences.  e.g. : "Weeks", "Months"
     * <br>"repeatValue"  - The value of the interval between recurrences in units represented by "repeatUnit".
     * <br>"selectedDays" - The array of integer(1-sunday, 2-monday .. 7-saturday) representing days on which the recurrence should occur 
     *                      in a recurrent week.("null" for "repeatUnit" other than "Weeks")
     * <br>"endTime"      - The Date object representing recurrence end("null" if schedule end type is selected as "never").
     */
    this.getScheduleRecurrenceInfo = function() {
      var recurrenceInfo = null;
      if(internalObj.formWidget) {
          if(!widgetConf.disableRecurrenceSection) {
              if (internalObj.dom.recurrence.sectionCheckbox.is(":checked") && internalObj.formWidget.isValidInput()) {
                var params = ScheduleRecurrenceUtil.toKeyValueObj(internalObj.formWidget.getValues());
                recurrenceInfo = {};
                recurrenceInfo.repeatUnit = params[internalObj.recurrence.repeatUnitName];
                recurrenceInfo.repeatValue = params[internalObj.recurrence.repeatValueName];
                if(recurrenceInfo.repeatUnit == internalObj.recurrence.repeatUnits.weekly) {
                  var selectedDays = params[internalObj.recurrence.repeatDays.name];
                  recurrenceInfo.selectedDays = $.isArray(selectedDays) ? selectedDays : new Array(selectedDays);
                }
                if(params[internalObj.recurrence.end.name] == internalObj.recurrence.end.type.on) {
                  var date = internalObj.formWidget.getInstantiatedWidgets().datePicker_recurrence_date_id.instance.getDate();
                  var time = internalObj.formWidget.getInstantiatedWidgets().dateTime_recurrence_time_id.instance.getTime();
                  recurrenceInfo.endTime = ScheduleRecurrenceUtil.mergeDateTime(date, ScheduleRecurrenceUtil.appendSeconds(time));
                }
              }
          }
      } else {
          throw new Error("The schedule recurrence widget has to be built first");
      }
      return recurrenceInfo;
    };
    
    /**
     * Get the schedule start and recurrence information in a URL query format.
     * Used in REST APIs.
     * 
     * @returns {String} The URL query representing the schedule start and recurrence information.
     * <br>e.g. : "schedule-at= ( 10-03-2018 10:20:30 am )&schedule-recurrence= ( unit eq Weeks and repeat-interval eq 1 days eq ( 1 , 2 ) end-date eq ( 10-03-2018 10:20:30 pm ) )"
     */
    this.getScheduleInfoAsURLQuery = function() {
      var urlParam;
      if(internalObj.formWidget) {
          if(!widgetConf.disableScheduleSection) {
              var startTime = this.getScheduleStartTime();
              if(startTime) {
                urlParam = "schedule-at= ( " + ScheduleRecurrenceUtil.getDateTimeString(startTime) + " )";
              }
          }
          if(!widgetConf.disableRecurrenceSection) {
              var recurrenceInfo = this.getScheduleRecurrenceInfo();
              if(recurrenceInfo) {
                var recurrenceQuery;
                recurrenceQuery = "schedule-recurrence= ( unit eq " + recurrenceInfo.repeatUnit + " and repeat-interval eq " + recurrenceInfo.repeatValue;
                if(recurrenceInfo.selectedDays) {
                  recurrenceQuery += " days eq ( " + recurrenceInfo.selectedDays.join(" , ") + " )";
                }
                if(recurrenceInfo.endTime){
                  recurrenceQuery += " end-date eq ( " + ScheduleRecurrenceUtil.getDateTimeString(recurrenceInfo.endTime) + " )";
                }
                recurrenceQuery += " )";
                urlParam = urlParam ? urlParam + "&" + recurrenceQuery : recurrenceQuery;
              }
          }
      } else {
          throw new Error("The schedule recurrence widget has to be built first");
      }
      return urlParam;
    };
    
    /**
     *  Validates the inputs given in the schedule recurrence widget
     *  @returns The boolean value representing the validity of the inputs 
     */
    this.isValid = function() {
      return internalObj.formWidget.isValidInput();
    };
    
    /**
     * Set the schedule start date and time
     * @param {Date} startTime Date object representing the schedule start time.
     * If the 'startTime' is null/undefined the schedule start type is selected to be 'Run now'.
     */
    this.setScheduleStartTime = function(startTime) {
      if(internalObj.formWidget) {
        if(!widgetConf.disableScheduleSection) {
          var scheduleTypeRow = internalObj.dom.schedule.typeRadio.closest(".row");
          if(startTime) {
            var widgetInstances = internalObj.formWidget.getInstantiatedWidgets();
            scheduleTypeRow.find("input:radio[value='"+ internalObj.schedule.type.types.later +"']").prop("checked", true);
            widgetInstances.datePicker_schedule_date_id.instance.setDate(startTime);
            var timeString = ScheduleRecurrenceUtil.getDateTimeString(startTime, true).split(" ")[1];
            var timeWidget = widgetInstances.dateTime_schedule_time_id.instance;
            timeWidget.setTimePeriod("24 hour");
            timeWidget.setTime(timeString);
          } else {
              scheduleTypeRow.find("input:radio[value='"+ internalObj.schedule.type.types.runnow +"']").prop("checked", true);
          }
          internalObj.scheduleRecurrenceInteraction.initializeScheduleElements();
        }
      } else {
        throw new Error("The schedule recurrence widget has to be built first");
      }
    };
    
    /**
     * Set the schedule recurrence info
     * 
     * @param {Object} recurrenceInfo - It can have
     * repeatUnit : <define the time unit of the value("repeatValue") of the interval between recurrences. It should be one of the ScheduleRecurrenceWidget.recurrence.repeatUnits.*>
     * repeatValue : <define the value of the interval between recurrences in units represented by "repeatUnit">
     * selectedDays : <define the array of integer(1-sunday, 2-monday .. 7-saturday) representing days on which the recurrence should occur 
     *                      in a recurrent week.("null" for "repeatUnit" other than "Weeks")>
     * endTime : <define the Date object representing recurrence end>
     * 
     * <br>
     * If the 'recurrenceInfo' is null/undefined then the recurrence section will be collapsed
     */
    this.setScheduleRecurrenceInfo = function(recurrenceInfo) {
      if(internalObj.formWidget) {
        if(!widgetConf.disableRecurrenceSection) {
          var recurrenceSection = internalObj.dom.recurrence;
          if(recurrenceInfo) {
            var repeatUnitSelectBox = recurrenceSection.repeat.units;
            if(!recurrenceSection.sectionCheckbox.is(":checked")) {
              recurrenceSection.sectionCheckbox.trigger("click");
              recurrenceSection.sectionCheckbox.attr('checked', true);
            }
            if(recurrenceInfo.repeatUnit && ScheduleRecurrenceUtil.getMatchedItemsList([recurrenceInfo.repeatUnit], widgetConf.recurrenceRepeatUnits, [] ).length > 0) {
                repeatUnitSelectBox.find("option:selected").removeAttr("selected");
                repeatUnitSelectBox.find("option[value='"+ recurrenceInfo.repeatUnit +"']").prop("selected", true);
            }
            if(recurrenceInfo.repeatValue){
              recurrenceSection.repeat.value.val(recurrenceInfo.repeatValue);
            }
            if(recurrenceInfo.selectedDays && ScheduleRecurrenceUtil.getMatchedItemsList([internalObj.recurrence.repeatUnits.weekly], widgetConf.recurrenceRepeatUnits, [] ).length > 0){
              repeatUnitSelectBox.find("option:selected").removeAttr("selected");
              repeatUnitSelectBox.find("option[value='"+ internalObj.recurrence.repeatUnits.weekly +"']").prop("selected", true);
              recurrenceSection.daysCheckbox.prop("checked",false);
              for(var i=0; i<recurrenceInfo.selectedDays.length; i++) {
                recurrenceSection.daysRow.find("input:checkbox[value='"+ recurrenceInfo.selectedDays[i] +"']").prop("checked", true);
              }
            }
            var endTypeRow = recurrenceSection.endTypeRadio.closest(".row");
            if(recurrenceInfo.endTime){
              var widgetInstances = internalObj.formWidget.getInstantiatedWidgets();
              endTypeRow.find("input:radio[value='"+ internalObj.recurrence.end.type.on +"']").prop("checked", true);
              widgetInstances.datePicker_recurrence_date_id.instance.setDate(recurrenceInfo.endTime);
              var timeString = ScheduleRecurrenceUtil.getDateTimeString(recurrenceInfo.endTime, true).split(" ")[1];
              var timeWidget = widgetInstances.dateTime_recurrence_time_id.instance;
              timeWidget.setTimePeriod("24 hour");
              timeWidget.setTime(timeString);
            } else {
              endTypeRow.find("input:radio[value='"+ internalObj.recurrence.end.type.never +"']").prop("checked", true);
            }
            
            internalObj.scheduleRecurrenceInteraction.initializeRecurrenceElements();
          } else {
            if(recurrenceSection.sectionCheckbox.is(":checked")) {
              recurrenceSection.sectionCheckbox.trigger("click");
              recurrenceSection.sectionCheckbox.attr('checked', false);
            }
          }
        }
      } else {
        throw new Error("The schedule recurrence widget has to be built first");
      }
    };
    
    /**
     * Destroys all elements created by the ScheduleRecurrenceWidget in the specified container
     * @returns {Object} Current ScheduleRecurrenceWidget object
     */
    this.destroy = function() {
      widgetConf.$container.remove();
      return this;
    };
  };
  
  ScheduleRecurrenceWidget.recurrence = {};
  ScheduleRecurrenceWidget.recurrence.repeatUnits = {
          "MINUTES": "Minutes",
          "HOURS": "Hours",
          "DAYS": "Days",
          "WEEKS": "Weeks",
          "MONTHS": "Months",
          "YEARS": "Years"
       };
  
  return ScheduleRecurrenceWidget;
});