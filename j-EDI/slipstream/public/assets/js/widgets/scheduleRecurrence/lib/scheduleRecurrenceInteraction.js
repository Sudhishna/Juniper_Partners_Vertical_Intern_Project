/**
 * A library that handles the interaction between the elements provided by the Schedule Recurrence widget. 
 *
 * @module ScheduleRecurrenceWidget
 * @author Vignesh K.
 * @copyright Juniper Networks, Inc. 2015
 */
define([
        'lib/i18n/i18n',
        'widgets/scheduleRecurrence/lib/customValidator',
        'widgets/scheduleRecurrence/lib/scheduleRecurrenceUtil'
   ],/** @lends ScheduleRecurrenceInteraction */
   function(i18n, CustomValidator, ScheduleRecurrenceUtil){
    
    ScheduleRecurrenceUtil = new ScheduleRecurrenceUtil();

    var ScheduleRecurrenceInteraction = function (conf, internalObj) {
        
      
      /**
       * Initialize variables and add handlers
       */
      this.addHandlers = function() {
        
        if(!conf.disableScheduleSection) {
          initializeSchedule();
          addScheduleHandlers();
          this.initializeScheduleElements();
        }
        
        if(!conf.disableRecurrenceSection) {
          initializeRecurrence();
          addRecurrenceHandlers();
          this.initializeRecurrenceElements();
        }
        
      };
      
      /**
       * initialize variables for schedule section
       */
      var initializeSchedule = function() {
        internalObj.dom.schedule = {};
        internalObj.dom.schedule.typeRadio = internalObj.$widgetContainer.find("input:radio[name='"+internalObj.schedule.type.name+"']");
        internalObj.dom.schedule.date = internalObj.$widgetContainer.find("#schedule_date_id");
        internalObj.dom.schedule.dateTimeRow = internalObj.dom.schedule.date.closest(".row");
        internalObj.dom.schedule.time = internalObj.$widgetContainer.find("#schedule_time_id .time_text");
      };
      
      /**
       * initialize variables for recurrence section
       */
      var initializeRecurrence = function() {
        internalObj.dom.recurrence = {};
        internalObj.dom.recurrence.repeat = {};
        internalObj.dom.recurrence.repeat.units = internalObj.$widgetContainer.find("#recurrence_unit_id");
        internalObj.dom.recurrence.repeat.value = internalObj.$widgetContainer.find("#recurrence_value_id");
        internalObj.dom.recurrence.repeat.valueDesc = internalObj.$widgetContainer.find("#recurrence_value_desc_id > label");
        internalObj.dom.recurrence.daysCheckbox = internalObj.$widgetContainer.find("input:checkbox[name='"+ internalObj.recurrence.repeatDays.name +"']");
        internalObj.dom.recurrence.daysRow = internalObj.dom.recurrence.daysCheckbox.closest(".row");
        internalObj.dom.recurrence.endTypeRadio =  internalObj.$widgetContainer.find("input:radio[name='"+ internalObj.recurrence.end.name +"']");
        internalObj.dom.recurrence.date = internalObj.$widgetContainer.find("#recurrence_date_id");
        internalObj.dom.recurrence.dateTimeRow = internalObj.dom.recurrence.date.closest(".row");
        internalObj.dom.recurrence.summaryDesc = internalObj.$widgetContainer.find("#recurrence_summary_id > label");
        internalObj.dom.recurrence.sectionCheckbox = internalObj.$widgetContainer.find("#recurrence_id .toggle_section > input:checkbox");
        internalObj.dom.recurrence.time = internalObj.$widgetContainer.find("#recurrence_time_id .time_text");
      };
      
      /**
       * Initialize the UI elements of schedule section
       */
      this.initializeScheduleElements = function() {
        scheduleTypeChangeHandler();
      };
      
      /**
       * Initialize the recurrence UI elements
       */
      this.initializeRecurrenceElements = function() {
        recurrenceUnitChangeHandler();
        recurrenceEndTypeChangeHandler();
        updateSummary();
      };
      
      /**
       * Defines the event handlers for schedule section
       */
      var addScheduleHandlers = function() {
        internalObj.dom.schedule.typeRadio.bind("change", scheduleTypeChangeHandler);
      };
      
      /**
       * Defines the event handlers for recurrence section
       */
      var addRecurrenceHandlers = function() {
        
        internalObj.dom.recurrence.repeat.units.bind("change", recurrenceUnitChangeHandler);
        internalObj.dom.recurrence.repeat.value.bind("change", updateSummary);
        internalObj.dom.recurrence.daysCheckbox.bind("change", updateSummary);
        internalObj.dom.recurrence.endTypeRadio.bind("change", recurrenceEndTypeChangeHandler);
        
      };
      
      /**
       * The schedule type change handler. It does
       * Show or hide the date time widget based on the schedule type
       */
      var scheduleTypeChangeHandler = function() {
        if(internalObj.dom.schedule.typeRadio.filter(":checked").val() == internalObj.schedule.type.types.later) {
          internalObj.dom.schedule.dateTimeRow.removeClass("hidden");
        } else {
          internalObj.dom.schedule.dateTimeRow.addClass("hidden");
        }
      };
      
      /**
       * Recurrence unit change handler. It does
       * Changes the description of the recurrence value field
       * Show or hide the recurrence days row
       * Update recurrence summary
       */
      var recurrenceUnitChangeHandler = function() {
        var unit = internalObj.dom.recurrence.repeat.units.val();
        
        var desc = i18n.getMessage(internalObj.recurrence.repeatUnits2LabelPrefix + internalObj.SEPARATOR + unit);
        internalObj.dom.recurrence.repeat.valueDesc.text(desc);
        
        if(unit == internalObj.recurrence.repeatUnits.weekly) {
          internalObj.dom.recurrence.daysRow.removeClass("hidden");
        } else {
          internalObj.dom.recurrence.daysRow.addClass("hidden");
        }
        updateSummary();
      };
      
      /**
       * Recurrence End type change handler. It does
       * Show or hide the recurrence end date time widget
       */
      var recurrenceEndTypeChangeHandler = function() {
        if(internalObj.dom.recurrence.endTypeRadio.filter(":checked").val() == internalObj.recurrence.end.type.on) {
          internalObj.dom.recurrence.dateTimeRow.removeClass("hidden");
        } else {
          internalObj.dom.recurrence.dateTimeRow.addClass("hidden");
        }
      };
      
      /**
       * Updates the summary of the recurrence based on the recurrence unit and recurrence value and recurrence days
       */
      var updateSummary = function() {
        var SPACE = " ";
        var repeatunit = internalObj.dom.recurrence.repeat.units.val();
        var repeatValue = internalObj.dom.recurrence.repeat.value.val();
        var repeatunitDesc = i18n.getMessage(internalObj.recurrence.repeatUnits3LabelPrefix + internalObj.SEPARATOR + repeatunit);

        if (repeatValue > 0 && repeatValue <= 9999) {
          var summaryText = i18n.getMessage(internalObj.recurrence.summaryLabelKey1) + SPACE + Number(repeatValue) + SPACE + repeatunitDesc;
          
          if(repeatunit == internalObj.recurrence.repeatUnits.weekly) {
              var days = ScheduleRecurrenceUtil.getCheckedItems(internalObj.dom.recurrence.daysCheckbox, summaryFormatter);
              days = days.join(", ");
              if(days) {
                summaryText += SPACE + i18n.getMessage(internalObj.recurrence.summaryLabelKey2) + SPACE + days;
              }
          }
          internalObj.dom.recurrence.summaryDesc.text(summaryText);
        }
      };
      
      /**
       * Adds call back based validations to the 
       * elements of schedule recurrence widget
       */
      this.addCustomValidations = function() {
        
        var customValidator = new CustomValidator(internalObj.$widgetContainer);
        customValidator.removeValidationForDisabledField(internalObj.disabledValidationKey);
        
        addDataTriggersForTimeWidget();
        
        if(!conf.disableScheduleSection) {
          var eventHash = {};
          eventHash[internalObj.schedule.validationKey.date] = scheduleDateValidator;
          eventHash[internalObj.schedule.validationKey.time] = scheduleTimeValidator;
            
          customValidator.addCustomValidation(eventHash);
        }
        
        if(!conf.disableRecurrenceSection) {
          var eventHash = {};
          eventHash[internalObj.recurrence.validationKey.date] = recurrenceDateValidator;
          eventHash[internalObj.recurrence.validationKey.time] = recurrenceTimeValidator;
            
          customValidator.addCustomValidation(eventHash);
        }
      };
      
      /**
       * Adds the data-trigger attribute to time widgets to support call back based validation
       */
      var addDataTriggersForTimeWidget = function() {
        if(!conf.disableScheduleSection) {
          internalObj.dom.schedule.time.attr("data-trigger",internalObj.schedule.validationKey.time);
        }
        if(!conf.disableRecurrenceSection) {
          internalObj.dom.recurrence.time.attr("data-trigger",internalObj.recurrence.validationKey.time);
        }
      };
      
      /**
       * The schedule start date widget's custom validation callback.
       * Validates if the schedule start date is greater than or equal to current date
       */
      var scheduleDateValidator = function() {
        var currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        
        var startDate = internalObj.formWidget.getInstantiatedWidgets().datePicker_schedule_date_id.instance.getDate();
        if(startDate && startDate < currentDate) {
          return i18n.getMessage(internalObj.schedule.validationLabel);
        }
        
        internalObj.dom.schedule.time.trigger('change');
        if(!conf.disableRecurrenceSection && internalObj.dom.recurrence.endTypeRadio.filter(":checked").val() == internalObj.recurrence.end.type.on) {
        	internalObj.dom.recurrence.date.trigger('change');
        	internalObj.dom.recurrence.time.trigger('change');
        }
                
        return;
      };
      
      /**
       * The schedule start time widget's custom validation callback.
       * Validates if the schedule start date + time is greater than current date and time
       */
      var scheduleTimeValidator = function() {
        var currentDate = new Date();
        
        var time = internalObj.formWidget.getInstantiatedWidgets().dateTime_schedule_time_id.instance.getTime();
        if(!ScheduleRecurrenceUtil.isValidTimeFormat(time)) {
          return i18n.getMessage(internalObj.invalidTimeLabel);
        }
        var startDate = internalObj.formWidget.getInstantiatedWidgets().datePicker_schedule_date_id.instance.getDate();
        if(startDate) {
          time = ScheduleRecurrenceUtil.appendSeconds(time);
          startDate = ScheduleRecurrenceUtil.mergeDateTime(startDate, time);
          if(startDate && startDate <= currentDate) {
            return i18n.getMessage(internalObj.schedule.validationLabel);
          }
        }
        if(!conf.disableRecurrenceSection && internalObj.dom.recurrence.endTypeRadio.filter(":checked").val() == internalObj.recurrence.end.type.on) {
        	internalObj.dom.recurrence.time.trigger('change');
        }
        
        return;
      };
      
      /**
       * The recurrence end date widget's custom validation callback.
       * Validates if the recurrence end date is greater than or 
       * equal to current date or schedule start date
       */
      var recurrenceDateValidator = function() {
        var date1 = new Date();
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setMilliseconds(0);
        
        var msgKey = internalObj.recurrence.validationLabel1;
        if(!conf.disableScheduleSection && internalObj.dom.schedule.typeRadio.filter(":checked").val() == internalObj.schedule.type.types.later) {
          date1 = internalObj.formWidget.getInstantiatedWidgets().datePicker_schedule_date_id.instance.getDate();
          msgKey = internalObj.recurrence.validationLabel2;
        }
        var date2 = internalObj.formWidget.getInstantiatedWidgets().datePicker_recurrence_date_id.instance.getDate()
        if(date1 && date2 < date1) {
          return i18n.getMessage(msgKey);
        }
        
        internalObj.dom.recurrence.time.trigger('change');
        
        return;
      };
      
      /**
       * The recurrence end time widget's custom validation callback.
       * Validates if the schedule end date + time is greater than 
       * current date and time or schedule start date and time.
       */
      var recurrenceTimeValidator = function() {
        var date1 = new Date();
        
        var time = internalObj.formWidget.getInstantiatedWidgets().dateTime_recurrence_time_id.instance.getTime();
        if(!ScheduleRecurrenceUtil.isValidTimeFormat(time)) {
          return i18n.getMessage(internalObj.invalidTimeLabel);
        }
        
        var msgKey = internalObj.recurrence.validationLabel1;
        if(!conf.disableScheduleSection && internalObj.dom.schedule.typeRadio.filter(":checked").val() == internalObj.schedule.type.types.later) {
          date1 = internalObj.formWidget.getInstantiatedWidgets().datePicker_schedule_date_id.instance.getDate();
          var time1 = internalObj.formWidget.getInstantiatedWidgets().dateTime_schedule_time_id.instance.getTime();
          time1 = ScheduleRecurrenceUtil.appendSeconds(time1);
          if(date1) {
            date1 = ScheduleRecurrenceUtil.mergeDateTime(date1, time1);
          }
          msgKey = internalObj.recurrence.validationLabel2;
        }
        var date2 = internalObj.formWidget.getInstantiatedWidgets().datePicker_recurrence_date_id.instance.getDate();
        
        time = ScheduleRecurrenceUtil.appendSeconds(time);
        date2 = ScheduleRecurrenceUtil.mergeDateTime(date2, time);
        if(date1 && date2 <= date1) {
          return i18n.getMessage(msgKey);
        }
        return;
      };
      
      
      
      var summaryFormatter = function(value) {
        return i18n.getMessage( internalObj.recurrence.repeatDays.daysUnit2LabelPrefix + internalObj.SEPARATOR + value);
      };

    };

    return ScheduleRecurrenceInteraction;
});
