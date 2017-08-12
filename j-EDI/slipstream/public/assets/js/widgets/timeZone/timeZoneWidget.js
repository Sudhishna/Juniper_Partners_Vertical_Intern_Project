/** 
 * A widget which displays a selection box for various timezones as defined by UX.
 * A Olson timezone text is required for auto-selecting a particular timezone.
 *
 * @module TimeZoneWidget
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
  'jquery',
  'text!./templates/timeZones.html',
  'text!./conf/timeZones.json',
  './timeUtil',
  'lib/template_renderer/template_renderer'
], /** @lends TimeZoneWidget */ function($, timeZonesTemplate, timeZonesConf, TimeUtil, render_template) {
  /**
   * Constructs a TimeZoneWidget object.
   * @constructor
   * @class TimeZoneWidget
   * @param {Object} conf - Widget's configuration object (requires a container element for rendering and a optional olson for timezone olson string).
   */
  var TimeZoneWidget = function(conf) {
    var el = conf.container;

    var olson = (typeof conf.selectedTimezone == 'string') ? conf.selectedTimezone.trim() : '';
    // the device likes 'St_Johns' for 'St. John's'
    olson = olson.replace('St_Johns', 'St. John\'s');
    // the device likes underbar: '_' for space: ' 
    olson = olson.replace('_', ' ');

    // model data for view binding
    var modelData = {};

    // get the selection index in the table
    var getSelectionIndex = function() {
      var selectedText = $(el).find("#timezone-value").val();
      for (var i = 0; i < modelData.timezones.length; ++i) {
          var tz = modelData.timezones[i];
          if (selectedText.indexOf(tz.short) != -1) {
            return i;
          }
      }
      return -1;
    };

    // timezone table div 
    var tzTableDiv;

    // set UI inetractions
    var setInteractions = function() {
      tzTableDiv = $(el).find('.timezone-div');

      $(el).find('#timezone-value').click(function() {
        if (tzTableDiv.is(":hidden") === true){
          var selectedRow = $(el).find('.timezone-table tr:eq('+ getSelectionIndex() +')');
          // highlight the row selection, show and animate it (move row to top)
          selectedRow.addClass('selected-row');

          tzTableDiv.show();
          tzTableDiv.animate({
            scrollTop: selectedRow.offset().top - $(el).find('.timezone-table').offset().top
          }, 100);

          // add a mouseout for removing this row highlighting (from above)
          selectedRow.mouseout( function() {
            $(this).removeClass('selected-row');
          });
        }else{
          tzTableDiv.hide();
        }
      }).blur(function(event) {
        tzTableDiv.hide();
      });

      tzTableDiv.find('tr').each(function() {
        $(this).mousedown(function(event) {
          event.preventDefault();
        }).click(function() {
          $(el).find('#timezone-value').val(this.cells[0].innerHTML + ' ' + this.cells[1].innerHTML + ' ' + this.cells[2].innerHTML);
          tzTableDiv.hide();
        });
      });
    };

    /**
     * Renders the time zone select box for specified el.
     * @instance
     * @returns {Object} this object
     */
    this.build = function () {
      modelData.timezones = JSON.parse(timeZonesConf);

      var currentTimezoneOffset = TimeUtil.GetTimezoneString();

      for (var i = 0; i < modelData.timezones.length; ++i) {
          var tz = modelData.timezones[i];

          if (olson.length && tz.long.indexOf(olson) != -1) {
            modelData.timezone_value = tz.offset + ' ' + tz.long + ' ' + tz.short;
            break;
          } else if (!olson.length && tz.offset.indexOf(currentTimezoneOffset) != -1) {
            modelData.timezone_value = tz.offset + ' ' + tz.long + ' ' + tz.short;
            break;
          }
      };

      // bind model to view
      $(el).html(render_template(timeZonesTemplate, modelData));

      // set UI interactions
      setInteractions();

      return this;
    };

    /**
     * Destroys all elements created by the TimeoneWidget
     * @instance
     * @returns {Object} this object
     */
    this.destroy = function() {
        $(el).remove();
        return this;
    };

    /**
     * Gets the selected time zone zone string used for display purpose.
     * @instance
     * @returns {String} The selected text in the select box.
     * Note: render() must be called once (on this widget) for this to work.
     */
    this.getSelectedTimezoneText = function() {
      return $(el).find("#timezone-value").val();
    };

    /**
     * Gets the selected time zone zone Olson string used for REST API purpose.
     * @instance
     * @returns {String} The selected olson text for the selection in the select box.
     * Note: render() must be called once (on this widget) for this to work.
     */
    this.getSelectedTimezone = function() {
      olson =  $(el).find("#timezone-value").val().split(/\(([^)]+)\)/)[1];
      // the device likes 'St_Johns' for 'St. John's'
      olson = olson.replace('St. John\'s', 'St_Johns');
      // the device likes underbar: '_' for space: ' '
      olson = olson.replace(' ', '_');
      return olson;
    };

    /**
     * Sets the timezone from specified Olson string format (used for REST API purpose).
     * @instance
     * @param {string} olsonIn - olson timezone format for timezone selection.
     */
    this.setSelectedTimezone = function(olsonIn) {
      olson = (typeof olsonIn == 'string') ? olsonIn.trim() : '';
      // the device likes 'St_Johns' for 'St. John's'
      olson = olson.replace('St_Johns', 'St. John\'s');
      // the device likes underbar: '_' for space: ' 
      olson = olson.replace('_', ' ');
      this.build();
    };
  };

  return TimeZoneWidget;
});
