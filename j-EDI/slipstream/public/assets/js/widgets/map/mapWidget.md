# Map Widget

## Introduction
The Map widget is a UI control that provides map-like behavior.

## API
The Map widget follows the widget programming interface standards, therefore it implements the build and destroy methods. A configuration object is passed to its constructor which is used to configure the many options of the map widget.

### Configuration
The map widget has many configurable options.  The absolute minimum configuration parameters that must be declared by any client application is a container and a geoJsonObject.  

The minimum configuration object has the following parameters:

```json
{
  container: <DOM object that defines where the widget will be rendered>,
  geoJsonObject: <a javascript object that was parsed from a geoJson data formatted source - ie. a geojson.json file.>
}
```

The container that will have a map widget can be any block element but commonly is a div. For example:

```
<div class=".map"></div>
```

### geoJsonObject
The geoJsonObject parameter will be consumed by the Map Widget to acquire information about the geographic features to be rendered on the map.  

The geoJsonObject should have been parsed using JSON.parse(data); where data is the raw (geo) json file.  The raw geojson data should adhere to the geojson formatting standard.  A default geojson file has been provided and can be found at:  

```
% public/widgets/map/conf/countries.geojson.json
```

This geojson file embodies the world map and contains every continent and every country circa 2015.

A minimum Map widget with default configuration values should be instantiated with:

```javascript
// rawGeoJsonData (json) should have been acquired from some data source.
var mapWidget = new MapWidget({
    "container": this.$el.find('.map'),
    "geoJsonObject": JSON.parse(rawGeoJsonData)
});
```

Custom data can be appended to each 'feature' in the geoJson object and be rendered on the feature itself.  Usually this will be some color value whose color is a function of the custom value itself.  See 'getColor' for more details.


The *container* and the *geoJsonObject* parameters are the only mandatory parameters that a client must supply in order for the map widget to render.

If you instantiate a map widget with the above (bare minimum) configuration you will get a gray map.  When you hover your mouse over any country you should see the hovered over country become highlighted.  By default the highlight styling is such that the country's outline is colored yellow.  The highlight styling of any given country is configurable.

(Again every configuration option below this point is optional)

## Optional Configuration Parameters
All optional configuration parameters will be specified in an options object hash.

```javascript
var mapWidget = new MapWidget({
    'container'     : this.$el.find('.map'),
    'geoJsonObject' : JSON.parse(geoJsonData),
    'options'       : {
        'highlightCountryStyle'   : {...},
        'defaultCountryStyle'     : {...}      
        ...
    }
});
```

### highlightCountryStyle
The highlightCountryStyle parameter represents the styling of a geoJson feature should a country become highlighted.  This is not a behavioral parameter - rather, as the name describes, it is merely a styling.  A highlightCountryStyle style object must embody these parameters:

```json
    {
        weight          : 2,
        color           : 'red',        // outline color
        dashArray       : '',
        fillOpacity     : 0.7,
        fillColor       : 'cyan'        
    }
```

Every parameter in the object hash (excluding fillColor) will describe attributes of the geojson feature for highlighting.  

| Option       | Type   | Default   | Desciption    |
|--------------|---------|----------|---------------|
| color        | String  | white    |  Stroke color. |
| weight       | Number  |   2      |  Stroke width in pixels. |
| opacity      | Number  |   1      |  Stroke opacity. |
| dashArray    | String  |   <empty string>      |  A string that defines the stroke dash pattern. |
| fillOpacity  | Number  |   0.7    |  Fill opacity. |
| fillColor    | String  | #808080  | Fill Color. |

### defaultCountryStyle
The defaultCountryStyle parameter represents the styling of a geoJson feature by default - when there are no events, etc.  Essentially a feature's default state.  This is not a behavioral parameter - rather, as the name describes, it is merely a styling.  A highlightCountryStyle style object must embody these parameters:

```json
    {
        weight          : 2,
        color           : 'red',        // outline color
        dashArray       : '',
        fillOpacity     : 0.7
    }
```

| Option       | Type   | Default   | Desciption    |
|--------------|---------|----------|---------------|
| color        | String  | white    |  Stroke color. |
| weight       | Number  |   1      |  Stroke width in pixels. |
| opacity      | Number  |   1      |  Stroke opacity. |
| dashArray    | String  |   3     |  A string that defines the stroke dash pattern. |
| fillOpacity  | Number  |   0.7    |  Fill opacity. |


