/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var formConfiguration = {};

    formConfiguration.FirewallPolicies = {
        "title": "Create Policy",
        "form_id": "create_policy",
        "form_name": "create_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "section_id": "section_id",
                "elements": [
                    {
                        "element_text": true,
                        "id": "context",
                        "name": "context",
                        "value": "{{context}}",
                        "label": "Name",
                        "required": true,
                        "error": "Name is a required field"
                    },
                    {
                        "element_textarea": true,
                        "id": "policy_description",
                        "name": "policy_description",
                        "value": "{{policy_description}}",
                        "label": "Description"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_policy_cancel",
                "name": "cancel",
                "value": "Cancel"
            },
            {
                "id": "add_policy_save",
                "name": "save",
                "value": "Save"
            }
        ]
    };

return formConfiguration;

});
