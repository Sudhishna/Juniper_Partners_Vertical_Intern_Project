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
    'text!widgets/map/tests/popoverTemplate.html',
    'text!widgets/map/tests/hoverTemplate.html',
    'text!widgets/map/tests/legendTemplate.html',
    'text!widgets/map/tests/legendTitleTemplate.html'
], function(template_renderer, Backbone, MapWidget, popoverTemplate, hoverTemplate, legendTemplate, legendTitleTemplate){
    var MapView = Backbone.View.extend({
        events :{
            'click .blk_ip_btn' : function(){
                alert('blocking ip\'s ');
            }
        },
        render: function () {
            var self = this;
            this.map = new MapWidget({
                'container': '.map',
                'geoJsonObject'     : self.model.get('geoJsonCountries'),
                'options' : {
                    'zoomControl'       : false,
                    // 'isDraggable'       : false,
                    'getPopoverContent' : function(countryObject){
                        var country = countryObject.properties.iso_a2.toLowerCase();
                        var contentString = template_renderer(popoverTemplate, {country_abbrev: country, country_name: countryObject.properties.name,
                                                            threat_event_ct: countryObject.properties.threatEventCount });
                            return contentString;
                        }
                    ,'highlightCountryStyle' : {
                        weight          : 2,
                        color           : 'red',        // outline color
                        dashArray       : '',
                        fillOpacity     : 0.7,
                        fillColor       : 'cyan'        // fill color on highlight
                    }
                    ,'defaultCountryStyle' : {
                        weight          : 1,
                        opacity         : 1,
                        color           : 'red',         // outline color
                        dashArray       : '3',
                        fillOpacity     : 0.7
                    }
                    ,'dataPropertyKey'  : 'threatEventCount'
                    ,'getColor'         : function(d){      // color is based on 'threatEventCount per country.'
                        var tiers = 7;
                        var max = 5000;
                        var rangeConst = Math.floor(max/tiers);
                        return d > rangeConst*7 ? '#800026' :
                               d > rangeConst*6  ? '#BD0026' :
                               d > rangeConst*5  ? '#E31A1C' :
                               d > rangeConst*4  ? '#FC4E2A' :
                               d > rangeConst*3   ? '#FD8D3C' :
                               d > rangeConst*2   ? '#FEB24C' :
                               d > rangeConst   ? '#FED976' : '#FFEDA0';
                    }
                    ,'defaultCountriesColor' : '#808080'        // default country color if 'getColor' has NOT been defined.
                    ,'legends'                 : [
                                        {
                                           'position' : 'bottomleft',
                                           'content'  : function(getColorFunction){
                                                var grades = [0, 625, 625*2, 625*3, 625*4, 625*5, 625*6, 625*7];
                                                var contentString = template_renderer(legendTitleTemplate, {title: 'Threat Count'});

                                                // loop through our density intervals and generate a label with a colored square for each interval
                                                for (var i = 0; i < grades.length; i++) {
                                                    var color = getColorFunction(grades[i] + 1);
                                                    var startRange = grades[i];
                                                    var endRange = '-' + (grades[i + 1]-1);
                                                    if(grades[i + 1] == undefined){
                                                        endRange = '+';
                                                    }
                                                    var range = startRange + endRange;

                                                    var row =template_renderer(legendTemplate, {
                                                        color: color,
                                                        range: range
                                                    });
                                                    contentString += row;
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