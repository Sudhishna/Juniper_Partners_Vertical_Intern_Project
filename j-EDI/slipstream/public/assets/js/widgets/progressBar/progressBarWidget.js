/**
 * A module that builds a progress bar widget using a configuration object.
 * The configuration object includes a container where the widget will be rendered and
 * an element object with the parameters required to build the widget.
 *
 * @module ProgressBarWidget
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'progressbar',
    'text!widgets/progressBar/templates/determinateProgressBar.html',
    'text!widgets/progressBar/templates/indeterminateProgressBar.html',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], function(ProgressBar, DeterminateProgressBarTemplate, IndeterminateProgressBarTemplate, render_template, i18n) {

    /**
     * ProgressBarWidget constructor
     *
     * @constructor
     * @class ProgressBarWidget - Builds a Progress Bar Widget from a configuration object.
     *
     * @param {Object} conf - It requires one parameter:
     * container: define the container where the widget will be rendered
     * hasPercentRate: <define if the progress bar has to show the percentage progress, then the value is true. Default: false.(optional)>
     * status_text: <define the status text.(optional)>
     * 
     * @returns {Object} Current ProgressBarWidget's object: this
     */
    var ProgressBarWidget = function(conf){

        var self = this,
            $progressBarContainer = $(conf.container),
            progressBar,
            defaultColor = '#05A4FF',
            trailColor = "#ccc";


        var errorMessages = {
            'noElements': 'The elements object required to build the ProgressBar widget is missing',
            'noProgressBar': 'the progress bar object has not created'
        }
        /**
         * Builds the determinate ProgressBarWidget in the specified container
         */
        function determinate(){
            $progressBarContainer.append($(render_template(DeterminateProgressBarTemplate)));
            
            progressBar = new ProgressBar.Line( $progressBarContainer.find('.progressBar')[0], {
                color: defaultColor,
                trailColor: trailColor,
                text: {
                    value: '0%',
                    className: 'progressBarPercentageLabel',
                    autoStyle: false
                }
            });
        }

        /**
         * Builds the indeterminate ProgressBarWidget in the specified container
         */
        function indeterminate(){
            $progressBarContainer.append($(render_template(IndeterminateProgressBarTemplate)));
        }


        /**
         * Builds the ProgressBarWidget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            
            (conf.hasPercentRate) ? determinate(): indeterminate();
            (conf.statusText) ? this.setStatusText(conf.statusText): "";
            $progressBarContainer.addClass('parentContainer');
            return this;
        };


        /**
         * Destroys all elements created by the ProgressBarWidget in the specified container
         * @returns {Object} Current ProgressBarWidget object
         */
        this.destroy =  function () {
            if ($progressBarContainer){
                var $container = (conf.hasPercentRate)? $progressBarContainer.find('.determinateProgressBarContainer') : $progressBarContainer.find('.indeterminateProgressBarContainer');
                
                progressBar && progressBar.destroy();

                if ($container){
                    $container.remove();
                }else{
                    throw new Error(errorMessages.noElements);
                }
            }else{
                throw new Error(errorMessages.noProgressBar);
            }
            
            return this;
        }

        /**
         * Sets progress instantly without animation.
         * @param Number: how much percent the progress bar should display. range from 0.0-1.0
         */
        this.setProgressBar =  function (progress) {
            if (progressBar){
                progressBar.set(progress);
                progressBar.setText(Math.round(progress * 100) + '%');
            }else{
                throw new Error(errorMessages.noProgressBar);
            }
        }

        /**
         * Hides time remaining.
         */
        this.hideTimeRemaining =  function () {
            if ($progressBarContainer){
                var $timestampContainer = $progressBarContainer.find('.progressBarTimeStamp');
                if ($timestampContainer){
                    $timestampContainer.hide();
                }else{
                    throw new Error(errorMessages.noElements);
                }  
            }else{
                throw new Error(errorMessages.noProgressBar);
            }
        }

        /**
         * Sets time remaining.
         * @param Millionseconds: how long the file will be loaded completely.
         */
        this.setTimeRemaining =  function (millionseconds) {
            var min = (millionseconds > 1000*60) ? Math.round(millionseconds/1000 * 60)/1000*60 : 0,
                sec = Math.round((millionseconds - min * 1000* 60)/1000);
            if ($progressBarContainer){
                var $timestampContainer = $progressBarContainer.find('.progressBarTimeStamp');
                if ($timestampContainer){
                    $timestampContainer.text(i18n.getMessage('progress_bar_timestamp'), min, sec);
                }else{
                    throw new Error(errorMessages.noElements);
                }   
            }else{
                throw new Error(errorMessages.noProgressBar);
            }
        }

        /**
         * Sets progress bar text.
         * @param String: the text.
         */
        this.setStatusText =  function (text) {
            if ($progressBarContainer){
                $progressBarContainer.find('.progressBarText').text(text);
            }else{
                throw new Error(errorMessages.noProgressBar);
            }
        }
    };

    return ProgressBarWidget;
});