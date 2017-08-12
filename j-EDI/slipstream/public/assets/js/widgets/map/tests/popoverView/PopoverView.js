/**
 * A sample view whose purpose is to provide content to be rendered within the Map Widget's popover 
 *
 * @module PopoverView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'lib/template_renderer/template_renderer',
    'backbone',
    'text!widgets/map/tests/popoverView/popoverTemplate.html'
], function(template_renderer, Backbone, popoverTemplate){


    var PopoverView = Backbone.View.extend({
        events :{
            'click #btn_id' : function(){
                alert('button pressed');
            }
        },

        render: function () {
            var countryObject = this.options.geoJsonFeature;
            var country = countryObject.properties.iso_a2.toLowerCase();
            this.$el.append(template_renderer(popoverTemplate, {country_abbrev: country, country_name: countryObject.properties.name,
                                                            threat_event_ct: countryObject.properties.threatEventCount }));
            return this;
        }
    });

    return PopoverView;
});