/**
 * A module that builds a Tooltip widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the elements that need tooltip.
 *
 * @module TooltipWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery.tooltipster'
],  /** @lends TooltipWidget */
    function(tooltipster) {

    /**
     * TooltipWidget constructor
     *
     * @constructor
     * @class TooltipWidget - Builds a Tooltip widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the parameters required by the tooltip.
     * view: define the view rendered by the tooltip.
     * @returns {Object} Current TooltipWidget's object: this
     */
    var TooltipWidget = function(conf){

        this.conf = {
            container: $(conf.container),
            elements: conf.elements,
            view: conf.view
        };

        var tooltipConfiguration;

        /** 
         * Builds the Tooltip widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            tooltipConfiguration = getTooltipConfiguration(this);
            tooltipConfiguration.container.tooltipster(tooltipConfiguration.parameters);
            return this;
        };

        /**
         * Refresh a tooltip content by destroying any instance of it and adding a new tooltip
         */
        this.refresh = function (){
            if (typeof(tooltipConfiguration)=='undefined'){
                this.build();
            } else {
                tooltipConfiguration.container.tooltipster('destroy');
                tooltipConfiguration.container.tooltipster(tooltipConfiguration.parameters);
            }
        };

        /**
         * Reformat the configuration parameters for the Tooltip widget to parameters that the third party tooltip library (Tooltipster) can use.
         * @param {Object} context - Current TooltipWidget's object: this
         */
        var getTooltipConfiguration = function (context){
            var tooltipConfiguration = {};

            tooltipConfiguration.parameters = conf.elements? {
                theme: 'tooltipster-shadow ' + conf.elements.style,
                minWidth: conf.elements.minWidth,
                maxWidth: conf.elements.maxWidth ? conf.elements.maxWidth : '500', //UX visual specs asks for a max of 500px width
                position: conf.elements.position,
                offsetX: conf.elements.offsetX,
                offsetY: conf.elements.offsetY,
                functionInit: conf.elements.functionInit,
                functionBefore: conf.elements.functionBefore,
                functionReady: conf.elements.functionReady,
                updateAnimation: conf.elements.animation,
                contentCloning: conf.elements.contentCloning,
                delay: conf.elements.delay
            }:{
                theme: 'tooltipster-shadow',
                contentAsHTML: true,
                maxWidth: '500'
            };
            if (conf.view){
                var contentview = (typeof(conf.view) == 'string')? $.parseHTML(conf.view): conf.view;
                tooltipConfiguration.parameters = _.extend(tooltipConfiguration.parameters, {
                    content: $(contentview),
                    interactive: true,
                    maxWidth: '630'
                });
                tooltipConfiguration.container = context.conf.container;
            } else {
                if (conf.elements) {
                    tooltipConfiguration.parameters = _.extend(tooltipConfiguration.parameters, {
                        contentAsHTML: conf.elements.contentAsHTML,
                        interactive: true
                    });
                }
                tooltipConfiguration.container = context.conf.container.find('.tooltip');
            }
            return tooltipConfiguration;
        };

        /**
         * Destroys all elements created by the Tooltip widget in the specified container
         * @returns {Object} Current Tooltip object
         */
        this.destroy =  function () {
            tooltipConfiguration.container.tooltipster('destroy');
            if (conf.view) tooltipConfiguration.container.removeAttr( "title" ); //restore original container by removing title attribute
            return this;
        };
    };

    return TooltipWidget;
});