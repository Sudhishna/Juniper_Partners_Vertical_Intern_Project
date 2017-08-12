/**
 * A form configuration object with the parameters required to build a Form for different views of the Grid widget
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var formConfiguration = {};

    formConfiguration.numberColumnFilter = {
        "title": "Number Filter",
        "form_id": "number_filter_overlay",
        "form_name": "number_filter_overlay",
        "on_overlay": true,
        "sections": [
            {
                "class": "number_column_filter_section radioButtons",
                "elements": [
                    {
                        "element_radio": true,
                        "id": "number_radio_field",
                        "required": true,
                        "values": [
                            {
                                "id": "exactly",
                                "name": "number_radio_button",
                                "label": "Exactly",
                                "checked": true,
                                "value": "exactly"
                            },
                            {
                                "id": "between",
                                "name": "number_radio_button",
                                "label": "Between",
                                "value": "between"
                            },
                            {
                                "id": "greater",
                                "name": "number_radio_button",
                                "label": "Greater than or equal to (>=)",
                                "value": "greater"
                            },
                            {
                                "id": "lesser",
                                "name": "number_radio_button",
                                "label": "Lesser than or equal to (=<)",
                                "value": "lesser"
                            }
                        ],
                        "error": "Please enter a number"
                    }
                ]
            },
            {
                "section_class": "number_column_filter_section",
                "elements": [
                    {
                        "element_float": true,
                        "id": "exactly_number",
                        "name": "exactly_number",
                        "error": false
                    },
                    {
                        "element_float": true,
                        "id": "between_number",
                        "name": "between_number",
                        "disabled": true,
                        "class": "between_number"
                    },
                    {
                        "element_float": true,
                        "id": "and_number",
                        "name": "and_number",
                        "disabled": true,
                        "label": "&",
                        "class": "between_number"
                    },
                    {
                        "element_float": true,
                        "id": "greater_number",
                        "name": "greater_number",
                        "disabled": true,
                        "class": "after_between_number"
                    },
                    {
                        "element_float": true,
                        "id": "lesser_number",
                        "name": "lesser_number",
                        "disabled": true
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_number_filter",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "cancel_number_filter",
            "value": "Cancel"
        }
    };

    formConfiguration.dateColumnFilter = {};

    formConfiguration.dateColumnFilter.Overlay = {
        "title": "Date and Time Filter",
        "form_id": "date_filter_overlay",
        "form_name": "date_filter_overlay",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_description": true,
                        "id": "tab-container",
                        "class": "tabs-on-overlay",
                        "name": "tab-container",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_date_filter",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "cancel_date_filter",
            "value": "Cancel"
        }
    };

    formConfiguration.dateColumnFilter.SpecificDate = {
        "form_id": "date_filter_specific",
        "form_name": "date_filter_specific",
        "err_div_id": "errorDiv",
        "sections": [
            {
                "elements": [
                    {
                        "element_dateTimeWidget": true,
                        "label": "Enter Date",
                        "datePickerWidget": {
                            "id": "on_dateTime_date_Widget_date",
                            "name": "on_dateTime_date_Widget_date",
                            "required": true,
                            "placeholder": "YYYY-MM-DD",
                            "dateFormat": "yyyy-mm-dd",
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete YYYY-MM-DD"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be YYYY-MM-DD"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "on_dateTime_date_Widget_time",
                            "name": "on_dateTime_date_Widget_time"
                        }
                    }
                ]
            }
        ]
    };

    formConfiguration.dateColumnFilter.Range = {
        "form_id": "date_filter_range",
        "form_name": "date_filter_range",
        "sections": [
            {
                "elements": [
                    {
                        "element_dateTimeWidget": true,
                        "label": "From",
                        "datePickerWidget": {
                            "id": "between_from_dateTime_date",
                            "name": "between_from_dateTime_date",
                            "required": true,
                            "placeholder": "YYYY-MM-DD",
                            "dateFormat": "yyyy-mm-dd",
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete YYYY-MM-DD"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be YYYY-MM-DD"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "between_from_dateTime_date_time",
                            "name": "between_from_dateTime_date_time"
                        }
                    },
                    {
                        "element_dateTimeWidget": true,
                        "label": "To",
                        "datePickerWidget": {
                            "id": "between_to_dateTime_date",
                            "name": "between_to_dateTime_date",
                            "required": true,
                            "placeholder": "YYYY-MM-DD",
                            "dateFormat": "yyyy-mm-dd",
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete YYYY-MM-DD"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be YYYY-MM-DD"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "between_to_dateTime_date_time",
                            "name": "between_to_dateTime_date_time"
                        }
                    }
                ]
            }
        ]
    };

    formConfiguration.dateColumnFilter.Before = {
        "form_id": "date_filter_before",
        "form_name": "date_filter_before",
        "sections": [
            {
                "elements": [
                    {
                        "element_dateTimeWidget": true,
                        "label": "Enter Date",
                        "datePickerWidget": {
                            "id": "before_dateTime_date_Widget_date",
                            "name": "before_dateTime_date_Widget_date",
                            "required": true,
                            "placeholder": "YYYY-MM-DD",
                            "dateFormat": "yyyy-mm-dd",
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete YYYY-MM-DD"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be YYYY-MM-DD"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "before_dateTime_date_Widget_time",
                            "name": "before_dateTime_date_Widget_time"
                        }
                    }
                ]
            }
        ]
    };

    formConfiguration.dateColumnFilter.After = {
        "form_id": "date_filter_after",
        "form_name": "date_filter_after",
        "sections": [
            {
                "elements": [
                    {
                        "element_dateTimeWidget": true,
                        "label": "Enter Date",
                        "datePickerWidget": {
                            "id": "after_dateTime_date_Widget_date",
                            "name": "after_dateTime_date_Widget_date",
                            "required": true,
                            "placeholder": "YYYY-MM-DD",
                            "dateFormat": "yyyy-mm-dd",
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete YYYY-MM-DD"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be YYYY-MM-DD"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "after_dateTime_date_Widget_time",
                            "name": "after_dateTime_date_Widget_time"
                        }
                    }
                ]
            }
        ]
    };

    return formConfiguration;

});