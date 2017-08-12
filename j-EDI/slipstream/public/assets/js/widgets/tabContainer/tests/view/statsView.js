/**
 * A view that uses the donutChartWidget to produce statistics about current devices (tab 5)
 *
 * @module Statistics View
 * @author Kelcy Newton <knewton@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/form/formWidget',
    'widgets/tabContainer/tests/conf/formConfiguration',
    'widgets/donutChart/tests/getDeviceStatus',
    'widgets/donutChart/tests/getDeviceTypes',
    'text!widgets/tabContainer/tests/view/donutChartTemplate.html',
    'widgets/confirmationDialog/tests/confirmationBox',
    "widgets/spinner/tests/appOverlaySpinner"
], function(Backbone, render_template, FormWidget, formConfiguration, DonutChartView1, DonutChartView2, donutChartTemplate, ConfirmationBox, SpinnerView){
    var StatsView = {};

    /**
     * Appends the template containing the donut charts to the statistics view (tab 5)
     * @param container/element dictating where to render the view, the template to base the view on
     * @return none
     */
    var addContent = function($container, template) {
        $container.append((render_template(template)));
    };

    StatsView.view1 = Backbone.View.extend({

      //button click events
      events: {
          "click .stats_refresh": "refresh"
      },

      /**
       * refresh the donut charts with new information (if any)
       * @param none
       * @return the template view containing the donut charts
       */
      refresh: function() {
          var self = this;
          new SpinnerView().openOverlay();

          //re render the donut charts
          addContent(this.$el, donutChartTemplate); //adds the html file
          new DonutChartView1({
            el: this.$el.find('#device_status')
          });
          new DonutChartView2({
            el: this.$el.find('#device_type')
          });
          overlayWidgetObj.destroy();
          return this;
      },

        /**
         * Render the view containing the donut charts for the first time
         * @param none
         * @return the template view containing the donut charts
         */
        render: function () {
            addContent(this.$el, donutChartTemplate);

            //create the form the donut charts will sit in (found in /tests/conf/formConfiguration.js)
            this.form = new FormWidget({
                "elements": formConfiguration.Statistics,
                "container": this.$el.find('#form')
            });
            this.form.build();

            //render a new donut chart view in the specified div
            new DonutChartView1({
              el: this.$el.find('#device_status')
            });
            //render a new donut chart view in the specified div
            new DonutChartView2({
              el: this.$el.find('#device_type')
            });

            //append the refresh button to the view
            this.$el.append('<br>');
            this.$el.append('<input type="button" class="slipstream-primary-button  stats_refresh" value="Refresh">');
            return this;
        }
    });

    return StatsView;
});
