/** 
 * A module providing common utilities for the utility toolbar
 * implementation.
 *
 * @module 
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    return {
        /**
         * Create an explicit intent to launch the activity associated
         * with a selected toolbar element.
         *
         * @param {Object} activity - The activity for which the intent is being created.
         * @param {Object} toolbarElement - The model object representing the toolbar element
         * associated with the activity.
         * @param {Function} facade - The facade function for the toolbar element.
         */
        createToolbarIntent: function(activity, toolbarElement, facade) {
            var intent = null;

            if (activity) {
                var elementProxy = createElementProxy(toolbarElement, facade);

                var activityContext = _.extend(activity.context, {
                    toolbarElement: elementProxy
                });

                intent = {
                    module:  activity.module,
                    context: activityContext
                }
            }

            return intent;
        }
    };

    /**
     * Create a proxy object for an instance of a toolbar element model.  
     * This proxy will forward calls to setters on the Slipstream.SDK.ToolbarElement 
     * 'facade' to method calls on the provided toolbar element model.
     *
     * @param {Object} element - The model object representing the toolbar element
     * @param {Function} facade - The facade function for the toolbar element.
     */
    function createElementProxy(element, facade) {
         var setterPrefix = "set",
             proxy = new facade();

        /**
         * Find all setters on the facade's prototype and generate proxy methods that
         * forward to method calls on the underlying toolbar element model.
         */
        for (var prop in proxy) {
            if (typeof proxy[prop] == "function" && prop.indexOf(setterPrefix) == 0) {
                (function() {
                    var propName = prop;
                    proxy[propName] = function(value) {
                        var attrName = propName.slice(setterPrefix.length);
                        attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                        element.set.call(element, attrName, value);
                    } 
                })();  
            }    
        }

        return proxy;
    }
});