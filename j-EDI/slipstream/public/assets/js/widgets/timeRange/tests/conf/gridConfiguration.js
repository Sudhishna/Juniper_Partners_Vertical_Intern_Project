/**
 * A sample configuration object that shows the parameters required to build a Grid widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([ ], function () {

    var configurationSample = {};

    configurationSample.smallGrid = {
        // "title": "Single Row Selection",
        "url": "/api/get-data",
        "jsonRoot": "policy",
        "singleselect": "true",
        "filter": {
            searchUrl: function (value, url){
                return url + "?searchKey=" + value + "&searchAll=true";
            }
        },
        "columns": [{
                "name": "name",
                "label": "Name"
            },{
                "name": "note",
                "label": "Note"
            },{
                "name": "amount",
                "label": "Amount"
            }]
    };

    return configurationSample;

});
