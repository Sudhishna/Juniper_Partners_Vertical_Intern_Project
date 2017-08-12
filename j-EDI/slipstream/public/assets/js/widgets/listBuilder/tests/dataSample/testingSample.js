/**
 * A testing sample object that add or remove items in a List Builder widget
 *
 * @module testingSample
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var testingSample = {};

    testingSample.sample1 =  [{
        "label": "OSPF3",
        "value": "OSPF3"
    },
    {
        "label": "RIPNG",
        "value": "RIPNG"
    }],
    testingSample.sample2 =  [{
        "label": "BFD2",
        "value": "BFD2",
        "moreInfo": "(50)",
        "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
        "valueDetails": "System",
        "img_src": "./img/icon4.png"
    },
    {
        "label": "IGMP2",
        "value": "IGMP2",
        "valueDetails": "System",
        "img_src": "./img/icon4.png"
    },
    {
        "label": "LDP2",
        "valueDetails": "System",
        "value": "LDP2"
    }],
    testingSample.sample3 = [{
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
    }],
    testingSample.sample4 = [{
        "label": "BFD3",
        "value": "BFD3",
        "moreInfo": "(5)",
        "tooltip": "Source port: <b>8080</b><br/>Destination port: <b>8080</b>",
        "valueDetails": "System",
        "img_src": "./img/icon4.png"
    },
    {
        "label": "IGMP3",
        "value": "IGMP3",
        "valueDetails": "System",
        "img_src": "./img/icon4.png"
    },
    {
        "label": "LDP3",
        "valueDetails": "System",
        "value": "LDP3"
    }],
    testingSample.sample5 = ['OSPF3', 'RIPNG'],
    testingSample.sample6 = ['PIM', 'RIP', 'ROUTER-DISCOVERY'];

    return testingSample;

});
