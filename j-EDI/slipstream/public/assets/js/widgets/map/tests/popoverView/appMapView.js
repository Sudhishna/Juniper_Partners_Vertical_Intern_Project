/**
 * A view that uses the Map Widget to render a Map in a Backbone View.  This view
 * also instantiates a view to be consumed by the getPopoverContent function that is
 * defined to provide popover content.
 *
 * @module Map View
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'lib/template_renderer/template_renderer',
    'backbone',
    'widgets/map/mapWidget',
    'widgets/map/tests/popoverView/PopoverView'
    ], function(template_renderer, Backbone, MapWidget, PopoverView){
    var MapView = Backbone.View.extend({
        events :{
            'click .blk_ip_btn' : function(){
                alert('blocking ip\'s');
            }
        },
        render: function () {
            var self = this;
            this.map = new MapWidget({
                'container': '.map',
                'geoJsonObject'     : self.model.get('geoJsonCountries'),
                'options' : {
                    'getPopoverContent' : function(countryObject){
                            myView = new PopoverView({geoJsonFeature: countryObject});
                            myView.render();
                            return myView.el;
                    }                
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