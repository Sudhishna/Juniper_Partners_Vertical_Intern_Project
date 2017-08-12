/**
 * A form configuration object with the parameters for addDevice, CLI, Configure, and Stats tabs. All non relevant form configurations have been commented out for ease of use when searching
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@uniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var formConfiguration = {};

    // formConfiguration.Filter = {
    //     "form_id": "filter_grid_form",
    //     "form_name": "filter_grid_form",
    //     "sections": [
    //         {
    //             "section_class": "left",
    //             "elements": [
    //                 {
    //                     "element_dropdown": true,
    //                     "id": "from_zone_filter",
    //                     "name": "from_zone_filter",
    //                     "label": "From Zone:",
    //                     "class": "elements-filter left",
    //                     "values": [
    //                             {
    //                                 "label": "Loading ...",
    //                                 "disabled": "true",
    //                                 "value": ""
    //                             }
    //                         ],
    //                     "error": "Please make a selection"
    //                 },{
    //                     "element_dropdown": true,
    //                         "id": "to_zone_filter",
    //                         "name": "to_zone_filter",
    //                         "label": "To Zone:",
    //                         "class": "elements-filter left",
    //                         "values": [
    //                             {
    //                                 "label": "Loading ...",
    //                                 "disabled": "true",
    //                                 "value": ""
    //                             }
    //                         ],
    //                     "error": "Please make a selection"
    //                 }
    //             ]
    //         }]
    // };
    //
    // formConfiguration.SourceAddress = {
    //     "title": "Source Address",
    //     "form_id": "source_address_view",
    //     "form_name": "source_address_view",
    //     "err_div_id": "errorDiv",
    //     "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    //     "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    //     "err_div_link_text":"Configuring Basic Settings",
    //     "err_timeout": "1000",
    //     "valid_timeout": "5000",
    //     "sections": [
    //         {
    //             "heading_text": "Select the Source Address for the policy. You can choose an address book entry from the list bellow or you can create a new address book entry by selecting the \"Create Address\" button",
    //             "elements": [
    //                 {
    //                     "element_text": true,
    //                     "id": "source_address",
    //                     "class": "list-builder",
    //                     "name": "source-address",
    //                     "placeholder": "Loading ..."
    //                 }
    //             ]
    //         }
    //     ]
    // };
    //
    // formConfiguration.DestinationAddress = {
    //     "title": "Destination Address",
    //     "form_id": "source_address_view",
    //     "form_name": "source_address_view",
    //     "err_div_id": "errorDiv",
    //     "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    //     "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    //     "err_div_link_text":"Configuring Basic Settings",
    //     "err_timeout": "1000",
    //     "valid_timeout": "5000",
    //     "sections": [
    //         {
    //             "heading_text": "Select the Destination Address for the policy. You can choose an address book entry from the list bellow or you can create a new address book entry by selecting the \"Create Address\" button",
    //             "elements": [
    //                 {
    //                     "element_text": true,
    //                     "id": "destination_address",
    //                     "class": "list-builder",
    //                     "name": "destination-address",
    //                     "placeholder": "Loading ..."
    //                 }
    //             ]
    //         }
    //     ]
    // };

    //creates the form for /view/statsView.js
    formConfiguration.Statistics = {
        "title": "View Device Statistics",
        "form_id": "current_device_view",
        "form_name": "current_device_view",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                //"heading_text": "Please Select Devices below to see its details",
            }
        ]
    };
    //
    // formConfiguration.zonePolicy = {
    //     "title": "Zone Policy",
    //     "form_id": "zone_policy",
    //     "form_name": "zone_policy",
    //     "err_div_id": "errorDiv",
    //     "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    //     "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    //     "err_div_link_text":"Configuring Basic Settings",
    //     "err_timeout": "1000",
    //     "valid_timeout": "5000",
    //     "sections": [
    //         {
    //             "section_id": "section_id",
    //             "elements": [
    //                 {
    //                     "element_radio": true,
    //                     "id": "policy_type",
    //                     "label": "Type",
    //                     "required": true,
    //                     "values": [
    //                         {
    //                             "id": "type_group1",
    //                             "name": "type_group",
    //                             "label": "Group",
    //                             "value": "Group",
    //                             "checked": "true"
    //                         },
    //                         {
    //                             "id": "type_group2",
    //                             "name": "type_group",
    //                             "label": "Device",
    //                             "value": "Device"
    //                         }
    //                     ],
    //                     "error": "Please make a selection"
    //                 },
    //                 {
    //                     "element_text": true,
    //                     "id": "context",
    //                     "name": "context",
    //                     "value": "{{context}}",
    //                     "label": "Name",
    //                     "required": true,
    //                     "error": "Name is a required field"
    //                 },
    //                 {
    //                     "element_textarea": true,
    //                     "id": "policy_description",
    //                     "name": "policy_description",
    //                     "value": "{{policy_description}}",
    //                     "label": "Description"
    //                 },
    //                 {
    //                     "element_radio": true,
    //                     "id": "policy_manage",
    //                     "label": "Manage",
    //                     "ua-help": "alias_for_ua_event_binding",
    //                     "tooltip": "Tooltip for manage field",
    //                     "values": [
    //                         {
    //                             "id": "manage_group1",
    //                             "name": "manage_group",
    //                             "label": "Zone Policy",
    //                             "value": "Zone Policy",
    //                             "checked": "true"
    //                         },
    //                         {
    //                             "id": "manage_group2",
    //                             "name": "manage_group",
    //                             "label": "Global Policy",
    //                             "value": "Global Policy"
    //                         },
    //                         {
    //                             "id": "manage_group3",
    //                             "name": "manage_group",
    //                             "label": "Both Zone & Global Policy",
    //                             "value": "Both Zone & Global Policy"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "element_dropdown": true,
    //                     "id": "policy_priority",
    //                     "name": "policy_priority",
    //                     "label": "Policy Priority",
    //                     "values": [
    //                         {
    //                             "label": "Low",
    //                             "value": "Low"
    //                         },
    //                         {
    //                             "label": "Medium",
    //                             "value": "Medium",
    //                             "selected": "true"
    //                         },
    //                         {
    //                             "label": "High",
    //                             "value": "High"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "element_dropdown": true,
    //                     "id": "policy_profile",
    //                     "name": "policy_profile",
    //                     "label": "Profile",
    //                     "values": [
    //                         {
    //                             "label": "Select profile",
    //                             "value": ""
    //                         },
    //                         {
    //                             "label": "Log Session Init (SYSTEM)",
    //                             "value": "Log Session Init (SYSTEM)"
    //                         },
    //                         {
    //                             "label": "Log Session Close (SYSTEM)",
    //                             "value": "Log Session Close (SYSTEM)"
    //                         },
    //                         {
    //                             "label": "All Logging Enabled (SYSTEM)",
    //                             "value": "All Logging Enabled (SYSTEM)"
    //                         },
    //                         {
    //                             "label": "All Logging Disabled (SYSTEM)",
    //                             "value": "All Logging Disabled (SYSTEM)"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // };

    //creates the view for the spinner overlay in spinner/tests/appOverlaySpinner.js
    formConfiguration.utmPolicy = {
      "title": "Are you sure you wish to proceed?",
      "form_id": "create_zone_policy",
      "form_name": "create_zone_policy",
      "err_div_id": "errorDiv",
      "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
      "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
      "err_div_link_text":"Configuring Basic Settings",
      "err_timeout": "1000",
      "valid_timeout": "5000",
      "on_overlay": true,
      "sections": [
            {
                "elements": [
                  {
                      "element_description": true,
                      "id": "overlayText",
                      "label": "Click 'Yes' to fetch data.",
                      "value": ""
                  }
                ]
            }
        ],
        "buttons": [
          {
              "id": "close_overlay",
              "name": "save",
              "value": "Cancel"
          },{
                "id": "fetch_data",
                "name": "save",
                "value": "Yes"
            }
        ],
    };

    //creates the form for /view/cliView.js
    formConfiguration.constructCLICommand = {
        "title": "Run CLI Commands",
        "form_id": "cli_form",
        "form_name": "cli_form",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "elements": [
                  {
                      "element_text": true,
                      "id": "application",
                      "class": "list-builder",
                      "name": "application",
                      "placeholder": "Fetching Devices, Please Wait ..."
                  },
                  {
                      "element_textarea": true,
                      "id": "cli_text_area",
                      "name": "cli_text_area",
                      "label": "Enter CLI Command",
                      "placeholder": "ex: show interfaces terse",
                      "post_validation": "validTextarea",
                      "required": true,
                      "notshowrequired": true,
                      "error": "Enter a valid cli command",
                  }
                ]
            }
        ],
         "buttons": [{
            "id": "run_command",
            "name": "run_command",
            "value": "Run CLI Command"
          }],
          "unlabeled": "true"
    };

    // formConfiguration.deviceStatistics = {
    //     "title": "Statistics",
    //     "form_id": "cli_form",
    //     "form_name": "cli_form",
    //     "err_div_id": "errorDiv",
    //     "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    //     "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    //     "err_div_link_text":"Configuring Basic Settings",
    //     "err_timeout": "1000",
    //     "valid_timeout": "5000",
    //     "sections": [
    //         {
    //             "elements": [
    //               {
    //                   "element_text": true,
    //                   "id": "statistics",
    //                   "class": "",
    //                   "name": "application",
    //                   "placeholder": "Fetching Devices, Please Wait ..."
    //               },
    //               {
    //                   "element_textarea": true,
    //                   "id": "cli_text_area",
    //                   "name": "cli_text_area",
    //                   "label": "Enter CLI Command",
    //                   "placeholder": "ex: show interfaces terse",
    //                   "error": "Enter a valid cli command",
    //                   "post_validation": "validTextarea"
    //               }
    //             ]
    //         }
    //     ],
    //      "buttons": [{
    //         "id": "run_command",
    //         "name": "run_command",
    //         "value": "Run CLI Command"
    //       }],
    //       "unlabeled": "true"
    // };

    //creates the form for /view/addDeviceView.js
    formConfiguration.addDevice = {
        "title": "Add a Device",
        "form_id": "add_device_form",
        "form_name": "add_device_form",
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
                      "id": "deviceModel",
                      "name": "deviceModel",
                      "label": "Device model",
                      "required": true,
                      "notshowrequired": true,
                      "error": "Device Model is a required field"
                  },
                  {
                        "element_ip": true,
                        "id": "deviceIP",
                        "name": "deviceIP",
                        "label": "Device IP ",
                        "value": "{{deviceIP}}",
                        "required": true,
                        "notshowrequired": true,
                        "error": "Please enter a valid IPv4 or IPv6 address"
                    },
                    {
                        "element_text": true,
                        "id": "deviceUser",
                        "name": "deviceUser",
                        "label": "Device Username",
                        "required": true,
                        "notshowrequired": true,
                        "error": "Device Username is a required field"
                    },
                    {
                        "element_password": true,
                        "id": "device_password",
                        "name": "device_password",
                        "label": "Device Password",
                        //"placeholder": "Sp0g-Sp0g",
                        "required": true,
                        "notshowrequired": true,
                        "pattern-error": [
                            {
                                "pattern": "length",
                                "min_length":"6",
                                "error": "Must be 6 at least 6 characters."
                            },
                            {
                                "pattern": "hasnumber",
                                "error": "At least one number is required."
                            },
                            {
                                "pattern": "hasmixedcase",
                                "error": "A combination of mixed case letters is required."
                            }
                        ],
                        "error": true,
                        "help": "Must be 6 characters or more. At least one capital letter, one lowercase letter, and a number is required."
                      }
                ]
            }
        ],
          "buttons": [{
              "id": "add_device",
              "name": "add_device",
              "value": "Add Device"
        }],
          "unlabeled": "true", //align the button left
    };

    // formConfiguration.TabOnOverlay = {
    //     "title": "Tab Container Widget in a Form on Overlay",
    //     "form_id": "create_zone_policy",
    //     "form_name": "create_zone_policy",
    //     "err_div_id": "errorDiv",
    //     "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    //     "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    //     "err_div_link_text":"Configuring Basic Settings",
    //     "err_timeout": "1000",
    //     "valid_timeout": "5000",
    //     "on_overlay": true,
    //     "sections": [
    //         {
    //             "elements": [
    //                 {
    //                     "element_text": true,
    //                     "id": "policy_name",
    //                     "name": "name",
    //                     "label": "Policy Name",
    //                     "placeholder": "required",
    //                     "ua-help": "alias_for_ua_event_binding",
    //                     "error": "Please enter a value for this field",
    //                     "required": true,
    //                     "tooltip": "Tooltip for text field"
    //                 },
    //                 {
    //                     "element_description": true,
    //                     "id": "tab-container",
    //                     "class": "tabs-on-overlay",
    //                     "name": "tab-container",
    //                     "label": "Tabs",
    //                     "placeholder": "Loading ..."
    //                 }
    //             ]
    //         }
    //     ],
    //     "buttons": [
    //         {
    //             "id": "add_policy_save",
    //             "name": "save",
    //             "value": "OK"
    //         }
    //     ],
    //     "cancel_link": {
    //         "id": "add_policy_cancel",
    //         "value": "Cancel"
    //     }
    // };

    //creates the form for /view/configView.js
    formConfiguration.ConfigView = {
        "title": "Configure a Device",
        "form_id": "config_form",
        "form_name": "config_form",
        "sections": [
            {
                "heading_text": "Choose a device below to configure",
                "elements": [
                  {
                      "element_text": true,
                      "id": "application",
                      "class": "list-builder",
                      "name": "application",
                      "placeholder": "Fetching Devices. Please Wait"
                  },
                  {
                      "element_file": true,
                      "id": "config_file",
                      "name": "config_file",
                      "label": "File Upload",
                      "required": true,
                      "placeholder": "",
                      "fileupload_button_label": "Browse",
                      "placeholder": "ex: init.conf",
                      "error": "Please select a valid file"
                  },
                  {
                      "element_email":true,
                      "id":"user_email",
                      "name":"user_email",
                      "label": "Email for JSNApy Check",
                      "placeholder": " ex: username@juniper.net",
                      "required": true
                  },
                  // {
                  //     "element_checkbox": true,
                  //     "id": "checkbox_field",
                  //     "label": "Perform JSNApy Pre/Post Checks",
                  //     "required": false,
                  //     "values": [
                  //         {
                  //             "id": "checkbox_enable",
                  //             "name": "enable_disable",
                  //             "label": "Click to run pre/post checks",
                  //             "value": "enable",
                  //             "checked": false,
                  //             "visibility": "show_hide_element0"
                  //
                  //         }
                  //     ],
                  //     "error": "Please make a selection"
                  // },
                  {
                      "element_dropdown": true,
                      "id": "user_tests",
                      "name": "user_tests",
                      "label": "JSNApy Test Options",
                      // "required": true,
                      // "notshowrequired": true,
                      "placeholder": "ex: test_contains",
                      "multipleSelection": true,
                      "data": [
                          {
                              "id": "test_all_same.yml",
                              "text": "test_all_same"
                          },
                          {
                              "id": "test_all_same2.yml",
                              "text": "test_all_same2"
                          },
                          {
                              "id": "test_bgp_neighbor.yml",
                              "text": "test_bgp_neighbor"
                          },
                          {
                              "id": "test_contains.yml",
                              "text": "test_contains"
                          },
                          {
                              "id": "test_delta.yml",
                              "text": "test_delta"
                          },
                          {
                              "id": "test_diff.yml",
                              "text": "test_diff"
                          },
                          {
                              "id": " test_exists.yml",
                              "text": " test_exists"
                          },
                          {
                              "id": "test_filter.yml",
                              "text": "test_filter"
                          },
                          {
                              "id": "test_full_output.yml",
                              "text": "test_full_output"
                          },
                          {
                              "id": "test_get_config.yml",
                              "text": "test_get_config"
                          },
                          {
                              "id": "test_in_range.yml",
                              "text": "test_in_range"
                          },
                          {
                              "id": "test_interface.yml",
                              "text": "test_interface"
                          },
                          {
                              "id": "test_is_equal.yml",
                              "text": "test_is_equal"
                          },
                          {
                              "id": "test_is_gt.yml",
                              "text": "test_is_gt"
                          },
                          {
                              "id": "test_is_in.yml",
                              "text": "test_is_in"
                          },
                          {
                              "id": "test_is_lt.yml",
                              "text": "test_is_lt"
                          },
                          {
                              "id": "test_no_diff.yml",
                              "text": "test_no_diff"
                          },
                          {
                              "id": "test_not_equal.yml",
                              "text": "test_not_equal"
                          },
                          {
                              "id": "test_not_exists.yml",
                              "text": "test_not_exists"
                          },
                          {
                              "id": "test_not_in.yml",
                              "text": "test_not_in"
                          },
                          {
                              "id": "test_not_in.yml",
                              "text": "test_not_in"
                          },
                          {
                              "id": "test_not_more.yml",
                              "text": "test_not_more"
                          },
                          {
                              "id": "test_not_range.yml",
                              "text": "test_not_range"
                          },
                          {
                              "id": "test_wo_mssg.yml",
                              "text": "test_wo_mssg"
                          },
                          {
                              "id": "test_xml.yml",
                              "text": "test_xml"
                          }
                      ],
                      "help": "Please select one or more tests to run",
                      "error": "Please make a selection"
                  }
              ]
          }
      ],
        "buttons": [{
             "id": "commit_config",
             "name": "commit_config",
             "value": "Commit Configuration"
     }],
        "unlabeled": "true"
  };

return formConfiguration;

});
