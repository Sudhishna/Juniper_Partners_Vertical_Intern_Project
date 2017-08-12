define(["backbone", './baseCollection.js'], function(Backbone, BaseCollection) {
        var collection = BaseCollection.extend({
        parse: function(data) {
            return data["alerts"]["alert"];
        }
    });

    return collection;
});