define(["backbone"], function(Backbone) {
    var n = 5;          // always fetch top 5 elements
    var severity = 4;   // always fetch critical errors

	var collection = Backbone.Collection.extend({
         initialize: function(models, options) {
             this.resolverClass = options.resolver;
         },
         severity: severity,
         fetch: function(options) {
            var resolver = new this.resolverClass();
            var deferred = $.Deferred();

            resolver.getMostRecent(n, {
                success: function(objects) {
                    deferred.resolve(objects);
                },
                fail: function() {
                    deferred.reject();
                },
                severity: this.severity
            });

            this.collectionURL = resolver.getURL();

            var self = this;
            var promise = $.when(deferred);

            promise
                .done(function(objects) {
                    self.reset(self.parse(objects));
                })
                .fail(function() {
                    console.log("fetch of ", self.colType, "failed");
                });

            return promise;
        }
    });

    return collection;
});