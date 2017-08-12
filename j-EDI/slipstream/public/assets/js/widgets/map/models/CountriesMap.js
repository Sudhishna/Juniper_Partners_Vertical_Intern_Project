/**
 * A model representing countries.
 *
 * @module CountriesMap
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'text!widgets/map/conf/countries.geojson.json'
], /** @lends CountriesMap */ function(Backbone, geoJsonData) {

    /**
     * Construct a Model to bind to map based view.
     * @constructor
     * @class CountriesMap
     */
    var CountriesMap = Backbone.Model.extend({
        defaults: {
            geoJsonData: geoJsonData
        },

        initialize: function(){
            this.set('geoJsonCountries', JSON.parse(this.defaults.geoJsonData));
            var countries = this.get('geoJsonCountries').features.length;
            // Generate random values for custom property per country
            for(var i=0; i < countries; i++){
                this.get('geoJsonCountries').features[i].properties['threatEventCount'] = 
                    (Math.floor(Math.random() * (5000 - 0)) + 0);
            }
        }
    });
    return CountriesMap;
});