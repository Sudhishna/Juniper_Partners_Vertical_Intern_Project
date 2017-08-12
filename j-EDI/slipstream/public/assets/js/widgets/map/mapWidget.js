/**
 * The Map widget is used to render a map.
 *
 * @module MapWidget
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'widgets/map/conf/defaultMapConfig',
    'widgets/map/conf/defaultUnknownCountryConfig',
    'leaflet',
    'text!widgets/map/templates/mapWidget.html',
    'widgets/map/animationCanvasLayer',
    'widgets/map/sprite',
    'marionette'
], /** @lends MapWidget */
    function (render_template, i18n, DefaultMapConfig, UnknownCountryConfig, L, MapTemplate, AnimationCanvasLayer, Sprite) {
    /**
     * MapWidget constructor
     *
     * @constructor
     * @class MapWidget - Builds a Map widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: defines the container where the widget will be rendered | required
     * geoJsonObject: provides the map with geojson data so that it can be used to create a geojson layer | required
     *
     * @returns {Object} Current MapWidget object
     */
    var MapWidget = function (conf) {

        this.conf                 = {},
        this.conf                 = _.extend(this.conf, DefaultMapConfig),
        this.conf                 = _.extend(this.conf, conf.options),
        this.conf.geoJsonObject   = conf.geoJsonObject;

        this.conf['$container']   = $(conf.container);
        var self                  = this,
            popupClick            = L.popup({closeOnClick: false, offset: L.point(0, -10)}),
            popupHover            = L.popup({className: 'hoverPopup', offset: L.point(0, -20), closeOnClick: true, closeButton: false}),
            map                   = null,
            markerTypes           = {},
            markers               = [],
            defaultMarkerKey      = 'defaultMarkerKey',
            legendsHash           = {},
            hoverPopupCloseTimer  = null,
            hoverPopupOpenTimer   = null,
            HOVER_CLOSE_DELAY     = 2000,
            HOVER_OPEN_DELAY      = 350,
            hoverPopupOpenDelay   = HOVER_OPEN_DELAY,
            hoverPopupCloseDelay  = HOVER_CLOSE_DELAY,
            arcMap                = {},
            animationLayer        = null,
            unknownMarker         = null,
            vent                  = new Backbone.Wreqr.EventAggregator(),
            errorMessages         = {
                'hasRequiredParameters': conf && conf.container && conf.geoJsonObject,
                'noConf'     :  'The configuration object required to build the map widget is missing',
                'noContainer': 'The container object required to build the map widget is missing',
                'noGeoJSON'  : 'A geoJson object required to build the map widget is missing'
            };


        /**
         * Renders the map widget
         * @instance
         * @returns {Object} this object
         */
        this.build = function () {
            if(errorMessages.hasRequiredParameters){

                // Setting imagePath on leaflet icon object.
                //      see link for explanation as to why:
                //  https://github.com/Leaflet/Leaflet/issues/766
                L.Icon.Default.imagePath = '/assets/js/vendor/leaflet/images/';

                this.conf.$container.append($(render_template(MapTemplate)));
                var mapContent = this.conf.$container.find('.mapContent');

                if(this.conf.mapBackgroundColor){
                    mapContent.css('background-color', this.conf.mapBackgroundColor);
                }

                map = new L.map(mapContent[0], {
                        center              : this.conf.mapCenter,
                        zoom                : this.conf.zoomLevel,
                        attributionControl  : false,
                        minZoom             : this.conf.minZoom,
                        maxZoom             : this.conf.maxZoom,
                        dragging            : this.conf.isDraggable,
                        zoomControl         : this.conf.zoomControl,
                        doubleClickZoom     : this.conf.doubleClickZoom,
                        scrollWheelZoom     : this.conf.scrollWheelZoom,
                        touchZoom           : this.conf.touchZoom
                });

                self.geoJSONLayer = null;

                self.geoJSONLayer = L.geoJson(self.conf.geoJsonObject, {
                        style: getStyle,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                if(self.conf.legends){
                    if(self.conf.legends.length > 0){
                        var nLegends = self.conf.legends.length;
                        var legendsArray = self.conf.legends;
                        for(i in legendsArray){
                            self.addLegend(legendsArray[i].position, legendsArray[i].content);
                        }
                    }
                }
                if(self.conf.unknownCountry != false){
                    var defaultUnknownCountryConfig = _.extend({}, UnknownCountryConfig);
                    self.conf.unknownCountry = _.extend(defaultUnknownCountryConfig, self.conf.unknownCountry);

                    var unknownCountryIcon = L.icon({
                        iconUrl: self.conf.unknownCountry.defaultImage,
                        className: 'unknownCountryFeature',
                        iconSize:     [50, 50], // size of the icon
                        // iconAnchor:   [self.conf.unknownCountry.coordinates.lat, self.conf.unknownCountry.coordinates.lng]
                    });
                    unknownMarker = L.marker([self.conf.unknownCountry.coordinates.lat, self.conf.unknownCountry.coordinates.lng], {icon: unknownCountryIcon });
                    unknownMarker.addTo(map);

                    if (self.conf.getHoverContent) {
                        unknownMarker.on('mouseover', function (e){
                            var obj = e.target.toGeoJSON();
                            obj.properties.iso_a2 = self.conf.unknownCountry.iso_a2;
                            obj.properties.name = self.conf.unknownCountry.name;
                            obj.properties[self.conf.dataPropertyKey] = 0;
                            var content = self.conf.getHoverContent(obj);
                            popupHover.setLatLng(e.latlng).setContent(content);
                            popupHover.openOn(map);
                        });
                    }

                    if (self.conf.getPopoverContent) {
                        unknownMarker.on('click', function (e){
                            var obj = e.target.toGeoJSON();
                            obj.properties.iso_a2 = self.conf.unknownCountry.iso_a2;
                            obj.properties.name = self.conf.unknownCountry.name;
                            obj.properties[self.conf.dataPropertyKey] = 0;
                            var content = self.conf.getPopoverContent(obj);
                            popupClick.setLatLng(e.latlng).setContent(content);
                            popupClick.openOn(map);
                        });
                    }
                    var unknownCountryFeature = self.conf.$container.find('.unknownCountryFeature');
                    var setUnknownCountryColor = function() {
                        if ( self.conf.getUnknownCountryDataProperty && typeof(self.conf.getUnknownCountryDataProperty) ==='function') {
                          var dataPropertyValue = self.conf.getUnknownCountryDataProperty();
                          unknownCountryFeature.css('background-color', self.getColor(dataPropertyValue));
                        } else {
  -                       unknownCountryFeature.css('background-color', self.getColor(0));
                        }
                    };
                    unknownMarker.on('mouseover', function (e) {
                      var hoverStyle = self.conf.highlightCountryStyle;
                      unknownCountryFeature.css('background-color', hoverStyle.fillColor);
                    });
                    unknownMarker.on('mouseout', function (e) {
                      setUnknownCountryColor();
                    });

                    if (self.getColor){
                      setUnknownCountryColor();
                    }
                }

                vent.bind('animation:removeMarker', removeMarker);
                var mapBounds = map.getBounds();
                mapBounds._southWest.lat -= 155;
                mapBounds._southWest.lng -= 155;
                mapBounds._northEast.lat += 155;
                mapBounds._northEast.lng += 155;                
                map.setMaxBounds(L.latLngBounds(mapBounds._southWest, mapBounds._northEast));
                return this;
            }else{
                throwErrorMessage();
            }
        };

        removeMarker = function(marker){
          map.removeLayer(marker);
        };

        transformLLtoXY = function(ll) {
            return { y: ll['lat'], x: ll['lng'] };
        };

        /**
         * Animate a line on the map.
         *
         * @param {Object} source - required.  This parameter will represent the starting point of the line to animate.
         *      This object must contain 3 pieces of info: lat (latitude), lng (longitude), marker (key value of marker to be used).
         * @param {Object} destination - required.  This parameter will represent the end point of the line to animate.
         *      This object must contain 3 pieces of info: lat (latitude), lng (longitude), marker (key value of marker to be used).
         *
         * @param {number} fadeTime - The number of milliseconds that the line shall appear on the map.
         *
         */
        this.animateLine = function(source, destination, fadeTime, lineColor){
            if(arcMap[source.lat.toString() + source.lng.toString() + destination.lat.toString() +destination.lng.toString()]){
                // should not animate the line if there already exist an exact match in the arcMap.
                return;
            }

            var straight_line = [];
            straight_line[0] = transformLLtoXY(source);
            straight_line[1] = transformLLtoXY(destination);

            var newLine = L.polyline(straight_line.map(function(c) {
                return [c.y, c.x];
                }), {
                    color: lineColor,
                    weight: 3,
                    opacity: 1
                });

            newLine.addTo(map);
            var totalLength = newLine._path.getTotalLength();
            newLine._path.classList.add('path-start');

            // This pair of CSS properties hides the line initially
            // See http://css-tricks.com/svg-line-animation-works/
            // for details on this trick.
            newLine._path.style.strokeDashoffset = totalLength;
            newLine._path.style.strokeDasharray = totalLength;

            var _arc = newLine;
            arcMap[source.lat.toString() + source.lng.toString() + destination.lat.toString() +destination.lng.toString()] = _arc;

            var timeToFade = fadeTime || 1500;
            // Offset the timeout here: setTimeout makes a function
                    // run after a certain number of milliseconds - in this
                    // case we want each arc path to be staggered a bit.
            setTimeout((function(path) {
                var obj = {};
                return function() {
                    var src = self.addMarker(source['marker'], [source['lat'], source['lng']]);
                    var dst = self.addMarker(destination['marker'],[destination['lat'], destination['lng']]);

                    // setting the strokeDashoffset to 0 triggers the animation.
                    path.style.strokeDashoffset = 0;

                    obj['src'] = src;
                    obj['dest'] = dst;
                    obj['arc'] = newLine;
                    setTimeout((function(){
                        var key = source['lat'].toString() +source['lng'].toString()+ destination['lat'].toString() + destination['lng'].toString();
                        $(arcMap[key]._container).fadeOut(750, function(){
                            map.removeLayer(obj.src);
                            map.removeLayer(obj.dest);
                            map.removeLayer(arcMap[key]);
                            delete arcMap[key];
                        })
                    }), fadeTime);
                };
            })(newLine._path), 350);
        };

        this.animateSprite = function(source, destination, lineColor){
              if(!source.lat){
                source.lat = self.conf.unknownCountry.coordinates.lat;
                source.lng = self.conf.unknownCountry.coordinates.lng;
              }

              if(!destination.lat){
                destination.lat = self.conf.unknownCountry.coordinates.lat;
                destination.lng = self.conf.unknownCountry.coordinates.lng;
              }

              var pt = map.latLngToContainerPoint(new L.LatLng(source.lat, source.lng));
              source.x = pt.x;
              source.y = pt.y;


              var pt2 = map.latLngToContainerPoint(new L.LatLng(destination.lat, destination.lng));
              destination.x = pt2.x;
              destination.y = pt2.y;

              this.srcMarker = this.addMarker(source.marker, [source['lat'], source['lng']]);
              this.dstMarker = this.addMarker(destination.marker, [destination['lat'], destination['lng']]);
              source._marker = this.srcMarker;
              destination._marker = this.dstMarker;

              var sprite = new Sprite(lineColor, source, destination, vent);

              if(!animationLayer){
                  animationLayer = new AnimationCanvasLayer();
                  animationLayer.addTo(map);
                  map.getPanes()['tilePane'].style.zIndex = 9999999;                 
              }
              animationLayer.addSprite(sprite);
          };

        /**
         * Add a legend to the map.
         *
         * @param {string} position - required.  This parameter must be 'topleft' | 'bottomleft' | 'topright' | 'bottomright'.
         * @param {string | Object} content - required.  This parameter is the innerHTML content of the legend.
         *
         */
        this.addLegend = function(position, content){
            if(position && content){
                if(legendsHash[position]){
                    // replace legend.
                    legendsHash[position].removeFrom(map);
                }

                var legend = L.control({position: position.trim().toLowerCase()});
                    legend.onAdd = function (map) {
                        var div = L.DomUtil.create('div', 'info legend');
                        div.innerHTML = content(self.getColor);
                        return div;
                };
                legend.addTo(map);
                legendsHash[position] = legend;
            }
        };

        /**
         * Remove a legend from the map.
         * @param {string} position - required.  This parameter must be 'topleft' | 'bottomleft' | 'topright' | 'bottomright'.
         */
        this.removeLegend = function(position){
            if(position){
                if(legendsHash[position]){
                    legendsHash[position].removeFrom(map);
                    delete legendsHash[position];
                }
            }
        };

        /**
         * Helper method that causes the map widget to redraw itself.  This method should be used
         *  by the client when the map container's size has changed.
         *
         */
        this.invalidateSize = function(){
            map.invalidateSize();
        };

        getStyle = function(feature){
            self.conf.defaultCountryStyle.fillColor = self.getColor(feature.properties[self.conf.dataPropertyKey]);
            return self.conf.defaultCountryStyle;
        };

        /**
         *  Resets the geojson feature (from which the event originated) to it's default style.
         *
         */
        resetHighlight = function(e) {
            self.geoJSONLayer.resetStyle(e.target);
            closeHoverPopup();
        };
        closeHoverPopup = function(){
            hoverPopupCloseTimer = setTimeout(function(){
                popupHover._close();
                hoverPopupCloseTimer = null;
                hoverPopupCloseDelay = HOVER_CLOSE_DELAY;
            },hoverPopupCloseDelay);
        };

        clearHoverPopupOpenTimer = function(){
            if(hoverPopupOpenTimer){
                hoverPopupOpenDelay = HOVER_OPEN_DELAY;
                clearTimeout(hoverPopupOpenTimer);
            }
        };
        clearHoverPopupCloseTimer = function(){
            if(hoverPopupCloseTimer){
                hoverPopupCloseDelay = HOVER_CLOSE_DELAY;
                clearTimeout(hoverPopupCloseTimer);
            }
        };

        /**
         *  Highlights the geojson feature (from which the event originated) to it's specified style.
         *
         */
        highlightFeature = function(e) {
            var layer = e.target;
            var style = self.conf.highlightCountryStyle;
            if (layer.setStyle) {
                layer.setStyle(style);
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            }
        };

        /**
         *  Provides a color for a geojson feature (from which the event originated).
         * @param {number} datum - value of the attribute on the geojson feature that is indexed by the dataPropertyKey
         *
         */
        this.getColor = function (datum) {
            if(self.conf.getColor){
                return self.conf.getColor(datum);
            }
            return self.conf.defaultCountriesColor;
        };

        onEachFeature = function(feature, layer){
            layer.on('mouseover', highlightFeature)
                 .on('mouseover', showHoverContent)
                 .on('mouseout', resetHighlight)
                 .on('click', showPopover);
        };

        /**
         * Renders a popover at the source of the event.  If the widget was initialized with
         * no 'getPopoverContent' function/property, then this method will have no external/internal behavior.
         *
         */
        showPopover = function(e){
            if(self.conf.getPopoverContent){
                var content = self.conf.getPopoverContent(e.target.toGeoJSON());
                popupClick.setLatLng(e.latlng).setContent(content);
                popupClick.openOn(map);
            }
        };

        /**
         * Renders a popover on hover at the source of the event. If the widget was initialized with
         * no 'getHoverContent' function/property, then this method will have no external/internal behavior.
         *
         */
        showHoverContent = function(e){
            if(self.conf.getHoverContent){
                clearHoverPopupCloseTimer();
                clearHoverPopupOpenTimer();
                hoverPopupOpenTimer = setTimeout(function(){
                    var content = self.conf.getHoverContent(e.target.toGeoJSON());
                    popupHover.setLatLng(e.latlng).setContent(content);
                    popupHover.openOn(map);
                }, hoverPopupOpenDelay);

            }
        };

        /**
         * Get the isDraggable that was passed into the MapWidget at constuction time.
         *
         * @returns {boolean} the isDraggable configured; if no 'isDraggable' was passed in at construction time then the default config value will be returned.
         */
        this.isDraggable = function(){
            return this.conf.isDraggable;
        };

        /**
         * Get the minZoom that was passed into the MapWidget at constuction time.
         *
         * @returns {number} the minZoom; if no minZoom was passed in at construction time then the default config value will be returned.
         */
        this.getMinZoom = function(){
            return this.conf.minZoom;
        };

        /**
         * Get the maxZoom that was passed into the MapWidget at constuction time.
         *
         * @returns {number} the maxZoom; if no maxZoom was passed in at construction time then the default config value will be returned.
         */
        this.getMaxZoom = function(){
            return this.conf.maxZoom;
        };

        /**
         * Get the mapCenter that was passed into the MapWidget at constuction time.
         *
         * @returns {Array} the mapCenter in latitude and longitude; if no mapCenter was passed in at construction time then the default config value will be returned.
         */
        this.getMapCenter = function(){
            return this.conf.mapCenter;
        };

        /**
         * Get the zoomLevel that was passed into the MapWidget at constuction time.
         *
         * @returns {number} the zoomLevel; if no zoomLevel was passed in at construction time then the default config value will be returned.
         */
        this.getZoomLevel = function(){
            return this.conf.zoomLevel;
        };

        /**
         * Get the defaultCountriesColor that was passed into the MapWidget at constuction time.
         *
         * @returns {number|string} the defaultCountriesColor; if no defaultCountriesColor was passed in at construction time then the default config value will be returned.
         */
        this.getDefaultCountriesColor = function(feature){
            return self.conf.defaultCountriesColor;
        };

        /**
         * Get the highlightCountryStyle that was passed into the MapWidget at constuction time.
         *
         * @returns {number|string} the highlightCountryStyle; if no highlightCountryStyle was passed in at construction time then the default config value will be returned.
         */
        this.getHighlightStyle = function(){
            return self.conf.highlightCountryStyle;
        };

        /**
         * Get the defaultCountryStyle that was passed into the MapWidget at constuction time.
         *
         * @returns {number|string} the defaultCountryStyle; if no ddefaultCountryStyle was passed in at construction time then the default config value will be returned.
         */
        this.getDefaultCountryStyle = function(){
            return self.conf.defaultCountryStyle;
        };

        /**
         * Get the popover content that was passed into the MapWidget at constuction time.
         *
         * @returns {HTMLElement|string} the popover content; null if no content was passed in at construction time.
         */
        this.getPopoverContent = function(){
            if(self.conf.getPopoverContent){
                return self.conf.getPopoverContent();
            }
            return null;
        };

        /**
         * Get the data property key.
         *
         * @returns {string} the data property key.
         */
        this.getDataPropertyKey = function(){
            return self.conf.dataPropertyKey;
        };

        /**
         * Create a map marker.  This should be used before calling the 'addMarker' function.
         * @param {string} key - A unique key to identify the marker.  (ie 'source' or 'destination')
         * @param {string} iconUrl - optional.  The path to the icon resource to be used as the marker image.
         *
         * @returns {Object} the map marker object; null if no key specified.
         */
        this.createMarkerType = function(key, iconUrl){
            if(key){
                if(!markerTypes[key]){
                    if(iconUrl){
                        var CustomMarker = L.Icon.Default.extend({
                            options: {
                                iconUrl: iconUrl,
                                iconAnchor: [12, 21],
                                shadowSize: [0, 0],
                                shadowAnchor: [0, 0]
                            }
                        });
                        markerTypes[key] = new CustomMarker();
                    }else{
                        markerTypes[key] = defaultMarkerKey;
                    }
                    return true;
                }
            }
            return false;
        };

        /**
         * Get a map marker type.  The marker must have been created previously using the 'createMarkerType' function.
         * @param {string} key - specify a marker to get.  This marker must be one that was previously created using 'createMarkerType'.
         *
         * @returns {Object} the map marker object; null if no key specified.
         */
        this.getMarkerType = function(key){
            if(key){
                return markerTypes[key];
            }
            return null;
            // throw new Error(errorMessage.noMarkerKey);
        };

        /**
         * Adds a marker in the Map widget and will be rendered on the map.
         * @param {string} key - specify a marker to be used.  This marker must be one that was previously created using 'createMarkerType'.
         * @param {Array} latlng - the latitude and logitude values in an array; where latitude is index 0 and longitude is index 1 in the array.
         *
         * @returms {Object} - the created marker object; null if no key or lat/lng is not provided.
         */
        this.addMarker = function(key, latlng){
            if(key){
                if(markerTypes[key]){
                    if(latlng){
                        var location = new L.LatLng(latlng[0], latlng[1]);
                        var icon = markerTypes[key];
                        var marker = null;
                        if(icon == defaultMarkerKey){
                            marker = L.marker(location);
                        }else{
                            marker = L.marker(location, {icon: icon});
                        }
                        marker.addTo(map);
                        return marker;
                    }
                }
                return null;
            }
            return null;
        };

        this.removeMarker = function(latlng){};

        /**
         * Get the geoJSON object that the map widget is using.
         * @returns {Object} geoJSON object.
         */
        this.getGeoJsonObject = function(){
            return self.conf.geoJsonObject;
        };

        /**
         * Get the unknown country icon.
         * @returns {String} path to the unknown country image.
        */
        this.getUnknownCountryIcon = function(){
            if (self.conf.unknownCountry) {
                return self.conf.unknownCountry.defaultImage;
            }
            return null;
        };

        /**
         * Get the unknown country's coordinates in latitude and longitude.
         * @returns {Object} latitude using key 'lat' and longitude using key 'lng'.
        */
        this.getUnknownCountryCoordinates = function(){
            if (self.conf.unknownCountry) {
                return self.conf.unknownCountry.coordinates;
            }
            return null;
        };

        /**
         * Throw error messages depeding on the parameter that is missing in the configuration object
         * @inner
         */
        var throwErrorMessage = function () {
            if (typeof(conf) === 'undefined') throw new Error(errorMessages.noConf);
            else if (typeof(conf.container) === 'undefined') throw new Error(errorMessages.noContainer);
            else if (typeof(conf.geoJsonObject) === 'undefined') throw new Error(errorMessages.noGeoJSON);
        };


        /**
         * Destroys all elements created by the Map widget
         * @instance
         * @returns {Object} this object
         */
        this.destroy = function () {
            if(animationLayer) {
              for(prop in animationLayer) {
                delete animationLayer[prop];
              }
            }
            self.conf.geoJsonObject = null;
            vent.unbind();
            vent = null;
            if(map != null){
                map.remove();
                map = null;
            }
            markers.length = 0;
            delete this.conf;
            markers = null;
            popupClick = null;
            popupHover = null;
            unknownMarker = null;
            layer = null;
            arcMap = null;
            legendsHash = null;
            markerTypes = null;
            return this;
        }
    };

    return MapWidget;
});
