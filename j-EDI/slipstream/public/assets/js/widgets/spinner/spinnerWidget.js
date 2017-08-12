/**
 * A module that builds a spinner widget using a configuration object.
 * The configuration object includes a container where the widget will be rendered and
 * an element object with the parameters required to build the widget.
 *
 * @module SpinnerWidget
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'progressbar',
    'text!widgets/spinner/templates/determinateSpinner.html',
    'text!widgets/spinner/templates/indeterminateSpinner.html',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
],function(ProgressBar, DeterminateSpinnerTemplate, IndeterminateSpinnerTemplate, render_template, i18n) {

    /**
     * SpinnerWidget constructor
     *
     * @constructor
     * @class SpinnerWidget - Builds a Spinner Widget from a configuration object.
     *
     * @param {Object} conf - It requires one parameter:
     * container: define the container where the widget will be rendered
     * hasPercentRate: <define if the spinner has to show the percentage progress, then the value is true. Default: false.(optional)>
     * status_text: <define the status text.(optional)>
     * 
     * @returns {Object} Current SpinnerWidget's object: this
     */
    var SpinnerWidget = function(conf){

        var self = this,
            $spinnerContainer = $(conf.container),
            spinner,
            defaultColor = '#05A4FF',
            trailColor = "#ccc";

        var errorMessages = {
            'noElements': 'The elements object required to build the Spinner widget is missing',
            'noSpinner': 'the spinner object has not created'
        }

        /**
         * Builds the determinate SpinnerWidget in the specified container
         */
        function determinate(){
            if ($spinnerContainer){
                $spinnerContainer.append($(render_template(DeterminateSpinnerTemplate)));
                
                spinner = new ProgressBar.Circle( $spinnerContainer.find('.spinner')[0], {
                    color: defaultColor,
                    strokeWidth: 14,
                    trailColor: trailColor,
                    text: {
                        value: '0%',
                        className: 'spinner_label spinnerLabel',
                        autoStyle: false
                    }
                });
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }

        /**
         * Builds the indeterminate SpinnerWidget in the specified container
         */
        function indeterminate(){
            if ($spinnerContainer){
                $spinnerContainer.append($(render_template(IndeterminateSpinnerTemplate)));
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }


        /**
         * Builds the SpinnerWidget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            
            (conf.hasPercentRate) ? determinate(): indeterminate();
            (conf.statusText) ? this.setStatusText(conf.statusText): "";
            $spinnerContainer.addClass('parentContainer');
            return this;
        };


        /**
         * Destroys all elements created by the SpinnerWidget in the specified container
         * @returns {Object} Current SpinnerWidget object
         */
        this.destroy =  function () {
            if ($spinnerContainer){
                var $container = (conf.hasPercentRate) ? $spinnerContainer.find('.determinateSpinnerContainer') : $spinnerContainer.find('.indeterminateSpinnerContainer');
                
                spinner && spinner.destroy();

                if ($container){
                    $container.remove();
                }else{
                    throw new Error(errorMessages.noElements);
                }
            }else{
                throw new Error(errorMessages.noSpinner);
            }
            
            return this;
        }

        /**
         * Sets progress instantly without animation.
         * @param Number: how much percent the percetage should display. range from 0.0-1.0
         */
        this.setSpinnerProgress =  function (progress) {
            if (spinner){
                spinner.set(progress);
                spinner.setText(Math.round(progress * 100) + '%');
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }

        /**
         * Hides time remaining.
         */
        this.hideTimeRemaining =  function () {
            if ($spinnerContainer){
                var $timestampContainer = $spinnerContainer.find('.spinnerTimeStamp');
                if ($timestampContainer){
                    $timestampContainer.hide();
                }else{
                    throw new Error(errorMessages.noElements);
                }  
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }

        /**
         * Sets time remaining.
         * @param Millionseconds: how long the file will be loaded completely.
         */
        this.setTimeRemaining =  function (millionseconds) {
            var min = (millionseconds > 1000*60) ? Math.round(millionseconds/1000 * 60)/1000*60 : 0,
                sec = Math.round((millionseconds - min * 1000* 60)/1000);
            if ($spinnerContainer){
                var $timestampContainer = $spinnerContainer.find('.spinnerTimeStamp');
                if ($timestampContainer){
                    $timestampContainer.text(i18n.getMessage('progress_bar_timestamp'), min, sec);
                }else{
                    throw new Error(errorMessages.noElements);
                }   
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }

        /**
         * Sets spinner text.
         * @param String: the text.
         */
        this.setStatusText =  function (text) {
            if ($spinnerContainer){
                $spinnerContainer.find('.spinnerText').text(text);
            }else{
                throw new Error(errorMessages.noSpinner);
            }
        }
    };

    return SpinnerWidget;
});