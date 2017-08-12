/** 
 * A module that implements a view representing the second level navigational
 * elements.
 *
 * @module 
 * @name Slipstream/SecondaryNavigationApp/List/View
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["../models/navModel",
        "text!./templates/secondary/subElement.tpl"],
        /** @lends Navigation.Secondary */ function(NavModel, subElementTpl){
    Slipstream.module("Navigation.Secondary", function(Secondary, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a group of secondary navigational elements
         * @constructor 
         * @class SecondaryNavigationGroupView
         */
        var SecondaryNavigationGroupView = Marionette.CompositeView.extend({
            tagName: "dl",
            className: "accordion",
            attributes: {"data-accordion": ""},
            template: subElementTpl,

            events: {
              "click dd > a:first": "onClick",
              "click dd.parent:first > span.twistie": "onToggleExpand"
            },

            modelEvents: {
                "selected": "renderSelected",
                "deselected": "renderDeselected",
                "expanded": "renderExpanded",
                "collapsed": "renderCollapsed"
            },

            onClick: function(e) {  
                console.log("clicked ", this.model.get("name"));
                e.preventDefault();
                e.stopPropagation();  

                this._onSelect();
            },

            _onSelect: function() {
                var intent = this.model.get("intent");
                var children = this.model.get("children");

                if (children) {
                    this._onSelectCategory();
                }
                else {
                    this._onSelectLeaf();
                }
            },

            _onSelectLeaf: function() {
                this.loadActivity(this.model.get("intent"));
            },

            _onSelectCategory: function() {
                var selected = this.model.selected;
                var intent = this.model.get("intent");

                if (!selected && intent) {
                    this.loadActivity(intent);
                }

                this.toggleExpand();
            },

            onToggleExpand: function(e) {
                 e.stopPropagation();
                 this.toggleExpand();
            },

            toggleExpand: function() {
                this.model.toggleExpand();     
            },

            renderExpanded: function() {
                this.$el.find("dd:first").addClass("expanded");
                this.$el.find(".content:first").addClass("active"); 

                if (this.isChildSelected()) {
                    this.renderDeselected();
                }
            },

            renderCollapsed: function() {
                this.$el.find("dd:first").removeClass("expanded");
                this.$el.find(".content:first").removeClass("active"); 

                if (this.isChildSelected()) {
                    this.renderSelected(true);
                }
            },

            renderSelected: function(soft) {
                var activity_link = this.$el.find("a:first");
                var twistie = this.$el.find("span.twistie:first");
                activity_link.addClass("selected");

                if (soft) { // soft selection
                    activity_link.addClass("soft");
                }

                if (twistie) {
                    twistie.addClass("selected");
                }
            },

            renderDeselected: function() {
                this._showDeselected();

                var self = this;

                /**
                 * This selected node may be nested within a set of collapsed nodes.
                 * When deselecting this node, remove the 'selected' styling from the
                 * parent nodes.
                 */
                this.$el.parents("dd.parent").map(function() {
                    var $parent = $(this);
                    var soft_selection = $parent.find("a:first.soft");

                    if (soft_selection.size() > 0) {
                        self._showDeselected.call($parent);
                    }
                })
            },

            _showDeselected: function() {
                var node = this.$el || this;
                var activity_link = node.find("a:first");
                var twistie = node.find("span.twistie:first");

                activity_link.removeClass("selected").removeClass("soft");
                twistie.removeClass("selected");    
            },

            isChildSelected: function() {
                var isChildSelected = this.$el.find("dl > dd > a.selected");
                return isChildSelected.size() > 0;
            },
            /**
             * Initialize the group of secondary navigational elements
             * @inner
             */
            initialize: function() {
                var children = this.model.get("children");

                if (children) {
                    this.model.set("parent", true);
                }

                this.collection = new NavModel.NavigationElementCollection(children);
            },

            appendHtml: function(collectionView, itemView) {
                collectionView.$("div.content:first").append(itemView.el);

                if (!itemView.model.get("children")) {
                    $(itemView.el).find("a:first").addClass("activity-link");    
                }
            },

            onRender: function() {
                this.$el.find("a:first").addClass("activity-link");

                if (this.model.get("children")) {
                    this.$el.find(">dd").addClass("parent");
                }
            },

            /**
            * Load the activity associated with the navigational element
            * @inner
            */
            loadActivity: function(intent) {
              var self = this;
              if (intent) {
                var doLoadActivity = function() {
                    Slipstream.vent.trigger("activity:start", intent);
                    self.model.select();
                };
                Slipstream.commands.execute('navigation:request',{success: doLoadActivity, fail:function(){}});
              }
            }
        });

        /**
         * Construct a view representing a group of secondary navigational elements
         * @constructor 
         * @class SecondaryNavigation
         */
        Secondary.View = Marionette.CollectionView.extend({
            itemView: SecondaryNavigationGroupView,
            onShow: function() {
                // Force foundation to parse the newly added accordion DOM nodes.
                $(this.el).foundation('accordion').init();
            }
        });
      });

      return Slipstream.Navigation.Secondary.View;
});
