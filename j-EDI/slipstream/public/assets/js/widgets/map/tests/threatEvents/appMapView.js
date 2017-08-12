/**
 * A view that uses the Map Widget to render a Map in a Backbone View from a configuration file
 * The configuration file contains the key and value pairs which declare a configuration from 
 * which the Map View should be built.
 *
 * @module Map View
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'lib/template_renderer/template_renderer',
    'backbone',
    'widgets/map/mapWidget',
    'text!widgets/map/tests/threatEvents/popoverTemplate.html',
    'text!widgets/map/tests/threatEvents/hoverTemplate.html'
], function(template_renderer, Backbone, MapWidget, popoverTemplate, hoverTemplate){
    var MapView = Backbone.View.extend({
        events :{
            'click .blk_ip_btn' : function(){
                alert('blocking ip\'s ');
            }
        },
        render: function () {
            var tiers = 5,
                max = 5000,
                rangeConst = Math.floor(max/tiers),
                colorArray = ['#c3e7f1', '#95c1e7', '#6198d0', '#567cbe', '#454ea1'];
            var self = this;
            this.map = new MapWidget({
                'container': '.map',
                'geoJsonObject'     : self.model.get('geoJsonCountries'),
                'options' : {
                    // 'zoomControl'       : true,
                    // 'isDraggable'       : false,
                    'getPopoverContent' : function(countryObject){
                        var country = countryObject.properties.iso_a2.toLowerCase();
                        var contentString = template_renderer(popoverTemplate, {country_abbrev: country, country_name: countryObject.properties.name,
                                                            threat_event_ct: countryObject.properties.threatEventCount });
                            return contentString;
                        }
                        ,'getHoverContent' : function(countryObject){
                            var country = countryObject.properties.iso_a2.toLowerCase();
                            var contentString = template_renderer(hoverTemplate, {country_name: countryObject.properties.name,
                                                                threat_event_ct: countryObject.properties.threatEventCount });
                                return contentString;
                            }
                    ,'highlightCountryStyle' : {
                        weight          : 1,
                        color           : 'gray',        // outline color
                        dashArray       : '2',
                        fillOpacity     : 0.7,
                        fillColor       : '#78b94d'        // fill color on highlight
                    }
                    ,'defaultCountryStyle' : {
                        weight          : 1,
                        opacity         : 1,
                        color           : 'gray',         // outline color
                        dashArray       : '2',
                        fillOpacity     : 0.7
                    }
                    ,'dataPropertyKey'  : 'threatEventCount'
                    ,'getColor'         : function(d) {      // color is based on 'threatEventCount per country.'
                        return d > rangeConst*4 ? colorArray[4] :
                               d > rangeConst*3 ? colorArray[3] :
                               d > rangeConst*2 ? colorArray[2] :
                               d > rangeConst   ? colorArray[1] : colorArray[0];
                    }
                    ,'defaultCountriesColor' : '#808080'        // default country color if 'getColor' has NOT been defined.
                    ,'legends'                 : [
                                        {
                                           'position' : 'bottomleft',
                                           'content'  : function(getColorFunction){
                                                var grades = [0, rangeConst, rangeConst*2, rangeConst*3, rangeConst*4];
                                                var contentString = '<div class="legendTitle">Threat Events</div>';
                                                // loop through our density intervals and generate a label with a colored square for each interval
                                                for (var i = 0; i < grades.length; i++) {
                                                    contentString +=
                                                    '<span class="legendItem">' +
                                                        '<i style="background:' + getColorFunction(grades[i] + 1) + '"></i>'
                                                        +
                                                        grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + ' ' : '+')
                                                        +
                                                    '</span>';
                                                }
                                                return contentString;
                                            }
                                        }   
                     ]
                }
            });
            this.map.build();

            return this;
        },

        close: function () {
            this.map.destroy();
        }
    });

    return MapView;
});