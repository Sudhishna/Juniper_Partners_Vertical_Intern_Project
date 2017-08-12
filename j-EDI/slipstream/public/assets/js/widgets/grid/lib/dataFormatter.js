/**
 * A module reformats the grid json data
 *
 * @module DataFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Eva Wang <iwang@juniper.net>
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([],  /** @lends DataFormatter */
    function() {

    /**
     * DataFormatter constructor
     *
     * @constructor
     * @class DataFormatter - Reformats the grid json data.
     *
     * @returns {Object} Current DataFormatter's object: this
     */
    var DataFormatter = function(){

        /**
         * Builds the DataFormatter
         * @returns {Object} Current "this" of the class
         */

        this.formatJSONData = function(conf, data){
            var gridConfiguration = conf.elements,
                originalData = data,
                pageHasSingleRecord = function(){
                    var numberOfRecordsOnPage = ((data.page - 1) * conf.elements.numberOfRows) + 1; //Check if after pagination, there is single record left in the past page              
                    if  ((data['records'] && parseInt(data['records']) === numberOfRecordsOnPage) || (gridConfiguration.jsonRoot && (conf.elements.tree || (data['records'] && parseInt(data['records']) === numberOfRecordsOnPage)))) {
                        return true;
                    }
                    return false;
                };

            if (!data) return '';
            if (pageHasSingleRecord()){ //fixes Space issue for grids with only one record. In this case, the data is represented as an object instead of an array with one object.
                if (gridConfiguration.jsonRoot.indexOf('.')>0){
                    var nestedIndex = gridConfiguration.jsonRoot.split('.');
                    originalData = data[nestedIndex[0]];
                    if (conf.elements.tree && _.isEmpty(data[nestedIndex[0]])) { //for cases in tree grid where the children don't return data. the parent will expanded but no children should be showed.
                        data[nestedIndex[0]] = [];
                    }
                    var nestedData = data[nestedIndex[0]];
                    for (var j=1; j<nestedIndex.length; j++){
                        originalData = originalData[nestedIndex[j]];
                        if (j==nestedIndex.length-1){
                            nestedData[nestedIndex[j]] = $.isArray(originalData)? originalData : [originalData];
                        } else {
                            nestedData[nestedIndex[j]] = [];
                        }
                        nestedData = nestedData[nestedIndex[j]];
                    }
                    !(conf.elements.tree) && (originalData = data); 
                } else {
                    originalData = data[gridConfiguration.jsonRoot];
                }
            }
            return originalData;
        };

        this.formatTreeJSONData = function(conf, data, unformattedData){
            var originalData = data;
            for (var i = 0; originalData && i < originalData.length; i++) {
                var isExpanded = originalData[i][conf.elements.tree.level] <= conf.elements.tree.initialLevelExpanded;
                if (isExpanded){
                    originalData[i].expanded = true;
                }
                originalData[i].loaded = (originalData[i].leaf || isExpanded) ? true: false;

                for (var key in unformattedData) {
                    if (!$.isArray(unformattedData[key])){
                        originalData[i][key] = unformattedData[key];
                    }
                }
            }

            return originalData;
        };
    };

    return DataFormatter;
});