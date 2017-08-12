define(["backbone", './baseCollection.js'], function(Backbone, BaseCollection) {
    var n = 5;

	var collection = BaseCollection.extend({
        model: Backbone.Model.extend({
            toJSON: function() {
                return _.extend(Backbone.Model.prototype.toJSON.call(this), {
                    "definition-name": this.get("name"),
                    "description": this.get("alarmDescription"),
                    "generated-time" : this.get("lastUpdated")
                });
            }
        }),
        parse: function(data) {
            return data["alarms"]["alarm"];
        }
    });

    return collection;
});