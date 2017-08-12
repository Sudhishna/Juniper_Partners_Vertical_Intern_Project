/** 
 * A module that implements the framework's navigational elements.
 *
 * The navigational elements are partitioned into two structures:
 *
 * 1) A collection of primary navigation elements.
 *
 * 2) A forest of secondary navigational elements.  Each tree in the forest is
 *    rooted at a primary navigational element.
 *
 * An example structure can be visualized as follows:
 *
 * +---------+---------+---------+
 * |    p1   |    p2   |   p3    |
 * *---------+---------+---------+
 *      |         |               
 *      c1        c1              
 *     /  \      / | \
 *    c2   c3   c2 c3 c4
 *
 * which represents the following navigational paths:
 *
 * p1 > c1 > c2,
 * p1 > c1 > c3,
 * p2 > c1 > c2,
 * p2 > c1 > c3,
 * p2 > c1 > c4,
 * p3
 *
 * Selection models govern the rules for selecting primary and secondary elements.
 *
 * The primary elements are governed by a single-select model, allowing only a single primary
 * element to be selected at a given time.  Selection of one element deselects the currently selected
 * element. 
 *
 * The secondary elements are governed by a 'tree' selection model with the following characteristics:
 *
 * 1) Only a single leaf node may be selected at a given time.  Selection of one leaf node deselects
 *    the currently selected leaf node.
 *
 * 2) Any number of non-leaf nodes may be selected at a given time.    
 *
 * @module 
 * @name Slipstream/Navigation
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */ 
define(["conf/navigation/schema",
        "./models/navModel",
        "./views/primaryNavView",
        "./views/secondaryNavView",
        "lib/utils",
        "backbone.picky" 
        ], /** @lends Navigation */ function(schema, NavModel, PrimaryNavView, SecondaryNavView, Utils, Picky) {

    Slipstream.module("Navigation", function(Navigation, Slipstream, Backbone, Marionette, $, _) {
        // Don't start the navigation app when the framework boots
        this.startWithParent = false;

        var roots = [],
            nls_context = "@slipstream_nav",
            primaryNavigation,
            current_root = undefined;

        Slipstream.vent.on("nav:discovered", process_nav_element);  

        Slipstream.vent.on("nav:primary:selected", function(primaryNavModel) {
            var intent =  null,
                primaryIntent = primaryNavModel.get("intent"),
                leaves = primaryNavModel.get("leaves");

            if (primaryIntent) {
                if (leaves) {
                    Slipstream.vent.trigger("activity:start", primaryIntent);
                }    
            }
            else {
                if (leaves) {
                    var parent_intent = leaves[0].attributes.parent.get("intent");

                    intent = (parent_intent) ? parent_intent : leaves[0].get("intent");
                    Slipstream.vent.trigger("activity:start", intent);
                } 
                else {
                    var secondaryNavView = createSecondaryNavView(primaryNavModel);

                    if (secondaryNavView) {
                        displaySecondaryNavView(secondaryNavView);
                    }
                }
            }

            var children = primaryNavModel.get("children");

            Slipstream.commands.execute("nav:secondary:activate", children);
            Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", children);
        });

        // Before an activity starts, reveal its navigation path
        Slipstream.vent.on("activity:beforeStart", function(activity) {
            revealNav(activity);
        });

        /**
         * Reveal an activity's navigation path in the UI 
         *
         * @param {Object} activity - The activity whose navigation path is to be revealed.
         */
        function revealNav(activity) {
            var cmp_fn = function(path_element, node) {
                return path_element == node.get("internal_name");
            }

            var navElements, children;

            if (activity.path) {
                var navigation_path = activity.path.path;

                if (navigation_path != "/") {
                    navElements = map_nav(activity.path, roots, cmp_fn);

                    if (navElements) {
                        var root = navElements[0],
                            children = root.get("children");

                        root.select();

                        if (children) {
                            if (root != current_root) {
                                current_root = root;

                                var secondaryNavView = createSecondaryNavView(root);

                                if (secondaryNavView) {
                                    displaySecondaryNavView(secondaryNavView);
                                }
                            }

                            for (var i = 1; i < navElements.length - 1; i++) { 
                                if (navElements[i].get("children")) {
                                    navElements[i].expand();
                                }
                            }
                            // select the last element
                            var mod = navElements[navElements.length-1];
                            navElements[navElements.length - 1].select();
                        }
                    }
                }

                Slipstream.commands.execute("nav:secondary:activate", children);
                Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", children);
                Slipstream.vent.trigger("nav:resolved", navElements, activity);
            }
        }

        /**
         * Create a view representing the secondary navigation for a given primary
         * navigation element.
         *
         * @param {Object} root - The primary navigation element corresponding to 
         * the secondary navigational elements whose view is to be created.
         * 
         * @return The created view, or null if the primary navigation element has
         * no children.
         */
        function createSecondaryNavView(root) {
            var secondaryNavView = null,
                children = root.get("children");

            if (children) {
                var collection = new NavModel.NavigationElementCollection(children);
                root.treeNodeDeselect();

                secondaryNavView = new SecondaryNavView({
                    collection: collection
                });
            }  

            return secondaryNavView;  
        }

        /**
         * Display a secondary navigation view
         *
         * @param {Object} view - The view to be displayed
         */
        function displaySecondaryNavView(view) {
            Slipstream.secondaryNavRegion.reset();
            Slipstream.secondaryNavRegion.show(view);
        }

        /**
         * Get the set of defined navigation elements.  A defined path is one that
         * is contributed by a plugin.
         * 
         * @param {Array<Object>} paths - The trees representing the navigation paths
         * to be traversed in the search for defined elements.
         *
         * @param {Object} parent - The nearest common parent of the given paths.
         *
         * @returns The set of trees representing defined navigation paths.
         */
        function getNavElements(paths, parent, tree) {
        	// only return those elements that have been defined by a discovered navigation path
            var nodes = [], leaves = [];

            if (paths && paths.length) {
                for (var i = 0; i < paths.length; i++) {
                    if (paths[i].defined && isNavElementAccessible(paths[i])) {
                        var navElement;

                        if (parent) {
                           navElement = new NavModel.SecondaryNavigationElement(_.extend(paths[i], {tree : tree}));
                        }
                        else {
                            navElement = new NavModel.PrimaryNavigationElement(paths[i]);
                            tree = navElement;
                        }

                        navElement.set("parent", parent);
                        
                        if (paths[i].children) {
                            navElement.set("isParent", true);

                            var children = getNavElements(paths[i].children, navElement, tree);
                            var leaves = []
                            for (var j = 0; j < children.length; j++) {
                                if (!children[j].get("children")) {
                                    leaves.push(children[j]);
                                }
                                else {
                                    leaves = leaves.concat(children[j].get("leaves"));
                                }
                            }
                            if (leaves.length) {
                                navElement.set("leaves", leaves);
                            }
                            
                            navElement.set("children", children.length ? children : null);
                        }

                        if (!navElement.get("isParent") || (navElement.get("isParent") && (navElement.get("intent") || navElement.get("children")))) {
                            nodes.push(navElement);
                        }
                    }
                }
            }

            return nodes;
        }

        /**
         * Render the navigation elements
         */
        function renderNavigation(nav_elements) {
            // Create the primary navigation collection and mix in its single-select model
            function isNavElementDisplayable(elem) {
                return (elem.get("intent") || elem.get("children"));
            }

            primaryNavigation = new NavModel.NavigationElementCollection(nav_elements.filter(isNavElementDisplayable));
            var singleSelect = new Picky.SingleSelect(primaryNavigation);
            _.extend(primaryNavigation, singleSelect);

            var primaryNavView = new PrimaryNavView({
                collection: primaryNavigation
            });

            Slipstream.primaryNavRegion.show(primaryNavView); 

            Slipstream.commands.setHandler("nav:selectDefault", function() {
                // var ui_preferences = Slipstream.reqres.request("ui:preferences:get");
      
                //if (!ui_preferences.nav.url) {
                    /**
                     * If we're at the root URL, then select the default navigation element,
                     * if one exists. 
                     */
                    if (window.location.pathname == "/") {
                        // Find the default primary nav element, if there is one, and select it.
                        var defaultPrimaryNavView = primaryNavView.children.find(function(element) {
                            return element.model.get("default");
                        });

                        if (defaultPrimaryNavView) {
                            defaultPrimaryNavView.$el.click();
                        }
                    }
                //}
            });
        }

        /**
         * Map a set of navigation path elements that match 
         * a path in the given set of nodes.  Each element in the
         * supplied navigation path will be compared to an element
         * at the corresponding depth in the given set of tree nodes.
         * This comparison will use the supplied cmp_fn.  If the
         * cmp_fn returns 'true', the map_fn will be applied to the
         * tree node.  
         *
         * @param {Object} nav  - The navigation path to be mapped.
         *
         * @param {Array} nodes - A tree of nodes representing a set of
         * possible navigation paths.
         *
         * @param {Function} cmp_fn - A comparison function used to 
         * compare path elements to nodes in the tree.
         *
         * @param {Function} map_fn - A function to be applied to all
         * nodes along the supplied navigation path.
         * 
         * @returns {Object} If all path elements
         * match a path in the tree then an array of the matched nodes
         * is returned.  Otherwise null is returned.
         * 
         */
        function map_nav(nav, nodes, cmp_fn, map_fn) {
            // helper function for getting an object's property value
            function get(object, prop) {
                var propVal = null;
                if (object.hasOwnProperty(prop)) {
                    propVal = object[prop];
                }
                else if (typeof object["get"] == "function") {
                    propVal = object.get(prop);
                }
                return propVal;
            }

            var path_fragments = nav.path.split('/'),
                last_matched_node = null,
                matched_nodes = [],
                parent = null;

            /*
             * Walk the list of path fragments and compare each to 
             * the corresponding node in the supplied tree.
             */
            for (var i = 0; i < path_fragments.length; i++) {
                if (!nodes) {
                    break;    
                }

                var num_children = nodes.length;

                for (var j = 0; j < num_children; j++) {
                    if (cmp_fn(path_fragments[i], nodes[j])) {
                        last_matched_node = nodes[j];
                        matched_nodes.push(last_matched_node);
                        if (map_fn) {
                            map_fn(last_matched_node, parent);
                        }
                        parent = last_matched_node;
                        nodes = get(last_matched_node, "children");
                        break;
                     }
                 }

                // We didn't find the path fragment in the current set of nodes
                if (j == num_children) {
                    break;  
                }
            }

            // all path fragments matched against the schema
            if (i == path_fragments.length) {
                return matched_nodes;
            }

            return null;
        }

        /**
         * Process a discovered navigation element
         *
         * @param {Object} nav - The discovered navigation element
         * @param {Object} filterInfo - The navigation element's associated filter information
         */
        function process_nav_element(nav, filterInfo) {
            var cmp_fn = function(path_element, node) {
                return path_element == node.name;
            };

            var map_fn = function(node, parent) {
                node.defined = true;
                node.parent = parent;
            };

            var nodes = map_nav(nav, schema, cmp_fn, map_fn);

            if (nodes) {
                var filter = filterInfo.filter;

                if (filter) {
                    var leaf_node = nodes[nodes.length-1];
                    leaf_node.intent = new Slipstream.SDK.Intent(filter.action, filter.data); 
                    leaf_node.capabilities = filterInfo.activity.capabilities;
                }  
            }
            else {
                console.log("Invalid navigation path", nav.path, " specified.  Path ignored.");    
            }
        }

        /**
         * Check that the nav element is accessible given the current user's capabilities
         *
         * @param {Object} navElement - The nav element whose capabilities are to be checked.
         */
        function isNavElementAccessible(navElement) {
            var requiredCapabilities = navElement.capabilities;

             // if no capabilities defined, then access is unrestricted.
             if (!requiredCapabilities) {
                return true;
             }

             return Utils.userHasCapabilities(requiredCapabilities);
        }

        Navigation.on("start", function() {
            // Load the navigation schema's nls bundle
            Slipstream.execute("nls:loadBundle", {
                ctx_name: nls_context,
                ctx_root: '/assets/js/conf/navigation'
            });

            // Get the navigation elements from the schema
            roots = getNavElements(schema);

            // Render the navigational elements
            renderNavigation(roots);
        });
    });

    return Slipstream.Navigation;
});