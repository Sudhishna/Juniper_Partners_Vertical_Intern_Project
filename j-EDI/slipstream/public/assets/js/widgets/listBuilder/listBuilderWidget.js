/**
 * A module that builds a double list widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the list of label/values that should be showed in the list builder.
 *
 * @module ListBuilderWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/listBuilder/lib/jquery.bootstrap-duallistbox',
    'lib/i18n/i18n'
],  /** @lends ListBuilderWidget */
    function(BootstrapDualListbox, i18n) {

    /**
     * ListBuilderWidget constructor
     *
     * @constructor
     * @class ListBuilderWidget - Builds a double list widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * list: define the set of value/label that should be showed in the list builder. Example:
     * [{
         "label": "BFD",
         "value": "BFD"
        },
        {
         "label": "BGP",
         "value": "BGP"
       }]
     * @returns {Object} Current ListBuilderWidget's object: this
     */
    var ListBuilderWidget = function(conf){

        this.conf = conf;
        var bootstrapDualListbox;

        /** 
         * Builds the listBuilder widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            bootstrapDualListbox = new BootstrapDualListbox(this.conf.container,{
                jsonList: this.conf.list,
                moveAllLabel: '',
                removeAllLabel: '',
                moveSelectedLabel: '',
                removeSelectedLabel: '',
                filterPlaceHolder: '',
                selectedListLabel: i18n.getMessage('Selected'),
                nonSelectedListLabel: i18n.getMessage('Available'),
                infoTextEnd: i18n.getMessage('items'),
                moveOnSelect: false,
                selectOrMinimalHeight: 130
            });
            return this;
        },

        /**
         * Get the items that were available (first column)
         * @returns {Object} A set of value/label for each of the available items
         */
        this.getAvailableItems = function (){
            var availableItems;
            if (bootstrapDualListbox){
                availableItems = bootstrapDualListbox.getAvailableItems();
            }else{
                console.log('this listbuilder has not been built.');
            }
            return availableItems;
        },

        /**
         * Add elements for the available column (available column)
         * @param {Object} A set of value/label for each of the items that will be added to the available column
         */
        this.addAvailableItems = function (list){
            if (bootstrapDualListbox){
                bootstrapDualListbox.addAvailableItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
        },

        /**
         * Set elements for the available column (available column)
         * @param [Array] A set of value for each of the items that will be moved to the available column from the selected colunm
         */
        this.setAvailableItems = function (list){
            if (bootstrapDualListbox){
                bootstrapDualListbox.setAvailableItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
        },

        /**
         * Remove elements for the available column (available column)
         * @param [Array] A set of value for each of the items that will be removed from the available column
         */
        this.removeAvailableItems = function (list){
            var removeAvailableItems;
            if (bootstrapDualListbox){
                removeAvailableItems = bootstrapDualListbox.removeAvailableItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
            return removeAvailableItems;
        },

        /**
         * Get the items that were selected (second column)
         * @returns {Object} A set of value/label for each of the selected items
         */
        this.getSelectedItems = function (){
            var selectedItems;
            if (bootstrapDualListbox){
                selectedItems = bootstrapDualListbox.getSelectedItems();
            }else{
                console.log('this listbuilder has not been built.');
            }
            return selectedItems;
        },

        /**
         * Add elements for the second column (selected column)
         * @param {Object} A set of value/label for each of the items that will be added to the selected column
         */
        this.addSelectedItems = function (list){
            if (bootstrapDualListbox){
                bootstrapDualListbox.addSelectedItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
        },

        /**
         * Set elements for the second column (selected column)
         * @param [Array] A set of value for each of the items that will be moved to the selected column from the available column
         */
        this.setSelectedItems = function (list){
            if (bootstrapDualListbox){
                bootstrapDualListbox.setSelectedItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
        },

        /**
         * Remove the items that were selected (second column)
         * @returns [Array] A set of value for each of the items that will be removed from the selected column
         */
        this.removeSelectedItems = function (list){
            var removeSelectedItems;
            if (bootstrapDualListbox){
                removeSelectedItems = bootstrapDualListbox.removeSelectedItems(list);
            }else{
                console.log('this listbuilder has not been built.');
            }
                
            return removeSelectedItems;
        },

        /**
         * Destroys all elements created by the listBuilderWidget in the specified container
         * @returns {Object} Current listBuilderWidget object
         */
        this.destroy =  function () {
            this.conf.container.remove();
            return this;
        }


    };

    return ListBuilderWidget;
});