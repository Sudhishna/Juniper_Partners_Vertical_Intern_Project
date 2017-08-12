/**
 * The Map widget Unit tests.
 *
 * @module MapWidgetTests
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jquery',
    'widgets/map/mapWidget',
    'text!widgets/map/conf/countries.geojson.json',
    'widgets/map/conf/defaultUnknownCountryConfig'
], function ($, MapWidget, geojson, UnknownCountryConfig) {
    describe('MapWidget- Unit Tests:', function () {

        var mapWidgetObj = null;
        var conf = null;
        var options = null;            

        beforeEach(function () {
            conf = {
                container   : '#main_content',
                geoJsonObject : JSON.parse(geojson),
                options     : {
                }
            };
        });

        afterEach(function () {
            if(mapWidgetObj){
                mapWidgetObj.destroy();
            }
            delete conf.options;
            delete conf;
            delete options;  
            delete mapWidgetObj;
            conf.options = null;
            conf = null;
            options = null;
            mapWidgetObj = null;
        });

        describe('map Widget Unit test suite', function () {
            it('should exist', function () {
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                mapWidgetObj = new MapWidget(conf);
                (typeof mapWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return mapWidget object', function () {
                var widgetObj = null;
                mapWidgetObj = new MapWidget(conf);
                assert.isNull(widgetObj, 'widgetObj should be null before checking if build returns map widget object.');
                assert.equal(mapWidgetObj.build(), mapWidgetObj);
            });
            it('destroy() function should exist', function () {
                mapWidgetObj = new MapWidget(conf);
                (typeof mapWidgetObj.destroy == 'function').should.be.true;
            });
            it('isDraggable() function should return true by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.isDraggable(), true, 'isDraggable should be true by default');
            });
            it('isDraggable() function should return false by configuration', function(){
                options = {
                    isDraggable: false                
                };
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.isDraggable(), false, 'isDraggable should be false by configuration');
            });
            it('isDraggable() function should return true by configuration', function(){
                options = {
                    isDraggable: true                
                };                
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.isDraggable(), true, 'isDraggable should be true by configuration');
            });
            it('getMinZoom() function should return 2.0 by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getMinZoom(), 2.0, 'getMinZoom should return 2.0 by default');
            });
            it('getMinZoom() function should return 5.0 by config', function(){
                options = {
                    minZoom: 5.0                
                };                
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getMinZoom(), 5.0, 'getMinZoom should return 5.0 by config');
            });
            it('getMaxZoom() function should return 5 by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getMaxZoom(), 5, 'getMaxZoom should return 5 by default');
            });
            it('getMaxZoom() function should return 5.0 by config', function(){
                options = {
                    maxZoom: 10                
                };                
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getMaxZoom(), 10, 'getMaxZoom should return 10 by config');
            });
            it('getMapCenter() function should return [29.278420174798246, -5.309598025402226] by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var returnValue = mapWidgetObj.getMapCenter();
                assert.isArray(returnValue, 'getMapCenter should returnan array.');
                assert.equal(returnValue[0], 29.278420174798246, 'getMapCenter should return 29.278420174798246 as the default latitude');
                assert.equal(returnValue[1], -5.309598025402226, 'getMapCenter should return -5.309598025402226 as the default longitude');
            });
            it('getMapCenter() function should return [680, 880] by config', function(){
                options = {
                    mapCenter: [680, 880]
                };                
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var returnValue = mapWidgetObj.getMapCenter();
                assert.isArray(returnValue, 'getMapCenter should returnan array.');
                assert.equal(returnValue[0], 680, 'getMapCenter should return 680 as the default latitude');
                assert.equal(returnValue[1], 880, 'getMapCenter should return 880 as the default longitude');
            });
            it('getZoomLevel() function should return 1.95 by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getZoomLevel(), 1.95, 'getZoomLevel should return 1.95 by default');
            });
            it('getZoomLevel() function should return 2.8 by config', function(){
                options = {
                    zoomLevel: 2.8                
                };                
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getZoomLevel(), 2.8, 'getMaxZoom should return 2.8 by config');
            });
            it('getDefaultCountriesColor() function should return #808080 by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getDefaultCountriesColor(), '#808080', 'getDefaultCountriesColor should return #808080 by default');
            });
            it('getDefaultCountriesColor() function should return red by config', function(){
                options = {
                    defaultCountriesColor: 'red'                
                };
                conf.options = options;    
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getDefaultCountriesColor(), 'red', 'getDefaultCountriesColor should return red by config');
            });
            it('getHighlightStyle() function should return default config values', function(){
                conf.options = options;    
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultHighlightStyle = {
                    weight: 2,
                    color: 'white',
                    dashArray: '',
                    fillOpacity: 0.7
                };

                var highlightStyle = mapWidgetObj.getHighlightStyle();
                assert.deepEqual(highlightStyle, defaultHighlightStyle, 'getHighlightStyle() should return the default styles by default');

            });
            it('getHighlightStyle() function should return custom config values', function(){
                var customHighlightStyle = {
                    weight: 5,
                    color: 'green',
                    dashArray: '3',
                    fillOpacity: 1
                };
                var options = {'highlightCountryStyle' : customHighlightStyle};
                conf.options = options;    
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();

                var highlightStyle = mapWidgetObj.getHighlightStyle();
                assert.deepEqual(highlightStyle, customHighlightStyle, 'getHighlightStyle() should return the custom style by config');

            });


            it('getDefaultCountryStyle() function should return default config values', function(){
                conf.options = options;    
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultCountryStyle = {
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };

                var countryStyle = mapWidgetObj.getDefaultCountryStyle();

                // ignore fillColor value so a deep compare will not pass the assertion.  Need to compare each property value one by one.
                assert.equal(countryStyle.weight, defaultCountryStyle.weight, 'getDefaultCountryStyle() should return the default weight style by default');
                assert.equal(countryStyle.opacity, defaultCountryStyle.opacity, 'getDefaultCountryStyle() should return the default opacity style by default');
                assert.equal(countryStyle.color, defaultCountryStyle.color, 'getDefaultCountryStyle() should return the default color style by default');
                assert.equal(countryStyle.dashArray, defaultCountryStyle.dashArray, 'getDefaultCountryStyle() should return the default dashArray style by default');
                assert.equal(countryStyle.fillOpacity, defaultCountryStyle.fillOpacity, 'getDefaultCountryStyle() should return the default fillOpacity style by default');
            });
            it('getDefaultCountryStyle() function should return custom config values', function(){
                var customStyle = {
                    weight: 5,
                    opacity: 5,
                    color: 'qwerty',
                    dashArray: '876543',
                    fillOpacity: .888
                };
                var options = {'defaultCountryStyle' : customStyle};
                conf.options = options;    
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultCountryStyle = {
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };

                var countryStyle = mapWidgetObj.getDefaultCountryStyle();

                // ignore fillColor value so a deep compare will not pass the assertion.  Need to compare each property value one by one.
                assert.equal(countryStyle.weight, customStyle.weight, 'getDefaultCountryStyle() should return the custom weight style by config');
                assert.equal(countryStyle.opacity, customStyle.opacity, 'getDefaultCountryStyle() should return the custom opacity style by config');
                assert.equal(countryStyle.color, customStyle.color, 'getDefaultCountryStyle() should return the custom color style by config');
                assert.equal(countryStyle.dashArray, customStyle.dashArray, 'getDefaultCountryStyle() should return the custom dashArray style by config');
                assert.equal(countryStyle.fillOpacity, customStyle.fillOpacity, 'getDefaultCountryStyle() should return the custom fillOpacity style by config');
            });
            it('getPopoverContent() function should return null by default', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.isNull(mapWidgetObj.getPopoverContent(), 'getPopoverContent() should return null by default');
            });
            it('getPopoverContent() function should return custom content by config', function(){
                var customContentString = '<div>Some custom content.</div>';
                var options = {
                    'getPopoverContent' : function(){
                        return customContentString;
                    }
                };
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getPopoverContent(), customContentString, 'getPopoverContent() should return custom content by config');
            });
            it('getDataPropertyKey() function should return threatEventCount by default', function(){
                var defaultDataPropertyKey = 'threatEventCount';
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getDataPropertyKey(),defaultDataPropertyKey, 'getDataPropertyKey() should return threatEventCount by default');                
            });
            it('getDataPropertyKey() function should return custom by config', function(){
                var customtDataPropertyKey = 'customDataProperty';
                var options = {'dataPropertyKey' : customtDataPropertyKey};
                conf.options = options;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.equal(mapWidgetObj.getDataPropertyKey(),customtDataPropertyKey, 'getDataPropertyKey() should return custom by config');                
            });      
            it('createMarkerType() function should create a marker in the mapWidget', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var key = 'sourceMarker';
                var marker = mapWidgetObj.getMarkerType(key);
                assert.isUndefined(marker, 'mapWidget should return undefined for a marker that has not been created');
                assert.ok(mapWidgetObj.createMarkerType(key, 'images/marker-icon-red.png'));
                marker = mapWidgetObj.getMarkerType(key);
                assert.isNotNull(marker, 'mapWidget should return the created marker given the key in which the marker was created.');
            });
            it('createMarkerType() function should create a default marker in the mapWidget when no url is given.', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var key = 'sourceMarker';
                var marker = mapWidgetObj.getMarkerType(key);
                assert.isUndefined(marker, 'mapWidget should return undefined for a marker that has not been created');
                assert.ok(mapWidgetObj.createMarkerType(key));
                marker = mapWidgetObj.getMarkerType(key);
                assert.isNotNull(marker, 'mapWidget should return the created marker given the key in which the marker was created.');
                assert.isDefined(marker, 'mapWidget should return defined value.');

            });
            it('createMarkerType() function should fail to create a  marker in the mapWidget when no key is given.', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.notOk(mapWidgetObj.createMarkerType());
            });
            it('getMarkerType() function should return null when no key is given', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                assert.isNull(mapWidgetObj.getMarkerType());
            });
            it('addMarker() function should place a marker on the map - of the given type at the given lat/long.', function(){
                    mapWidgetObj = new MapWidget(conf);
                    mapWidgetObj.build();
                    var key = 'sourceMarker';
                    var latlong = [37.3393900, -121.8949600];
                    mapWidgetObj.createMarkerType(key);
                    var marker = mapWidgetObj.addMarker(key, latlong);
                    assert.equal(marker._latlng['lat'], latlong[0], 'marker should have matching latitude to the passed in param');
                    assert.equal(marker._latlng['lng'], latlong[1], 'marker should have matching longitude to the passed in param');
            });
            it('addMarker() function should should fail if no key is given', function(){
                    mapWidgetObj = new MapWidget(conf);
                    mapWidgetObj.build();
                    var key = 'key';
                    var latlong = [37.3393900, -121.8949600];
                    mapWidgetObj.createMarkerType(key);
                    var marker = mapWidgetObj.addMarker(null, latlong);
                    assert.isNull(marker, 'addMarker should return null when no key is given');
            });
            it('addMarker() function should should fail if no lat/lng is given', function(){
                    mapWidgetObj = new MapWidget(conf);
                    mapWidgetObj.build();
                    var key = 'sourceMarker';
                    var latlong = null;
                    mapWidgetObj.createMarkerType(key);
                    var marker = mapWidgetObj.addMarker(key, latlong);
                    assert.isNull(marker, 'addMarker should return null when no lat/lng is given');
            });
            it('getColor() function should return default value', function(){
                var defaultColor = '#808080';
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var colorValue = mapWidgetObj.getColor(999);    // pass in an abitrary arg to show that the param has no effect on the return value.
                assert.equal(colorValue, defaultColor, 'getColor() function should return default color value');
                var colorValue = mapWidgetObj.getColor(1);    // pass in an abitrary arg to show that the param has no effect on the return value.
                assert.equal(colorValue, defaultColor, 'getColor() function should return default color value');
            });
            it('getColor() function should return custom values', function(){
                var options = {
                    'getColor' : function(d){
                        if(d==0) return 'red';
                        else if(d==999) return 'green';
                        return 'blue';
                    }
                };
                conf.options = options;

                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var colorValue = mapWidgetObj.getColor(0);
                assert.equal(colorValue, 'red', 'getColor() function should return custom color value red when arg == 0');
                colorValue = mapWidgetObj.getColor(999);
                assert.equal(colorValue, 'green', 'getColor() function should return custom color value green when arg == 999');
                colorValue = mapWidgetObj.getColor(5);
                assert.equal(colorValue, 'blue', 'getColor() function should return custom color value red when arg != 0 or arg !=999');

            });
            it('getGeoJsonObject() function should return the geoJsonObject', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var gjo = mapWidgetObj.getGeoJsonObject();
                assert.isNotNull(gjo, 'getGeoJsonObject should return non null value'); 
                assert.isDefined(gjo, 'getGeoJsonObject should return defined value');
            });
            it('addLegend() function should not add a legend to the map when manually called without position param', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend(function(){
                    return 'xyz';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
            });
            it('addLegend() function should not add a legend to the map when manually called without content param', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend('bottomright');
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
            });
            it('addLegend() function should not add a legend to the map when manually called without params', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend();
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
            });
            it('addLegend() function should add a legend to the map when manually called', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend('bottomright', function(){
                    return 'xyz';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');
            });
            it('addLegend() function should overwrite a legend to the map when manually called', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend('bottomright', function(){
                    return 'xyz';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');
                mapWidgetObj.addLegend('bottomright', function(){
                    return 'abc';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');
            });
            it('addLegend() function should add up to 4 legends to the map when manually called with different positions', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
                mapWidgetObj.addLegend('bottomright', function(){
                    return 'xyz';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');

                mapWidgetObj.addLegend('bottomleft', function(){
                    return 'abc';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 2, '2 legend nodes should be returned');

                mapWidgetObj.addLegend('topleft', function(){
                    return '123';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 3, '3 legend nodes should be returned');

                mapWidgetObj.addLegend('topright', function(){
                    return '456';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('topright', function(){
                    return '789';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('topright', function(){
                    return '000';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('topleft', function(){
                    return '987';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('bottomleft', function(){
                    return '654';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('bottomright', function(){
                    return '321';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');

                mapWidgetObj.addLegend('topright', function(){
                    return 'a1b2c3';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 4, '4 legend nodes should be returned');
            });
            it('removeLegend() function should remove a legend from the map when manually called', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();

                var legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');

                mapWidgetObj.addLegend('bottomright', function(){
                    return 'xyz';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');

                mapWidgetObj.addLegend('topright', function(){
                    return 'abc';
                });
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 2, '2 legend nodes should be returned');

                mapWidgetObj.removeLegend('bottomright');
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');

                mapWidgetObj.removeLegend('bottomright');
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 1, '1 legend node should be returned');

                mapWidgetObj.removeLegend('topright');
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');

                mapWidgetObj.removeLegend('topright');
                legendNodes = $('.info.legend');
                assert.equal(legendNodes.length, 0, '0 legend node should be returned');
            });
            it('getUnknownCountryIcon() function should return default image path when no conf for unknown country is passed in.', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultImagePath = mapWidgetObj.getUnknownCountryIcon();
                var defaultUnknownCountryConfig = UnknownCountryConfig.defaultImage;
                assert.equal(defaultImagePath, defaultUnknownCountryConfig);
            });
            it('getUnknownCountryIcon() function should return custom image path when no conf for unknown country is passed in.', function(){
                var customPath = 'some/custom/path.svg';
                conf.options.unknownCountry = {
                    defaultImage: customPath
                };
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var imagePath = mapWidgetObj.getUnknownCountryIcon();
                assert.equal(imagePath, customPath);
            });
            it('getUnknownCountryIcon() function should return null when unknownCountry is set to false in config.', function(){
                conf.options.unknownCountry = false;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var imagePath = mapWidgetObj.getUnknownCountryIcon();
                assert.equal(imagePath, null);
            });
            it('getUnknownCountryCoordinates() function should return null when unknownCountry is set to false in config.', function(){
                conf.options.unknownCountry = false;
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var coordinates = mapWidgetObj.getUnknownCountryCoordinates();
                assert.equal(coordinates, null);
            });
            it('getUnknownCountryCoordinates() function should return default values when no unknownCountry object is passed in.', function(){
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultCountryCoordinates = mapWidgetObj.getUnknownCountryCoordinates();
                var defaultUnknownCountryConfigCoordinates = UnknownCountryConfig.coordinates;
                assert.equal(defaultCountryCoordinates['lat'], defaultUnknownCountryConfigCoordinates['lat'], 'Latitude should be equal');
                assert.equal(defaultCountryCoordinates['lng'], defaultUnknownCountryConfigCoordinates['lng'], 'Longitude should be equal');
            });
            it('getUnknownCountryCoordinates() function should return custom values when unknownCountry object is passed in with custom coordinates.', function(){
                conf.options.unknownCountry = {
                    coordinates: {
                        'lat' : -10,
                        'lng' : -10
                    }
                };
                mapWidgetObj = new MapWidget(conf);
                mapWidgetObj.build();
                var defaultCountryCoordinates = mapWidgetObj.getUnknownCountryCoordinates();
                assert.equal(defaultCountryCoordinates['lat'], conf.options.unknownCountry.coordinates['lat'], 'Latitude should be equal');
                assert.equal(defaultCountryCoordinates['lng'], conf.options.unknownCountry.coordinates['lng'], 'Longitude should be equal');
            }); 
           
        });
    });
});