Notice that there is no 'fillColor' attribute like there is for highlightCountryStyle.  This is to facilitate the default state of a feature to be a function of some value.  For example, if you wanted to render a choropleth map based on threat events, each country would have a different number of threat events.  If you are rendering a choropleth map then you would want the shading of each country to be a function of some color range.  This takes us to the next configurable parameters - getColor and dataPropertyKey.

### getColor and dataPropertyKey
First, these two parameters should be specified together.  Why?  Because the getColor should be defined as a function.  The purpose of this function is to provide the features on your map with a default fill color.  As explained above, if you want each of your features (countries, states, provinces, prefectures, etc) to have it's color be a function of some value then you must provide these two parameters.  An example of getColor could like like this:

```javascript
    'getColor' : function(datum){
        if(datum<=5) return 'red';
        else return 'blue';
    }
```

The getColor function will be invoked by the map widget to get the color of a feature when the map is rendered and updated.

What is the 'datum' parameter you ask?  'datum' is value of the attribute on the geojson feature that is indexed by the dataPropertyKey.  Confused?  Here's an example.

I have geoJson feature here (a single entry in a geojson record):

```json
{
   "type":"Feature",
   "properties":{
      "threatEventCount" : 4,
      "scalerank":1,
      "sovereignt":"Argentina",
      "sov_a3":"ARG",
      "name":"Argentina",
      "abbrev":"Arg.",
      "postal":"AR",
      "formal_en":"Argentine Republic",
      "continent":"South America",
      "region_un":"Americas",
      "region_wb":"Latin America & Caribbean",
      "geometry":{
         "type":"MultiPolygon",
         "coordinates":[
            [
               [
                  [
                     -65.5,
                     -55.2
                  ],
                    ...
                  ],
                  [
                     -64.964892137294584,
                     -22.075861504812352
                  ]
               ]
            ]
         ]
      }
   }
}
```

There is a lot of data here just for a single feature - but here we have the country Argentina.  Notice that there is a 'properties' object hash embedded inside the feature object.  Furthermore, notice that the first property within the properties object hash is 'threatEventCount'.

In this example, if I want to render a choropleth map where the country shading is either red or blue based on the property 'threatEventCount', then the value for my dataPropertyKey will be 'threatEventCount'.

Here is the full map widget instantiation and configuration.

```javascript
var mapWidget = new MapWidget({
    'container'     : this.$el.find('.map'),
    'geoJsonObject' : JSON.parse(geoJsonData),
    'options'       : {
        'getColor'          : function(datum){
                                if(datum<=5) return 'red';
                                else return 'blue';
                              },
        'dataPropertyKey'   : 'threatEventCount'
    }
});
```

Given this configuration, in what color will Argentina render?  Try it!

### defaultCountriesColor
What if you do not want to create a choropleth map and just want every map feature to be uniform in color you should specify this parameter.

```javascript
'defaultCountriesColor' : '#808080' // default country color if 'getColor' has NOT been defined.

```

### getPopoverContent
As the name of this optional parameter suggests, the value that the client shall provide is a function that returns a string or HTML element.  The developer should keep in mind that the value returned by this function will be used to render content in a popover.  That is the single purpose of providing this parameter - just content for a popover.  The 'getPopoverContent' function will be invoked by the Map Widget and when invoked will pass in an argument whose value will be the target feature from which the event originated.  Ie. If a user clicks on Argentina and a popover is to open, then 'getPopoverContent' will be invoked where the argument provided to the function invocation will be the Argentina javascript object.  

Below is an example configuration that returns the name of the map feature that was clicked.

```javascript
var mapWidget = new MapWidget({
    'container'     : this.$el.find('.map'),
    'geoJsonObject' : JSON.parse(geoJsonData),
    'options'       : {
        'getPopoverContent' : function(countryObject){
                                var countryName = countryObject.properties.name.trim();
                                var contentString = '<div>' + countryName + '</div>'
                                return contentString;
                        }  
    }
});
```

