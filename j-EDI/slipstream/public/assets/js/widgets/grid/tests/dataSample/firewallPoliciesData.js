/**
 * A sample configuration object that shows the parameters required to build a Grid widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([ ], function () {

    var dataSample = {};

    dataSample.firewallPoliciesAll = {
        "policy-Level1":{
            "policy-Level2": {
                "policy-Level3":
                    [
                        {
                            "junos:position": 1,
                            "junos:total": 126,
                            "name": "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_PSP_12.197.68.4",
                                "IP_PSP_64.173.86.142"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.160",
                                "IP_PSP_172.21.109.42"
                            ],
                            "application": [
                                "ESP",
                                "IKE",
                                "IKE1",
                                "IKE_NAT_TRAVERSAL",
                                "ftp",
                                "TCP_3845"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 2,
                            "junos:total": 126,
                            "name": "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_DPW_204.186.62.2",
                                "IP_PHEAA_216.37.216.250",
                                "IP_PSP_149.101.21.124",
                                "IP_Rissnet_65.5.59.34",
                                "IP_PSP_199.224.123.82",
                                "IP_PSP_209.243.54.181",
                                "IP_PSP_209.243.54.180"
                            ],
                            "destination-address": [{ //["1","2"]
                                    "key": "key_IP_PSP_164.156.136.113",
                                    "label": "IP_PSP_164.156.136.113"
                                },{
                                    "key": "key_IP_PSP_164.156.135.3",
                                    "label": "IP_PSP_164.156.135.3"
                                },{
                                    "key": "key_IP_PSP_164.156.136.160",
                                    "label": "IP_PSP_164.156.136.160"
                            }],
//                            "application": [
//                                "any"
//                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 3,
                            "junos:total": 126,
                            "inactive": "true",
                            "name": "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [{
                                "key": "IP_PSP_164.156.136.2",
                                "label": "IP_PSP_164.156.136.2"
                            }],
                            "application": [
                                "ssh_state_synch"
                            ],
                            "application-services": {
                                "idp": {
                                    "key": "as_idp_true",
                                    "label": "true"
                                },
                                "utm-policy": {
                                    "key": "as_idp_junos-vf-profile",
                                    "label": "junos-vf-profile"
                                }
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 4,
                            "junos:total": 126,
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "name": "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante",
                            "inactive": "true",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [{
                                "key": "IP_INS_164.156.141.4",
                                "label": "IP_INS_164.156.141.4"
                            }],
                            "application": [
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit",
                            "description": "String to show no line breaks in the field."
                        },
                        {
                            "junos:position": 5,
                            "junos:total": 126,
                            "name": "190002-INS_to_Sircon_drop_em1",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [{
                                "key": "IP_INS_164.156.141.4",
                                "label": "IP_INS_164.156.141.4"
                            }],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 6,
                            "junos:total": 126,
                            "name": "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
//                                "IP_CONV_204.17.79.60"
                            ],
                            "destination-address": [
                                "IP_LOT_164.156.36.6",
                                "IP_LOT_164.156.36.7"
                            ],
                            "application": [
                                "GRE",
                                "UDP_1723"
                            ],
                            "date": "2007-10-06",
                            "action": "permit",
                            "description": "String to \n show \n line breaks \n in the field."
                        },
                        {
                            "junos:position": 7,
                            "junos:total": 126,
                            "name": "194002-Treasury_to_T3_Technologies_-_Treasury_Waiver_request_fo",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "IP_TRE_164.156.25.50",
                                "IP_TRE_164.156.25.57",
                                "IP_TRE_164.156.25.55",
                                "IP_TRE_164.156.25.54",
                                "IP_TRE_164.156.25.52",
                                "IP_TRE_164.156.25.51",
                                "Range_Tre_164.156.25.91_103"
                            ],
                            "application": [
                                "PPTP"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 8,
                            "junos:total": 126,
                            "name": "1195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_SEC_206.41.253.26"
                            ],
                            "destination-address": [
                                "Net_SEC_164.156.45.0",
                                "Net_SEC_164.156.46.0",
                                "Net_SEC_164.156.47.0"
                            ],
                            "application": [
                                "AH",
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit",
                            "description": "Test to show very very long string \n with line breaks \n in the field."
                        },
                        {
                            "junos:position": 9,
                            "junos:total": 126,
                            "name": "196001-VPN_Cleanup_rule__IPSec_1",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60",
                                "IP_REV_63.80.22.190",
                                "IP_REV_64.172.19.140",
                                "IP_SEC_206.41.253.26",
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "any"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 10,
                            "junos:total": 126,
                            "name": "201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_Verizon_4.59.140.232",
                                "IP_Verizon_63.66.64.232",
                                "Net_Verizon_63.66.64.240",
                                "Net_Verizon_4.59.140.240"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 11,
                            "junos:total": 126,
                            "name": "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent1",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_PSP_12.197.68.4",
                                "IP_PSP_64.173.86.142"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.160",
                                "IP_PSP_172.21.109.42"
                            ],
                            "application": [
                                "ESP",
                                "IKE",
                                "ftp",
                                "IKE_NAT_TRAVERSAL",
                                "TCP_3845"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 12,
                            "junos:total": 126,
                            "name": "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_DPW_204.186.62.2",
                                "IP_PHEAA_216.37.216.250",
                                "IP_PSP_149.101.21.124",
                                "IP_Rissnet_65.5.59.34",
                                "IP_PSP_199.224.123.82",
                                "IP_PSP_209.243.54.181",
                                "IP_PSP_209.243.54.180"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.113",
                                "IP_PSP_164.156.135.3",
                                "IP_PSP_164.156.136.160"
                            ],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 13,
                            "junos:total": 126,
                            "inactive": "true",
                            "name": "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.2"
                            ],
                            "application": [
                                "ssh_state_synch"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 14,
                            "junos:total": 126,
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "name": "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante2",
                            "inactive": "true",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [
                                "IP_INS_164.156.141.4"
                            ],
                            "application": [
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 15,
                            "junos:total": 126,
                            "name": "190002-INS_to_Sircon_drop_em",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [
                                "IP_INS_164.156.141.4"
                            ],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 16,
                            "junos:total": 126,
                            "name": "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60"
                            ],
                            "destination-address": [
                                "IP_LOT_164.156.36.6",
                                "IP_LOT_164.156.36.7"
                            ],
                            "application": [
                                "GRE",
                                "UDP_1723"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 17,
                            "junos:total": 126,
                            "name": "194002-Treasury_to_T3_Technologies_-_Treasury_Waiver_request_fo2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "IP_TRE_164.156.25.50",
                                "IP_TRE_164.156.25.57",
                                "IP_TRE_164.156.25.55",
                                "IP_TRE_164.156.25.54",
                                "IP_TRE_164.156.25.52",
                                "IP_TRE_164.156.25.51",
                                "Range_Tre_164.156.25.91_103"
                            ],
                            "application": [
                                "PPTP"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 18,
                            "junos:total": 126,
                            "name": "195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_SEC_206.41.253.26"
                            ],
                            "destination-address": [
                                "Net_SEC_164.156.45.0",
                                "Net_SEC_164.156.46.0",
                                "Net_SEC_164.156.47.0"
                            ],
                            "application": [
                                "AH",
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 19,
                            "junos:total": 126,
                            "name": "196001-VPN_Cleanup_rule__IPSec_",
                            "from-zone-name": "untrust-inet",
//                            "from-zone-name": "<script>alert(“hello, world”);</script>",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60",
                                "IP_REV_63.80.22.190",
                                "IP_REV_64.172.19.140",
                                "IP_SEC_206.41.253.26",
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "any"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 20,
                            "junos:total": 126,
                            "name": "201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante2",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_Verizon_4.59.140.232",
                                "IP_Verizon_63.66.64.232",
                                "Net_Verizon_63.66.64.240",
                                "Net_Verizon_4.59.140.240"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 21,
                            "junos:total": 126,
                            "name": "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_PSP_12.197.68.4",
                                "IP_PSP_64.173.86.142"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.160",
                                "IP_PSP_172.21.109.42"
                            ],
                            "application": [
                                "ESP",
                                "IKE",
                                "IKE1",
                                "IKE_NAT_TRAVERSAL",
                                "ftp",
                                "TCP_3845"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 22,
                            "junos:total": 126,
                            "name": "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_DPW_204.186.62.2",
                                "IP_PHEAA_216.37.216.250",
                                "IP_PSP_149.101.21.124",
                                "IP_Rissnet_65.5.59.34",
                                "IP_PSP_199.224.123.82",
                                "IP_PSP_209.243.54.181",
                                "IP_PSP_209.243.54.180"
                            ],
                            "destination-address": [{ //["1","2"]
                                "key": "key_IP_PSP_164.156.136.113",
                                "label": "IP_PSP_164.156.136.113"
                            },{
                                "key": "key_IP_PSP_164.156.135.3",
                                "label": "IP_PSP_164.156.135.3"
                            },{
                                "key": "key_IP_PSP_164.156.136.160",
                                "label": "IP_PSP_164.156.136.160"
                            }],
//                            "application": [
//                                "any"
//                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 23,
                            "junos:total": 126,
                            "inactive": "true",
                            "name": "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [{
                                "key": "IP_PSP_164.156.136.2",
                                "label": "IP_PSP_164.156.136.2"
                            }],
                            "application": [
                                "ssh_state_synch"
                            ],
                            "application-services": {
                                "idp": {
                                    "key": "as_idp_true",
                                    "label": "true"
                                },
                                "utm-policy": {
                                    "key": "as_idp_junos-vf-profile",
                                    "label": "junos-vf-profile"
                                }
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 24,
                            "junos:total": 126,
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "name": "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante3",
                            "inactive": "true",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [{
                                "key": "IP_INS_164.156.141.4",
                                "label": "IP_INS_164.156.141.4"
                            }],
                            "application": [
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 25,
                            "junos:total": 126,
                            "name": "190002-INS_to_Sircon_drop_em13",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [{
                                "key": "IP_INS_164.156.141.4",
                                "label": "IP_INS_164.156.141.4"
                            }],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 26,
                            "junos:total": 126,
                            "name": "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
//                                "IP_CONV_204.17.79.60"
                            ],
                            "destination-address": [
                                "IP_LOT_164.156.36.6",
                                "IP_LOT_164.156.36.7"
                            ],
                            "application": [
                                "GRE",
                                "UDP_1723"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 27,
                            "junos:total": 126,
                            "name": "194002-Treasury_to_T3_Technologies_-_Treasury_Waiver_request_fo3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "IP_TRE_164.156.25.50",
                                "IP_TRE_164.156.25.57",
                                "IP_TRE_164.156.25.55",
                                "IP_TRE_164.156.25.54",
                                "IP_TRE_164.156.25.52",
                                "IP_TRE_164.156.25.51",
                                "Range_Tre_164.156.25.91_103"
                            ],
                            "application": [
                                "PPTP"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 28,
                            "junos:total": 126,
                            "name": "1195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec3",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_SEC_206.41.253.26"
                            ],
                            "destination-address": [
                                "Net_SEC_164.156.45.0",
                                "Net_SEC_164.156.46.0",
                                "Net_SEC_164.156.47.0"
                            ],
                            "application": [
                                "AH",
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 29,
                            "junos:total": 126,
                            "name": "196001-VPN_Cleanup_rule__IPSec_13",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60",
                                "IP_REV_63.80.22.190",
                                "IP_REV_64.172.19.140",
                                "IP_SEC_206.41.253.26",
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "any"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 30,
                            "junos:total": 126,
                            "name": "201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante4",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_Verizon_4.59.140.232",
                                "IP_Verizon_63.66.64.232",
                                "Net_Verizon_63.66.64.240",
                                "Net_Verizon_4.59.140.240"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 31,
                            "junos:total": 126,
                            "name": "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent14",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_PSP_12.197.68.4",
                                "IP_PSP_64.173.86.142"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.160",
                                "IP_PSP_172.21.109.42"
                            ],
                            "application": [
                                "ESP",
                                "IKE",
                                "ftp",
                                "IKE_NAT_TRAVERSAL",
                                "TCP_3845"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 32,
                            "junos:total": 126,
                            "name": "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_DPW_204.186.62.2",
                                "IP_PHEAA_216.37.216.250",
                                "IP_PSP_149.101.21.124",
                                "IP_Rissnet_65.5.59.34",
                                "IP_PSP_199.224.123.82",
                                "IP_PSP_209.243.54.181",
                                "IP_PSP_209.243.54.180"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.113",
                                "IP_PSP_164.156.135.3",
                                "IP_PSP_164.156.136.160"
                            ],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 33,
                            "junos:total": 126,
                            "inactive": "true",
                            "name": "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.2"
                            ],
                            "application": [
                                "ssh_state_synch"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 34,
                            "junos:total": 126,
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "name": "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante24",
                            "inactive": "true",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [
                                "IP_INS_164.156.141.4"
                            ],
                            "application": [
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 35,
                            "junos:total": 126,
                            "name": "190002-INS_to_Sircon_drop_em4",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "Sircon_Group"
                            ],
                            "destination-address": [
                                "IP_INS_164.156.141.4"
                            ],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 36,
                            "junos:total": 126,
                            "name": "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60"
                            ],
                            "destination-address": [
                                "IP_LOT_164.156.36.6",
                                "IP_LOT_164.156.36.7"
                            ],
                            "application": [
                                "GRE",
                                "UDP_1723"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 37,
                            "junos:total": 126,
                            "name": "194002-Treasury_to_T3_Technologies_-_Treasury_Waiver_request_fo24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "IP_TRE_164.156.25.50",
                                "IP_TRE_164.156.25.57",
                                "IP_TRE_164.156.25.55",
                                "IP_TRE_164.156.25.54",
                                "IP_TRE_164.156.25.52",
                                "IP_TRE_164.156.25.51",
                                "Range_Tre_164.156.25.91_103"
                            ],
                            "application": [
                                "PPTP"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 38,
                            "junos:total": 126,
                            "name": "195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_SEC_206.41.253.26"
                            ],
                            "destination-address": [
                                "Net_SEC_164.156.45.0",
                                "Net_SEC_164.156.46.0",
                                "Net_SEC_164.156.47.0"
                            ],
                            "application": [
                                "AH",
                                "ESP",
                                "IKE"
                            ],
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 39,
                            "junos:total": 126,
                            "name": "196001-VPN_Cleanup_rule__IPSec_4",
                            "from-zone-name": "untrust-inet",
//                            "from-zone-name": "<script>alert(“hello, world”);</script>",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_CONV_204.17.79.60",
                                "IP_REV_63.80.22.190",
                                "IP_REV_64.172.19.140",
                                "IP_SEC_206.41.253.26",
                                "IP_TRE_96.254.162.106"
                            ],
                            "destination-address": [
                                "any"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        },
                        {
                            "junos:position": 40,
                            "junos:total": 126,
                            "name": "201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante24",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "any"
                            ],
                            "destination-address": [
                                "IP_Verizon_4.59.140.232",
                                "IP_Verizon_63.66.64.232",
                                "Net_Verizon_63.66.64.240",
                                "Net_Verizon_4.59.140.240"
                            ],
                            "application": [
                                "any"
                            ],
                            "date": "2007-10-06",
                            "action": "deny"
                        }
                    ]
            }
        },
        "context": "untrust-inet,trust-inet"
    };

    dataSample.noDataResponse =  {
        "policy-Level1":{
            "policy-Level2": {
                "policy-Level3":
                    [
                        {
                            "junos:total": 0
                        }
                    ]
            }
        }
    };

    dataSample.firewallPoliciesFiltered =  {
        "policy-Level1":{
            "policy-Level2": {
                "policy-Level3":
                    [
                        {
                            "junos:position": 1,
                            "junos:total": 2,
                            "name": "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_PSP_12.197.68.4",
                                "IP_PSP_64.173.86.142"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.160",
                                "IP_PSP_172.21.109.42"
                            ],
                            "application": [
                                "ESP",
                                "IKE",
                                "ftp",
                                "IKE_NAT_TRAVERSAL",
                                "TCP_3845"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "permit"
                        },
                        {
                            "junos:position": 2,
                            "junos:total": 2,
                            "name": "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante",
                            "from-zone-name": "untrust-inet",
                            "to-zone-name": "trust-inet",
                            "source-address": [
                                "IP_DPW_204.186.62.2",
                                "IP_PHEAA_216.37.216.250",
                                "IP_PSP_149.101.21.124",
                                "IP_Rissnet_65.5.59.34",
                                "IP_PSP_199.224.123.82",
                                "IP_PSP_209.243.54.181",
                                "IP_PSP_209.243.54.180"
                            ],
                            "destination-address": [
                                "IP_PSP_164.156.136.113",
                                "IP_PSP_164.156.135.3",
                                "IP_PSP_164.156.136.160"
                            ],
                            "application": [
                                "any"
                            ],
                            "application-services": {
                                "idp": "true",
                                "utm-policy": "junos-vf-profile",
                                "application-firewall": "rules-set",
                                "application-traffic-control": "rule-set1"
                            },
                            "date": "2007-10-06",
                            "action": "deny"
                        }
                    ]
            }
        },
        "context": "untrust-inet,trust-inet"
    };

    dataSample.oneRow =  {
        "junos:position": 1,
        "junos:total": 126,
        "name": "MV183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent3",
        "from-zone-name": "untrust-inet",
        "to-zone-name": "trust-inet",
        "source-address": [
            "IP_PSP_12.197.68.4",
            "IP_PSP_64.173.86.142"
        ],
        "destination-address": [
            "IP_PSP_164.156.136.160",
            "IP_PSP_172.21.109.42"
        ],
        "application": [
            "ESP",
            "IKE",
            "ftp",
            "IKE_NAT_TRAVERSAL",
            "TCP_3845"
        ],
        "application-services": {
            "idp": "true",
            "utm-policy": "junos-vf-profile",
            "application-firewall": "rules-set",
            "application-traffic-control": "rule-set1"
        },
        "date": "2007-10-06",
        "action": "permit"
    };

    return dataSample;

});