/**
 * A collection of models representing steps in the wizard train.  
 * Each member of the collection is a TrainStep.
 *
 * @module TrainStepCollection
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    './trainStepModel'
], function(Backbone, TrainStep) {
    /**
     * A collection of TrainStepModels
     */
    var TrainStepCollection = Backbone.Collection.extend({
        model: TrainStep
    });

    return TrainStepCollection;
});