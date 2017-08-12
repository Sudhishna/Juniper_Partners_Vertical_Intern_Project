define(function() {
	describe('URL Router Unit tests:', function() {
        var activity1 = {
             "module": "activity1_module",
             "url_path": "/some/path",             
             "plugin_name": "unit_test_plugin",
             "context": "unit_test_plugin",
             "filters": [
                {
                   "id": "id1",
                   "action": "VIEW",
                   "data": {
                       "mime_type": "vnd.juniper.net.type1"
                   }
                }
             ]
        };

        var activity2 = {
             "module": "activity2_module",
             "url_path": "/some/other/path/that/is/arbitrarily/long",
             "plugin_name": "unit_test_plugin",
             "context": "unit_test_plugin",
             "filters": [
                {
                   "id": "id2",
                   "action": "VIEW",
                   "data": {
                       "mime_type": "vnd.juniper.net.type2"
                   }
                }
             ]
        };

        var activity3 = {
             "module": "activity3_module",
             "url_path": "/",
             "plugin_name": "activity3",
             "context": "unit_test_plugin",
             "filters": [
                {
                   "id": "id3",
                   "action": "VIEW",
                   "data": {
                       "mime_type": "vnd.juniper.net.type3"
                   }
                }
             ]
        };

        var activity4 = {
             "module": "activity4_module",
             "url_path": "/",
             "plugin_name": "activity4",
             "context": "unit_test_plugin",
             "filters": [
                {
                   "id": "id4",
                   "action": "VIEW",
                   "data": {
                       "mime_type": "vnd.juniper.net.type4"
                   }
                }
             ]
        };

        beforeEach(function() {
        	Slipstream.vent.off("activity:start");
        });

        after(function() {
            history.go(-2);  // restore browser history
        });

        before(function() {
            Slipstream.vent.trigger("activity:discovered", activity1);
            Slipstream.vent.trigger("activity:discovered", activity2);
            Slipstream.vent.trigger("activity:discovered", activity3);
            Slipstream.vent.trigger("activity:discovered", activity4);
            history.pushState(null, "", "/" + activity1.plugin_name + activity1.url_path);
            history.pushState(null, "", "/" + activity2.plugin_name + activity2.url_path);
            history.pushState(null, "", "/" + activity3.plugin_name + activity3.url_path + "activity3" + "%3Fparam1=1&param2=2");
            history.pushState(null, "", "/" + activity4.plugin_name + activity4.url_path + "activity4/" + "query%3Fparam1=1&param2=2");
        });
        
		it('activity1 should be started when URL /some/path is pushed into browser history', function(done) {
      Slipstream.vent.on("activity:start", function(activity) {
                if (activity.module == "activity1_module") {
                    console.log("module = " + activity.module);
                    done();
                }
            });
      console.log("going back in history");
			history.go(-1);
		});

		it('activity2 should be started when URL /some/other/path/that/is/arbitrarily/long is pushed into browser history', function(done) {
			Slipstream.vent.on("activity:start", function(activity) {
                if (activity.module == "activity2_module") {
                    done();
                }
            });
			history.go(1);
		});

    it('activity3 should be started when URL /activity3/%3Fparam1=1&param2=2 is pushed into browser history', function(done) {
      Slipstream.vent.on("activity:start", function(activity) {
                if (activity.module == "activity3_module") {
                    done();
                }
            });
    });

    it('activity4 should be started when URL /activity4/query%3Fparam1=1&param2=2 is pushed into browser history', function(done) {
      Slipstream.vent.on("activity:start", function(activity) {
                if (activity.module == "activity4_module") {
                    done();
                }
            });
    });



	});
});