An additional example is provided at:  <Slipstream root directory>/public/assets/js/widgets/map/tests/popoverView/testMap.html.  The purpose of this example is to exhibit the usage of a Slipstream View within 'getPopoverContent'.

### getHoverContent
The 'getHoverContent' should be used in the exact same manner as 'getPopoverContent'.  So please refer to the docuementation for 'getPopoverContent'.  The 'getHoverContent' function should be provided only if you want a pop over to appear on hover events.  If not provided then no hover behavior will activated.

### animateLine
The 'animateLine' should be used to perform an animation.  To perform an animation the client must provide four parameters.  The source, destination, fadeTime and lineColor.  Both, the source and destiation, must be an object hash that contains a 'lat' and 'lng' property where the values are are of type number.  The fadeTime property must be of type number and positive.  The lineColor can be either a valid html supported color string or hex value.

### animateSprite
The 'animateSprite' should be used to perform an animation where the animation involves an object moving from one source point to another destination point.  To perform an animation the client must provide 3 parameters.  The source, destination and lineColor.  Both, the source and destiation, must be an object hash that contains a 'lat' and 'lng' property where the values are are of type number.  The lineColor can be either a valid html supported color string or hex value.  The lineColor will be used to visually fill in the sprite object.

### mapBackgroundColor
The 'mapBackgroundColor' configuration option can be used to set the background of the map (ie.  the oceans).  As with all color based config options, the valid values are legal html color value strings or hex values.

### unknownCountry
The 'unknownCountry' option should be used to specify an unknown continent on the map widget.  By default the 'unknownCountry' is specified.
The 'unknownCountry' option is specified as an object hash.  The properties of the object are described in the table below.

| Option       | Type   | Default   | Desciption    |
|--------------|---------|----------|---------------|
| defaultImage | String  | /assets/images/unknown_country_live.svg | The path to the image resource to be used to represent the unknown country. |
| coordinates | Object  | {lat: -49.61, lng: -12.83}  | An object that has properties 'lat' and 'lng' for the latitude and longitude geo coordinates. |
| name | String  | Unknown | A string value that will be used to name the unknown country. |
| iso_a2 | String  | qq | A string of length 2 that should be used to uniquely identify the unknown country.  This could be used by the client to apply a flag via css or to lookup the unknown country in the client side model. |

The author of this documentation recommends using the website:  http://www.latlong.net/ to find the (latitude and longitude) coordinates of where you want to place the unknownCountry.

The remaining options (below in the table) should be added to the options object described and used above (in the previous examples).

## Other Map Options
| Option       | Type   | Default   | Desciption    |
|--------------|---------|----------|---------------|
| mapCenter    | Array   |  29.278420174798246, -5.309598025402226    |  Initial geographical center of the map. Array elements should be ordered as [longitude, latitude] |
| isDraggable  | Boolean  |   true     |  Whether the map be draggable with mouse/touch or not. |
| minZoom      | Number  |   2.0      |  Minimum zoom level of the map. |
| maxZoom    | Number  |   5     |  Maximum zoom level of the map. |
| zoomLevel  | Number  |   1.8   |  Initial map zoom. |
| zoomControl  | Boolean  |   true    |  Whether the zoom UI controls (+ / -) are added to the map. |
| doubleClickZoom  | Boolean  |   true   |  Whether the map can be zoomed in by double clicking on it and zoomed out by double clicking while holding shift. |
| scrollWheelZoom  | Boolean  |   false    |  Whether the map can be zoomed by using the mouse wheel.  |
| touchZoom  | Boolean  |   false    |  Whether the map can be zoomed by touch-dragging with two fingers. |



## Map Widget Methods
### build
Standard Slipstream widget lifecycle method.  Adds the dom elements and events of the Map widget in the specified container. For example:

```javascript
mapWidget.build();
```

### destroy
Standard Slipstream widget lifecycle method.  Clean up the specified container from the resources created by the Map widget.

```javascript
mapWidget.destroy();
```

### addLegend

Add a legend to the map.  This method has no return value.  There are two required  parameters.  The first parameter is 'position'; it is a string.  The set of valid values for position are ['topleft', 'topright', bottomleft, bottomright].
 
The second parameter is 'content'.This parameter is the innerHTML content of the legend and therefore can be either a string or an object.

