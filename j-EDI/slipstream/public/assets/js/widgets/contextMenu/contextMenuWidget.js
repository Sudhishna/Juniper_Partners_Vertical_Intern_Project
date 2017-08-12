/**
 * A module that builds a Context Menu widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the list of label/values that should be showed in the Context Menu.
 *
 * @module ContextMenuWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery.contextMenu'
],  /** @lends ContextMenuWidget */
    function(contextMenu) {

    /**
     * ContextMenuWidget constructor
     *
     * @constructor
     * @class ContextMenuWidget - Builds a Context Menu widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the items that should be showed in the Context Menu, callback and auto hide options.
     * dynamic: defines if the DOM footprint of the context menu should be destroyed after the menu is hidden
     * @returns {Object} Current ContextMenuWidget's object: this
     */
    var ContextMenuWidget = function(conf){

        /** 
         * Builds the Context Menu widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            var contextMenuConfiguration =  {selector: conf.container};
            conf.trigger && (contextMenuConfiguration.trigger = conf.trigger);            
            contextMenuConfiguration.zIndex = conf.zIndex || 200;

            var contextMenuElements = formatConfiguration(conf);
            if (conf.dynamic) {
                contextMenuConfiguration.build = function($trigger, e){
                    conf.position && (this.position = conf.position);
                    conf.context && (this.context = conf.context);
                    // conf.autoHide && (this.autoHide = conf.autoHide);
                    return contextMenuElements;
                }
            } else {
                contextMenuConfiguration =  _.extend(contextMenuConfiguration, contextMenuElements);
                conf.position && (contextMenuConfiguration.position = conf.position);
                conf.context && (contextMenuConfiguration.context = conf.context);
            }
            $.contextMenu(contextMenuConfiguration);

            return this;
        };

        /**
         * Reformat the configuration parameters from the Context Menu widget configuration to parameters that the third party context menu library (contextMenu) can use.
         * @param {Object} context - ContextMenu's configuration for the elements section
         * @returns {Object} Reformatted Tooltip elements parameter
         */
        var formatConfiguration =  function (conf) {
            var contextMenuConfiguration = $.extend( true, {}, conf.elements),
                confItems = conf.elements.items,
                confItem, confItemItem, item;
            contextMenuConfiguration['items']={};
            for (var i=0; i<confItems.length; i++){
                confItem=confItems[i];
                getItemMenuConfiguration(confItem,contextMenuConfiguration);
                if (confItem.items){
                    confItemItem = confItem.items;
                    contextMenuConfiguration.items[confItem.key].items={};
                    for (var j=0; j<confItemItem.length; j++){
                        getItemMenuConfiguration(confItemItem[j],contextMenuConfiguration.items[confItem.key]);
                    }
                }
            }
            if (conf.autoHide) {
                if (contextMenuConfiguration.events){
                    var confShowEvent =  contextMenuConfiguration.events.show;
                    var confHideEvent =  contextMenuConfiguration.events.hide;

                }
                else {
                    contextMenuConfiguration.events = {};
                }
                contextMenuConfiguration.events.show = function(opt){
                    bindMenuAutoHide(opt);
                    (typeof(confShowEvent) === 'function' ) && confShowEvent.call(this,opt);
                };
                contextMenuConfiguration.events.hide = function(opt){
                    unbindMenuAutoHide(opt);
                    (typeof(confHideEvent) === 'function' ) && confHideEvent.call(this,opt);
                }

            }            
            return contextMenuConfiguration;
        };

        /**
         * Reformat the item element of Context Menu widget to a format that the third party context menu library (contextMenu) can use.
         * @param {Object} itemConfiguration - configuration of the item
         * @param {Object} contextMenuConfiguration - ContextMenu's configuration for the elements section
         */
        var getItemMenuConfiguration  = function (itemConfiguration, contextMenuConfiguration){
            var itemMenuConfiguration, itemKey;
            if (itemConfiguration.separator){
                contextMenuConfiguration['items'][_.uniqueId("context_menu_separator")]='';
            } else if (itemConfiguration.title){
                itemKey = _.uniqueId("context_menu_title");
                itemMenuConfiguration = {
                    "name": itemConfiguration.title,
                    "type": "text",
                    "className": itemConfiguration.className ? "contextMenuTitle " + itemConfiguration.className : "contextMenuTitle"
                };
                contextMenuConfiguration.items[itemKey] = itemMenuConfiguration
            } else if (itemConfiguration.key){
                itemMenuConfiguration = _.extend({},itemConfiguration);
                itemKey = itemMenuConfiguration.key;
                contextMenuConfiguration.items[itemKey] = {"name": itemMenuConfiguration.label};
                delete itemMenuConfiguration.key;
                delete itemMenuConfiguration.label;
                if(itemMenuConfiguration.groupId){
                    itemMenuConfiguration.radio = itemMenuConfiguration.groupId;
                    delete itemMenuConfiguration.groupId;
                }
                _.extend(contextMenuConfiguration.items[itemKey],itemMenuConfiguration);
            }
        };

        /**
         * Bind autohide behavior to context menus that have autoHide option set to true in the configuration
         * @param  {object} opt - object passed by jQuery Context Menu library on show event         
         */
        var bindMenuAutoHide = function(opt) {
            var $menuTriggerElement = opt.$trigger;
            var menuTriggerCurrentOffset = $menuTriggerElement.offset();
            var $contextMenuElem = opt.$menu;
            var contextMenuElemOffset = $contextMenuElem.offset();            
            var outOfBounds = false;
            var contextMenuElemWidth = $contextMenuElem.outerWidth();
            var bounds = {
               leftBound: menuTriggerCurrentOffset.left,
               rightBound: menuTriggerCurrentOffset.left + (($menuTriggerElement.outerWidth() > $contextMenuElem.outerWidth()) ? $menuTriggerElement.outerWidth() : $contextMenuElem.outerWidth()),
               topBound: menuTriggerCurrentOffset.top,
               bottomBound: menuTriggerCurrentOffset.top + $menuTriggerElement.outerHeight() + $contextMenuElem.outerHeight()
            };
            $(document.body).on('mousemove.columnFilter.autoHide', function (evt) {
                // Check horizontal bounds
                if (evt.pageX < bounds.leftBound || evt.pageX > bounds.rightBound) {
                    outOfBounds = true;
                }
                // Check vertical bounds
                else if (evt.pageY < bounds.topBound || evt.pageY > bounds.bottomBound) {
                    outOfBounds = true;
                }
                if (outOfBounds) {                    
                    setTimeout(function(){
                        (opt.$menu) && opt.$menu.trigger("contextmenu:hide");
                    }, 700);
                }
            });
        };

        var unbindMenuAutoHide = function(opt) {
            $(document.body).off('mousemove.columnFilter.autoHide');
        };

        /**
         * Set values for input elements. It could be used to import states from data store.
         * @param {Object} opt - it is a reference to the options object passed at contextMenu registration
         * @param {Object} data - data to be set
         * @returns {Object} Current Context Menu object
         */
        this.setInputValues =  function (opt, data) {
            $.contextMenu.setInputValues(opt, data);
            return this;
        };

        /**
         * Fetch values for input elements. It could be used to export states from data store.
         * @param {Object} opt - it is a reference to the options object passed at contextMenu registration
         * @param {Object} data - data to be set
         * @returns {Object} Current Context Menu object
         */
        this.getInputValues =  function (opt, data) {
            $.contextMenu.getInputValues(opt, data);
            return this;
        };

        /**
         * Allows to open the context menu programmatically
         * @returns {Object} Current Context Menu object
         */
        this.open =  function (pos) {
            $(conf.container).contextMenu(pos);
            return this;
        };

        /**
         * Destroys all elements created by the Context Menu widget in the specified container
         * @returns {Object} Current Context Menu object
         */
        this.destroy =  function () {
            $.contextMenu('destroy', conf.container );
            return this;
        };
    };

    return ContextMenuWidget;
});