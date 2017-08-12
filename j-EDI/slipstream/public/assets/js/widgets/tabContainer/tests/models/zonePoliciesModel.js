/**
 * A Backbone model and collection that uses sample data to represent Zone Policies
 *
 * @module DevicesModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone'
], function(Backbone) {

    /**
     * Zone Model and Collection definition
     */
    var DevicesModel = {};
    DevicesModel.address ={},
    DevicesModel.application ={};

    DevicesModel.address.model =  Backbone.Model.extend({});

    DevicesModel.address.collection =  Backbone.Collection.extend({
        url: './dataSample/addressBookGlobal.json',
        model: DevicesModel.address.model
    });

    DevicesModel.application.model =  Backbone.Model.extend({});

    DevicesModel.application.collection =  Backbone.Collection.extend({
        url: './dataSample/application.json', //python URL
        model: DevicesModel.application.model
    });


    return DevicesModel;
});