#### css classes for the legend 
In addition to the ability to add a legend to the map, the Slipstream map widget has two predefined css classes that can be optionally used to style the legend content.  These two classes are - __legendTitle__ and __legendItem__.

The recommended usage of __legendTitle__ is that it be applied to the html element that contains the legend's title.

```html
<div class="legendTitle">My Legend Title</div>
```

Similarly, the recommended usage of __legendItem__ is that it be applied to the html element that contains the legend's items.
```html
<span class="legendItem">
  <i style="background: #707070"></i>
  Info
</span>
<span class="legendItem">
  <i style="background: #808080"></i>
  Warning
</span>
<span class="legendItem">
  <i style="background: #909090"></i>
  Critical
</span>
```

### removeLegend
 Remove a legend from the map.  This method has no return value.  There is one required parameter.  It is a string that specifies, by position, which legend to remove.  The set of valid values for position are ['topleft', 'topright', bottomleft, bottomright]. 
   
### invalidateSize
 Checks if the map container size changed and updates the map if so — call it after you've changed the map size dynamically, also animating pan by default.
   
### isDraggable
Getter for the **isDraggable** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getMinZoom
Getter for the **minZoom** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getMaxZoom
Getter for the **maxZoom** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getMapCenter
Getter for the **mapCenter** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.

### getZoomLevel
Getter for the **zoomLevel** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getDefaultCountriesColor
Getter for the **defaultCountriesColor** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getHighlightStyle
Getter for the **highlightStyle** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getDefaultCountryStyle
Getter for the **defaultCountryStyle** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getPopoverContent
Getter for the **getPopoverContent** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### getDataPropertyKey
Getter for the **dataPropertyKet** parameter value of the current map instance.  The returned value should be that which was passed into the MapWidget at constuction time or default.
### createMarkerType
Create a marker.  Returns true if successful, false if creation has failed.The function accepts 2 parmeters but only the first is required.  The first is 'key'.  They key should be of type string.  This key will be used to identify the marker type to be created.  If the key already exists the function will return false.  The second (**optional**) parmeter should be the URL to the icon image (absolute or relative to your script path).  The icon image will be used to create a custom marker. 

### getMarkerType
Getter to be used to retrieve the marker type of a given type.  There is a required parameter whose value must be a string or object that was used to create the marker type to be retrieved.  If given a valid key, a marker type will be returned.

### addMarker
Adds a marker in the Map widget and will be rendered on the map.  There are 2 required parameters - the first is 'key'.  Key is a string and will be used to specify a marker type.  This marker type must be one that was previously created using 'createMarkerType'.  The second parameter is an Array of 2 elements.  These 2 elements are the latitude and logitude values; where latitude is index 0 and longitude is index 1 in the array.  This parameter will be used to specify the geographic point on the map widget where the marker shall be rendered.

### getColor
Provides a color for a geojson feature (from which the event originated).  The default color returned will be '#808080'.  The return value of this method can be overridden by specifying 'getColor' on the options object hash as **getColor**.  There is one parameter that is required; it should be of type string.  The value shall be the attribute on the geojson feature that is indexed by the **dataPropertyKey**.

### getUnknownCountryIcon
Getter for the unknownCountry's **defaultImage** parameter value of the current map instance.  The returned value should be of String type and that which was passed into the MapWidget at constuction time or default.  If unknownCountry's value was set to false then this getter should return null.

### getUnknownCountryCoordinates
Getter for the unknownCountry's **coordinates** parameter value of the current map instance.  The returned value should be an Object type and that which was passed into the MapWidget at constuction time or default.  The latitude can be referenced with key 'lat' and the longitude can be refereneced with key 'lng'.  If the **unknownCountry**'s value was set to false then this getter should return null.

## Glossary

__feature__:  an abstraction for a item on a map - ie country, state, province, prefecture, county, city, building, house, street, tree etc.  A geographic feature.

__geojson__: GeoJSON is a format for encoding a variety of geographic data structures. A GeoJSON object may represent a geometry, a feature, or a collection of features. GeoJSON supports the following geometry types: Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, and GeometryCollection.

__choropleth map__: a map that uses differences in shading, coloring, or the placing of symbols within predefined areas to indicate the average values of a property or quantity in those areas.

