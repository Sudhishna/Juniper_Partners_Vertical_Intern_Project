/**
 * A form configuration object with the parameters required to build a Form for the List Builder
 *
 * @module formConfiguration
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var formConfiguration = {
        "title": "List Builder",
        "form_id": "test_list_builder",
        "form_name": "test_list_builder",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Example of the remote interaction",
                "elements": [
                    {
                        "element_text": true,
                        "class": "list-builder",
                        "id": "protocols",
                        "name": "protocols",
                        "label": "Protocols",
                        "placeholder": "Loading ...",
                    },
                    {
                        "element_description": true,
                        "id": "protocols_button_container",
                        "name": "protocols_button_container",
                        "class": "selected_items_buttons",
                        "inlineButtons":[
                        // {
                        //     "id": "get_available",
                        //     "name": "get_available",
                        //     "value": "Get Available Items"
                        // },
                        // {
                        //     "id": "get_selected",
                        //     "name": "get_selected",
                        //     "value": "Get Selected Items"
                        // },
                        {
                            "id": "remove_available",
                            "name": "remove_available",
                            "value": "Remove Available Items"
                        },
                        {
                            "id": "remove_selected",
                            "name": "remove_selected",
                            "value": "Remove Selected Items"
                        },
                        {
                            "id": "search_available",
                            "name": "search_available",
                            "value": "Search Available Items"
                        },
                        {
                            "id": "search_selected",
                            "name": "search_selected",
                            "value": "Search Selected Items"
                        }]
                    }
                ]
            },
            {
                "heading": "Example of the local interaction after loading remotely once",
                "elements": [
                    {
                        "element_text": true,
                        "class": "list-builder",
                        "id": "addresses",
                        "name": "addresses",
                        "label": "Addresses",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_description": true,
                        "id": "addresses_button_container",
                        "name": "addresses_button_container",
                        "class": "selected_items_buttons",
                        "inlineButtons":[{
                            "id": "set_selected",
                            "name": "set_selected",
                            "value": "Select Items"
                        },
                        {
                            "id": "set_available",
                            "name": "set_available",
                            "value": "Unselect Items"
                        },
                        {
                            "id": "add_available",
                            "name": "add_available",
                            "value": "Add New Available Items"
                        },
                        {
                            "id": "add_selected",
                            "name": "add_selected",
                            "value": "Add New Selected Items"
                        }]
                        
                    }
                    
                ]
            },
            {
                "heading": "Example of the local interaction",
                "elements": [
                    {
                        "element_text": true,
                        "class": "list-builder",
                        "id": "services",
                        "name": "services",
                        "label": "Services",
                        "placeholder": "Loading ..."
                    }
                    
                ]
            }
        ]
    };



return formConfiguration;

});
