/**
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014-2015
 */
define([], function () {

    var config = {};

    config.elements = {
        title: "Overlay Title",
        message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        inputField: [
            {
                "label": "Enter number",
                "id": "field_number",
                "name": "field_number",
                "placeholder": "123"
            }
        ],
        "buttons": [
            {
                "id": "no",
                "name": "no",
                "value": "No"
            },
            {
                "id": "yes",
                "name": "yes",
                "value": "Yes"
            }
        ]
    };
    return config;

});