/**
 * Configuration to be used by the form widget to render the login and set password views
 *
 * @module formConf
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['lib/i18n/i18n'], function (i18n) {

    var formConf = {};

    formConf.login = {
        "title": "{{title}}",
        "form_id": "login_user_password",
        "form_name": "login_user_password",
        "err_div_id": "errorDiv",
        "disableAutocomplete": true,
        "err_div_message": i18n.getMessage('login_widget_error'),
        "err_timeout": "2000",
        "valid_timeout": "5000",
        "sections": [
            {
//                "heading": "{{subtitle}}",
                "heading_text": "{{version}}",
                "heading_id": "heading_text",
                "elements": [
                    {
                        "element_text": true,
                        "id": "login_username",
                        "name": "login_username",
                        "placeholder": i18n.getMessage('login_widget_username'),
                        "class": "login_username",
                        "required": true,
                        "notshowrequired": true,
                        "error": i18n.getMessage('form_error_required')
                    },
                    {
                        "element_password": true,
                        "id": "login_password",
                        "name": "login_password",
                        "placeholder": i18n.getMessage('login_widget_password'),
                        "required": true,
                        "notshowrequired": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": i18n.getMessage('form_error_required')
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    }
                ]
            }
        ],
        "unlabeled":true,
        "buttons": [
            {
                "id": "login_credentials",
                "name": "login_credentials",
                "value": i18n.getMessage('login_widget_button')
            }
        ]
    };

    formConf.values = {
        "title": i18n.getMessage('login_widget_title'),
        "subtitle": i18n.getMessage('login_widget_subtitle'),
        "version": i18n.getMessage('login_widget_version'),
        "copyrightYear": i18n.getMessage('login_widget_year'),
        "copyright": i18n.getMessage('login_widget_copyright'),
        "juniper": i18n.getMessage('login_widget_juniper'),
        "copyrightAllRights": i18n.getMessage('login_widget_rights'),
        "copyrightTrademark": i18n.getMessage('login_widget_trademark'),
        "copyrightPrivacy": i18n.getMessage('login_widget_privacy')
    };

    return formConf;

});
