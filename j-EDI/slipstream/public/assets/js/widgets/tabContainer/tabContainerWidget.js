/**
 * A module that builds a tab container widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: jQuery UI Tabs.
 *
 * @module TabContainerWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jqueryTabs',
    'jqueryVerticalTabs',
    'widgets/tabContainer/lib/tabTemplates',
    'lib/template_renderer/template_renderer'
],  /** @lends TabContainerWidget*/
    function(tabs, verticalTabs, TabTemplates, render_template) {

    var TabContainerWidget= function(conf){
        /**
         * TabContainerWidget constructor
         *
         * @constructor
         * @class TabContainerWidget- Builds a tab container widget from a configuration object.
         * @param {Object} conf - It requires the following parameters:
         * container: define the container where the widget will be rendered
         * tabs: define the name and the content that will be showed in the tab container. It should be an array with objects that have the following parameters:
         * - id: id of the tab and represented by a string primitive data type. The id should be unique in the page.
         * - name: name of the tab and represented by a string primitive data type.
         * - content: content of the tab and represented by a Slipstream view object data type.
         * - isDefault: tab that will be showed by default when the tab is rendered and represented by a boolean data type. If it is set to true if it will indicate the default. If it is absent or all isDefault parameters are set to false, then the first tab will be the default tab.
         * orientation: String that defines the layout of the tab. If it is set to "vertical", the tabs will be displayed vertically. If it is absent, or if it is set to "horizontal", the tabs will be displayed horizontally..
         * rightAlignment: Boolean that defines the default alignment of the tabs. If it is set to "true", tabs will be aligned on right. If it is absent, or set to false, the tabs will be aligned towards left.
         * height: defines the height of the container that holds the tab content. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it absent, the height of the tab will be calculated independently and will be long enough to hold the content of each of them.
         * toggle: Boolean that defines the tab container as a set of toggle buttons
         *  submit: defines the button that will be used to retrieve the data holded by each of the tabs. It includes the parameters:
         * - id: id of the button
         * - name: name of the button
         * - value: label of the button
         * @returns {Object} Current TabContainerWidget's object: this
         */

        var $container = $(conf.container),
            templates = new TabTemplates().getTemplates(),
            defaultTab = 0,
            errorMessages = {
                'noTab': 'The Tab Container widget has not been built',
                'containTab': 'The Tab Container widget must contain at least 1 tab',
                'duplicateID': 'The ID is duplicated'
            },
            tabCreated = true,
            tabsObj,
            tabsArr = _.clone(conf.tabs),
            tabIdentifierPrefix = 'tabContainer-widget_tabLink_';

        /**
         * Builds the TabContainer widget in the specified container
         * @returns {Object} "this" of the DropDownWidget
         */
        this.build =  function () {
            $container.addClass('tabContainer-widget');
            if (conf.toggle) {
                $container.addClass('tabContainer-toggle');
            } else if (conf.navigation) {
                $container.addClass('tabContainer-navigation');
                conf.orientation = 'horizontal';
            }
            conf.rightAlignment && $container.addClass('ui-tabs-float-right');

            var submit = conf.submit ? {
                submit: conf.submit,
                id: conf.submit.id,
                name: conf.submit.name,
                value: conf.submit.value
            } : {};
            $container.append(render_template(templates.tabContainer,submit));
            $container = $container.find('.tabContainer-widget_allTabs');

            $container.on( "tabscreate", function() {
                tabCreated = true;
            });

            // Set up the tab library holder and generic parameters
            $container.tabs({
                heightStyle: getHeight(),
                orientation: conf.orientation=='vertical'? "vertical": "horizontal"
            });
            tabsObj = addTabs();
            // Set up the tab library with function callback when a tab is clicked
            $container.tabs({
                active: defaultTab,
                activate: function (event, ui) {
                    var hasContent = ui.newPanel.text() ? true : false;
                    if (!hasContent){
                        var tabId = ui.newPanel.attr('id');
                        var tab = tabsObj[tabId];
                        ui.newPanel.append(tab.content.render().el);
                    }
                    var currentTab = $container.tabs("option", "active" );
                    switchTab(currentTab);
                    if (tabId){
                        var activeTabObj = {
                            id: currentTab,
                            tabView: tabsObj[tabId].content
                        };
                        if (conf.actionEvents && conf.actionEvents.tabClickEvent) {
                            triggerActionEvent(conf.actionEvents.tabClickEvent, activeTabObj);
                        }
                    }
                }
            });

            conf.navigation && appendNavigationContainers();

            return this;
        };

        /* Defines a Tab class */
        var Tab = function(tab){
            this.id = tab.id;
            this.name = tab.name;
            this.content = tab.content;
        };

        /* Iterates through the tabs array configuration and sets the default tab */
        var addTabs = function(){
            var tabs = {};

            for(var i=0; i<conf.tabs.length; i++){
                var tab = conf.tabs[i];
                var tabIdentifier = tabIdentifierPrefix+tab.id;
                tabs[tabIdentifier] = new Tab(tab);
                if (tab.isDefault)
                    defaultTab = i;
                addTab(tab);
            }
            addDefaultContentView(tabs, tabIdentifierPrefix+conf.tabs[defaultTab].id);
            return tabs;
        };

        /* Triggers the event for Tab Container */
        var triggerActionEvent = function (event, defaultObj){
            $container.trigger(event,defaultObj);
        };

        /* adds a tab by adding the tab link and the actual content */
        var addTab = function(tab){
            $container.append(render_template(templates.contentContainer,{id: tab.id}));
            $container.find(".tabContainer-widget_tabLink").append(render_template(templates.tabLink,{
                    id: tab.id,
                    name: tab.name
                }));
            $container.tabs("refresh");
        };

        /* adds the content view to the default tab container */
        var addDefaultContentView = function(tabs, tabIdentifier){
            var tab = tabs[tabIdentifier];
            $container
                .find("#" + tabIdentifier)
                .append(tab.content.render().el);
        };

        /*gets the height for the tab container which is the one that will have the view of the tab rendered */
        var getHeight = function(){
            var height = "auto";
            if (conf.height){
                $container.height(conf.height);
                height = "fill";
            }
            return height;
        };

        /**
          *  Adds error indication image on the tab if there is an error.
          *  @param {Object} currentTab - It requires the active tab
          */
        var  switchTab = function(currentTab) {
            if (tabCreated) {
            var length = conf.tabs.length; //Get total number of tabs
            var arrayOfTabs = conf.tabs;  //Declare an array of all tabs
            var ulClass = $container.find('.ui-tabs-nav');   //Get the ul class which contains all tabs
            for(var index=0; index<length; index++) {
                    var tabNumber = index + 1;
                    var liClass = ulClass.find("[aria-controls=tabContainer-widget_tabLink_"+arrayOfTabs[index].id+"]");    //Get the <li> element of the current tab, to add error image
                    var errorClass = liClass.find('.ui-tabs-anchor');
                    var errorIconSpan = liClass.find('.errorIcon');
                    if(index==currentTab) { //--------For Active Tab-------------
                        if(errorIconSpan.length>0) {   //Remove the error image for active tab
                            errorIconSpan.remove();
                        }
                    }  else {  //-------For other tabs------------
                        var view = arrayOfTabs[index].content;
                        if (view && !_.isEmpty(view.el.children) && view.isValidTabInput){
                        try{
                            if(!view.isValidTabInput() && errorIconSpan.length==0){
                                errorClass.append(render_template(templates.errorImage));  //Error image which has to be included on the tab
                            }
                        } catch(e) {
                            console.log(e);
                        }
                      }
                    }
                }

            } else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Append elements required for the navigation mode of the tab container widget
         * @inner
         */
        var appendNavigationContainers = function () {
            var $tabsTitleContainer = $container.find('>.ui-tabs-nav');
            $tabsTitleContainer.append(render_template(templates.navigationEnd));
            $tabsTitleContainer.find('.ui-tabs-anchor').after(render_template(templates.navigationIcon))
        };

        /**
         * Add a new tab dynamically
         * @param {Object/Array} tab - tab configuration
         */
        this.addTab = function (tabs) {
            if (tabs) {
                var addTabFun = function(tab){
                    if (!tabsObj[tabIdentifierPrefix+tab.id]){
                        addTab(tab);
                        tabsObj[tabIdentifierPrefix+tab.id] = tab;
                        tabsArr.push(tab);
                    }else{
                        throw new Error(errorMessages.duplicateID);
                    }
                };

                if ($.isArray(tabs)){
                    $.each(tabs, function(key, val){
                        addTabFun(val);
                    })
                }else{
                    addTabFun(tabs);
                }
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Remove an existing tab dynamically
         * @param {String/Array} id - the tab id in the configuration
         */
        this.removeTab = function (ids) {
            if (ids) {
                var removeTabFun = function(id){
                    if (tabsArr.length > 1){
                        var tabId = tabIdentifierPrefix+id,
                            ulClass = $container.find('.ui-tabs-nav'),
                            liClass = ulClass.find("[aria-controls="+tabId+"]");

                        if (liClass.length > 0){
                            liClass.remove();
                            $container.find("#" + tabId).remove();
                            for (var i=0; i<tabsArr.length; i++){
                                if (tabsArr[i].id == id){
                                    tabsArr.splice(i, 1);
                                    break;
                                }
                            }
                            delete tabsObj[tabId];
                            $container.tabs("refresh");
                        }
                    } else {
                        throw new Error(errorMessages.containTab);
                    }
                };

                if ($.isArray(ids)){
                    $.each(ids, function(key, val){
                        removeTabFun(val);
                    })
                }else{
                    removeTabFun(ids);
                }
            } else {
                throw new Error(errorMessages.containTab);
            }
        };

        /**
         * Gets the data that each tab has collected from the user input. The data is collected by calling the getViewData from each view in the tabs parameter.
         * @returns {Object} Object will all data collected for each of the views.
         */
        this.getTabsData = function () {
            if (tabCreated) {
                var tabsData = {};
                for(var tab in tabsObj){
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && !_.isEmpty(view.el.children) && view.getViewData){
                        try{
                            var tabData = view.getViewData();
                            tabData && (tabsData[tabObj.id] =  tabData);
                        } catch(e) {
                            console.log(e);
                        }
                    }
                }
                return tabsData;
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Gets the data that each tab has collected from the user input. The data is collected by calling the getViewData from each view in the tabs parameter.
         * The data is collected from all tabs, including the ones not visited
         * @returns {Object} Object will all data collected for each of the views.
         */
        this.getAllTabsData = function () {
            if (tabCreated) {
                var tabsData = {};
                for(var tab in tabsObj){
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && view.getViewData){
                        try{
                            _.isEmpty(view.el.children) && view.render();
                            var tabData = view.getViewData();
                            tabData && (tabsData[tabObj.id] =  tabData);
                        } catch(e) {
                            console.log(e);
                        }
                    }
                }
            }  else {
                throw new Error(errorMessages.noTab);
            }            return tabsData;
        };

        /**
         * Provides the id of the active tab
         * @returns {string} id of the active tab
         */
        this.getActiveTab = function () {
            if (tabCreated) {
                var tabId = $container.tabs("option", "active" );
                return tabsArr[tabId].id;
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Provides the index of the active tab as it is defined in the tabs array parameter
         * @returns {integer} index of the active tab
         */
        this.getActiveTabByIndex = function () {
            if (tabCreated) {
                return $container.tabs("option", "active" );
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Sets the active tab
         * @param {string} id - id of the tabs
         */
        this.setActiveTab = function (id){
            if (tabCreated) {
                for (var i=0; i<tabsArr.length; i++){
                    if (tabsArr[i].id == id){
                        id = i;
                        break;
                    }
                }
                $container.tabs("option", "active" , id);
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

        /**
         * Destroys all elements created by the TabContainer widget in the specified container
         * @returns {Object} Current TabContainer object
         */
        this.destroy =  function () {
            if (tabCreated) {
                $container.tabs( "destroy" );
                $container = $(conf.container);
                $container.find('.tabContainer-widget_allTabs').remove();
                $container.find('.tabContainer-widget_allButtons').remove();
                return this;
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };
        /**
         *  Get all tabs and check if there is any error or not
         */
        this.getValidInput = function(){
            if (tabCreated) {
                var tabsData = {};
                for(var tab in tabsObj){
                    var tabObj = tabsObj[tab];
                    var view = tabObj.content;
                    if (view && !_.isEmpty(view.el.children) && view.isValidTabInput){
                        try{
                            if(!view.isValidTabInput()){
                             this.setActiveTab(tabObj.id);
                             return false;
                            }
                        } catch(e) {
                            console.log(e);
                        }
                    }
                }
                return true;
            }  else {
                throw new Error(errorMessages.noTab);
            }
        };

    };

    return TabContainerWidget;
});
