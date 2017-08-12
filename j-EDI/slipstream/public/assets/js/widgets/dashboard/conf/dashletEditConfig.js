/**
 * Configuration for edit dashlet form overlay
 *
 * @module dashletEditView
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['lib/i18n/i18n'], function (i18n) {

    var dashletEditConfiguration = {},
        DASHLET_NAME_PATTERN = "^[a-zA-Z0-9][a-zA-Z0-9\\s-_.:\/]{0,62}$";

    dashletEditConfiguration.elements = {
        "title": "Edit Widget",
        "form_id": "editDashletSettings",
        "form_name": "editDashletSettings",
        "on_overlay": true,
        "sections": [
            {
                "section_id": "default_settings",
                "section_class": "section_class",
                "elements": [
                    {
                        "element_text": true,
                        "id": "dashlet_title",
                        "name": "dashlet_title",
                        "value": "{{title}}",
                        "label": "Name",
                        "required": true,
                        "pattern": DASHLET_NAME_PATTERN,
                        "error": "Invalid entry. Name must begin with an alphanumeric character; some special characters ( -_.:) are allowed; cannot exceed 63 characters."
                    },
                    {
                        "element_description": true,
                        "id": "dashlet_description",
                        "name": "dashlet_description",
                        "label": "Description",
                        "value": "{{details}}"
                    }
                ]
            }
        ],
        "buttonsClass":"buttons_row",
        "cancel_link": {
            "id": "cancel_link",
            "value": "Cancel"
        },
        "buttons": [
            {
                "id": "update",
                "name": "update",
                "value": "OK"
            }
        ]
    };

    return dashletEditConfiguration;

});
