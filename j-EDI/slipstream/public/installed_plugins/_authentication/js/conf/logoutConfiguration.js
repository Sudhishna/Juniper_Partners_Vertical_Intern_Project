/**
 * Configuration to be used by the form widget to render the logout message
 * 
 * @module formConf
 * @copyright Juniper Networks, Inc. 2014
 */

define(["conf/global_config"],
        function(global_config) {
            var global_conf_nls_ctx_name = "__global_conf__";

            var formConf = function( context ) {
                this.getLogoutConf = function( options ) {

                    options = options || { };

                    return {
                        "title": "{{title}}",
                        "form_id": "logout_form",
                        "form_name": "logout_form",
                        "sections": [
                            {
                                "heading_text": "{{version}}",
                                "heading_id": "heading_text",
                                "elements": [
                                    {
                                        "element_description": true,
                                        "id": "msg",
                                        "name": "msg",
                                        "class": "logout_message",
                                        "value": ( options.message && options.message != "" ) ? options.message : context
                                                .getMessage( "certification_based_logout_message" )
                                    },
                                    {
                                        "element_description": true,
                                        "id": "info",
                                        "name": "info",
                                        "class": "logout_info",
                                        "value": ( options.info ) ? options.info : context.getMessage( "certification_based_logout_info" )
                                    }
                                ]
                            }
                        ],
                        "unlabeled": true
                    }
                };

                this.getValues = function( ) {
                    return {
                        "title": Slipstream.reqres.request("nls:retrieve", {
                            msg: global_config.product_name,
                            namespace: global_conf_nls_ctx_name
                        }),
                        "subtitle": "",
                        "version": Slipstream.reqres.request("nls:retrieve", {
                            msg: global_config.product_version,
                            namespace: global_conf_nls_ctx_name
                        }),
                        "copyrightYear": Slipstream.reqres.request("nls:retrieve", {
                            msg: global_config.product_release_year,
                            namespace: global_conf_nls_ctx_name
                        }),
                        "copyright": context.getMessage( 'logout_copyright' ),
                        "juniper": context.getMessage( 'logout_juniper' ),
                        "copyrightAllRights": context.getMessage( 'logout_rights' ),
                        "copyrightTrademark": context.getMessage( 'logout_trademark' ),
                        "copyrightPrivacy": context.getMessage( 'logout_privacy' )
                    };
                };
            };
            return formConf;
        });
