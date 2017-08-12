/**
 * Configuration required to render the welcome page from the Form Widget
 *
 * @module Welcome page Configuration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(["lib/i18n/i18n"], function (i18n) {

    var summaryConfiguration = {};

    summaryConfiguration.list = {
        //"title": "Quickstart Summary",
        "form_id": "summary_list_form",
        "form_name": "summary_list_form",
        "sections": [
            {
                "heading_id": "heading_text",
                "heading_text": i18n.getMessage("wizard_summary_heading")
            }
        ],
        "footer": [
            {
                "text": i18n.getMessage("wizard_commit_to_complete")
            }
        ]
    };

    return summaryConfiguration;

});
