define(function () {
    return [
        {
            "default": true,
            "name": "nav.dashboard"
        },
        {
            "name": "nav.monitors",
            "children": [
                {
                    "name": "nav.alerts_alarms",
                    "children": [
                        {
                            "name":"nav.alerts"
                        },
                        {
                            "name": "nav.alert_definitions"
                        },
                        {
                            "name": "nav.alarms"
                        }

                    ]
                },
                {
                    "name": "nav.log_and_events",
                    "children": [
                        {
                            "name": "nav.logs_events_all_event_categories"
                        }, {
                            "name": "nav.logs_events_firewall"
                        }, {
                            "name": "nav.logs_events_web_filtering"
                        }, {
                            "name": "nav.logs_events_vpn"
                        }, {
                            "name": "nav.logs_events_content_filtering"
                        },{
                            "name": "nav.logs_events_anti_spam"
                        },{
                            "name": "nav.logs_events_anti_virus"
                        },{
                            "name": "nav.logs_events_ips"
                        }
                    ]
                },
                {
                    "name": "nav.threat_map_live",
                    "children": [
                        {
                            "name": "nav.threats_antivirus"
                        }
                    ]
                },  
                {
                    "name" : "nav.app_visibility"
                },
                {
                    "name" : "nav.user_visibility"
                },                              
                {
                    "name" : "nav.source_ip_visibility"
                },
                {
                    "name" : "nav.jobs"
                }, 
                {
                  "name": "nav.auditlog"
                }
            ]
        },
        {
            "name": "nav.devices_and_connections",
            "children": [
                         {
                                "name": "nav.all_devices"
                        },
                        {
                          "name": "nav.discover_devices"
                        }
                     ]
        },
        {
            "name": "nav.configure",
            "children": [
                /*
                {
                    "name": "nav.configurations",
                    "children": [
                        {
                            "name": "nav.devices"
                        }
                    ]
                },*/

                {
                    "name": "nav.firewall_policy",
                    "children": [
                        {
                            "name": "nav.firewallPolicies"
                        },
                        {
                            "name": "nav.fwPolicies_devices"
                        },
                        {
                            "name": "nav.schedulers"
                        },
                        {
                            "name": "nav.policy_profiles"
                        },
                        {
                            "name": "nav.device_templates"
                        }                        
                    ]
                },
                {
                    "name": "nav.app_firewall",
                    "children": [
                        {
                            "name": "nav.app_fw_policies"
                        },{
                            "name": "nav.appsigs"
                        },
                        {
                            "name": "nav.sslForwardProxyProfiles"
                        }                      
                    ]
                },
                {
                    "name": "nav.ips_policy",
                    "children": [
                        {
                            "name": "nav.ipsPolicies"
                        },
                        {
                            "name": "nav.ipsPolicies_devices"
                        },
                        {
                            "name": "nav.ipssigs"
                        },
                        {
                           "name": "nav.policy_templates"
                        }
                    ]
                },
                {
                    "name":"nav.nat_policy",
                    "children":[
                        {
                            "name":"nav.natPolicies"
                        },
                        {
                            "name":"nav.natPolicies_devices"
                        },
                        {
                            "name":"nav.nat_pools"
                        },
                        {
                            "name":"nav.port_sets"
                        }
                    ]
                },
                {
                    "name": "nav.utm",
                    "children": [
                        {
                            "name": "nav.utm_policies"
                        },
                        {
                            "name": "nav.utm_web_filtering"
                        },
                        {
                            "name": "nav.utm_antivirus"
                        },
                        {
                            "name": "nav.utm_antispam"
                        },
                        {
                            "name": "nav.utm_content_filtering"
                        },
                        {
                            "name": "nav.utm_device"
                        },
                        {
                            "name": "nav.utm_url_patterns"
                        },
                        {
                            "name": "nav.utm_url_category_list"
                        }
                    ]
                },
                {
                    "name": "nav.secintel",
                    "children": [
                        {
                            "name": "nav.secintel_profiles"
                        },
                        {
                            "name": "nav.secintel_policies"
                        }
                    ]
                },
                {
                    "name": "nav.vpn-management",
                    "children": [
                        {
                            "name": "nav.vpns"
                        },
                        {
                            "name": "nav.extranet-devices"
                        },
                        {
                            "name": "nav.vpn-profiles"
                        }
                    ]
                },
                {
                    "name": "nav.shared_objects",
                    "children": [
                        {
                            "name": "nav.addresses"
                        },
                        {
                            "name": "nav.applications"
                        },
                        {
                            "name": "nav.variables"
                        },
                        {
                            "name": "nav.zone_sets"
                        }
                    ]
                }
            ]
        },
        {
            "name": "nav.reports",
            "children": [
                {
                    "name": "nav.security_reports"
                },
                {
                    "name": "nav.generated_reports"
                }
            ]
        },
        {
            "name": "nav.administration",
            "children": [
                {
                    "name": "nav.myprofile"
                },
                {
                    "name": "nav.cloud_downloads"
                },
                {
                    "name" : "nav.rbac",
                    "children" : [ 
                                    {
                                        "name" : "nav.users"
                                    },
                                    {
                                        "name" : "nav.roles"
                                    }, 
                                    {
                                        "name" : "nav.domains"
                                    }, 
                                    {
                                        "name" : "nav.remoteprofiles"
                                    }

                                 ]
                },
                {
                    "name": "nav.log_collector_config",
                    "children" : [  {
                                        "name" : "nav.logging_nodes"
                                    }, 
                                    {
                                        "name" : "nav.statistics_and_troubleshooting"
                                    }, 
                                    {
                                        "name" : "nav.logging_devices"
                                    }, 
                                 ]
                },
                {
                    "name": "nav.monitor_settings"
                },
                {
                    "name": "nav.signature_database"
                }

            ]
        },
        {
            "name": "nav.device",
            "children": [
                {
                    "name": "nav.ports_interfaces",
                    "children": [
                        {
                            "name": "nav.interfaces"
                        },
                        {
                            "name": "nav.link_aggregation"
                        },
                        {
                            "name": "nav.zones"
                        },
                        {
                            "name": "nav.screens"
                        },
                        {
                            "name": "nav.static_routing"
                        },
                        {
                            "name": "nav.services",
                            "children": [
                                {
                                    "name": "nav.system_services"
                                },
                                {
                                    "name": "nav.advanced_services"
                                }
                            ]
                        },
                        {
                            "name": "nav.routing_protocols",
                            "children": [
                                {
                                    "name": "nav.route_information"
                                },
                                {
                                    "name": "nav.rip_information"
                                },
                                {
                                    "name": "nav.ospf_information"
                                },
                                {
                                    "name": "nav.bgp_information"
                                },
                                {
                                    "name": "nav.routing_policies",
                                },
                                {
                                    "name": "nav.virtual_router",
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "nav.system_properties",
                    "children": [
                        {
                            "name": "nav.systems_id"
                        },
                        {
                            "name": "nav.date_and_time"
                        },
                        {
                            "name": "nav.mgmt_access"
                        }
                    ]
                },
                {
                    "name": "nav.resource_thresholds"
                },
                {
                    "name": "nav.chassis_clustering",
                    "children": [
                        {
                            "name": "nav.chassis_clustering_setup"
                        },
                        {
                            "name": "nav.chassis_cluster_configuration"
                        }
                    ]
                },
                {
                    "name": "nav.software_updates",
                    "children": [
                        {
                            "name": "nav.software_updates_upload"
                        },
                        {
                            "name": "nav.software_updates_install"
                        },
                        {
                            "name": "nav.software_updates_downgrade"
                        }
                    ]
                },
                {
                    "nzme": "nav.troubleshoot_device",
                    "children": [
                        {
                            "name": "nav.ping_host"
                        },
                        {
                            "name": "nav.traceroute"
                        },
                        {
                            "name": "nav.packet_capture"
                        },
                        {
                            "nane": "nav.cli_terminal"
                        }
                    ]
                },
                {
                    "name": "nav.device_logging"
                },
                {
                    "name": "nav.alg",
                    "children": [
                        {
                            "name": "nav.alg_summary"
                        }
                    ]
                },
                {
                    "name": "nav.authentication"
                },
                {
                    "name": "nav.cli_tools",
                    "children": [
                        {
                            "name": "nav.cli_viewer"
                        }
                    ]
                },
                {
                    "name": "nav.filters",
                    "children": [
                        {
                            "name": "nav.ipv4_firewall_filters"
                        },
                        {
                            "name": "nav.ipv6_firewall_filters"
                        },
                        {
                            "name": "nav.assign_to_interfaces"
                        }
                    ]
                },
                {
                    "name": "nav.forwarding"
                },
                {
                    "name": "nav.vlan"
                },
                {
                    "name": "nav.class_of_service",
                    "children": [
                        {
                            "name": "nav.assign_interface"
                        },
                        {
                            "name": "nav.classifiers"
                        },
                        {
                            "name": "nav.cos_value_aliases"
                        },
                        {
                            "name": "nav.red_drop_profiles"
                        },
                        {
                            "name": "nav.forwarding_classes"
                        },
                        {
                            "name": "nav.rewrite_rules"
                        },
                        {
                            "name": "nav.uscheduler_maps"
                        }
                    ]
                },
                {
                    "name": "nav.device_setup_wizards",
                    "children": [
                        {
                            "name": "nav.quick_setup_wizard"
                        },
                        {
                            "name": "nav.trusted_zone_wizard"
                        },
                        {
                            "name": "nav.untrusted_zone_wizard"
                        }
                    ]
                }
            ]
        },
        {
            "name": "nav.policies",
            "children": [
                {
                    "name": "nav.firewall_policies",
                    "children": [
                        {
                            "name": "nav.firewall_policies_zone"
                        },
                        {
                            "name": "nav.firewall_policies_global"
                        }
                    ]
                },
                {
                    "name": "nav.ips",
                    "children": [
                        {
                            "name": "nav.define_ips_policy"
                        },
                        {
                            "name": "nav.ips_policy_templates"
                        }
                    ]
                },
                {
                    "name": "nav.utm",
                    "children": [
                        {
                            "name": "nav.define_utm_policy"
                        }
                    ]
                },
                {
                    "name": "nav.app_secure",
                    "children": [
                        {
                            "name": "nav.define_appfw_policy"
                        },
                        {
                            "name": "nav.app_qos"
                        },
                        {
                            "name": "nav.app_tracking"
                        }
                    ]
                },
                {
                    "name": "nav.ipsec_vpn",
                    "children": [
                        {
                            "name": "nav.ipsec_global_settings"
                        },
                        {
                            "name": "nav.auto_tunnel",
                            "children": [
                                {
                                    "name": "nav.auto_tunnel_phase1"
                                },
                                {
                                    "name": "nav.auto_tunnel_phase2"
                                }
                            ]
                        },
                        {
                            "name": "nav.dynamic_vpn",
                            "children": [
                                {
                                    "name": "nav.dynamic_vpn_authentication"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "nav.nat",
                    "children": [
                        {
                            "name": "nav.source_nat"
                        },
                        {
                            "name": "nav.destination_nat"
                        },
                        {
                            "name": "nav.static_nat"
                        },
                        {
                            "name": "nav.interface_nat_ports"
                        }
                    ]
                }
            ]
        },
        {
            "name": "nav.objects",
            "children": [
                {
                    "name": "nav.address_books"

                }
            ]
        }
    ]
});