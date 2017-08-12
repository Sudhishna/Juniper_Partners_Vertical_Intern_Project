/** 
 * A module that implements UI preference manager.  
 *
 * Once this module is started, it will load the user preferences from the
 * persistent store and trigger the "ui:preferences:loaded" event.
 *
 * @module 
 * @name Slipstream/UI
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['modules/preferences'], function(Preferences) {
    Slipstream.module("UI.PreferencesManager", function(PreferenceManager, Slipstream, Backbone, Marionette, $, _) {
    	this.startWithParent = false;

    	var preferencesCache = {};
        var inflight = false;
        var dirty = false;

        /**
         * Load preferences from the persistent store
         */
        function loadPreferences() {
            var deferred = $.Deferred();

            Preferences.fetch({
            	storage: "user",
            	success: function(prefs) {
            		deferred.resolve(prefs);
            	},
            	error: function(errMsg) {
            		deferred.reject(errMsg);
            	}
            })
            
            return deferred.promise();
        }

        /**
         * Get the set of cached UI preferences
         *
         * @return An object containing all cached user preferences
         */
        function getPreferences() {
        	return preferencesCache.ui;
        }

        PreferenceManager.addInitializer(function() {
        	console.log("loading preferences...");

        	var promise = loadPreferences();

        	$.when(promise)
        	    .done(function(prefs) {
                    console.log("preferences loaded");
        		    preferencesCache = prefs;
        	    })
        	    .fail(function(msg) {
        	        console.log("Failed to load preferences:", msg);	
        	    })
        	    .always(function() {
        	        Slipstream.vent.trigger("ui:preferences:loaded");	
        	    })
        });

        /**
         * Persist the UI preferences to the persistent store
         *
         * @param {Object} preferences - The preferences object containing the UI preferences.
         */
        function savePreferences(preferences) {
            // new
            preferencesCache = preferences;

            if (!inflight) {
                inflight = true;

                Preferences.save(preferences, {
                    storage: "user",
                    error: function(errMsg) {
                        console.log(errMsg);
                    },
                    complete: function() {
                        inflight = false;
                        
                        if (dirty) {
                            dirty = false;
                            savePreferences(preferencesCache);
                        }    
                    }
                });
            }
            else {
                dirty = true;
            }
        }

        /**
         * Retrieve a user preference.
         *
         * @param {String} path - @param {String} path - The path to the preferences setting within the preferences
         * object.  It takes the form:
         *
         * "pathFrag1:pathFrag2:...pathFragn"
         *
         * Where pathFragn is the n-th fragment of the preference's path in the
         * preferences object.
         */
        Slipstream.reqres.setHandler("ui:preferences:get", function(path) {
            if (!path) {
                return getPreferences();    
            }

            var path_elements = path.split(":");
            var prefs = preferencesCache;
            var prefs_element;

            for (i = 0; i < path_elements.length; i++) {
                prefs_element = prefs[path_elements[i]];

                if (!prefs_element) {
                    break;
                }

                prefs = prefs_element;
            }

            return prefs_element;
        });

        /**
         * Store a value for a UI preference
         *
         * @param {String} path - The path to the preferences setting within the preferences
         * object.  It takes the form:
         *
         * "pathFrag1:pathFrag2:...pathFragn"
         *
         * Where pathFragn is the n-th fragment of the preference's path in the
         * preferences object.  For example the path
         *
         * "ui:nav:left:width"
         *
         * represents the path to the attribute in the preferences object representing the width of the UI's left navigation pane.  The 
         * preference will be stored at
         *
         * ui.nav.left.width
         *
         * in the user preferences object.
         *
         * @param {String} val - The new value for the preference.
         */
        Slipstream.vent.on("ui:preferences:change", function(path, val) {
            var prefSegments =  path.split(":");
            var obj = preferencesCache;
            var i;

            // Create the preference's attribute path in the preferences object.
            for (i = 0; i < prefSegments.length - 1; i++) {
                var segment = prefSegments[i];

                if (!obj[segment]) {
                    obj[segment] = {};
                }

                obj = obj[segment];
            }

            obj[prefSegments[i]] = JSON.parse(JSON.stringify(val));

            // Save the updated preferences to the persistent store
            savePreferences(preferencesCache);
        });
    });

    return Slipstream.UI.PreferenceManager;
});