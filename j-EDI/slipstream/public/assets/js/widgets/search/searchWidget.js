/**
 * A module that builds a Search widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the list of label/values that should be showed in the search auto complete menu.
 *
 * @module SearchWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'tagit',
    'text!widgets/search/templates/searchContainer.html',
    'lib/template_renderer/template_renderer'
],  /** @lends SearchWidget */
    function(tagit, searchTemplate, render_template) {

    /**
     * SearchWidget constructor
     *
     * @constructor
     * @class SearchWidget - Builds a Search widget from a configuration object.
     *
     * @param {Object} conf - It requires the container parameter. The rest of the parameters are optional.
     * container: defines the container where the widget will be rendered
     * readOnly: defines if the token area will be shown as a read only container. The filter and logic menus won't be available.
     * filterMenu: defines the filter context menu that will be shown on the token area. It is used to select the key and value of a token.
     * logicMenu: defines the logic context menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens.
     * afterTagAdded: callback function invoked after a tag is added.
     * afterTagRemoved: callback function invoked after a tag is removed.
     *
     * @returns {Object} Current SearchWidget's object: this
     */
    var SearchWidget = function(conf){

        var containers = {
                '$searchContainer': $(conf.container)
            },
            errorMessages = {
                'noContainer': 'The container property required to build the Search widget is missing'
            },
            self = this;

        /** 
         * Builds the Search widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            containers.$searchContainer.append(render_template(searchTemplate,{
                'readOnly': conf.readOnly
            }));
            containers.$tokensContainer = containers.$searchContainer.find('.search-widget');

            containers.$tokensContainer.tagit({
                source: conf.filterMenu,
                logicSource: conf.logicMenu,
                singleField: true,
                singleFieldDelimiter: '&',
                //allowDuplicates:true,
                showAutocompleteOnFocus:true,
                allowSpaces: true,
                tagDelimiter: 187, //keyCode of 'equal' is 187,
                readOnly: conf.readOnly,
                afterTagAdded: conf.afterTagAdded
            });

            registerActionEventsHandlers();
            return this;
        };

        /**
         * Adds events handlers that listens when a user clicks on the filterMenu icon, the remove token icon and the remove all token button
         * @inner
         */
        var registerActionEventsHandlers = function () {
            if (!conf.readOnly) {
                containers.$searchContainer.find('.filterMenu').off('click.fndtn.filterMenu').on('click.fndtn.filterMenu', function (e) {
                    containers.$tokensContainer.tagit('showAutocomplete');
                });
            }
            containers.$searchContainer.find('.removeAllTokens').off('click.fndtn.removeAllTokens').on('click.fndtn.removeAllTokens', function (e) {
                self.removeAllTokens();
                if (conf.afterAllTagRemoved){
                    conf.afterAllTagRemoved();
                } else if (conf.afterTagRemoved) {
                    conf.afterTagRemoved();
                }
            });
            containers.$searchContainer.find('.tokens').off('click.fndtn.removeToken').on('click.fndtn.removeToken', '.tagit-close', function (e) {
               var removedToken = $(this.closest('.tag-it-close-span')).prev().text(); //tag-it library should provide this value
                conf.afterTagRemoved && conf.afterTagRemoved(removedToken);
            });
        };

        /**
         * Adds new token to the token area
         * @param {Array/String} tokens - token or tokens that will be added to the token container
         */
        this.addTokens = function (tokens) {
            if (containers.$tokensContainer) {
                if (!conf.readOnly) {
                    containers.$tokensContainer.tagit("createAdvanceTokens",tokens);
                }else{
                    containers.$tokensContainer.tagit("createToken",tokens);
                }
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Removes a token from the available token list. When the key is provided, and there is more of one value assigned to the key, then only the token value will be removed from the token. When the key is available but not token value, then the token that matches the key will be removed.
         * @param {string} token - value of the token to be removed, if not key is provided, the value represents all the token
         * @param {string} key - key of the token to be removed, if the key has multiple values, then only the matching value from the token parameter will be removed. If the token parameter is not available, then the token that matches the key will be removed, including all possible values.
         */
        this.removeToken = function (token, key) {
            if (containers.$tokensContainer) {
                var allTokens = self.getAllTokens(),
                    tokensFound;

                if (key){
                    if(token && ~token.indexOf(' = ')){ //removes the value that match the token with some key
                        var tokenKeyValue = token.split(' = ');
                        var tokenKey = tokenKeyValue[0];
                        var tokenValue = tokenKeyValue[1];
                        allTokens.filter(function(allToken){
                            if(~allToken.indexOf(' = ')){
                                var keyValue = allToken.split(' = ');
                                var values, newValues;
                                if (keyValue[0] == key){
                                    values = keyValue[1].split(', ');

                                    if (values.length >1){
                                        newValues = [];
                                        values.forEach(function(value){
                                            if (value != tokenValue){
                                                newValues.push(value);
                                            }
                                        });
                                        if(newValues.length){
                                            containers.$tokensContainer.tagit('removeTagByLabel',allToken);
                                            self.addTokens(key + ' = ' + newValues.join(', '));
                                        }
                                    } else {
                                        containers.$tokensContainer.tagit('removeTagByLabel',allToken);
                                    }

                                }
                            }
                        });
                    } else {
                        allTokens.filter(function(allToken){
                           if (allToken.indexOf(key) == 0){ //token starts with the key
                               containers.$tokensContainer.tagit('removeTagByLabel',allToken);
                           }
                        });
                    }
                } else { //removes the tokens that match a token + ' =' (composed key) or a value without key
                    tokensFound = allTokens.filter(function(value){
                        if(value.indexOf(token.trim()+' =') === 0 || value === token){
                            return true;
                        } else {
                            return false;
                        }
                    });
                    tokensFound.forEach(function(tokenFound){
                        containers.$tokensContainer.tagit('removeTagByLabel',tokenFound);
                    });
                }
                return tokensFound;
            }  else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Clears the widget of all tags — removes each tag it contains.
         */
        this.removeAllTokens = function () {
          if (containers.$tokensContainer) {
              containers.$tokensContainer.tagit('removeAll');
          }  else {
              throw new Error(errorMessages.noContainer);
          }
        };

        /**
         * Gets all available tokens from the token container.
         */
        this.getAllTokens = function () {
            if (containers.$tokensContainer) {
                return containers.$tokensContainer.tagit('assignedTagsWithKeys');
            }  else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Gets all available tokens from the token container including the logic operator.
         */
        this.getAdvancedSearchTokens = function () {
            if (containers.$tokensContainer) {
                var tokens = containers.$tokensContainer.tagit('assignedTags'),
                    advancedTokens = [],
                    logicOperator = "AND", //ToDo: dynamic value when the logic menu is enabled
                    tokensLength = tokens.length;
                for (var i=0; i< tokensLength; i++){
                    advancedTokens.push(tokens[i]);
                    if(i != tokensLength - 1)
                        advancedTokens.push(logicOperator);
                }
                return advancedTokens;
            }  else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Destroys all elements created by the Search widget in the specified container
         * @returns {Object} Current Search object
         */
        this.destroy =  function () {
            if (containers.$tokensContainer) {
                containers.$tokensContainer.tagit('destroy');
            }  else {
                throw new Error(errorMessages.noContainer);
            }
            return this;
        };
    };

    return SearchWidget;
});