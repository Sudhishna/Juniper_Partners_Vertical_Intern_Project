/**
 * A form configuration object with the parameters required to build a Form for testing the Schedule Recurrence Widget
 *
 * @module formConfiguration
 * @author Vignesh K.
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var formConfiguration = {
        "title": "Schedule Recurrence Widget",
        "form_id": "test_schedule recurrence widget",
        "form_name": "test_schedule recurrence widget",
        "sections": [
            {
                "section_id": "test_form_section",
                "elements": [
                    {
                        "element_text": true,
                        "id": "scheduler_recurrence_id",
                        "name": "scheduler_recurrence",
                        "placeholder": "Loading ...",
                    }
                ]
            },
            {
                "elements": [
                    {
                          "element_description": true,
                          "inlineButtons":[
                              {
                                  "id": "get_start_time_id",
                                  "value": "schedule start info",
                                  "class": "input_button"
                              },
                              {
                                  "id": "get_schedule_as_query_id",
                                  "value": "schedule info as URL query",
                                  "class": "input_button"
                              },
                              {
                                  "id": "get_schedule_recurrence_info_id",
                                  "value": "schedule recurrence info",
                                  "class": "input_button"
                              },
                              {
                                "id": "isvalid_id",
                                   "value": "isvalid",
                                   "class": "input_button"
                              }
                          ]
                    }
                ]
            }
        ]
    };

    return formConfiguration;

});
