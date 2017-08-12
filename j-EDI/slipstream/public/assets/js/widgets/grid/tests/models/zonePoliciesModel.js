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
    ZonePoliciesModel.policy ={};
    ZonePoliciesModel.sortedPolicy ={};
    ZonePoliciesModel.filteredPolicy ={};

    ZonePoliciesModel.zone.model =  Backbone.Model.extend({});

    ZonePoliciesModel.zone.collection =  Backbone.Collection.extend({
        url: './dataSample/zone.json',
        model: ZonePoliciesModel.zone.model
    });

    ZonePoliciesModel.address.model =  Backbone.Model.extend({});

    ZonePoliciesModel.address.collection =  Backbone.Collection.extend({
        url: './dataSample/addressBookGlobal.json',
        model: ZonePoliciesModel.address.model
    });

    ZonePoliciesModel.application.model =  Backbone.Model.extend({});

    ZonePoliciesModel.application.collection =  Backbone.Collection.extend({
        url: './dataSample/application.json',
        model: ZonePoliciesModel.application.model
    });

    ZonePoliciesModel.policy.model =  Backbone.Model.extend({});
    ZonePoliciesModel.sortedPolicy.model =  Backbone.Model.extend({});

    ZonePoliciesModel.policy.collection =  Backbone.Collection.extend({
        url: './dataSample/zonePoliciesOnePage.json',
        model: ZonePoliciesModel.policy.model
    });

    ZonePoliciesModel.sortedPolicy.collection =  Backbone.Collection.extend({
        url: './dataSample/zonePoliciesOnePageSorted.json',
        model: ZonePoliciesModel.sortedPolicy.model
    });    

    ZonePoliciesModel.filteredPolicy.collection =  Backbone.Collection.extend({
        url: './dataSample/filteredZonePoliciesOnePage.json',
        model: Backbone.Model.extend({})
    });

    return ZonePoliciesModel;
});