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
    'text!widgets/map/tests/hoverTemplate.html'
], function(template_renderer, Backbone, MapWidget, popoverTemplate, hoverTemplate){
    var MapView = Backbone.View.extend({
        events :{
            'click .blk_ip_btn' : function(){
                alert('blocking ip\'s ');
            },

            'click #create'  : function() {
                this.close();
                this.render();
            },
            'click #destroy' : function() {this.close();},
            'click #animate' : function(){
                var cairo = {
                    lat: 30.06, 
                    lng: 31.25,
                    marker: 'destination',
                    cityName: 'Cairo'
                };

                var sanjose = {
                    lat: 37.3393900,
                    lng: -121.8949600,
                    marker: 'source',
                    cityName: 'San Jose'
                };

                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(sanjose, cairo, 'cyan');
            },
            'click #animate2' : function(){
                var detroit = {
                    lat: 42.423457,
                    lng: -83.496094,
                    marker: 'source',
                    cityName: 'Detroit'
               
                };
                // -23.53, -46.63
                var saopaolo = {
                    lat: -23.53, 
                    lng: -46.63,
                    marker: 'destination',
                    cityName: 'Sao Paolo'
                };
                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(detroit, saopaolo, 'cyan');
            },
            'click #animate3' : function(){
                var capetown = {
                    lat: -33.93,
                    lng: 18.46,
                    marker: 'source',
                    cityName: 'Capetown'               
                };
                // -23.53, -46.63
                var toronto = {
                    lat: 43.7001100, 
                    lng: -79.4163000,
                    marker: 'destination',
                    cityName: 'Toronto'
                };

                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(capetown, toronto, 'cyan');
            },
            'click #animate4' : function(){
                var siemreap = {
                    lat: 13.35,
                    lng: 103.85,
                    marker: 'source',
                    cityName: 'Siem Ream'               
                };
                // -23.53, -46.63
                var sanfernando = {
                    lat: 10.283, 
                    lng: -61.467,
                    marker: 'destination',
                    cityName: 'San Fernando'
                };

                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(siemreap, sanfernando, 'cyan');
            },
            'click #animate5' : function(){
                var unknown = {
                    lat: null,
                    lng: null,
                    marker: 'source',
                    cityName: 'Siem Ream'               
                };
                // -23.53, -46.63
                var sanfernando = {
                    lat: 10.283, 
                    lng: -61.467,
                    marker: 'destination',
                    cityName: 'San Fernando'
                };

                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(unknown, sanfernando, 'cyan');
            },
            'click #animate6' : function(){
                var toronto = {
                    lat: 43.7001100, 
                    lng: -79.4163000,
                    marker: 'source',
                    cityName: 'Toronto'
                };
                // -23.53, -46.63
                var unknown = {
                    lat: null, 
                    lng: null,
                    marker: 'destination',
                    cityName: 'San Fernando'
                };

                this.map.createMarkerType('source');
                this.map.createMarkerType('destination', '/assets/js/widgets/map/tests/demo/marker-icon-red.png');
                this.map.animateSprite(toronto, unknown, 'cyan');
            }
        },

        render: function () {
            var self = this;
            this.map = new MapWidget({
                'container': '.map',
                'geoJsonObject'     : self.model.get('geoJsonCountries'),
                'options' : {
                    // 'zoomControl'       : true,
                    // 'isDraggable'       : false,
                    // 'mapBackgroundColor': 'purple',
                    'getUnknownCountryDataProperty' : function () {
                       return 400000;
                    },
                    'getPopoverContent' : function(countryObject){
                        var country = countryObject.properties.iso_a2.toLowerCase();
                        var contentString = template_renderer(popoverTemplate, {country_abbrev: country, country_name: countryObject.properties.name, threat_event_ct: countryObject.properties.threatEventCount });                    
                        if(country === 'qq') {
                            contentString = template_renderer(popoverTemplate, {country_abbrev: 'qq', country_name: countryObject.properties.name, threat_event_ct: 400000});
                        }
                        return contentString;
                    }
                    ,'getHoverContent' : function(countryObject){
                        var country = countryObject.properties.iso_a2.toLowerCase();
                        var contentString = template_renderer(hoverTemplate, {country_name: countryObject.properties.name, threat_event_ct: countryObject.properties.threatEventCount });         
                        if(country === 'qq') {
                            contentString = template_renderer(hoverTemplate, {country_abbrev: 'qq', country_name: countryObject.properties.name, threat_event_ct: 400000});
                        }
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
                        return d > rangeConst*7  ? '#800026' :
                               d > rangeConst*6  ? '#BD0026' :
                               d > rangeConst*5  ? '#E31A1C' :
                               d > rangeConst*4  ? '#FC4E2A' :
                               d > rangeConst*3  ? '#FD8D3C' :
                               d > rangeConst*2  ? '#FEB24C' :
                               d > rangeConst    ? '#FED976' : '#FFEDA0';
                    }
                    ,'defaultCountriesColor' : '#808080'        // default country color if 'getColor' has NOT been defined.
                    ,'legends'                 : 
                     [
                        {
                           'position' : 'bottomleft',
                           'content'  : function(getColorFunction){
                                var grades = [0, 625, 625*2, 625*3, 625*4, 625*5, 625*6, 625*7];
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
            if (this.map) {
                this.map.destroy();
                this.map = null;
            }
        }
    });

    return MapView;
});