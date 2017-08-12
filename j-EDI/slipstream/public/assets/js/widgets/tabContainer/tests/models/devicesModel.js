/**
 * A Backbone model and collection that uses sample data to represent list of device data for deviceListing (Tab 1), CliView (Tab 3) and confgiView (Tab 4)
 *
 * @module DevicesModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone'
], function(Backbone) {

    /**
     * Zone Model and Collection definition
     */

    var DevicesModel = {};
    // DevicesModel.address ={},
    DevicesModel.application ={};
    // DevicesModel.cli ={};

    // DevicesModel.address.model =  Backbone.Model.extend({});
    //
    // DevicesModel.address.collection =  Backbone.Collection.extend({
    //     url: './dataSample/addressBookGlobal.json',
    //     model: DevicesModel.address.model
    // });

    DevicesModel.application.model =  Backbone.Model.extend({});

    DevicesModel.application.collection =  Backbone.Collection.extend({
        url: 'http://192.168.25.2/DeviceListing.py', //python url to retrieve device data
        model: DevicesModel.application.model

    });

    // DevicesModel.cli.model = Backbone.Model.extend({});
    //
    // DevicesModel.cli.collection = Backbone.Collection.extend({
    //   url: './dataSample/cliData.json',
    //   model: DevicesModel.cli.model
    // });



    return DevicesModel;
});
