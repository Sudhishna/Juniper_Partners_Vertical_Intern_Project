define(["Slipstream"], function(Slipstream) {

    var plugin_publisher = "Unit Testing, Inc.";
    var plugin_module = "unit_test_module";

	var plugin_manifest = function(plugin_name) {
		return {
			name: plugin_name,
			publisher: plugin_publisher,
			version: "0.0.1",
			release_date: "02.07.2014",
			min_platform_version: "0.0.1",
			activities: [{
				module: plugin_module,
				filters: [{
					action: "MANAGE",
					data: {
						mimeType: "vnd.juniper.net.system.time"
					}
				}]
			}]
	    };
	};

    var num_plugins_to_create = 5;
	var plugin_name_prefix = "plugin_";
	var plugin_collection;


	describe.skip("SlipstreamPlugins", function() {
		/**
	     * When the test is complete, remove all created plugins
	     */
	    after(function(done) {
	    	var num = plugin_collection.length;
	    	while (plugin_collection.length > 0) {
	            plugin_collection.models[0].destroy({
	            	success: function(model, response) {
	                    if (--num == 0) {
	                    	done();
	                    }
	            	},
	            	error: function(model, response) {
	                    done(response);
	            	}
	            })
	        }
	    });

	    describe("PluginDiscovery", function() {
		    it('plugins', function(done) {
		    	var num_plugins_discovered = 0;
		    	// Listen for plugin:discovered events from the framework
		    	Slipstream.vent.on("plugin:discovered", function(plugin) {
		    		// Validate the discovered plugin against the expected definition
		    		
		    		// sanity check the discovered plugin
	                plugin.get("publisher").should.equal(plugin_publisher);
	                plugin.get("activities").forEach(function(activity) {
	                    activity.module.should.equal(plugin_module);
	                });
		    		
		    		num_plugins_discovered++
		    		if (num_plugins_discovered == num_plugins_to_create) {
			            done();
		    		}
			    });

			    Slipstream.on("initialize:after", function() {
			    	// Create a set of plugins on the server
					plugin_collection = new Slipstream.Entities.PluginCollection();
			        for (var i = 0; i < num_plugins_to_create; i++) {
			             plugin_collection.create(plugin_manifest(plugin_name_prefix + i));    	
			        }
			    })
			    Slipstream.boot();
		    });
		});

	});
    
});