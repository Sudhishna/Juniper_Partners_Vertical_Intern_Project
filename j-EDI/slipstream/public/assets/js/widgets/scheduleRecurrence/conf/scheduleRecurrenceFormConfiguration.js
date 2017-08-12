/**
 * A configuration object with the parameters required to build a form for schedule recurrence widget
 * 
 * @module scheduleRecurrence
 * @author Vignesh K
 * @copyright Juniper Networks, Inc. 2015
 */

define([
      'lib/i18n/i18n'
    ],
    function(i18n) {

      var ScheduleRecurrenceFormConfiguration = function(conf, internalObj) {
        
        this.getValues = function() {
          
          var formConf = {
            "form_id": "schedule_recurrence_form_id",
            "form_name": "schedule_recurrence_form",
            "sections": []
          };
          
          
          if(conf.title) {
            var msgSection = {
               "section_id": "schedule_recurrence_title_id",
               "elements": [
                   {
                     "element_description": true,
                     "value": conf.title,
                     "class": "element-input-auto"
                   }
                 ]
            };
            formConf.sections.push(msgSection);
          }
          
          
          if(!conf.disableScheduleSection) {
            var scheduleSection = {
              "section_id": "schedule_id",
              "elements": [
                  {
                    "element_radio": true,
                    "id": "schedule_type_id",
                    "name": "schedule_type",
                    "label": conf.scheduleLabel?conf.scheduleLabel:i18n.getMessage("schedulerecurrence_widget_schedule_type"),
                    "required": true,
                      "field-help": {
                          "content": conf.scheduleTooltip?conf.scheduleTooltip:i18n.getMessage("schedulerecurrence_widget_schedule_tooltip_content"),
                          "ua-help-identifier": "alias_for_title_ua_event_binding"
                      },                    
                    "values": [
                        {
                            "id": "schedule_type_runnow",
                            "name": internalObj.schedule.type.name,
                            "label": i18n.getMessage("schedulerecurrence_widget_schedule_type_runnow"),
                            "value": internalObj.schedule.type.types.runnow,
                            "checked": true
                        },
                        {
                            "id": "schedule_type_later",
                            "name": internalObj.schedule.type.name,
                            "label": i18n.getMessage("schedulerecurrence_widget_schedule_type_later"),
                            "value": internalObj.schedule.type.types.later
                        }
                    ]
                  },
                  {
                    "element_dateTimeWidget": true,
                    "label": "",
                    "required": true,
                    "notshowrequired": true,
                    "datePickerWidget":
                    {
                      "id": "schedule_date_id",
                      "name": "schedule_date",
                      "placeholder": "MM/DD/YY",
                      "dateFormat": "mm/dd/yyyy",
                      "pattern-error":
                        [
                          {
                            "pattern": "length",
                            "min_length": "10",
                            "max_length": "10",
                            "error": "Incomplete MM/DD/YYYY"
                          },
                          {
                            "pattern": "date",
                            "error": "Must be MM/DD/YYYY"
                          },
                          {
                            "pattern": "validtext",
                            "error": "This is a required field"
                          }
                        ],
                      "error": true,
                      "notshowvalid": true,
                      "post_validation" : internalObj.schedule.validationKey.date
                    },
                    "timeWidget":
                    {
                      "id": "schedule_time_id",
                      "name": "schedule_time"
                    },
                    "class": "hidden"
                  }
                ]
            };
            formConf.sections.push(scheduleSection);
          }
          
          if(!conf.disableRecurrenceSection) {
        	var recurrence_unit =[];
        	if(conf.recurrenceRepeatUnits)
        	{
        		for( var ii in conf.recurrenceRepeatUnits)
        		{
        			recurrence_unit.push({
                        "label": i18n.getMessage(internalObj.recurrence.repeatUnits1LabelPrefix + internalObj.SEPARATOR + conf.recurrenceRepeatUnits[ii]),
                        "value": conf.recurrenceRepeatUnits[ii]
                      });
        		}
        	}
            var recurrenceSection = {
              "section_id": "recurrence_id",
              "toggle_section":
                {
                  "label": i18n.getMessage("schedulerecurrence_widget_recurrence_heading"),
                  "status": "hide",
                  "checked": false
                },
              "elements": [
                {
                   "element_dropdown": true,
                   "id": "recurrence_unit_id",
                   "name": internalObj.recurrence.repeatUnitName,
                   "label": i18n.getMessage("schedulerecurrence_widget_recurrence_unit"),
                   "required": true,
                   "notshowrequired": true,
                   "values":recurrence_unit,
                   "class": "element-input-auto"
                },
                {
                  "element_number": true,
                  "id": "recurrence_value_id",
                  "name": internalObj.recurrence.repeatValueName,
                  "label": i18n.getMessage("schedulerecurrence_widget_recurrence_repeat_value"),
                  "min_value":"1",
                  "max_value":"9999",
                  "placeholder": "",
                  "required": true,
                  "notshowrequired": true,
                  "value": "1",
                  "error": i18n.getMessage("schedulerecurrence_widget_recurrence_repeat_value_error"),
                  "class":"element-input-short left"
                },
                {
                  "element_description": true,
                  "id": "recurrence_value_desc_id",
                  "name": "recurrence_value_desc",
                  "value": i18n.getMessage(internalObj.recurrence.repeatUnits2LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatUnits.daily),
                  "class":"element-input-padding left"
                },
                {
                  "element_checkbox": true,
                  "id": "recurrence_days_id",
                  "name": "recurrence_days",
                  "label": i18n.getMessage("schedulerecurrence_widget_recurrence_days_on"),
                  "required": true,
                  "notshowrequired": true,
                  "values": [
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.mon + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.mon),
                        "value": internalObj.recurrence.repeatDays.days.mon,
                        "post_validation": internalObj.disabledValidationKey,
                        "checked": true
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.tues + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.tues),
                        "value": internalObj.recurrence.repeatDays.days.tues,
                        "post_validation": internalObj.disabledValidationKey
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.wed + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.wed),
                        "value": internalObj.recurrence.repeatDays.days.wed,
                        "post_validation": internalObj.disabledValidationKey
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.thur + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.thur),
                        "value": internalObj.recurrence.repeatDays.days.thur,
                        "post_validation": internalObj.disabledValidationKey
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.fri + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.fri),
                        "value": internalObj.recurrence.repeatDays.days.fri,
                        "post_validation": internalObj.disabledValidationKey
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.sat + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.sat),
                        "value": internalObj.recurrence.repeatDays.days.sat,
                        "post_validation": internalObj.disabledValidationKey
                      },
                      {
                        "id": "recurrence_days_val_" + internalObj.recurrence.repeatDays.days.sun + "_id",
                        "name": internalObj.recurrence.repeatDays.name,
                        "label": i18n.getMessage(internalObj.recurrence.repeatDays.daysUnit1LabelPrefix + internalObj.SEPARATOR + internalObj.recurrence.repeatDays.days.sun),
                        "value": internalObj.recurrence.repeatDays.days.sun,
                        "post_validation": internalObj.disabledValidationKey
                      }
                  ],
                  "error": i18n.getMessage("schedulerecurrence_widget_recurrence_days_error"),
                  "class": "element-input-auto option-one-row clear"
                },
                {
                  "element_radio": true,
                  "id": "recurrence_end_id",
                  "name": "recurrence_end",
                  "label": i18n.getMessage("schedulerecurrence_widget_recurrence_end"),
                  "required": true,
                  "notshowrequired": true,
                  "values": [
                      {
                          "id": "recurrence_end_never_id",
                          "name": internalObj.recurrence.end.name,
                          "label": i18n.getMessage("schedulerecurrence_widget_recurrence_end_never"),
                          "value": internalObj.recurrence.end.type.never,
                          "checked": true
                      },
                      {
                          "id": "recurrence_end_on_id",
                          "name": internalObj.recurrence.end.name,
                          "label": i18n.getMessage("schedulerecurrence_widget_recurrence_end_on"),
                          "value": internalObj.recurrence.end.type.on
                      }
                  ],
                  "class": "clear"
                },
                {
                  "element_dateTimeWidget": true,
                  "label": "",
                  "required": true,
                  "notshowrequired": true,
                  "datePickerWidget":
                  {
                    "id": "recurrence_date_id",
                    "name": "recurrence_date",
                    "placeholder": "MM/DD/YY",
                    "dateFormat": "mm/dd/yyyy",
                    "pattern-error":
                      [
                        {
                          "pattern": "length",
                          "min_length": "10",
                          "max_length": "10",
                          "error": "Incomplete MM/DD/YYYY"
                        },
                        {
                          "pattern": "date",
                          "error": "Must be MM/DD/YYYY"
                        },
                        {
                          "pattern": "validtext",
                          "error": "This is a required field"
                        }
                      ],
                    "error": true,
                    "notshowvalid": true,
                    "class": "hidden",
                    "post_validation" : internalObj.recurrence.validationKey.date
                  },
                  "timeWidget":
                  {
                    "id": "recurrence_time_id",
                    "name": "recurrence_time"
                  },
                  "class": "clear hidden"
                },
                {
                  "element_description": true,
                  "id": "recurrence_summary_id",
                  "label": i18n.getMessage("schedulerecurrence_widget_recurrence_summary"),
                  "name": "recurrence_summary",
                  "value": "",
                  "class": "clear"
                }
              ]
           };
            formConf.sections.push(recurrenceSection);
          }
          
          
          return formConf;
        };
      };

      return ScheduleRecurrenceFormConfiguration;
    });