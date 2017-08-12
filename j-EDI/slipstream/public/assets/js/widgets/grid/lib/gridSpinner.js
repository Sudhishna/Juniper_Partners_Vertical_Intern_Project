/**
 * A module that builds the spinner used in the grid widget.
 *
 * @module GridSpinner
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/spinner/spinnerWidget'
],  /** @lends GridSpinner */
    function(render_template, GridTemplates, SpinnerWidget) {

    /**
     * GridSpinner constructor
     *
     * @constructor
     * @class GridSpinner - Builds the spinner used in the grid widget
     *
     * @returns {Object} Current Spinner's object: this
     */
        var GridSpinner = function(){

            var activityIndicatorTime = 20, 
                templates = new GridTemplates().getTemplates(),
                $spinnerContainer, 
                $indicatorBackground,
                spinnerSelectedTimeout,
                spinner,
                $grid; 
        /**
         * Adds Spinner to the Grid widget while loading
         */
            this.showSpinner = function(gridContainer){
                 if (!$grid){
                    $grid = gridContainer.find('.ui-jqgrid');
                 }
                 if (!$spinnerContainer){
                    $spinnerContainer = gridContainer.find('.loading');
                 }
                 if (!$indicatorBackground){
                    $indicatorBackground = $spinnerContainer.find(".slipstream-indicator-background");
                 }

                 $grid.addClass('minHeight');
                 $spinnerContainer.show().append(render_template(templates.loadingBackgroundTemplate));
                 $indicatorBackground.show();
                 spinner = new SpinnerWidget({
                        "container": $spinnerContainer
                 });   
                 spinnerSelectedTimeout = setTimeout(function () { 
                    spinner.build();
                }, activityIndicatorTime);
            };

        /**
         * Hides spinner from the Grid widget after the grid has finished loading
         */
            this.hideSpinner = function(){
                clearTimeout(spinnerSelectedTimeout);
                $grid && $grid.removeClass('minHeight');
                if (spinner) {
                    spinner.destroy();
                    $spinnerContainer.hide();
                    if ($indicatorBackground.length > 0)
                        $indicatorBackground.hide();
                }
            };

        };

    return GridSpinner;
});