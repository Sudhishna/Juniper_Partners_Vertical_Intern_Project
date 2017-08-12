/**
 * A library that groups templates used by the Tab Container widget
 *
 * @module TabTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'text!widgets/tabContainer/templates/tabContainer.html',
    'text!widgets/tabContainer/templates/tabLink.html',
    'text!widgets/tabContainer/templates/contentContainer.html',
    'text!widgets/tabContainer/templates/errorImage.html',
    'text!widgets/tabContainer/templates/navigationIcon.html',
    'text!widgets/tabContainer/templates/navigationEnd.html'
], /** @lends TabTemplates */
    function(tabContainer,
             tabLink,
             contentContainer,
             errorImage,
             navigationIcon,
             navigationEnd
             ){

    /*
     * TabTemplates constructor
     *
     * @constructor
     * @class TabTemplates
     */
    var TabTemplates = function () {

        /**
         * Provides partial templates used by the tabContainer widget to create elements of the tabs.
         */
          this.getTemplates = function () {
              return {
                  "tabContainer":tabContainer,
                  "tabLink":tabLink,
                  "contentContainer":contentContainer,
                  "errorImage":errorImage,
                  "navigationIcon":navigationIcon,
                  "navigationEnd":navigationEnd
              }
          }
    };

    return TabTemplates;
});
