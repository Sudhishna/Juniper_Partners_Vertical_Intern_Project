/** 
 * A module that implements a Javascript
 * binding to the Slipstream preferences REST API.
 *
 * @module 
 * @name Slipstream/SDK/Preferences
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("Preferences", /** @lends Preferences */ function(Preferences, Slipstream, Backbone, Marionette, $, _) {
        // private 
        var auth_resolver = null;
        var url_prefix = "/slipstream/preferences";
        var storage_options = {user: 'user', session: 'session'};
        var getUserName = function(){
            if(!auth_resolver){
                auth_resolver = new Slipstream.SDK.AuthenticationResolver();
            }
            return auth_resolver.getUserName();
        };

        // public

       /**
        *  Check the requested preferences storage
        *
        *  @param {String} storage - the requested preferences storage.  Valid values are "user" or "session".
        *  @throws {Error}  If argument is not "user" or "session".
        */
        var check_storage = function(storage) {
            if (!storage_options[storage]) {
                throw new Error("Invalid storage option: " + storage);
            }
        }

        /**
         * Execute preferences request
         *
         * @param {Object} options - An object containing a set of request options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences request completes successfully.  
         * error:  A function to be called if the preferences request fails.  The function gets passed
         * a string describing the error condition.
         */
        var executeRequest = function(options) {
            var userName = getUserName();
            var defaults = {
                userName: userName,
                storage: storage_options.user,
                dataType: "json",
                contentType: "application/json",
                timeout: 3000,
                success: function() {},
                error: function() {}
            } 

            if (options && options.error) {
                var error_callback = options.error;
                options.error = function(jqXHR, statusText, errorText) {
                    error_callback("Preferences operation failed: " + errorText);    
                };
            }

            if (options && options.success) {
                var success_callback = options.success;
                options.success = function(data, statusText, jqXHR) {
                    success_callback(data);
                }
            }

            var options = _.extend(defaults, options),
                url = url_prefix + "/" + options.storage + "?userName=" + userName;

            check_storage(options.storage);
            options.userName = userName;

            $.ajax(url, options);    
        }

        /**
         * Save a set of preferences
         *
         * @param {Object} prefs - An object representing the set of preferences to be saved.
         * @param {Object} options - An object containing a set of save options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are saved successfully.
         * error:  A function to be called if the preferences fail to save correctly.  The function gets passed
         * a string describing the error condition.
         */
        Preferences.save = function(prefs, options) {
            var save_opts = {
                type: "PUT",
                processData: false,
                data: JSON.stringify(prefs)
            } 

            var blended_options = _.extend(options, save_opts);

            executeRequest(blended_options);
        }
        
        /**
         * Fetch the set of preferences.
         *
         * @param {Object} options - An object containing a set of fetch options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are fetched successfully.  The function gets passed
         * the fetched preferences object.
         * error:  A function to be called if the preferences fail to save correctly.  The function gets passed
         * a string describing the error condition.
         */
        Preferences.fetch = function(options) {
            var fetch_opts = {
                type: "GET"
            } 

            var blended_options = _.extend(options, fetch_opts);

            executeRequest(blended_options);
        }

        /**
         * delete a set of preferences
         *
         * @param {Object} options - An object containing a set of delete options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are deleted successfully.  
         * error:  A function to be called if the preferences fail to delete correctly.  The function gets passed
         * a string describing the error condition.
         */
        Preferences.delete = function(options) {
            var delete_opts = {
                type: "DELETE"
            } 

            var blended_options = _.extend(options, delete_opts);

            executeRequest(blended_options);
        }
    });

    return Slipstream.Preferences;
});