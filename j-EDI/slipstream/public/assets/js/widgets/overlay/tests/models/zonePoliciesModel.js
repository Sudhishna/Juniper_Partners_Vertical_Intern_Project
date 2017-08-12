/**
 * A Backbone model and collection that uses sample data to represent Zone Policies
 *
 * @module ZonePoliciesModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone'
], function(Backbone) {

    /**
     * Zone Model and Collection definition
     */
    var ZonePoliciesModel = {};
    ZonePoliciesModel.zone ={},
    ZonePoliciesModel.address ={},
    ZonePoliciesModel.application ={};

    ZonePoliciesModel.zone.model =  Backbone.Model.extend({});

    ZonePoliciesModel.zone.collection =  Backbone.Collection.extend({
        url: '/assets/js/widgets/form/tests/dataSample/zone.json',
        model: ZonePoliciesModel.zone.model
    });

    ZonePoliciesModel.address.model =  Backbone.Model.extend({});

    ZonePoliciesModel.address.collection =  Backbone.Collection.extend({
        url: '/assets/js/widgets/form/tests/dataSample/addressBookGlobal.json',
        model: ZonePoliciesModel.address.model
    });

    ZonePoliciesModel.application.model =  Backbone.Model.extend({});

    ZonePoliciesModel.application.collection =  Backbone.Collection.extend({
        url: '/assets/js/widgets/form/tests/dataSample/application.json',
        model: ZonePoliciesModel.application.model
    });


    return ZonePoliciesModel;
});