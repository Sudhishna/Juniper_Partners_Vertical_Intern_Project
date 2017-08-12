/**
 * A Form Config that will be used to host a grid.
 *
 * @module FormGridContainerConf
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([],
    function() {
        var Configuration = function() {
            this.getValues = function() {
                return {
                    "form_id": "simple_grid",
                    "form_name": "simple_grid",
                    "err_div_id": "errorDiv",
                    "err_timeout": "1000",
                    "on_overlay": true,
                    "title":"Simple Grid in a Form within an Overlay",
                    "title-help": {
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Innumerabilia dici possunt in hanc sententiam, sed non necesse est. Potius ergo illa dicantur: turpe esse, viri non esse debilitari dolore, frangi, succumbere.",
                        "ua-help-identifier": "alias_for_ua_event_binding"
                    },
                    "sections": [
                    {
                        "elements": [
                        {
                            "element_text": true,
                            "id": "grid",
                            "class": "fixedHeightGrid",
                            "placeholder": "loading ..."
                        }]
                    }],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "cancel",
                        "value": "Cancel"
                    },
                    "buttons": [
                        {
                            "id": "ok",
                            "value": "Ok"
                        }
                    ]
                };

            };
        };
        return Configuration;
    }
);
