/**
 * A model representing a step in the wizard train.  The model
 * contains the following attributes:
 *
 * {Integer} step - 0-based index of the step in the wizard.
 * {String} title - The user-visible title of the step.
 *
 * @module TrainStep
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone'
], function(Backbone) {

    var TrainStep = Backbone.Model.extend({
        defaults: {
            "step" : 0,
            "title": "Untitled"
        }
    });

    return TrainStep;
});