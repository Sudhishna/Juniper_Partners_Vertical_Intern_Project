/**
 * A sample configuration object that shows the parameters required to build a List Builder widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var configurationSample = {};

    configurationSample.firstListBuilder =  {
        "availableElements": [
            {
                "label": "BFD",
                "value": "BFD",
                "moreInfo": "(50)",
                "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
                "valueDetails": "System",
                "img_src": "./img/icon4.png",
                "extraData": JSON.stringify({a:'a',b:'b'})
            },
            {
                "label": "BGP",
                "value": "BGP",
                "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
                "valueDetails": "System",
                "moreInfo": "(8)",
                "img_src": "./img/icon3.png",
                "extraData": "extra data"
            },
            {
                "label": "DVMRP",
                "value": "DVMRP",
                "valueDetails": "System",
                "img_src": "./img/icon3.png"
            },
            {
                "label": "IGMP",
                "value": "IGMP",
                "valueDetails": "System",
                "img_src": "./img/icon4.png"
            },
            {
                "label": "LDP",
                "valueDetails": "System",
                "value": "LDP"
            },
            {
                "label": "MSDP",
                "value": "MSDP"
            },
            {
                "label": "NHRP",
                "value": "NHRP"
            },
            {
                "label": "OSPF",
                "value": "OSPF"
            },
            {
                "label": "PGM",
                "value": "PGM"
            },
            {
                "label": "PIM",
                "value": "PIM"
            },
            {
                "label": "RIP",
                "value": "RIP"
            },
            {
                "label": "ROUTER-DISCOVERY",
                "value": "ROUTER-DISCOVERY"
            },
            {
                "label": "RSVP",
                "value": "RSVP"
            },
            {
                "label": "SAP",
                "value": "SAP"
            }
        ],
        "selectedElements": [
            {
                "label": "OSPF3",
                "value": "OSPF3"
            },
            {
                "label": "RIPNG",
                "value": "RIPNG"
            },
            {
                "label": "VRRP",
                "value": "VRRP"
            }
        ]
    },
    configurationSample.secondListBuilder =  {
        "availableElements": [
            {
                "label": "BFD",
                "value": "BFD",
                "moreInfo": "(50)",
                "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
                "valueDetails": "System",
                "img_src": "./img/icon4.png"
            },
            {
                "label": "BGP",
                "value": "BGP",
                "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
                "valueDetails": "System",
                "moreInfo": "(8)",
                "img_src": "./img/icon3.png"
            },
            {
                "label": "DVMRP",
                "value": "DVMRP",
                "valueDetails": "System",
                "img_src": "./img/icon3.png"
            },
            {
                "label": "IGMP",
                "value": "IGMP",
                "valueDetails": "System",
                "img_src": "./img/icon4.png"
            },
            {
                "label": "LDP",
                "valueDetails": "System",
                "value": "LDP"
            },
            {
                "label": "MSDP",
                "value": "MSDP"
            },
            {
                "label": "NHRP",
                "value": "NHRP"
            },
            {
                "label": "OSPF",
                "value": "OSPF"
            },
            {
                "label": "PGM",
                "value": "PGM"
            },
            {
                "label": "PIM",
                "value": "PIM"
            },
            {
                "label": "RIP",
                "value": "RIP"
            },
            {
                "label": "ROUTER-DISCOVERY",
                "value": "ROUTER-DISCOVERY"
            },
            {
                "label": "RSVP",
                "value": "RSVP"
            },
            {
                "label": "SAP",
                "value": "SAP"
            }
        ],
        "selectedElements": []
    };

    return configurationSample;

});
