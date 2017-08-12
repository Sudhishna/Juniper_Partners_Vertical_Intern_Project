/**
 * A form configuration object with the parameters required to build a grid
 *
 * @module gridConfiguration
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var gridConfiguration = {};

    gridConfiguration.simpleSample = {
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "noResultMessage": "Data is not available",
        "columns": [{
            "name": "name",
            "label": "Name",
            "width": 180
        }, {
            "name": "note",
            "label": "Note",
            "width": 225
        }, {
            "name": "amount",
            "label": "Amount",
            "width": 190
        }, {
            "name": "rating",
            "label": "Rating",
            "width": 190
        }]
    };

    return gridConfiguration;

});
