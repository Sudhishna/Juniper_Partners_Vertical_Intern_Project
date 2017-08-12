/**
 * A Simple Grid Config
 *
 * @module GridInFormConf
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {
    var Configuration = function(context) {
        this.getValues = function(){
            return {
                "url": "/assets/js/widgets/overlay/tests/dataSample/simpleGrid.json",
                'height': '500px',
                "jsonRoot": "policy",
                "singleselect": "true",
                "sorting": false,
                "onSelectAll": false,
                "showWidthAsPercentage": false,
                "noResultMessage":"Data is not available",
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
            }
        }
    };
    return Configuration;
});